import { ModelType } from '../config/models'
import { useSettingsStore } from '../store/settingsStore'

interface ModelResponse {
  content: string
  error?: string
}

interface OllamaResponse {
  model: string
  created_at: string
  response: string
  done: boolean
  context?: number[]
  total_duration?: number
  load_duration?: number
  prompt_eval_duration?: number
  eval_duration?: number
  eval_count?: number
  error?: string
}

export async function generateResponse(model: ModelType, prompt: string): Promise<ModelResponse> {
  const { apiKeys, ollamaEndpoint } = useSettingsStore.getState()
  console.log('Settings state:', { apiKeys, ollamaEndpoint })

  try {
    switch (model) {
      case 'ollama':
        if (!ollamaEndpoint) {
          throw new Error('URL du serveur Ollama non configurée')
        }

        console.log('Sending request to Ollama:', {
          endpoint: ollamaEndpoint,
          prompt: prompt
        })

        console.log('Preparing Ollama request to:', `${ollamaEndpoint}/api/generate`)
        const ollamaResponse = await fetch(`${ollamaEndpoint}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': window.location.origin,
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            model: 'llama2',
            prompt: prompt,
            stream: false,
            options: {
              temperature: 0.7,
              top_p: 0.9,
              top_k: 40,
            }
          }),
        }).catch(error => {
          console.error('Network error:', error)
          throw new Error(`Erreur de connexion au serveur Ollama: ${error.message}`)
        })

        if (!ollamaResponse.ok) {
          const errorMessage = `Erreur Ollama: ${ollamaResponse.status} ${ollamaResponse.statusText}`
          console.error('Ollama error:', errorMessage)
          throw new Error(errorMessage)
        }

        let responseData: OllamaResponse
        try {
          responseData = await ollamaResponse.json()
          if (responseData.error) {
            throw new Error(`Erreur Ollama: ${responseData.error}`)
          }
          return { content: responseData.response }
        } catch (e) {
          console.error('Failed to parse Ollama response:', e)
          throw new Error('Erreur lors du traitement de la réponse Ollama')
        }


      case 'replicate':
        if (!apiKeys.replicate) {
          return { content: '', error: 'Replicate API key not configured' }
        }

        const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${apiKeys.replicate}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: "2796ee9483c3fd7aa2e171d38f4ca12251a30609463dcfd4cd76703f22e96cdf",
            input: {
              prompt: prompt,
              max_tokens: 500,
            },
          }),
        })

        if (!replicateResponse.ok) {
          throw new Error('Failed to get response from Replicate')
        }

        const replicateData = await replicateResponse.json()
        return { content: replicateData.output }

      case 'openai':
        if (!apiKeys.openai) {
          return { content: '', error: 'OpenAI API key not configured' }
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKeys.openai}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: 500,
          }),
        })

        if (!openaiResponse.ok) {
          throw new Error('Failed to get response from OpenAI')
        }

        const openaiData = await openaiResponse.json()
        return { content: openaiData.choices[0].message.content }

      default:
        return { content: '', error: 'Invalid model selected' }
    }
  } catch (error) {
    console.error('Error generating response:', error)
    return {
      content: '',
      error: error instanceof Error ? error.message : 'An error occurred',
    }
  }
}
