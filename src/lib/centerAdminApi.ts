const API_BASE_URL = 'http://localhost:5000/api' // Hardcoded for testing

class CenterAdminAPI {
  private getAuthHeaders() {
    // Check both token keys for compatibility
    const token = localStorage.getItem('center-admin-token') || localStorage.getItem('centerAdminToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  private async handleResponse(response: Response) {
    const contentType = response.headers.get('content-type')
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response received:', text)
      throw new Error(`Server returned non-JSON response. Status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }
    
    return data
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    return this.handleResponse(response)
  }

  async verifyMFA(mfaToken: string, otp?: string, backupCode?: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/verify-mfa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mfaToken, otp, backupCode })
    })
    
    return this.handleResponse(response)
  }

  async logout() {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async logoutAll() {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/logout-all`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/profile`, {
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async enableMFA() {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/mfa/enable`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async disableMFA(password: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/mfa/disable`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ password })
    })
    
    return this.handleResponse(response)
  }

  // Dashboard
  async getDashboardOverview(timeframe: string = '30d') {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/dashboard/overview?timeframe=${timeframe}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getDetailedAnalytics(params: {
    startDate: string
    endDate: string
    groupBy?: string
    metrics?: string[]
  }) {
    const searchParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.groupBy && { groupBy: params.groupBy }),
      ...(params.metrics && { metrics: params.metrics.join(',') })
    })

    const response = await fetch(
      `${API_BASE_URL}/center-admin/dashboard/analytics?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  // Branch Management
  async getBranches(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    city?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/branches?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getBranch(branchId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/branches/${branchId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async createBranch(branchData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/branches`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(branchData)
    })
    
    return this.handleResponse(response)
  }

  async updateBranch(branchId: string, branchData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/branches/${branchId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(branchData)
    })
    
    return this.handleResponse(response)
  }

  async deleteBranch(branchId: string, permanent: boolean = false) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/branches/${branchId}?permanent=${permanent}`,
      {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      }
    )
    
    return this.handleResponse(response)
  }

  async assignManager(branchId: string, managerId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/branches/${branchId}/manager`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ managerId })
    })
    
    return this.handleResponse(response)
  }

  async addStaff(branchId: string, staffData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/branches/${branchId}/staff`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(staffData)
    })
    
    return this.handleResponse(response)
  }

  async removeStaff(branchId: string, userId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/branches/${branchId}/staff/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async getBranchAnalytics(branchId: string, params: {
    startDate: string
    endDate: string
    groupBy?: string
  }) {
    const searchParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
      ...(params.groupBy && { groupBy: params.groupBy })
    })

    const response = await fetch(
      `${API_BASE_URL}/center-admin/branches/${branchId}/analytics?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  // Role Management
  async getRoles(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    level?: number
    isActive?: boolean
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/roles?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getRole(roleId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/roles/${roleId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async createRole(roleData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData)
    })
    
    return this.handleResponse(response)
  }

  async updateRole(roleId: string, roleData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles/${roleId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(roleData)
    })
    
    return this.handleResponse(response)
  }

  async deleteRole(roleId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles/${roleId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async addRolePermission(roleId: string, permissionData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles/${roleId}/permissions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(permissionData)
    })
    
    return this.handleResponse(response)
  }

  async removeRolePermission(roleId: string, module: string, action?: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles/${roleId}/permissions`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ module, action })
    })
    
    return this.handleResponse(response)
  }

