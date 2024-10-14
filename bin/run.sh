#!/bin/bash

# Hardcodeo la data del container
CONTAINER_NAME="gateway"
PATH_DOCKERFILE="/home/guido/Escritorio/TwitSnap-Gateway/Dockerfile"
CONTEXT_PATH="/home/guido/Escritorio/TwitSnap-Gateway"

echo "[INFO]: Running build_container.sh..."
./build_container.sh "${CONTAINER_NAME}" "${PATH_DOCKERFILE}" "${CONTEXT_PATH}" || {
    echo "[ERROR]: Failed to run build_container.sh."
    exit 1
}

echo "[INFO]: Running execute_container.sh..."
./execute_container.sh "${CONTAINER_NAME}" || {
    echo "[ERROR]: Failed to run execute_container.sh."
    exit 1
}

echo "[INFO]: Docker container started successfully."
