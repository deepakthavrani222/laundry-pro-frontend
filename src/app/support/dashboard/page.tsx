'use client'

import { useAuthStore } from '@/store/authStore'
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
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SupportDashboard() {
  const { user } = useAuthStore()

  const stats = [
    {
      name: 'Open Tickets',
      value: '23',
      icon: Ticket,
      change: '+5 from yesterday',
      changeType: 'warning',
      color: 'from-orange-500 to-red-600',
    },
    {
      name: 'In Progress',
      value: '12',
      icon: Clock,
      change: 'Active conversations',
      changeType: 'neutral',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'Resolved Today',
      value: '47',
      icon: CheckCircle,
      change: '+18 from yesterday',
      changeType: 'positive',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Avg Response Time',
      value: '2.5 min',
      icon: TrendingUp,
      change: '15% faster than target',
      changeType: 'positive',
      color: 'from-purple-500 to-pink-600',
    },
  ]

  const recentTickets = [
    {
      id: 'TKT-1247',
      customer: 'John Doe',
      subject: 'Order not delivered on time',
      status: 'open',
      statusText: 'New',
      priority: 'high',
      created: '2 hours ago',
      category: 'Delivery Issue',
    },
    {
      id: 'TKT-1246',
      customer: 'Sarah Wilson',
      subject: 'Damaged clothes received',
      status: 'in_progress',
      statusText: 'In Progress',
      priority: 'high',
      created: '4 hours ago',
      category: 'Quality Issue',
    },
    {
      id: 'TKT-1245',
      customer: 'Mike Johnson',
      subject: 'Refund request for cancelled order',
      status: 'in_progress',
      statusText: 'Awaiting Approval',
      priority: 'normal',
      created: '6 hours ago',
      category: 'Refund',
    },
    {
      id: 'TKT-1244',
      customer: 'Emily Davis',
      subject: 'Unable to place new order',
      status: 'resolved',
      statusText: 'Resolved',
      priority: 'low',
      created: '1 day ago',
      category: 'Technical',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'resolved': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'normal': return 'border-l-blue-500'
      case 'low': return 'border-l-gray-300'
      default: return 'border-l-gray-300'
    }
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}! 👋</h1>
            <p className="text-purple-100">Ready to help customers and resolve their issues today.</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link href="/support/tickets">
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Ticket className="w-5 h-5 mr-2" />
                View Tickets
              </Button>
            </Link>
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
            <div className={`text-xs ${
              stat.changeType === 'positive' ? 'text-green-600' : 
              stat.changeType === 'warning' ? 'text-orange-600' : 'text-gray-500'
            }`}>
              {stat.change}
            </div>
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

          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border-l-4 ${getPriorityColor(ticket.priority)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{ticket.id}</div>
                    <div className="text-sm text-gray-600">{ticket.subject}</div>
                    <div className="text-xs text-gray-400">{ticket.customer} • {ticket.created}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)} mb-2`}>
                    {ticket.statusText}
                  </div>
                  <div className="text-xs text-gray-500">{ticket.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Performance */}
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
                href="/support/chat"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Live Chat</div>
                  <div className="text-xs text-gray-500">Real-time customer support</div>
                </div>
              </Link>

              <Link
                href="/support/customers"
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Customer Lookup</div>
                  <div className="text-xs text-gray-500">Search customer history</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">My Performance</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tickets Resolved Today</span>
                <span className="text-lg font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-lg font-bold text-blue-600">1.8 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-lg font-bold text-purple-600">4.9/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolution Rate</span>
                <span className="text-lg font-bold text-orange-600">95%</span>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Contact Channels</h3>
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">Phone Support</span>
                </div>
                <span className="text-sm font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">Live Chat</span>
                </div>
                <span className="text-sm font-medium">3 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">Email Support</span>
                </div>
                <span className="text-sm font-medium">8 Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}