  async assignRole(userId: string, roleId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles/assign`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ userId, roleId })
    })
    
    return this.handleResponse(response)
  }

  async getRoleHierarchy() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/roles/hierarchy`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async initializeDefaultRoles() {
    const response = await fetch(`${API_BASE_URL}/center-admin/roles/initialize`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  // Pricing Management
  async getPricingConfigurations(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/pricing?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getPricingConfiguration(pricingId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/pricing/${pricingId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getActivePricing() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/pricing/active`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async createPricingConfiguration(pricingData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(pricingData)
    })
    
    return this.handleResponse(response)
  }

  async updatePricingConfiguration(pricingId: string, pricingData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing/${pricingId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(pricingData)
    })
    
    return this.handleResponse(response)
  }

  async approvePricingConfiguration(pricingId: string, makeActive: boolean = false) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing/${pricingId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ makeActive })
    })
    
    return this.handleResponse(response)
  }

  async activatePricingConfiguration(pricingId: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing/${pricingId}/activate`, {
      method: 'POST',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }

  async clonePricingConfiguration(pricingId: string, newVersion: string, newName?: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing/${pricingId}/clone`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newVersion, newName })
    })
    
    return this.handleResponse(response)
  }

  async calculatePrice(items: any[], options: any = {}) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing/calculate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ items, options })
    })
    
    return this.handleResponse(response)
  }

  async getServiceItems(category?: string) {
    const searchParams = new URLSearchParams()
    if (category) {
      searchParams.append('category', category)
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/pricing/service-items?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getDiscountPolicies(active: boolean = true) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/pricing/discount-policies?active=${active}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async validateDiscountCode(code: string, orderValue: number = 0, customerInfo: any = {}) {
    const response = await fetch(`${API_BASE_URL}/center-admin/pricing/validate-discount`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ code, orderValue, customerInfo })
    })
    
    return this.handleResponse(response)
  }

  // Financial Management
  async getFinancialOverview(timeframe: string = '30d') {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/financial/overview?timeframe=${timeframe}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getTransactions(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    startDate?: string
    endDate?: string
    branchId?: string
    customerId?: string
    minAmount?: number
    maxAmount?: number
    paymentMethod?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/financial/transactions?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getTransaction(transactionId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/financial/transactions/${transactionId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async approveRefund(transactionId: string, notes?: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/financial/transactions/${transactionId}/approve-refund`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notes })
    })
    
    return this.handleResponse(response)
  }

  async rejectRefund(transactionId: string, reason: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/financial/transactions/${transactionId}/reject-refund`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason })
    })
    
    return this.handleResponse(response)
  }

  async getSettlements(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    startDate?: string
    endDate?: string
    recipientId?: string
    minAmount?: number
    maxAmount?: number
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/financial/settlements?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async createSettlement(settlementData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/financial/settlements`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settlementData)
    })
    
