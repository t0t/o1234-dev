import logging
from pathlib import Path
from typing import List

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredImageLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

from app.config import CHROMA_DIR, DOCUMENTS_DIR

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar el text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,      # Aumentado para capturar más contexto
    chunk_overlap=200,    # Aumentado para mejor continuidad
    length_function=len,
    separators=["\n\n", "\n", " ", ""]  # Priorizar división por párrafos
)

def load_document(file_path: Path):
    """Carga un documento basado en su extensión."""
    suffix = file_path.suffix.lower()
    try:
        if suffix == '.pdf':
            logger.info(f"Cargando PDF: {file_path}")
            loader = PyPDFLoader(str(file_path))
            pages = loader.load()
            for i, page in enumerate(pages):
                logger.info(f"Contenido de la página {i+1}:\n{page.page_content[:500]}...")
            return pages
        elif suffix == '.txt':
            logger.info(f"Cargando TXT: {file_path}")
            loader = TextLoader(str(file_path))
            return loader.load()
        elif suffix in ['.jpg', '.jpeg', '.png']:
            logger.info(f"Cargando imagen: {file_path}")
            loader = UnstructuredImageLoader(str(file_path))
            return loader.load()
        else:
            logger.warning(f"Tipo de archivo no soportado: {suffix}")
            return []
        
    except Exception as e:
        logger.error(f"Error al cargar {file_path}: {str(e)}")
        return []

def process_documents() -> None:
    """Procesa todos los documentos en el directorio de documentos."""
    try:
        # Inicializar el modelo de embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        
        # Cargar todos los documentos
        documents = []
        for file_path in DOCUMENTS_DIR.glob('*.*'):
            if file_path.name != '.gitkeep':
                docs = load_document(file_path)
                if docs:
                    logger.info(f"Documento cargado exitosamente: {file_path}")
                    documents.extend(docs)

        if not documents:
            logger.warning("No se encontraron documentos para procesar")
            return

        # Dividir documentos en chunks
        texts = text_splitter.split_documents(documents)
        logger.info(f"Documentos divididos en {len(texts)} chunks")

        # Crear o actualizar la base de datos vectorial
        vectorstore = Chroma.from_documents(
            documents=texts,
            embedding=embeddings,
            persist_directory=str(CHROMA_DIR)
        )
        vectorstore.persist()
        logger.info("Base de datos vectorial actualizada exitosamente")

    except Exception as e:
        logger.error(f"Error durante el procesamiento: {str(e)}")
        raise

if __name__ == "__main__":
    process_documents()
