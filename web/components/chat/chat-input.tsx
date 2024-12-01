'use client'

import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (prompt: string, code?: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [prompt, setPrompt] = useState('')
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    
    onSendMessage(prompt, code || undefined)
    setPrompt('')
    setCode('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full p-3">
      <div className="relative">
        <textarea
          placeholder="코드를 입력하세요 (선택사항)..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 p-4 text-sm font-mono bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/30 resize-none transition-all duration-200 ease-in-out text-gray-800 placeholder-gray-500"
        />
      </div>
      <div className="flex mt-4 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-4 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-6 py-4 font-medium text-white bg-blue-500/80 hover:bg-blue-600/80 focus:bg-blue-600/80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out backdrop-blur-sm"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

