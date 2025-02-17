from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import logging
from pathlib import Path

from langchain.chains import RetrievalQA
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from transformers import pipeline
from langchain.llms import HuggingFacePipeline

from app.config import STATIC_DIR, CHROMA_DIR, MODEL_ID, MAX_LENGTH, TEMPERATURE

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crear la aplicación FastAPI
app = FastAPI(title="Q&A App")

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

class Query(BaseModel):
    question: str

# Inicializar componentes de LangChain
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
        vectorstore = Chroma(
            persist_directory=str(CHROMA_DIR),
            embedding_function=embeddings
        )

        # Inicializar el modelo de lenguaje
        llm = HuggingFacePipeline(
            pipeline=pipeline(
                "text2text-generation",
                model=MODEL_ID,
                max_length=MAX_LENGTH,
                temperature=TEMPERATURE,
                device="cpu"
            )
        )

        # Crear la cadena de QA
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectorstore.as_retriever(
                search_kwargs={"k": 3}
            )
        )
        
        logger.info("Sistema inicializado correctamente")
    except Exception as e:
        logger.error(f"Error durante la inicialización: {str(e)}")
        raise

@app.get("/")
async def read_root():
    return FileResponse(str(STATIC_DIR / "index.html"))

# Endpoint para health check
@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/ask")
async def ask_question(query: Query):
    try:
        # Obtener respuesta
        response = qa_chain.run(query.question)
        return {"response": response}
    except Exception as e:
        logger.error(f"Error al procesar la pregunta: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
