import { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Settings } from 'lucide-react'
import type { ModelType } from '../config/models'
import { useSettingsStore } from '../store/settingsStore'

export function SettingsDialog() {
  const { apiKeys, ollamaEndpoint, setApiKey, setOllamaEndpoint } = useSettingsStore()
  const [testStatus, setTestStatus] = useState<Record<ModelType, 'idle' | 'testing' | 'success' | 'error'>>({
    ollama: 'idle',
    replicate: 'idle',
    openai: 'idle',
  })

  const testConnection = async (model: ModelType) => {
    setTestStatus(prev => ({ ...prev, [model]: 'testing' }))
    try {
      let success = false
      switch (model) {
        case 'ollama':
          const ollamaResponse = await fetch(`${ollamaEndpoint}/api/tags`)
          success = ollamaResponse.ok
          break
        case 'replicate':
          if (!apiKeys.replicate) throw new Error('API key required')
          const replicateResponse = await fetch('https://api.replicate.com/v1/models', {
            headers: { Authorization: `Token ${apiKeys.replicate}` }
          })
          success = replicateResponse.ok
          break
        case 'openai':
          if (!apiKeys.openai) throw new Error('API key required')
          const openaiResponse = await fetch('https://api.openai.com/v1/models', {
            headers: { Authorization: `Bearer ${apiKeys.openai}` }
          })
          success = openaiResponse.ok
          break
      }
      setTestStatus(prev => ({ ...prev, [model]: success ? 'success' : 'error' }))
    } catch (error) {
      console.error(`Error testing ${model}:`, error)
      setTestStatus(prev => ({ ...prev, [model]: 'error' }))
    }
  }

  const getStatusColor = (status: 'idle' | 'testing' | 'success' | 'error') => {
    switch (status) {
      case 'idle': return 'text-gray-500'
      case 'testing': return 'text-blue-500'
      case 'success': return 'text-green-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Paramètres des Modèles</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Ollama Settings */}
          <div className="grid gap-2">
            <Label htmlFor="ollama-endpoint">Endpoint Ollama</Label>
            <div className="flex gap-2">
              <Input
                id="ollama-endpoint"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434"
              />
              <Button
                onClick={() => testConnection('ollama')}
                disabled={testStatus.ollama === 'testing'}
                className={getStatusColor(testStatus.ollama)}
              >
                {testStatus.ollama === 'testing' ? 'Test...' : 'Tester'}
              </Button>
            </div>
          </div>

          {/* Replicate Settings */}
          <div className="grid gap-2">
            <Label htmlFor="replicate-key">Clé API Replicate</Label>
            <div className="flex gap-2">
              <Input
                id="replicate-key"
                type="password"
                value={apiKeys.replicate}
                onChange={(e) => setApiKey('replicate', e.target.value)}
                placeholder="Votre clé API Replicate"
              />
              <Button
                onClick={() => testConnection('replicate')}
                disabled={testStatus.replicate === 'testing'}
                className={getStatusColor(testStatus.replicate)}
              >
                {testStatus.replicate === 'testing' ? 'Test...' : 'Tester'}
              </Button>
            </div>
          </div>

          {/* OpenAI Settings */}
          <div className="grid gap-2">
            <Label htmlFor="openai-key">Clé API OpenAI</Label>
            <div className="flex gap-2">
              <Input
                id="openai-key"
                type="password"
                value={apiKeys.openai}
                onChange={(e) => setApiKey('openai', e.target.value)}
                placeholder="Votre clé API OpenAI"
              />
              <Button
                onClick={() => testConnection('openai')}
                disabled={testStatus.openai === 'testing'}
                className={getStatusColor(testStatus.openai)}
              >
                {testStatus.openai === 'testing' ? 'Test...' : 'Tester'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
