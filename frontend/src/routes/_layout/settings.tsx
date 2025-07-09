import React, { useState } from 'react'
import { createFileRoute } from "@tanstack/react-router"
import { motion } from 'framer-motion'
import { 
  FiUser, 
  FiLock, 
  FiCpu, 
  FiDatabase,
  FiMoon,
  FiSun,
  FiGlobe,
  FiVolume2
} from 'react-icons/fi'
import useAuth from "../../hooks/useAuth"

interface TabConfig {
  value: string
  title: string
  icon: React.ReactNode
  component: React.FC
}

const UserProfile: React.FC = () => {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          defaultValue={user?.full_name || ''}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          defaultValue={user?.email || ''}
          disabled
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Role
        </label>
        <input
          type="text"
          defaultValue={user?.is_superuser ? 'Administrator' : 'User'}
          disabled
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
        />
      </div>
      
      <button className="btn-primary">
        Update Profile
      </button>
    </div>
  )
}

const AvatarSettings: React.FC = () => {
  const [voiceSpeed, setVoiceSpeed] = useState(1.0)
  const [responseDelay, setResponseDelay] = useState(0.5)
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Avatar Preferences
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Voice Speed
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-400 w-12">{voiceSpeed}x</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Response Delay (seconds)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={responseDelay}
                onChange={(e) => setResponseDelay(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-gray-400 w-12">{responseDelay}s</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>
      
      <button className="btn-primary">
        Save Avatar Settings
      </button>
    </div>
  )
}

const DataPrivacy: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Data & Privacy
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-100 mb-2">
              Conversation History
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Your conversation history is stored for 30 days to improve the avatar's responses.
            </p>
            <button className="btn-secondary">
              Clear History
            </button>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-100 mb-2">
              Training Data
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Files you upload are used to train the avatar model.
            </p>
            <button className="btn-secondary">
              View My Data
            </button>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-100 mb-2">
              Export Data
            </h4>
            <p className="text-sm text-gray-400 mb-3">
              Download all your data in a machine-readable format.
            </p>
            <button className="btn-secondary">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const tabsConfig: TabConfig[] = [
  { 
    value: "profile", 
    title: "Profile", 
    icon: <FiUser className="w-4 h-4" />,
    component: UserProfile 
  },
  { 
    value: "avatar", 
    title: "Avatar Settings", 
    icon: <FiCpu className="w-4 h-4" />,
    component: AvatarSettings 
  },
  { 
    value: "privacy", 
    title: "Data & Privacy", 
    icon: <FiDatabase className="w-4 h-4" />,
    component: DataPrivacy 
  },
]

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
})

function UserSettings() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) {
    return null
  }

  const ActiveComponent = tabsConfig.find(tab => tab.value === activeTab)?.component || UserProfile

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gradient mb-8">
          Settings
        </h1>

        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex space-x-1 p-2">
              {tabsConfig.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${activeTab === tab.value 
                      ? 'bg-primary-600 text-white' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }
                  `}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <ActiveComponent />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
