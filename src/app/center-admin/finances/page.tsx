'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  RefreshCw,
  Calendar,
  Download
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface FinanceStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  pendingPayments: number
  growth: {
    revenue: number
    expenses: number
  }
}

export default function FinancesPage() {
  const [stats, setStats] = useState<FinanceStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    pendingPayments: 0,
    growth: { revenue: 0, expenses: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    fetchFinanceStats()
  }, [period])

  const fetchFinanceStats = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/center-admin/financial/overview?period=${period}`)
      if (response.data.success && response.data.data) {
        // Merge with defaults to ensure all fields exist
        setStats({
          totalRevenue: response.data.data.totalRevenue || 0,
          totalExpenses: response.data.data.totalExpenses || 0,
          netProfit: response.data.data.netProfit || 0,
          pendingPayments: response.data.data.pendingPayments || 0,
          growth: {
            revenue: response.data.data.growth?.revenue || 0,
            expenses: response.data.data.growth?.expenses || 0
          }
        })
      }
    } catch (error) {
      console.error('Error fetching finance stats:', error)
      // Keep default values on error
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Finances Overview</h1>
          <p className="text-gray-600">Track revenue, expenses and financial health</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button onClick={fetchFinanceStats} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  (stats.growth?.revenue || 0) >= 0 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {(stats.growth?.revenue || 0) >= 0 ? '+' : ''}{stats.growth?.revenue || 0}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-gray-600 text-sm">Total Revenue</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                  (stats.growth?.expenses || 0) <= 0 
                    ? 'text-green-700 bg-green-100' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {(stats.growth?.expenses || 0) >= 0 ? '+' : ''}{stats.growth?.expenses || 0}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalExpenses)}</h3>
              <p className="text-gray-600 text-sm">Total Expenses</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h3 className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.netProfit)}
              </h3>
              <p className="text-gray-600 text-sm">Net Profit</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pendingPayments)}</h3>
              <p className="text-gray-600 text-sm">Pending Payments</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/center-admin/financial/transactions" className="block">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Transactions</h3>
                    <p className="text-sm text-gray-600">View all transactions</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>

            <Link href="/center-admin/financial" className="block">
              <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">Financial Management</h3>
                    <p className="text-sm text-gray-600">Detailed financial reports</p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Export Reports</h3>
                  <p className="text-sm text-gray-600">Download financial data</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Recent Financial Activity</h3>
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Financial activity will appear here</p>
              <p className="text-sm">Track payments, refunds, and settlements</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
