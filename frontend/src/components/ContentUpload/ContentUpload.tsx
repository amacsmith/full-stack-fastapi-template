import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  FiUpload, 
  FiFile, 
  FiVideo, 
  FiMic, 
  FiFileText, 
  FiX, 
  FiCheck,
  FiAlertCircle,
  FiDownload
} from 'react-icons/fi'
import { useToast } from '../ui/toaster'

interface UploadedFile {
  id: string
  file: File
  type: 'video' | 'audio' | 'document' | 'other'
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

const getFileType = (file: File): UploadedFile['type'] => {
  const mimeType = file.type
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document'
  return 'other'
}

const getFileIcon = (type: UploadedFile['type']) => {
  switch (type) {
    case 'video': return FiVideo
    case 'audio': return FiMic
    case 'document': return FiFileText
    default: return FiFile
  }
}

export const ContentUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { addToast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: getFileType(file),
      status: 'pending',
      progress: 0
    }))
    
    setFiles(prev => [...prev, ...newFiles])
    addToast({
      type: 'info',
      title: 'Files Added',
      description: `${acceptedFiles.length} file(s) ready for upload`
    })
  }, [addToast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.doc', '.docx']
    }
  })

  const simulateUpload = async (fileId: string) => {
    const fileIndex = files.findIndex(f => f.id === fileId)
    if (fileIndex === -1) return

    // Set uploading status
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'uploading' } : f
    ))

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress: i } : f
      ))
    }

    // Set processing status
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f
    ))

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Complete
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'completed' } : f
    ))
  }

  const handleUploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) {
      addToast({
        type: 'warning',
        title: 'No Files',
        description: 'No pending files to upload'
      })
      return
    }

    setIsUploading(true)
    
    try {
      // Upload files sequentially (in real app, could be parallel)
      for (const file of pendingFiles) {
        await simulateUpload(file.id)
      }
      
      addToast({
        type: 'success',
        title: 'Upload Complete',
        description: `Successfully uploaded ${pendingFiles.length} file(s)`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Upload Failed',
        description: 'Failed to upload some files'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">
          Upload Training Data
        </h2>
        <p className="text-gray-400">
          Upload videos, podcasts, documents, and other materials to train the CEO avatar
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragActive 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-300 mb-2">
          {isDragActive 
            ? 'Drop the files here...' 
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-sm text-gray-500">
          Supported: Videos, Audio files, PDFs, Documents
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-100">
              Files ({files.length})
            </h3>
            <button
              onClick={handleUploadAll}
              disabled={isUploading || files.every(f => f.status !== 'pending')}
              className="btn-primary"
            >
              {isUploading ? 'Uploading...' : 'Upload All'}
            </button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {files.map((file) => {
                const Icon = getFileIcon(file.type)
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-gray-800 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* File Icon */}
                      <div className={`p-3 rounded-lg ${
                        file.type === 'video' ? 'bg-purple-900/20 text-purple-400' :
                        file.type === 'audio' ? 'bg-blue-900/20 text-blue-400' :
                        file.type === 'document' ? 'bg-green-900/20 text-green-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* File Info */}
                      <div className="flex-1">
                        <h4 className="text-gray-100 font-medium truncate">
                          {file.file.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(file.file.size)}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-3">
                        {file.status === 'pending' && (
                          <span className="text-sm text-gray-500">Pending</span>
                        )}
                        
                        {file.status === 'uploading' && (
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-primary-500"
                                animate={{ width: `${file.progress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-10">
                              {file.progress}%
                            </span>
                          </div>
                        )}
                        
                        {file.status === 'processing' && (
                          <div className="flex items-center gap-2 text-yellow-400">
                            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm">Processing</span>
                          </div>
                        )}
                        
                        {file.status === 'completed' && (
                          <div className="flex items-center gap-2 text-green-400">
                            <FiCheck className="w-4 h-4" />
                            <span className="text-sm">Completed</span>
                          </div>
                        )}
                        
                        {file.status === 'error' && (
                          <div className="flex items-center gap-2 text-red-400">
                            <FiAlertCircle className="w-4 h-4" />
                            <span className="text-sm">Error</span>
                          </div>
                        )}

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1.5 rounded hover:bg-gray-700 transition-colors"
                          disabled={file.status === 'uploading' || file.status === 'processing'}
                        >
                          <FiX className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {file.error && (
                      <p className="mt-2 text-sm text-red-400">
                        {file.error}
                      </p>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="font-medium text-gray-100 mb-2">
          Supported Content Types:
        </h4>
        <ul className="space-y-1 text-sm text-gray-400">
          <li>• <strong>Videos:</strong> MP4, AVI, MOV, MKV (CEO speeches, interviews)</li>
          <li>• <strong>Audio:</strong> MP3, WAV, M4A (Podcasts, recordings)</li>
          <li>• <strong>Documents:</strong> PDF, DOC, DOCX, TXT (Reports, transcripts)</li>
          <li>• <strong>Max file size:</strong> 500MB per file</li>
        </ul>
      </div>
    </div>
  )
} 