# SynthAI Browser Extension

A powerful browser extension that enables AI-powered web interaction using multiple LLM models.

## Features

- 🤖 Multiple LLM Model Support (Ollama, Replicate, OpenAI)
- 💬 Interactive Chat Interface
- 🌓 Dark/Light Theme Support
- 🎨 Modern UI with ShadcnUI Components
- 🔒 Local Model Support with Ollama
- 📱 Responsive Design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Ollama (for local model support)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/synthai-extension.git
cd synthai-extension
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file for API keys (if using Replicate or OpenAI):
```env
VITE_REPLICATE_API_KEY=your_replicate_key
VITE_OPENAI_API_KEY=your_openai_key
```

4. Start the development server:
```bash
npm run dev
```

### Building the Extension

1. Build the project:
```bash
npm run build
```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- ShadcnUI
- Zustand
- Vite

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
