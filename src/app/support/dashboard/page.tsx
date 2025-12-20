'use client'

import { useAuthStore } from '@/store/authStore'
import { useSupportDashboard } from '@/hooks/useSupport'
import { 
  Ticket, 
  MessageCircle, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  ArrowRight,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SupportDashboard() {
  const { user } = useAuthStore()
  const { metrics, recentTickets, categoryDistribution, loading, error, refetch } = useSupportDashboard()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'resolved': return 'text-green-600 bg-green-50'
      case 'escalated': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-600'
      case 'high': return 'border-l-orange-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 mt-16">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6 mt-16">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Dashboard</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <Button onClick={refetch} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Open Tickets',
      value: metrics?.openTickets || 0,
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      change: 'Needs attention'
    },
    {
      name: 'In Progress',
      value: metrics?.inProgressTickets || 0,
      icon: Clock,
      color: 'from-blue-500 to-blue-600',
      change: 'Being handled'
    },
    {
      name: 'My Tickets',
      value: metrics?.myAssignedTickets || 0,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: 'Assigned to you'
    },
    {
      name: 'Overdue',
      value: metrics?.overdueTickets || 0,
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      change: 'SLA breached'
    },
  ]

  return (
    <div className="space-y-6 mt-16">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
            <p className="text-purple-100">Ready to help customers and resolve their issues today.</p>
            <p className="text-purple-200 text-sm mt-2">
              Total tickets today: {metrics?.todayTickets || 0} | Avg resolution: {metrics?.avgResolutionTime || 0}h
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/support/tickets">
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Ticket className="w-5 h-5 mr-2" />
                View Tickets
              </Button>
            </Link>
            <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={refetch}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600 mb-2">{stat.name}</div>
            <div className="text-xs text-gray-500">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Tickets</h2>
            <Link href="/support/tickets" className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentTickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Yet</h3>
              <p className="text-gray-600">New tickets will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTickets.map((ticket: any) => (
                <Link
                  key={ticket._id}
                  href={`/support/tickets/${ticket._id}`}
                  className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4 ${getPriorityColor(ticket.priority)}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{ticket.ticketNumber}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{ticket.title}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)} mb-2`}>
                      {ticket.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{ticket.priority}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Category Distribution */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/support/tickets"
                className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Manage Tickets</div>
                  <div className="text-xs text-gray-500">View & resolve tickets</div>
                </div>
              </Link>

              <Link
                href="/support/tickets?status=open"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Open Tickets</div>
                  <div className="text-xs text-gray-500">{metrics?.openTickets || 0} awaiting response</div>
                </div>
              </Link>

              <Link
                href="/support/reports"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Reports</div>
                  <div className="text-xs text-gray-500">View performance metrics</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tickets by Category</h2>
            {categoryDistribution.length === 0 ? (
              <p className="text-gray-500 text-sm">No category data available</p>
            ) : (
              <div className="space-y-3">
                {categoryDistribution.map((cat: any) => (
                  <div key={cat._id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 capitalize">{cat._id?.replace('_', ' ') || 'Other'}</span>
                    <span className="text-sm font-bold text-gray-800">{cat.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Today's Stats</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Total Tickets</span>
                <span className="text-lg font-bold">{metrics?.totalTickets || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Today's Tickets</span>
                <span className="text-lg font-bold">{metrics?.todayTickets || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-100">Avg Resolution</span>
                <span className="text-lg font-bold">{metrics?.avgResolutionTime || 0}h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
