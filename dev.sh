#!/bin/bash

# Función para matar procesos existentes
cleanup() {
    echo "Deteniendo servidores..."
    pkill -f "uvicorn main:app"
    pkill -f "vite"
    exit 0
}

# Capturar señal de interrupción (Ctrl+C)
trap cleanup SIGINT

# Activar el entorno virtual
source venv/bin/activate

# Iniciar el backend
echo "Iniciando backend..."
cd backend
uvicorn main:app --reload --port 8001 &
BACKEND_PID=$!

# Iniciar el frontend
echo "Iniciando frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Esperar a que cualquiera de los procesos termine
wait $BACKEND_PID $FRONTEND_PID
