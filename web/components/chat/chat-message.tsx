import React from 'react'
import { Message } from '../../lib/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[80%] ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-900 shadow-md'
        }`}
      >
        <div className={`prose prose-sm max-w-none ${
          message.role === 'user' 
            ? 'prose-invert prose-p:text-white prose-code:text-white' 
            : ''
        }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {message.code && (
          <div className="mt-2 rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language="javascript" // 기본값으로 JavaScript를 사용하지만, 실제 언어에 따라 동적으로 변경할 수 있습니다.
              style={tomorrow}
            >
              {message.code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}

