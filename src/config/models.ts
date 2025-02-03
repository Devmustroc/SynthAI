export const MODELS = {
  ollama: {
    name: 'Ollama',
    endpoint: 'http://localhost:11434/api/generate',
    models: ['llama2', 'codellama', 'mistral'],
  },
  replicate: {
    name: 'Replicate',
    endpoint: 'https://api.replicate.com/v1/predictions',
    requiresApiKey: true,
  },
  openai: {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    requiresApiKey: true,
    models: ['gpt-3.5-turbo', 'gpt-4'],
  },
} as const

export type ModelType = keyof typeof MODELS
