import React, { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  FiHome,
  FiMessageSquare, 
  FiUpload, 
  FiSettings,
  FiUsers,
  FiDatabase,
  FiActivity,
  FiFileText,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'

interface NavItem {
  label: string
  icon: React.ReactNode
  path: string
  badge?: number
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <FiHome className="w-5 h-5" />,
    path: '/dashboard'
  },
  {
    label: 'Avatar',
    icon: <FiMessageSquare className="w-5 h-5" />,
    path: '/avatar',
    badge: 3
  },
  {
    label: 'Upload',
    icon: <FiUpload className="w-5 h-5" />,
    path: '/upload'
  },
  {
    label: 'Analytics',
    icon: <FiActivity className="w-5 h-5" />,
    path: '/analytics'
  },
  {
    label: 'Training Data',
    icon: <FiDatabase className="w-5 h-5" />,
    path: '/training'
  },
  {
    label: 'Users',
    icon: <FiUsers className="w-5 h-5" />,
    path: '/admin'
  },
  {
    label: 'Documentation',
    icon: <FiFileText className="w-5 h-5" />,
    path: '/docs'
  },
  {
    label: 'Settings',
    icon: <FiSettings className="w-5 h-5" />,
    path: '/settings'
  }
]

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      className="bg-gray-900 border-r border-gray-800 flex flex-col"
    >
      {/* Collapse Toggle */}
      <div className="p-4 flex justify-end">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <FiChevronRight className="w-5 h-5 text-gray-400" />
          ) : (
            <FiChevronLeft className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 pb-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
              ${isActive(item.path) 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'
              }
            `}
          >
            <div className="flex-shrink-0">{item.icon}</div>
            {!collapsed && (
              <>
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs bg-red-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-1">Pro Tip</h4>
            <p className="text-primary-100 text-sm">
              Use voice commands for hands-free avatar interaction
            </p>
          </div>
        </div>
      )}
    </motion.aside>
  )
}

export default Sidebar
