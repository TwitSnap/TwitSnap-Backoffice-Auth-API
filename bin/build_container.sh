#!/bin/bash

# Verifico el numero de parametros
if [ "$#" -ne 3 ]; then
    echo "[ERROR]: Invalid number of parameters."
    echo "Use: $0 <container_name> <dockerfile_absolute_path> <context_absolute_path>"
    exit 1
fi

# Variables
CONTAINER_NAME=$1
PATH_DOCKERFILE=$2
CONTEXT_PATH=$3

# Construyo el contenedor
echo "[INFO]: Building Docker image..."
docker build -t "${CONTAINER_NAME}" -f "${PATH_DOCKERFILE}" "${CONTEXT_PATH}" || {
    echo "[ERROR]: Docker image build failed."
    exit 1
}

echo "[INFO]: Docker image build successful. Image check:"
docker images | grep "${CONTAINER_NAME}"
