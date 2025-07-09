import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { 
  FiActivity, 
  FiUsers, 
  FiMessageSquare, 
  FiCpu, 
  FiDatabase,
  FiClock,
  FiTrendingUp,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            <FiTrendingUp className={`w-4 h-4 ${!trend.isPositive && 'rotate-180'}`} />
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-100">{value}</h3>
      <p className="text-sm text-gray-400 mt-1">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
      )}
    </motion.div>
  )
}

function Dashboard() {
  const navigate = useNavigate()

  // Mock data - in real app, this would come from API
  const stats = {
    totalSessions: 1247,
    activeUsers: 342,
    avgResponseTime: '0.8s',
    uptime: '99.9%',
    totalQuestions: 8432,
    satisfaction: 94
  }

  const recentActivity = [
    { id: 1, type: 'session', user: 'Conference Attendee #234', time: '2 minutes ago', status: 'active' },
    { id: 2, type: 'question', user: 'Demo User', time: '5 minutes ago', status: 'completed' },
    { id: 3, type: 'upload', user: 'Admin', time: '1 hour ago', status: 'completed' },
    { id: 4, type: 'training', user: 'System', time: '3 hours ago', status: 'completed' },
  ]

  const systemStatus = [
    { name: 'WebRTC Server', status: 'operational', latency: '12ms' },
    { name: 'AI Model API', status: 'operational', latency: '145ms' },
    { name: 'RIVA TTS', status: 'operational', latency: '78ms' },
    { name: 'Vector Database', status: 'warning', latency: '234ms' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400">
            Monitor and manage your Digital CEO Avatar system
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate({ to: '/avatar' })}
            className="p-4 bg-primary-600 hover:bg-primary-700 rounded-xl text-white transition-colors"
          >
            <FiMessageSquare className="w-6 h-6 mb-2" />
            <p className="font-medium">Start Session</p>
            <p className="text-sm opacity-80">Launch avatar interaction</p>
          </button>
          
          <button
            onClick={() => navigate({ to: '/upload' })}
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-100 transition-colors"
          >
            <FiDatabase className="w-6 h-6 mb-2" />
            <p className="font-medium">Upload Data</p>
            <p className="text-sm text-gray-400">Add training content</p>
          </button>
          
          <button
            className="p-4 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-100 transition-colors"
          >
            <FiActivity className="w-6 h-6 mb-2" />
            <p className="font-medium">View Analytics</p>
            <p className="text-sm text-gray-400">Detailed reports</p>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={stats.totalSessions.toLocaleString()}
            subtitle="Last 30 days"
            icon={<FiUsers className="w-6 h-6 text-white" />}
            trend={{ value: 12, isPositive: true }}
            color="bg-primary-600"
          />
          
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            subtitle="Currently online"
            icon={<FiActivity className="w-6 h-6 text-white" />}
            trend={{ value: 5, isPositive: true }}
            color="bg-green-600"
          />
          
          <StatCard
            title="Avg Response Time"
            value={stats.avgResponseTime}
            subtitle="AI processing"
            icon={<FiClock className="w-6 h-6 text-white" />}
            trend={{ value: 8, isPositive: false }}
            color="bg-yellow-600"
          />
          
          <StatCard
            title="System Uptime"
            value={stats.uptime}
            subtitle="Last 90 days"
            icon={<FiCheckCircle className="w-6 h-6 text-white" />}
            color="bg-purple-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              Recent Activity
            </h3>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'session' ? 'bg-primary-900/20 text-primary-400' :
                      activity.type === 'question' ? 'bg-blue-900/20 text-blue-400' :
                      activity.type === 'upload' ? 'bg-green-900/20 text-green-400' :
                      'bg-purple-900/20 text-purple-400'
                    }`}>
                      {activity.type === 'session' ? <FiUsers className="w-4 h-4" /> :
                       activity.type === 'question' ? <FiMessageSquare className="w-4 h-4" /> :
                       activity.type === 'upload' ? <FiDatabase className="w-4 h-4" /> :
                       <FiCpu className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-gray-100 text-sm font-medium">{activity.user}</p>
                      <p className="text-gray-500 text-xs capitalize">{activity.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                    <span className={`text-xs ${
                      activity.status === 'active' ? 'text-green-400' :
                      activity.status === 'completed' ? 'text-gray-400' :
                      'text-yellow-400'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors">
              View all activity →
            </button>
          </div>

          {/* System Status */}
          <div className="bg-gray-900 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              System Status
            </h3>
            
            <div className="space-y-3">
              {systemStatus.map((service) => (
                <div key={service.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{service.latency}</span>
                      {service.status === 'operational' ? (
                        <FiCheckCircle className="w-4 h-4 text-green-400" />
                      ) : service.status === 'warning' ? (
                        <FiAlertCircle className="w-4 h-4 text-yellow-400" />
                      ) : (
                        <FiAlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        service.status === 'operational' ? 'bg-green-500' :
                        service.status === 'warning' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: service.status === 'operational' ? '100%' : '70%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-400">
                All systems operational • Last check: 1 min ago
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-6 bg-gray-900 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">
            Performance Metrics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-2">Questions Answered</p>
              <p className="text-2xl font-bold text-gray-100">{stats.totalQuestions.toLocaleString()}</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 w-4/5" />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-2">User Satisfaction</p>
              <p className="text-2xl font-bold text-gray-100">{stats.satisfaction}%</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${stats.satisfaction}%` }} />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-400 mb-2">Model Accuracy</p>
              <p className="text-2xl font-bold text-gray-100">92%</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[92%]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 