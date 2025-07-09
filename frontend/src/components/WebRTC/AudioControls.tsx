import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FiMic, FiMicOff, FiHeadphones, FiActivity, FiWifi, FiWifiOff } from 'react-icons/fi'
import WaveSurfer from 'wavesurfer.js'
import { useWebRTCConnection } from '../../hooks/useWebRTCConnection'
import { useAvatarStore } from '../../stores/avatarStore'
import { useToast } from '../ui/toaster'

interface AudioControlsProps {
  className?: string
}

export const AudioControls: React.FC<AudioControlsProps> = ({ className = '' }) => {
  const waveformRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const [micEnabled, setMicEnabled] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const { addToast } = useToast()
  const { 
    connectionStatus, 
    setConnectionStatus,
    isListening,
    setIsListening,
    setCurrentTranscript
  } = useAvatarStore()

  const {
    localStream,
    remoteStream,
    connect,
    disconnect,
    toggleMicrophone,
    isConnected
  } = useWebRTCConnection()

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#3b82f6',
        progressColor: '#1d4ed8',
        cursorColor: '#60a5fa',
        barWidth: 3,
        barRadius: 3,
        cursorWidth: 1,
        height: 60,
        barGap: 3,
        responsive: true,
        normalize: true,
        backend: 'MediaElement'
      })
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
        wavesurferRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    // Monitor audio levels
    if (localStream) {
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(localStream)
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1)

      analyser.smoothingTimeConstant = 0.8
      analyser.fftSize = 1024

      microphone.connect(analyser)
      analyser.connect(javascriptNode)
      javascriptNode.connect(audioContext.destination)

      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount)
        analyser.getByteFrequencyData(array)
        const values = array.reduce((a, b) => a + b, 0)
        const average = values / array.length
        setAudioLevel(Math.round(average))
      }

      return () => {
        javascriptNode.disconnect()
        analyser.disconnect()
        microphone.disconnect()
        audioContext.close()
      }
    }
  }, [localStream])

  const handleConnect = async () => {
    try {
      setConnectionStatus('connecting')
      await connect()
      setConnectionStatus('connected')
      addToast({
        type: 'success',
        title: 'Connected',
        description: 'WebRTC connection established successfully'
      })
    } catch (error) {
      setConnectionStatus('error')
      addToast({
        type: 'error',
        title: 'Connection Failed',
        description: 'Failed to establish WebRTC connection'
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setConnectionStatus('disconnected')
    setMicEnabled(false)
    setIsListening(false)
    addToast({
      type: 'info',
      title: 'Disconnected',
      description: 'WebRTC connection closed'
    })
  }

  const handleToggleMic = async () => {
    if (!isConnected) {
      addToast({
        type: 'warning',
        title: 'Not Connected',
        description: 'Please connect first before using the microphone'
      })
      return
    }

    const enabled = await toggleMicrophone()
    setMicEnabled(enabled)
    setIsListening(enabled)
    
    addToast({
      type: 'info',
      title: enabled ? 'Microphone On' : 'Microphone Off',
      description: enabled ? 'You can now speak to the avatar' : 'Microphone muted'
    })
  }

  return (
    <div className={`bg-gray-900 rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-100">Audio Controls</h3>
        
        {/* Connection Button */}
        <button
          onClick={isConnected ? handleDisconnect : handleConnect}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isConnected 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-800 hover:bg-gray-700 text-gray-100'
          }`}
          disabled={connectionStatus === 'connecting'}
        >
          {connectionStatus === 'connecting' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Connecting...</span>
            </>
          ) : isConnected ? (
            <>
              <FiWifi className="w-4 h-4" />
              <span>Connected</span>
            </>
          ) : (
            <>
              <FiWifiOff className="w-4 h-4" />
              <span>Connect</span>
            </>
          )}
        </button>
      </div>

      {/* Audio Waveform */}
      <div className="mb-6">
        <div className="waveform-container mb-2">
          <div ref={waveformRef} className="w-full h-full" />
        </div>
        
        {/* Audio Level Indicator */}
        <div className="flex items-center gap-2">
          <FiActivity className="w-4 h-4 text-gray-400" />
          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500"
              animate={{ width: `${Math.min(audioLevel, 100)}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-xs text-gray-400 w-10">{audioLevel}%</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        {/* Microphone Toggle */}
        <button
          onClick={handleToggleMic}
          disabled={!isConnected}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all ${
            micEnabled
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
          } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {micEnabled ? (
            <FiMic className="w-8 h-8" />
          ) : (
            <FiMicOff className="w-8 h-8" />
          )}
          <span className="text-sm font-medium">
            {micEnabled ? 'Microphone On' : 'Microphone Off'}
          </span>
        </button>

        {/* Audio Output */}
        <button
          disabled={!isConnected}
          className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all bg-gray-800 hover:bg-gray-700 text-gray-300 ${
            !isConnected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiHeadphones className="w-8 h-8" />
          <span className="text-sm font-medium">Audio Output</span>
        </button>
      </div>

      {/* Status Messages */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-primary-900/20 border border-primary-500/20 rounded-lg"
        >
          <p className="text-sm text-primary-300 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            Listening... Speak naturally to interact with the avatar
          </p>
        </motion.div>
      )}
    </div>
  )
} 