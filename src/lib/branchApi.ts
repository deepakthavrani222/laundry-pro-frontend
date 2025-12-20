const API_BASE_URL = 'http://localhost:5000/api'

class BranchAPI {
  private getAuthHeaders() {
    let token = null
    
    // Try to get token from localStorage (set separately by authStore)
    token = localStorage.getItem('token')
    
    // Fallback: try to get from zustand persisted state
    if (!token) {
      const authData = localStorage.getItem('laundry-auth')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          // Zustand persist wraps state in 'state' object
          token = parsed.state?.token || parsed.token
        } catch (e) {
          console.error('Error parsing auth data:', e)
        }
      }
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async handleResponse(response: Response) {
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    return data
  }

  // Dashboard
  async getDashboard() {
    const response = await fetch(`${API_BASE_URL}/branch/dashboard`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Orders
  async getOrders(params?: { page?: number; limit?: number; status?: string; search?: string; priority?: string }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') searchParams.append(key, value.toString())
      })
    }
    const response = await fetch(`${API_BASE_URL}/branch/orders?${searchParams}`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string) {
    const response = await fetch(`${API_BASE_URL}/branch/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    })
    return this.handleResponse(response)
  }

  async assignStaffToOrder(orderId: string, staffId: string, estimatedTime?: string) {
    const response = await fetch(`${API_BASE_URL}/branch/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ staffId, estimatedTime })
    })
    return this.handleResponse(response)
  }

  // Staff
  async getStaff() {
    const response = await fetch(`${API_BASE_URL}/branch/staff`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async toggleStaffAvailability(staffId: string) {
    const response = await fetch(`${API_BASE_URL}/branch/staff/${staffId}/availability`, {
      method: 'PATCH',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Analytics
  async getAnalytics(timeframe: string = '7d') {
    const response = await fetch(`${API_BASE_URL}/branch/analytics?timeframe=${timeframe}`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Settings
  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/branch/settings`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async updateSettings(data: { operatingHours?: any; settings?: any }) {
    const response = await fetch(`${API_BASE_URL}/branch/settings`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  // Inventory
  async getInventory() {
    const response = await fetch(`${API_BASE_URL}/branch/inventory`, {
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  async addInventoryItem(data: {
    itemName: string
    currentStock: number
    minThreshold?: number
    maxCapacity?: number
    unit?: string
    unitCost?: number
    supplier?: string
    expiryDate?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/branch/inventory`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    return this.handleResponse(response)
  }

  async updateInventoryStock(itemId: string, quantity: number, action: 'add' | 'consume', reason?: string) {
    const response = await fetch(`${API_BASE_URL}/branch/inventory/${itemId}/stock`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ quantity, action, reason })
    })
    return this.handleResponse(response)
  }

  async deleteInventoryItem(itemId: string) {
    const response = await fetch(`${API_BASE_URL}/branch/inventory/${itemId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }
}

export const branchApi = new BranchAPI()
