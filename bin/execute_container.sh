#!/bin/bash

# Verificar el número de parámetros
if [ "$#" -ne 1 ]; then
    echo "[ERROR]: Invalid number of parameters."
    echo "Usage: $0 <container_name>"
    exit 1
fi

# Variable para el nombre del contenedor
CONTAINER_NAME=$1

# Verificar si la imagen de Docker existe
if ! docker image inspect "${CONTAINER_NAME}" > /dev/null 2>&1; then
    echo "[ERROR]: Docker image '${CONTAINER_NAME}' does not exist."
    exit 1
fi

# Ejecutar el contenedor
echo "[INFO]: Starting the Docker container '${CONTAINER_NAME}'..."
docker run -d -p 8080:8080 "${CONTAINER_NAME}" || {
    echo "[ERROR]: Failed to start Docker container."
    exit 1
}

echo "[INFO]: Docker container '${CONTAINER_NAME}' started successfully."
docker ps -a | grep "${CONTAINER_NAME}"