'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  Ticket, 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  MessageCircle,
  Package,
  DollarSign,
  RefreshCw,
  Send,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useTicketDetail } from '@/hooks/useSupport'
import { supportApi } from '@/lib/supportApi'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  
  const { ticket, loading, error, addMessage, resolve, refetch } = useTicketDetail(ticketId)
  
  const [newMessage, setNewMessage] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [showResolveModal, setShowResolveModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [resolution, setResolution] = useState('')
  const [resolutionType, setResolutionType] = useState<'resolved' | 'refund' | 'rewash' | 'compensation'>('resolved')
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [sending, setSending] = useState(false)

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    setSending(true)
    try {
      await addMessage(newMessage, isInternal)
      setNewMessage('')
      alert('Message sent!')
    } catch (err: any) {
      alert(`Failed: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  const handleResolve = async () => {
    if (!resolution.trim()) {
      alert('Please enter a resolution')
      return
    }
    try {
      let fullResolution = resolution
      if (resolutionType === 'refund') {
        fullResolution = `[REFUND: ₹${refundAmount}] ${resolution}`
      } else if (resolutionType === 'rewash') {
        fullResolution = `[REWASH SCHEDULED] ${resolution}`
      } else if (resolutionType === 'compensation') {
        fullResolution = `[COMPENSATION PROVIDED] ${resolution}`
      }
      
      await resolve(fullResolution)
      setShowResolveModal(false)
      setResolution('')
      alert('Ticket resolved successfully!')
    } catch (err: any) {
      alert(`Failed: ${err.message}`)
    }
  }

  const handleCreateRefund = async () => {
    if (!refundAmount || !refundReason) {
      alert('Please fill all fields')
      return
    }
    try {
      await supportApi.createRefund({
        orderId: ticket?.relatedOrder?._id || '',
        amount: parseFloat(refundAmount),
        reason: refundReason,
        category: ticket?.category || 'other',
        ticketId: ticketId
      })
      setShowRefundModal(false)
      setRefundAmount('')
      setRefundReason('')
      alert('Refund request created!')
      refetch()
    } catch (err: any) {
      alert(`Failed: ${err.message}`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50 border-red-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200'
      case 'escalated': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'closed': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="space-y-6 mt-16">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Ticket</h3>
              <p className="text-red-600">{error || 'Ticket not found'}</p>
            </div>
          </div>
          <Link href="/support/tickets">
            <Button className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/support/tickets">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{ticket.ticketNumber}</h1>
            <p className="text-gray-600">{ticket.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
            {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadge(ticket.priority)}`}>
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Ticket Details</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">{ticket.description}</p>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 font-medium capitalize">{ticket.category?.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>
                <span className="ml-2 font-medium">{new Date(ticket.createdAt).toLocaleString('en-IN')}</span>
              </div>
              {ticket.assignedTo && (
                <div>
                  <span className="text-gray-500">Assigned To:</span>
                  <span className="ml-2 font-medium">{ticket.assignedTo.name}</span>
                </div>
              )}
              {ticket.sla?.isOverdue && (
                <div className="col-span-2">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-800 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    SLA Breached - Overdue
                  </span>
                </div>
              )}
            </div>

            {ticket.resolution && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Resolution</h3>
                <p className="text-green-700">{ticket.resolution}</p>
                {ticket.resolvedBy && (
                  <p className="text-sm text-green-600 mt-2">
                    Resolved by {ticket.resolvedBy.name} on {new Date(ticket.resolvedAt || '').toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Messages / Chat */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              <MessageCircle className="w-5 h-5 inline mr-2" />
              Messages
            </h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {ticket.messages?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No messages yet</p>
              ) : (
                ticket.messages?.map((msg, index) => (
                  <div 
                    key={msg._id || index} 
                    className={`p-4 rounded-lg ${msg.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {msg.sender?.name || 'Unknown'}
                        {msg.isInternal && <span className="ml-2 text-xs text-yellow-600">(Internal Note)</span>}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* New Message Input */}
            {ticket.status !== 'closed' && (
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="internal"
                    checked={isInternal}
                    onChange={(e) => setIsInternal(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="internal" className="text-sm text-gray-600">Internal note (not visible to customer)</label>
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-800">{ticket.raisedBy?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{ticket.raisedBy?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-600">{ticket.raisedBy?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Related Order */}
          {ticket.relatedOrder && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Order</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order #</span>
                  <span className="font-medium">{ticket.relatedOrder.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium capitalize">{ticket.relatedOrder.status?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setShowResolveModal(true)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve Ticket
                </Button>
                
                {ticket.relatedOrder && (
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowRefundModal(true)}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Create Refund
                  </Button>
                )}
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={refetch}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Resolve Ticket</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['resolved', 'refund', 'rewash', 'compensation'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setResolutionType(type as any)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        resolutionType === type 
                          ? 'bg-purple-500 text-white border-purple-500' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              {resolutionType === 'refund' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Refund Amount (₹)</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution Details *</label>
                <textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how the issue was resolved..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={handleResolve}
                  disabled={!resolution.trim()}
                >
                  Resolve
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowResolveModal(false)
                    setResolution('')
                    setResolutionType('resolved')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Refund Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹) *</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter refund amount"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Reason for refund..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={handleCreateRefund}
                  disabled={!refundAmount || !refundReason}
                >
                  Create Refund
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setShowRefundModal(false)
                    setRefundAmount('')
                    setRefundReason('')
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
