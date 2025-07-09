import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMic, FiMessageSquare, FiUser, FiCpu } from 'react-icons/fi'
import { useAvatarStore } from '../../stores/avatarStore'
import { useToast } from '../ui/toaster'

interface Message {
  id: string
  type: 'user' | 'avatar'
  content: string
  timestamp: Date
  isThinking?: boolean
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { addToast } = useToast()
  const { 
    connectionStatus, 
    avatarState,
    setAvatarState,
    currentTranscript,
    currentResponse,
    setCurrentResponse
  } = useAvatarStore()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Watch for transcript updates from voice input
  useEffect(() => {
    if (currentTranscript && currentTranscript.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: currentTranscript,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      
      // Simulate avatar thinking
      const thinkingMessage: Message = {
        id: `thinking-${Date.now()}`,
        type: 'avatar',
        content: '',
        timestamp: new Date(),
        isThinking: true
      }
      setMessages(prev => [...prev, thinkingMessage])
      setAvatarState('thinking')
    }
  }, [currentTranscript, setAvatarState])

  // Watch for avatar responses
  useEffect(() => {
    if (currentResponse && currentResponse.trim()) {
      // Remove thinking message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isThinking)
        const avatarMessage: Message = {
          id: Date.now().toString(),
          type: 'avatar',
          content: currentResponse,
          timestamp: new Date()
        }
        return [...filtered, avatarMessage]
      })
      setAvatarState('speaking')
      setCurrentResponse('')
    }
  }, [currentResponse, setAvatarState, setCurrentResponse])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    if (connectionStatus !== 'connected') {
      addToast({
        type: 'warning',
        title: 'Not Connected',
        description: 'Please connect to the avatar first'
      })
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    
    // Show thinking state
    const thinkingMessage: Message = {
      id: `thinking-${Date.now()}`,
      type: 'avatar',
      content: '',
      timestamp: new Date(),
      isThinking: true
    }
    setMessages(prev => [...prev, thinkingMessage])
    setAvatarState('thinking')

    // Simulate API call - in real implementation, this would call the backend
    setTimeout(() => {
      const avatarResponse: Message = {
        id: Date.now().toString(),
        type: 'avatar',
        content: `I understand you're asking about "${inputValue}". As the CEO, I can provide insights based on our company's strategic direction and my experience. [This is a simulated response - real responses will come from the AI model]`,
        timestamp: new Date()
      }
      
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isThinking)
        return [...filtered, avatarResponse]
      })
      setAvatarState('speaking')
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiMessageSquare className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-100">
              Conversation
            </h3>
          </div>
          <span className="text-sm text-gray-400">
            {messages.length} messages
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="h-[400px] overflow-y-auto px-6 py-4 space-y-4 bg-gray-900/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FiMessageSquare className="w-12 h-12 text-gray-700 mb-4" />
            <p className="text-gray-400">
              Start a conversation with the CEO Avatar
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Type a message or use your microphone to speak
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'avatar' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <FiCpu className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  {message.isThinking ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Thinking</span>
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-current rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-current rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-current rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-lg glass hover:bg-gray-800/70 transition-colors"
            aria-label="Voice input"
            disabled={connectionStatus !== 'connected'}
          >
            <FiMic className="w-5 h-5 text-gray-300" />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-500"
            disabled={connectionStatus !== 'connected'}
          />
          
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || connectionStatus !== 'connected'}
            className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <FiSend className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {connectionStatus !== 'connected' && (
          <p className="text-xs text-yellow-400 mt-2">
            Connect to the avatar to start chatting
          </p>
        )}
      </div>
    </div>
  )
} 