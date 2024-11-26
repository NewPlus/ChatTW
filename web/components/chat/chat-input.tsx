'use client'

import { useState } from 'react'

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
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-3xl">
      <div className="relative">
        <textarea
          placeholder="코드를 입력하세요 (선택사항)..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-32 p-4 text-sm font-mono bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="질문을 입력하세요..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 p-4 text-sm bg-white rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="px-6 py-4 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          전송
        </button>
      </div>
    </form>
  )
}
