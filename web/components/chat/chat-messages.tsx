import React from 'react'
import { Message } from '../../lib/types'
import { ChatMessage } from './chat-message'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      )}
    </div>
  )
}