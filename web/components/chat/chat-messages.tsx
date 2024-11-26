import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { Message } from '@/lib/types'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="space-y-4 px-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`rounded-lg px-4 py-2 max-w-[80%] ${
              message.role === 'user'
                ? 'bg-blue-500 text-white prose-invert'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div className={`prose prose-sm dark:prose-invert max-w-none ${
              message.role === 'user' 
                ? 'prose-p:text-white prose-code:text-white prose-pre:bg-blue-600' 
                : 'prose-pre:bg-gray-800'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    return (
                      <code
                        className={`${className} ${
                          inline ? 'bg-opacity-20 bg-gray-200 rounded px-1' : ''
                        }`}
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  pre({ node, children, ...props }: any) {
                    return (
                      <pre className="p-4 rounded-lg overflow-auto" {...props}>
                        {children}
                      </pre>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            {message.code && (
              <div className="mt-2 bg-gray-800 text-gray-100 rounded-lg overflow-hidden">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  className="prose prose-sm prose-invert max-w-none"
                >
                  {`\`\`\`\n${message.code}\n\`\`\``}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="text-center text-gray-500">로딩 중...</div>
      )}
    </div>
  )
}