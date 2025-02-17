FROM python:3.10-slim

WORKDIR /code

# Instalar dependencias del sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements primero para aprovechar la caché de Docker
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código de la aplicación
COPY ./app /code/app

# Crear directorios necesarios
RUN mkdir -p /code/app/documents /code/app/chroma_data

# Exponer el puerto
EXPOSE 7860

# Comando para ejecutar la aplicación
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "7860"]
