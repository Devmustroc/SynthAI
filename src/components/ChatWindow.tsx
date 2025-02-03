import { useState } from 'react'
import { useChatStore } from '../store/chatStore'
import { type ModelType } from '../config/models'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'
import { generateResponse } from '../services/modelService'
import { AlertCircle, Loader2 } from 'lucide-react'

interface ChatWindowProps {
  model: ModelType
}

export function ChatWindow({ model }: ChatWindowProps) {
  const [input, setInput] = useState('')
  const { messages, addMessage, isLoading, setIsLoading } = useChatStore()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input
    addMessage({ role: 'user', content: userMessage })
    setInput('')
    setError(null)
    setIsLoading(true)
    
    try {
      const response = await generateResponse(model, userMessage)
      
      if (response.error) {
        setError(response.error)
        addMessage({
          role: 'assistant',
          content: `Erreur: ${response.error}. Veuillez vérifier vos paramètres de configuration.`,
        })
      } else {
        addMessage({
          role: 'assistant',
          content: response.content,
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-full">
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 border-t flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="border-t p-3 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} className="shrink-0">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Envoyer'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
