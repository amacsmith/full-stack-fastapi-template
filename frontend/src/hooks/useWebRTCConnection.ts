import { useEffect, useRef, useState, useCallback } from 'react'
import { useAvatarStore } from '../stores/avatarStore'
import adapter from 'webrtc-adapter'

interface UseWebRTCConnectionReturn {
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  toggleMicrophone: () => Promise<boolean>
  toggleCamera: () => Promise<boolean>
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
]

export const useWebRTCConnection = (): UseWebRTCConnectionReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const websocketRef = useRef<WebSocket | null>(null)
  
  const { setConnectionStatus, setError } = useAvatarStore()

  // WebSocket connection for signaling
  const connectWebSocket = useCallback(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/rtc'
    websocketRef.current = new WebSocket(wsUrl)

    websocketRef.current.onopen = () => {
      console.log('WebSocket connected')
    }

    websocketRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case 'offer':
          await handleOffer(data.offer)
          break
        case 'answer':
          await handleAnswer(data.answer)
          break
        case 'ice-candidate':
          await handleIceCandidate(data.candidate)
          break
        case 'ready':
          // Peer is ready to receive offers
          if (peerConnectionRef.current) {
            await createOffer()
          }
          break
      }
    }

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      setError('WebSocket connection error')
      setConnectionStatus('error')
    }

    websocketRef.current.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      setConnectionStatus('disconnected')
    }
  }, [setConnectionStatus, setError])

  // Create peer connection
  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    
    pc.onicecandidate = (event) => {
      if (event.candidate && websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate
        }))
      }
    }

    pc.ontrack = (event) => {
      console.log('Received remote stream')
      setRemoteStream(event.streams[0])
    }

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState)
      if (pc.connectionState === 'connected') {
        setIsConnected(true)
        setConnectionStatus('connected')
      } else if (pc.connectionState === 'failed') {
        setConnectionStatus('error')
        setError('Peer connection failed')
      }
    }

    peerConnectionRef.current = pc
    return pc
  }, [setConnectionStatus, setError])

  // Create offer
  const createOffer = async () => {
    if (!peerConnectionRef.current) return

    try {
      const offer = await peerConnectionRef.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      })
      await peerConnectionRef.current.setLocalDescription(offer)
      
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'offer',
          offer: offer
        }))
      }
    } catch (error) {
      console.error('Error creating offer:', error)
      setError('Failed to create offer')
    }
  }

  // Handle offer from remote peer
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) {
      createPeerConnection()
    }

    try {
      await peerConnectionRef.current!.setRemoteDescription(offer)
      const answer = await peerConnectionRef.current!.createAnswer()
      await peerConnectionRef.current!.setLocalDescription(answer)
      
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'answer',
          answer: answer
        }))
      }
    } catch (error) {
      console.error('Error handling offer:', error)
      setError('Failed to handle offer')
    }
  }

  // Handle answer from remote peer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.setRemoteDescription(answer)
    } catch (error) {
      console.error('Error handling answer:', error)
      setError('Failed to handle answer')
    }
  }

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return

    try {
      await peerConnectionRef.current.addIceCandidate(candidate)
    } catch (error) {
      console.error('Error adding ICE candidate:', error)
    }
  }

  // Get user media
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      })
      
      setLocalStream(stream)
      
      // Add tracks to peer connection
      if (peerConnectionRef.current) {
        stream.getTracks().forEach(track => {
          peerConnectionRef.current!.addTrack(track, stream)
        })
      }
      
      return stream
    } catch (error) {
      console.error('Error accessing media devices:', error)
      setError('Failed to access microphone')
      throw error
    }
  }

  // Connect to WebRTC
  const connect = async () => {
    try {
      // Get user media first
      await getUserMedia()
      
      // Create peer connection
      createPeerConnection()
      
      // Connect WebSocket for signaling
      connectWebSocket()
      
      // Send ready signal
      setTimeout(() => {
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify({ type: 'ready' }))
        }
      }, 1000)
    } catch (error) {
      console.error('Connection error:', error)
      throw error
    }
  }

  // Disconnect
  const disconnect = () => {
    // Close WebSocket
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop())
      setLocalStream(null)
    }

    setRemoteStream(null)
    setIsConnected(false)
  }

  // Toggle microphone
  const toggleMicrophone = async () => {
    if (!localStream) return false

    const audioTrack = localStream.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      return audioTrack.enabled
    }
    return false
  }

  // Toggle camera (placeholder for future use)
  const toggleCamera = async () => {
    if (!localStream) return false

    const videoTrack = localStream.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      return videoTrack.enabled
    }
    return false
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    localStream,
    remoteStream,
    isConnected,
    connect,
    disconnect,
    toggleMicrophone,
    toggleCamera
  }
} 