import { useState } from 'react'
import { ChatWindow } from './components/ChatWindow'
import { ModelSelector } from './components/ModelSelector'
import { ThemeProvider } from './components/ThemeProvider'
import { SettingsDialog } from './components/SettingsDialog'
import { type ModelType } from './config/models'

function App() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('ollama')

  return (
    <ThemeProvider>
      <div className="flex flex-col w-full h-full min-h-[600px] bg-background text-foreground">
        <header className="flex items-center justify-between p-3 border-b shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">SynthAI</h1>
            <SettingsDialog />
          </div>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </header>
        <main className="flex-1 overflow-hidden min-h-0">
          <ChatWindow model={selectedModel} />
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
