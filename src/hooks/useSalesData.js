import { useState, useEffect, useCallback } from 'react'
import salesService from '../services/salesService'
import toast from 'react-hot-toast'

/**
 * Custom hook for managing sales data with caching and optimized loading
 * @param {Object} initialParams - Initial filter parameters
 * @returns {Object} - Sales data, loading states, and control functions
 */
export const useSalesData = (initialParams = {}) => {
  const [purchases, setPurchases] = useState([])
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalRevenue: 0,
    completedPurchases: 0,
    pendingPurchases: 0
  })
  
  // Loading states for progressive loading
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [purchasesLoading, setPurchasesLoading] = useState(true)
  
  const [error, setError] = useState(null)
  const [selectedPurchase, setSelectedPurchase] = useState(null)
  
  // Filter and pagination state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: 'all',
    timeFilter: 'all',
    search: '',
    product: 'all',
    ...initialParams
  })
  
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  })

  // Fetch purchases with caching
  const fetchPurchases = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setPurchasesLoading(true)
      }
      setError(null)
      
      const data = await salesService.getPurchases(filters)
      
      setPurchases(data.purchases || [])
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
        limit: filters.limit
      })
      
    } catch (error) {
      console.error('Error fetching purchases:', error)
      setError(error.message || 'Failed to load sales data')
      toast.error('Failed to load sales data')
      setPurchases([])
    } finally {
      setPurchasesLoading(false)
    }
  }, [filters])

  // Fetch stats separately for progressive loading
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true)
      
      const data = await salesService.getSalesStats(filters.timeFilter)
      
      setStats({
        totalPurchases: data.totalPurchases || 0,
        totalRevenue: data.totalRevenue || 0,
        completedPurchases: data.completedPurchases || 0,
        pendingPurchases: data.pendingPurchases || 0
      })
      
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load sales statistics')
    } finally {
      setStatsLoading(false)
    }
  }, [filters.timeFilter])

  // Initialize data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      // Start both requests simultaneously for progressive loading
      await Promise.all([
        fetchStats(),
        fetchPurchases()
      ])
      
      setLoading(false)
    }
    
    loadData()
  }, [fetchStats, fetchPurchases])

  // Update filters and refetch data
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change
      page: newFilters.page || 1
    }))
  }, [])

  // Change page
  const changePage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  // Refresh data
  const refresh = useCallback(async () => {
    salesService.clearCache()
    await Promise.all([fetchStats(), fetchPurchases()])
  }, [fetchStats, fetchPurchases])

  // Get purchase details
  const getPurchaseDetails = useCallback(async (purchaseId) => {
    try {
      const data = await salesService.getPurchaseDetails(purchaseId)
      setSelectedPurchase(data.purchase)
      return data.purchase
    } catch (error) {
      console.error('Error fetching purchase details:', error)
      toast.error('Failed to load purchase details')
      throw error
    }
  }, [])

  // Update purchase status with optimistic updates
  const updatePurchaseStatus = useCallback(async (purchaseId, status) => {
    try {
      // Optimistic update
      setPurchases(prev => prev.map(purchase => 
        purchase.purchaseId === purchaseId 
          ? { ...purchase, status }
          : purchase
      ))
      
      await salesService.updatePurchaseStatus(purchaseId, status)
      
      // Refresh stats to reflect changes
      fetchStats()
      
      toast.success(`Purchase status updated to ${status}`)
      
    } catch (error) {
      console.error('Error updating purchase status:', error)
      toast.error('Failed to update purchase status')
      
      // Revert optimistic update
      await fetchPurchases(false)
      throw error
    }
  }, [fetchStats, fetchPurchases])

  // Process refund
  const processRefund = useCallback(async (purchaseId, refundData) => {
    try {
      await salesService.processRefund(purchaseId, refundData)
      
      // Refresh data after refund
      await Promise.all([fetchStats(), fetchPurchases(false)])
      
      toast.success('Refund processed successfully')
      
    } catch (error) {
      console.error('Error processing refund:', error)
      toast.error('Failed to process refund')
      throw error
    }
  }, [fetchStats, fetchPurchases])

  // Export purchases
  const exportPurchases = useCallback(async (purchaseIds = [], format = 'csv') => {
    try {
      const blob = await salesService.exportPurchases(purchaseIds, format)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sales-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success(`Sales data exported successfully`)
      
    } catch (error) {
      console.error('Error exporting purchases:', error)
      toast.error('Failed to export sales data')
      throw error
    }
  }, [])

  // Send customer email
  const sendCustomerEmail = useCallback(async (purchaseId, emailData) => {
    try {
      await salesService.sendCustomerEmail(purchaseId, emailData)
      toast.success('Email sent successfully')
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
      throw error
    }
  }, [])

  return {
    // Data
    purchases,
    stats,
    selectedPurchase,
    pagination,
    filters,
    
    // Loading states
    loading,
    statsLoading,
    purchasesLoading,
    error,
    
    // Actions
    updateFilters,
    changePage,
    refresh,
    getPurchaseDetails,
    updatePurchaseStatus,
    processRefund,
    exportPurchases,
    sendCustomerEmail,
    setSelectedPurchase
  }
}

export default useSalesData