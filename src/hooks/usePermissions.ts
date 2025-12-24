'use client'

import { useAuthStore } from '@/store/authStore'

/**
 * Hook to check user permissions
 * Usage: const { hasPermission, canView, canCreate, canUpdate, canDelete } = usePermissions('orders')
 */
export function usePermissions(module?: string) {
  const { user } = useAuthStore()
  
  // SuperAdmin has all permissions
  const isSuperAdmin = user?.role === 'superadmin'
  
  /**
   * Check if user has specific permission
   * @param mod - Module name (orders, customers, etc.)
   * @param action - Action name (view, create, update, delete, assign, etc.)
   */
  const hasPermission = (mod: string, action: string): boolean => {
    if (isSuperAdmin) return true
    if (!user?.permissions) return false
    return user.permissions[mod]?.[action] === true
  }

  /**
   * Check if user has any permission in a module
   */
  const hasModuleAccess = (mod: string): boolean => {
    if (isSuperAdmin) return true
    if (!user?.permissions?.[mod]) return false
    return Object.values(user.permissions[mod]).some(v => v === true)
  }

  // Module-specific shortcuts (if module is provided)
  const canView = module ? hasPermission(module, 'view') : false
  const canCreate = module ? hasPermission(module, 'create') : false
  const canUpdate = module ? hasPermission(module, 'update') : false
  const canDelete = module ? hasPermission(module, 'delete') : false
  
  // Advanced permissions
  const canAssign = module ? hasPermission(module, 'assign') : false
  const canCancel = module ? hasPermission(module, 'cancel') : false
  const canRefund = module ? hasPermission(module, 'refund') : false
  const canApprove = module ? hasPermission(module, 'approve') : false
  const canExport = module ? hasPermission(module, 'export') : false
  const canAssignRole = module ? hasPermission(module, 'assignRole') : false
  const canApproveChanges = module ? hasPermission(module, 'approveChanges') : false

  return {
    user,
    isSuperAdmin,
    hasPermission,
    hasModuleAccess,
    // Module shortcuts
    canView,
    canCreate,
    canUpdate,
    canDelete,
    canAssign,
    canCancel,
    canRefund,
    canApprove,
    canExport,
    canAssignRole,
    canApproveChanges,
    // All permissions for current module
    permissions: module ? user?.permissions?.[module] || {} : {}
  }
}

/**
 * Simple permission check without hook (for non-component use)
 */
export function checkPermission(user: any, module: string, action: string): boolean {
  if (!user) return false
  if (user.role === 'superadmin') return true
  return user.permissions?.[module]?.[action] === true
}
