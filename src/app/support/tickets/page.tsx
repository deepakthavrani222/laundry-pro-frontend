'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Ticket, 
  Search, 
  Filter,
  Eye,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react'

const tickets = [
  {
    id: 'TKT-1247',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210'
    },
    subject: 'Order not delivered on time',
    description: 'My order ORD-1245 was supposed to be delivered yesterday but I haven\'t received it yet. Please help.',
    status: 'open',
    statusText: 'New',
    priority: 'high',
    category: 'Delivery Issue',
    created: '2 hours ago',
    lastUpdate: '2 hours ago',
    assignedTo: null,
    orderId: 'ORD-1245'
  },
  {
    id: 'TKT-1246',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '9876543211'
    },
    subject: 'Damaged clothes received',
    description: 'I received my dry cleaning order but one of my shirts has a stain that wasn\'t there before.',
    status: 'in_progress',
    statusText: 'In Progress',
    priority: 'high',
    category: 'Quality Issue',
    created: '4 hours ago',
    lastUpdate: '1 hour ago',
    assignedTo: 'You',
    orderId: 'ORD-1243'
  },
  {
    id: 'TKT-1245',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '9876543212'
    },
    subject: 'Refund request for cancelled order',
    description: 'I cancelled my order ORD-1240 but haven\'t received the refund yet. It\'s been 3 days.',
    status: 'in_progress',
    statusText: 'Awaiting Approval',
    priority: 'normal',
    category: 'Refund',
    created: '6 hours ago',
    lastUpdate: '3 hours ago',
    assignedTo: 'Admin Team',
    orderId: 'ORD-1240'
  },
  {
    id: 'TKT-1244',
    customer: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '9876543213'
    },
    subject: 'Unable to place new order',
    description: 'I\'m getting an error when trying to place a new order through the app. The payment page is not loading.',
    status: 'resolved',
    statusText: 'Resolved',
    priority: 'low',
    category: 'Technical',
    created: '1 day ago',
    lastUpdate: '8 hours ago',
    assignedTo: 'You',
    orderId: null
  },
]

export default function SupportTicketsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50 border-red-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200'
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle
      case 'in_progress': return Clock
      case 'resolved': return CheckCircle
      default: return Ticket
    }
  }

  const handleTakeTicket = (ticketId: string) => {
    console.log('Taking ticket:', ticketId)
    // API call to assign ticket to current user
  }

  const handleUpdateStatus = (ticketId: string, newStatus: string) => {
    console.log('Update ticket status:', ticketId, newStatus)
    // API call to update ticket status
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Support Tickets</h1>
          <p className="text-gray-600">Manage customer support requests and issues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-red-600">23</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-green-600">47</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">My Tickets</p>
              <p className="text-2xl font-bold text-purple-600">8</p>
            </div>
            <User className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ticket ID, customer name, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Support Tickets ({filteredTickets.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTickets.map((ticket) => {
            const StatusIcon = getStatusIcon(ticket.status)
            return (
              <div key={ticket.id} className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(ticket.priority)}`}>
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{ticket.id}</h3>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {ticket.statusText}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-800' :
                          ticket.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                        </span>
                      </div>
                      
                      <h4 className="text-md font-medium text-gray-800 mb-2">{ticket.subject}</h4>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {ticket.customer.name}
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {ticket.customer.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {ticket.customer.phone}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created: {ticket.created}
                        </div>
                        <div>Category: {ticket.category}</div>
                        {ticket.orderId && (
                          <div>Related Order: {ticket.orderId}</div>
                        )}
                        {ticket.assignedTo && (
                          <div>Assigned to: {ticket.assignedTo}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    
                    {ticket.status === 'open' && !ticket.assignedTo && (
                      <Button 
                        size="sm" 
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                        onClick={() => handleTakeTicket(ticket.id)}
                      >
                        Take Ticket
                      </Button>
                    )}
                    
                    {ticket.assignedTo === 'You' && ticket.status === 'in_progress' && (
                      <Button 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    
                    {ticket.status === 'resolved' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                      >
                        Close Ticket
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}