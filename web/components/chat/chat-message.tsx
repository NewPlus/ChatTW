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
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div
        className={`relative rounded-2xl px-4 py-2 max-w-[80%] transition-all duration-300
          ${message.role === 'user'
            ? 'bg-gradient-to-br from-blue-600/90 to-blue-700/90 text-white backdrop-blur-md rounded-br-sm'
            : 'bg-white/20 text-gray-900 backdrop-blur-md rounded-bl-sm border border-white/20'
          } hover:shadow-lg`}
      >
        <div className={`prose prose-sm max-w-none ${
          message.role === 'user' 
            ? 'prose-invert prose-p:text-white/90 prose-code:text-white/90 prose-headings:text-white/90 prose-strong:text-white/90' 
            : 'prose-headings:text-gray-900 prose-p:text-gray-800 prose-code:text-gray-800'
        }`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <div className="relative group/code mt-4">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-lg blur opacity-75 group-hover/code:opacity-100 transition duration-500"></div>
                    <div className="relative">
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg !bg-gray-900/80 !backdrop-blur-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => handleCopy(String(children))}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                        aria-label={copyStatus === 'copied' ? '복사됨' : '코드 복사'}
                      >
                        {copyStatus === 'copied' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-200" />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <code className={`${className} px-1.5 py-0.5 rounded-md bg-black/10 backdrop-blur-sm font-mono text-sm`} {...props}>
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
          <div className="relative group/code mt-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-lg blur opacity-75 group-hover/code:opacity-100 transition duration-500"></div>
            <div className="relative">
              <SyntaxHighlighter
                language="javascript"
                style={tomorrow}
                className="rounded-lg !bg-gray-900/80 !backdrop-blur-sm"
              >
                {message.code}
              </SyntaxHighlighter>
              <button
                onClick={() => handleCopy(message.code!)}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                aria-label={copyStatus === 'copied' ? '복사됨' : '코드 복사'}
              >
                {copyStatus === 'copied' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-200" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

