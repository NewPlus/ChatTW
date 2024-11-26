import React from 'react'
import { Message } from '../../lib/types'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="rounded-lg p-4 bg-white shadow">
      <p>{message.content}</p>
    </div>
  )
}