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
    const endpoint = 'http://localhost:8001/generate/'
    
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
    <main className="flex flex-col h-screen bg-gray-50">
      {/* 헤더 영역 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto py-4 px-4">
          <h1 className="text-2xl font-bold text-gray-900">ChatTW</h1>
        </div>
      </header>

      {/* 대화창 영역 */}
      <div className="flex-1 overflow-y-auto pb-[200px] transition-all duration-300 ease-in-out">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
      </div>

      {/* 입력창 영역 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-50 from-50% via-gray-50 via-90% to-transparent">
        <div className="max-w-3xl mx-auto p-6 pt-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
}

