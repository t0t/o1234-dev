import logging
from pathlib import Path
from typing import List

from langchain.document_loaders import (
    PyPDFLoader,
    TextLoader,
    UnstructuredImageLoader,
)
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

from config import CHROMA_DIR, DOCUMENTS_DIR

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar el text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    length_function=len,
)

def load_document(file_path: Path):
    """Carga un documento basado en su extensión."""
    suffix = file_path.suffix.lower()
    try:
        if suffix == '.pdf':
            loader = PyPDFLoader(str(file_path))
        elif suffix == '.txt':
            loader = TextLoader(str(file_path))
        elif suffix in ['.jpg', '.jpeg', '.png']:
            loader = UnstructuredImageLoader(str(file_path))
        else:
            logger.warning(f"Tipo de archivo no soportado: {suffix}")
            return []
        
        return loader.load()
    except Exception as e:
        logger.error(f"Error al cargar {file_path}: {str(e)}")
        return []

def process_documents() -> None:
    """Procesa todos los documentos en el directorio de documentos."""
    # Inicializar el modelo de embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )

    # Cargar todos los documentos
    documents = []
    for file_path in DOCUMENTS_DIR.glob("**/*"):
        if file_path.is_file():
            logger.info(f"Procesando: {file_path}")
            docs = load_document(file_path)
            documents.extend(docs)

    if not documents:
        logger.warning("No se encontraron documentos para procesar")
        return

    # Dividir documentos en chunks
    texts = text_splitter.split_documents(documents)
    logger.info(f"Creados {len(texts)} chunks de texto")

    # Crear o actualizar la base de datos vectorial
    Chroma.from_documents(
        documents=texts,
        embedding=embeddings,
        persist_directory=str(CHROMA_DIR)
    )
    logger.info(f"Base de datos vectorial creada en {CHROMA_DIR}")

if __name__ == "__main__":
    process_documents()
