#!/bin/bash

# Función para manejar la salida de los procesos
cleanup() {
    echo "Deteniendo servicios..."
    kill $(jobs -p)
    exit
}

# Capturar señal de interrupción
trap cleanup SIGINT

echo "Iniciando servicios de DIAGNOSIA..."

# Verificar MongoDB
if ! systemctl is-active --quiet mongod; then
    echo "Iniciando MongoDB..."
    sudo systemctl start mongod
fi

# Instalar dependencias del backend
echo "Instalando dependencias del backend..."
cd backend && npm install

# Iniciar el backend
echo "Iniciando backend..."
npm run dev &

# Esperar un momento para que el backend inicie
sleep 2

# Iniciar el frontend
echo "Iniciando frontend..."
cd .. && npm run dev &

# Mantener el script corriendo
wait
