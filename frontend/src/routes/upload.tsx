import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiDatabase, FiCpu } from 'react-icons/fi'
import { useNavigate } from '@tanstack/react-router'
import { ContentUpload } from '../components/ContentUpload/ContentUpload'

export const Route = createFileRoute('/upload')({
  component: UploadPage,
})

function UploadPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate({ to: '/avatar' })}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Avatar
          </button>
          
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Training Data Management
          </h1>
          <p className="text-gray-400">
            Upload and manage content to train your Digital CEO Avatar
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <ContentUpload />
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Training Status */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">
                Training Status
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Model Status</span>
                    <span className="text-sm text-green-400">Active</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-full" />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Files</span>
                    <span className="text-gray-100">142</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Training Hours</span>
                    <span className="text-gray-100">47.3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="text-gray-100">2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <FiDatabase className="w-5 h-5 text-primary-400" />
                Data Sources
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                    <span className="text-sm text-gray-300">Videos</span>
                  </div>
                  <span className="text-sm text-gray-400">28 files</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-sm text-gray-300">Podcasts</span>
                  </div>
                  <span className="text-sm text-gray-400">67 files</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm text-gray-300">Documents</span>
                  </div>
                  <span className="text-sm text-gray-400">47 files</span>
                </div>
              </div>
            </div>

            {/* AI Model Info */}
            <div className="bg-gray-900 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                <FiCpu className="w-5 h-5 text-primary-400" />
                AI Model
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Base Model</span>
                  <span className="text-gray-100">LLaMA 3 8B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fine-tuning</span>
                  <span className="text-gray-100">Custom CEO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice Model</span>
                  <span className="text-gray-100">RIVA TTS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Context Window</span>
                  <span className="text-gray-100">8,192 tokens</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 