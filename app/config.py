from pathlib import Path

# Configuración base
BASE_DIR = Path(__file__).resolve().parent

# Configuración de rutas
STATIC_DIR = BASE_DIR / "static"
CHROMA_DIR = BASE_DIR / "chroma_data"
DOCUMENTS_DIR = BASE_DIR / "documents"

# Configuración del modelo
MODEL_ID = "declare-lab/flan-alpaca-large"
MAX_LENGTH = 512
TEMPERATURE = 0.7

# Asegurarse de que los directorios existan
STATIC_DIR.mkdir(exist_ok=True)
CHROMA_DIR.mkdir(exist_ok=True)
DOCUMENTS_DIR.mkdir(exist_ok=True)
