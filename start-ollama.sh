#!/bin/bash

# Kill any existing Ollama process
pkill ollama

# Start Ollama with CORS headers
OLLAMA_ORIGINS="*" ollama serve
