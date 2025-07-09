import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiVolume2, FiVolumeX, FiSettings, FiMaximize2 } from 'react-icons/fi'
import { useAvatarStore } from '../../stores/avatarStore'

interface AvatarDisplayProps {
  className?: string
  onFullscreen?: () => void
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({ className = '', onFullscreen }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  
  const { 
    avatarState, 
    isSpeaking, 
    connectionStatus,
    avatarSettings 
  } = useAvatarStore()

  useEffect(() => {
    // Initialize 3D avatar rendering here
    // This would connect to NVIDIA Omniverse or your 3D rendering engine
    const initializeAvatar = async () => {
      try {
        setIsLoading(true)
        // Avatar initialization logic
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate loading
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize avatar:', error)
        setIsLoading(false)
      }
    }

    initializeAvatar()
  }, [])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Handle audio muting logic
  }

  const statusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500',
    disconnected: 'bg-red-500',
    error: 'bg-red-600'
  }

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-gray-900 ${className}`}
    >
      {/* 3D Avatar Canvas */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Initializing CEO Avatar...</p>
          </div>
        </div>
      )}

      {/* Speaking Indicator */}
      {isSpeaking && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 avatar-glow animate-pulse-slow" />
        </motion.div>
      )}

      {/* Avatar Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {/* Connection Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
          <div className={`status-indicator ${statusColors[connectionStatus]}`} />
          <span className="text-xs text-gray-300 capitalize">{connectionStatus}</span>
        </div>

        {/* Control Buttons */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg glass hover:bg-gray-800/70 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <FiVolumeX className="w-5 h-5 text-gray-300" />
          ) : (
            <FiVolume2 className="w-5 h-5 text-gray-300" />
          )}
        </button>

        <button
          onClick={() => {/* Open settings */}}
          className="p-2 rounded-lg glass hover:bg-gray-800/70 transition-colors"
          aria-label="Settings"
        >
          <FiSettings className="w-5 h-5 text-gray-300" />
        </button>

        {onFullscreen && (
          <button
            onClick={onFullscreen}
            className="p-2 rounded-lg glass hover:bg-gray-800/70 transition-colors"
            aria-label="Fullscreen"
          >
            <FiMaximize2 className="w-5 h-5 text-gray-300" />
          </button>
        )}
      </div>

      {/* Avatar Name/Title */}
      <div className="absolute bottom-4 left-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass px-4 py-2 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-100">
            {avatarSettings.name || 'CEO Avatar'}
          </h3>
          <p className="text-sm text-gray-400">
            {avatarSettings.title || 'Digital Human'}
          </p>
        </motion.div>
      </div>

      {/* Audio Visualizer Overlay */}
      {isSpeaking && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
          <div className="h-full flex items-end justify-center gap-1 px-4">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-primary-500/50 rounded-full"
                animate={{
                  height: [10, 40, 10],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 