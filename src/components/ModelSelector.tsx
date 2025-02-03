import { MODELS, type ModelType } from '../config/models'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface ModelSelectorProps {
  selectedModel: ModelType
  onModelChange: (model: ModelType) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <Select value={selectedModel} onValueChange={(value) => onModelChange(value as ModelType)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(MODELS).map(([key, model]) => (
          <SelectItem key={key} value={key}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
