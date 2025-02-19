from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import logging
from pathlib import Path
from transformers import pipeline

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFacePipeline
from langchain.prompts import PromptTemplate

from app.config import (
    STATIC_DIR,
    CHROMA_DIR,
    MODEL_ID,
    MAX_LENGTH,
    TEMPERATURE,
)

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear la aplicación FastAPI
app = FastAPI()

# Montar archivos estáticos desde el directorio dist del frontend
frontend_dist = Path(__file__).resolve().parent.parent / "frontend" / "dist"
app.mount("/o1234-qa", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")

@app.get("/")
async def redirect_root():
    return {"message": "API is running. Please visit /o1234-qa/ for the frontend application."}

class Query(BaseModel):
    question: str

# Inicializar componentes de LangChain
# Initialize qa_chain as None at module level
qa_chain = None

@app.on_event("startup")
async def startup_event():
    global qa_chain
    try:
        # Inicializar embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )

        # Cargar la base de datos vectorial
        try:
            # Initialize vectorstore with proper error handling
            vectorstore = Chroma(
                persist_directory=str(CHROMA_DIR),
                embedding_function=embeddings,
                collection_metadata={"hnsw:space": "cosine"}  # Changed to cosine similarity for better compatibility
            )
            
            # Verify the vectorstore is properly initialized and has documents
            collection = vectorstore.get()
            if not collection or len(collection['ids']) == 0:
                logger.warning("No documents found in the vector store")
                raise Exception("Vector store is empty. Please ingest documents first.")
        except Exception as e:
            logger.error(f"Error initializing vector store: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail="Error initializing the knowledge base. Please ensure documents are properly ingested."
            )

        # Inicializar el modelo de lenguaje
        llm = HuggingFacePipeline(
            pipeline=pipeline(
                "text2text-generation",
                model=MODEL_ID,
                max_length=1024,  # Increased from 512 for longer responses
                temperature=0.5,  # Slightly increased for more creative responses
                truncation=True,
                do_sample=True,
                top_k=120,       # Increased for broader vocabulary
                top_p=0.98,      # Increased for more natural completions
                repetition_penalty=1.3,  # Increased to prevent word truncation
                device="cpu"
            )
        )

        # Crear la cadena de QA con prompt personalizado en español
        PROMPT_TEMPLATE = """Eres un asistente experto en O1234 que proporciona información detallada y completa sobre la metodología O1234. Tu tarea es responder preguntas de manera exhaustiva y bien estructurada en español, utilizando exclusivamente la información proporcionada en el contexto. Si la información solicitada no está disponible en el contexto, debes responder: "Lo siento, no encuentro información específica sobre eso en la documentación disponible."\n\nSigue estas reglas:\n1. Usa solo la información del contexto proporcionado\n2. Proporciona respuestas detalladas y completas\n3. Estructura la información de manera clara y organizada\n4. Incluye ejemplos o detalles relevantes cuando estén disponibles\n5. Si la pregunta es ambigua, pide aclaración\n6. Mantén un tono profesional y didáctico\n\nContexto: {context}\n\nPregunta: {question}\n\nRespuesta: """

        # Configurar el retriever con parámetros optimizados
        retriever = vectorstore.as_retriever(
            search_type="similarity",  # Changed from mmr to similarity
            search_kwargs={
                "k": 4
            }
        )

        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={
                "prompt": PromptTemplate(
                    template=PROMPT_TEMPLATE,
                    input_variables=["context", "question"]
                ),
                "verbose": False  # Disable verbose mode to prevent leaking internal details
            }
        )
        
        logger.info("Sistema inicializado correctamente")
    except Exception as e:
        logger.error(f"Error durante la inicialización: {str(e)}")
        qa_chain = None
        raise

@app.get("/")
async def read_root():
    """Servir la página principal."""
    return FileResponse(str(STATIC_DIR / "index.html"))

@app.get("/health")
async def health_check():
    """Endpoint para health check."""
    return {"status": "ok"}

@app.post("/ask")
async def ask_question(query: Query):
    """Endpoint para procesar preguntas."""
    try:
        # Verificar que qa_chain está inicializado
        if qa_chain is None:
            logger.error("qa_chain no está inicializado")
            raise HTTPException(
                status_code=503,
                detail="El sistema se está inicializando. Por favor, intenta de nuevo en unos momentos."
            )

        # Validar la pregunta
        if not query.question or len(query.question.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="La pregunta no puede estar vacía"
            )

        # Obtener respuesta con documentos fuente
        result = qa_chain({"query": query.question})
        
        if not result or "result" not in result:
            logger.error("No se obtuvo respuesta del modelo")
            raise HTTPException(
                status_code=500,
                detail="No se pudo generar una respuesta. Por favor, intenta de nuevo."
            )
        
        # Formatear la respuesta
        response = result["result"].strip()  # Clean up any extra whitespace
        
        return {"response": response}
    except HTTPException as he:
        logger.error(f"Error HTTP: {str(he)}")
        raise he
    except Exception as e:
        logger.error(f"Error al procesar la pregunta: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
