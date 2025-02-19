# O1234 Asistente de Documentación 📚

Una aplicación web que permite hacer preguntas sobre documentos usando un modelo de lenguaje de código abierto.

## 🌟 Características

- Interfaz web moderna y responsive
- Procesamiento de documentos PDF y texto
- Búsqueda semántica usando embeddings
- Modelo de lenguaje de código abierto (flan-alpaca-large)
- Soporte para temas claro/oscuro
- Interfaz en español

## 🔄 Flujo del Proyecto

### 1. Ingesta de Documentos

- **Actor**: Sistema de Ingesta (ingest.py)
- **Proceso**:
  1. Carga documentos PDF/TXT desde la carpeta `app/documents/`
     - Soporta múltiples formatos de documentos (PDF, TXT)
     - Utiliza PyPDF2 para procesar PDFs
     - Mantiene la estructura y formato del documento
  2. Divide los documentos en fragmentos manejables
     - Utiliza LangChain Text Splitter
     - Tamaño de fragmento configurable
     - Mantiene el contexto semántico
  3. Genera embeddings usando sentence-transformers
     - Modelo multilingüe para mejor comprensión
     - Convierte texto en vectores de alta dimensión
     - Preserva el significado semántico del contenido
  4. Almacena los embeddings en ChromaDB
     - Base de datos vectorial optimizada
     - Indexación eficiente para búsqueda rápida
     - Persistencia de datos para consultas futuras

### 2. Procesamiento de Consultas
- **Actor**: Backend (app.py)
- **Proceso**:
  1. Recibe preguntas del usuario vía API
  2. Convierte la pregunta en embeddings
  3. Busca contenido relevante en ChromaDB
  4. Genera respuesta usando el modelo flan-alpaca-large

### 3. Interacción del Usuario
- **Actor**: Frontend (HTML/JS)
- **Proceso**:
  1. Presenta interfaz web intuitiva
  2. Captura preguntas del usuario
  3. Muestra respuestas formateadas
  4. Gestiona temas claro/oscuro

## 🛠️ Tecnologías

- **Backend**: FastAPI, LangChain, Chroma DB
- **Frontend**: HTML5, CSS3, JavaScript moderno
- **Modelo**: declare-lab/flan-alpaca-large (2.7GB)
- **Base de Datos**: Chroma (vectorial)

## 💻 Instalación y Desarrollo

### Requisitos

- Python 3.10+
- pip
- 4GB RAM mínimo
- 2 vCPUs recomendado
- 3GB espacio en disco

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/yourusername/o1234-dev.git
cd o1234-dev
```

2. Instala las dependencias:
```bash
pip install -r requirements.txt
```

3. Procesa los documentos:
```bash
python3 -m app.ingest
```

4. Ejecuta la aplicación:
```bash
python -m uvicorn app.app:app --reload
```

5. Abre http://localhost:8000 en tu navegador

## 📝 Uso

1. La aplicación viene con documentos de ejemplo en la carpeta `app/documents/`
2. Escribe tu pregunta en el campo de texto
3. Presiona "Preguntar" o Enter
4. El modelo procesará tu pregunta y dará una respuesta basada en los documentos

## 🔧 Configuración

Las configuraciones principales están en `app/config.py`:

- `MODEL_ID`: Modelo a utilizar
- `MAX_LENGTH`: Longitud máxima de respuesta
- `TEMPERATURE`: Temperatura para generación

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
