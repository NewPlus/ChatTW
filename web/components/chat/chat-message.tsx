import React, { useState } from 'react';
import { Message } from '../../lib/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus(null), 2000);
    });
  };

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
            ? 'prose-invert prose-p:text-white prose-code:text-white prose-headings:text-white prose-strong:text-white' 
            : 'prose-headings:text-gray-900 prose-p:text-gray-900 prose-code:text-gray-900'
        }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <div className="relative group">
                    <SyntaxHighlighter
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => handleCopy(String(children))}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 hover:bg-gray-800/90 transition-all duration-200"
                      aria-label={copyStatus === 'copied' ? '복사됨' : '코드 복사'}
                    >
                      {copyStatus === 'copied' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-200" />
                      )}
                    </button>
                  </div>
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
        {message.code && !message.content.includes(message.code) && (
          <div className="mt-2 rounded-lg overflow-hidden relative group">
            <SyntaxHighlighter
              language="javascript"
              style={tomorrow}
            >
              {message.code}
            </SyntaxHighlighter>
            <button
              onClick={() => handleCopy(message.code!)}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800/70 hover:bg-gray-800/90 transition-all duration-200"
              aria-label={copyStatus === 'copied' ? '복사됨' : '코드 복사'}
            >
              {copyStatus === 'copied' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-200" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

