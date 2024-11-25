'use client'

import { useState } from 'react'
import { ChatMessages } from '@/components/chat/chat-messages'
import ChatInput from '@/components/chat/chat-input'
import { Message } from '@/lib/types'
import { determineRequestType } from '@/lib/utils'

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (prompt: string, code?: string) => {
    setIsLoading(true)
    
    const requestType = determineRequestType(prompt, code)
    const endpoint = requestType === 'CODE_GENERATION' 
      ? 'http://localhost:8000/generate/'
      : 'http://localhost:8000/fix/'
    
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      code: code
    }
    
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          code,
          type: requestType
        }),
      })

      const data = await response.json()
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        code: requestType === 'CODE_GENERATION' ? data.generated_code : data.fixed_code
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen pb-36">
      <div className="max-w-5xl mx-auto pt-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </main>
  )
}