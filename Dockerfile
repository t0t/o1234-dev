FROM python:3.10-slim

WORKDIR /code

# Configurar variables de entorno
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    DEBIAN_FRONTEND=noninteractive

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY ./app /code/app

# Crear directorios necesarios y establecer permisos
RUN mkdir -p /code/app/documents /code/app/chroma_data && \
    chmod -R 777 /code/app/documents /code/app/chroma_data

# Configurar el modelo y la base de datos
RUN python3 -c "from transformers import pipeline; pipeline('text2text-generation', model='declare-lab/flan-alpaca-large', device='cpu')"

# Exponer el puerto que usa Hugging Face Spaces
EXPOSE 7860

# Configurar el usuario no root
RUN useradd -m -u 1000 user
USER user

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1"]