    return this.handleResponse(response)
  }

  async approveSettlement(settlementId: string, comments?: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/financial/settlements/${settlementId}/approve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ comments })
    })
    
    return this.handleResponse(response)
  }

  async getFinancialReports(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/financial/reports?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async generateFinancialReport(reportData: {
    type: string
    startDate: string
    endDate: string
    filters?: any
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/financial/reports/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(reportData)
    })
    
    return this.handleResponse(response)
  }

  async getFinancialReport(reportId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/financial/reports/${reportId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  // Risk Management
  async getRiskOverview(timeframe: string = '30d') {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/risk/overview?timeframe=${timeframe}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getComplaints(params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    severity?: string
    priority?: string
    isEscalated?: boolean
    slaBreached?: boolean
    fraudRisk?: string
    startDate?: string
    endDate?: string
    branchId?: string
    customerId?: string
    assignedTo?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/risk/complaints?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getComplaint(complaintId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/risk/complaints/${complaintId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async escalateComplaint(complaintId: string, reason: string, level?: number) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/complaints/${complaintId}/escalate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ reason, level })
    })
    
    return this.handleResponse(response)
  }

  async assignComplaint(complaintId: string, assignedTo: string, assignedToModel: string) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/complaints/${complaintId}/assign`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ assignedTo, assignedToModel })
    })
    
    return this.handleResponse(response)
  }

  async resolveComplaint(complaintId: string, resolution: string, resolutionType: string, amount?: number) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/complaints/${complaintId}/resolve`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ resolution, resolutionType, amount })
    })
    
    return this.handleResponse(response)
  }

  async getBlacklistEntries(params?: {
    page?: number
    limit?: number
    entityType?: string
    status?: string
    reason?: string
    severity?: string
    riskScore?: number
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/risk/blacklist?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async createBlacklistEntry(entryData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/blacklist`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entryData)
    })
    
    return this.handleResponse(response)
  }

  async updateBlacklistEntry(entryId: string, entryData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/blacklist/${entryId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entryData)
    })
    
    return this.handleResponse(response)
  }

  async checkBlacklist(entityType: string, identifiers: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/blacklist/check`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ entityType, identifiers })
    })
    
    return this.handleResponse(response)
  }

  async getSLAConfigurations(params?: {
    page?: number
    limit?: number
    isActive?: boolean
    scope?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/risk/sla-configs?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async createSLAConfiguration(configData: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/risk/sla-configs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(configData)
    })
    
    return this.handleResponse(response)
  }

  // Analytics Management
  async getAnalyticsOverview(timeframe: string = '30d') {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/analytics/overview?timeframe=${timeframe}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async generateCustomerRetentionAnalysis(data: {
    startDate: string
    endDate: string
    filters?: any
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/analytics/customer-retention`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    return this.handleResponse(response)
  }

  async generateBranchPerformanceAnalysis(data: {
    startDate: string
    endDate: string
    filters?: any
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/analytics/branch-performance`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    return this.handleResponse(response)
  }

  async generateRevenueForecast(data: {
    startDate: string
    endDate: string
    forecastHorizon?: number
    methodology?: string
    filters?: any
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/analytics/revenue-forecast`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    return this.handleResponse(response)
  }

  async generateExpansionAnalysis(data: {
    targetLocation: {
      city: string
      area?: string
      pincode?: string
      coordinates?: {
        latitude: number
        longitude: number
      }
    }
    marketData: {
      populationDensity?: number
      averageIncome?: number
      competitorCount?: number
      marketSaturation?: number
      demandEstimate?: number
      seasonalityFactor?: number
    }
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/analytics/expansion-analysis`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    return this.handleResponse(response)
  }

  async getAnalytics(params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/analytics?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getAnalyticsById(analyticsId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/analytics/${analyticsId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  // Settings Management
  async getSystemSettings() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/settings/system`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async updateSystemSettings(category: string, settings: any) {
    const response = await fetch(`${API_BASE_URL}/center-admin/settings/system`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ category, settings })
    })
    
    return this.handleResponse(response)
  }

  async getProfileSettings() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/settings/profile`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async updateProfile(profileData: {
    name?: string
    phone?: string
    avatar?: string
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/settings/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData)
    })
    
    return this.handleResponse(response)
  }

  async changePassword(passwordData: {
    currentPassword: string
    newPassword: string
  }) {
    const response = await fetch(`${API_BASE_URL}/center-admin/settings/password`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(passwordData)
    })
    
    return this.handleResponse(response)
  }

  async getSystemInfo() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/settings/system-info`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  // Audit Management
  async getAuditLogs(params?: {
    page?: number
    limit?: number
    category?: string
    action?: string
    userEmail?: string
    riskLevel?: string
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/audit/logs?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getAuditLog(logId: string) {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/audit/logs/${logId}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getAuditStats(timeframe: string = '30d') {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/audit/stats?timeframe=${timeframe}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async exportAuditLogs(params?: {
    format?: string
    category?: string
    startDate?: string
    endDate?: string
    riskLevel?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/audit/export?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getActivitySummary() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/audit/activity-summary`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  // Notification Management
  async getNotifications(params?: {
    page?: number
    limit?: number
    unreadOnly?: boolean
  }) {
    const searchParams = new URLSearchParams()
    if (params) {
      if (params.page) searchParams.append('page', params.page.toString())
      if (params.limit) searchParams.append('limit', params.limit.toString())
      if (params.unreadOnly) searchParams.append('unreadOnly', 'true')
    }

    const response = await fetch(
      `${API_BASE_URL}/center-admin/auth/notifications?${searchParams}`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async getNotificationUnreadCount() {
    const response = await fetch(
      `${API_BASE_URL}/center-admin/auth/notifications/unread-count`,
      { headers: this.getAuthHeaders() }
    )
    
    return this.handleResponse(response)
  }

  async markNotificationsAsRead(notificationIds: string[]) {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/notifications/mark-read`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ notificationIds })
    })
    
    return this.handleResponse(response)
  }

  async markAllNotificationsAsRead() {
    const response = await fetch(`${API_BASE_URL}/center-admin/auth/notifications/mark-all-read`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    })
    
    return this.handleResponse(response)
  }
}

export const centerAdminApi = new CenterAdminAPI()