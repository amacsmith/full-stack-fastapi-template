import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FiMaximize2, FiMinimize2, FiInfo, FiUpload } from 'react-icons/fi'
import { AvatarDisplay } from '../components/Avatar/AvatarDisplay'
import { AudioControls } from '../components/WebRTC/AudioControls'
import { ChatInterface } from '../components/Chat/ChatInterface'
import { useAvatarStore } from '../stores/avatarStore'

export const Route = createFileRoute('/avatar')({
  component: AvatarInteraction,
})

function AvatarInteraction() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  
  const { connectionStatus, avatarState } = useAvatarStore()

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gradient">
              Digital CEO Avatar
            </h1>
            <p className="text-gray-400 mt-1">
              Real-time AI-powered interaction
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Info Button */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-lg glass hover:bg-gray-800/70 transition-colors"
              aria-label="Show information"
            >
              <FiInfo className="w-5 h-5 text-gray-300" />
            </button>
            
            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg glass hover:bg-gray-800/70 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <FiMinimize2 className="w-5 h-5 text-gray-300" />
              ) : (
                <FiMaximize2 className="w-5 h-5 text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Info Panel */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-lg glass"
          >
            <h3 className="font-semibold text-gray-100 mb-2">How to interact:</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Click "Connect" to establish WebRTC connection</li>
              <li>• Enable your microphone to speak with the avatar</li>
              <li>• The avatar will respond in real-time with CEO's voice</li>
              <li>• Use the chat interface for text-based interaction</li>
            </ul>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar Display */}
          <div className="lg:col-span-2">
            <AvatarDisplay 
              className="h-[600px]"
              onFullscreen={toggleFullscreen}
            />
          </div>

          {/* Right Column - Controls */}
          <div className="space-y-6">
            {/* Audio Controls */}
            <AudioControls />

            {/* Status Card */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Avatar Status
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Connection</span>
                  <span className={`text-sm font-medium capitalize ${
                    connectionStatus === 'connected' ? 'text-green-400' :
                    connectionStatus === 'connecting' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {connectionStatus}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">State</span>
                  <span className="text-sm font-medium text-gray-100 capitalize">
                    {avatarState}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Model</span>
                  <span className="text-sm font-medium text-gray-100">
                    LLaMA 3 8B
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Voice Engine</span>
                  <span className="text-sm font-medium text-gray-100">
                    NVIDIA RIVA
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => {/* Navigate to upload */}}
                  className="w-full flex items-center justify-center gap-2 btn-secondary"
                >
                  <FiUpload className="w-4 h-4" />
                  Upload Training Data
                </button>
                
                <button
                  onClick={() => {/* Reset conversation */}}
                  className="w-full btn-secondary"
                >
                  Reset Conversation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="mt-6">
          <ChatInterface />
        </div>
      </motion.div>
    </div>
  )
} 