import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook for handling async data fetching with loading states
 * @param {Function} fetchFunction - The async function to fetch data
 * @param {Array} dependencies - Dependencies that should trigger refetch
 * @param {Object} options - Options for the hook
 * @returns {Object} - { data, loading, error, refetch, setData }
 */
export const useAsyncData = (
  fetchFunction, 
  dependencies = [], 
  options = {}
) => {
  const {
    immediate = true,
    initialData = null,
    onSuccess = null,
    onError = null
  } = options

  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await fetchFunction(...args)
      
      setData(result)
      onSuccess?.(result)
      
      return result
    } catch (err) {
      setError(err)
      onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchFunction, onSuccess, onError])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  const refetch = useCallback((...args) => {
    return fetchData(...args)
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch,
    setData
  }
}

/**
 * Hook for paginated data fetching
 * @param {Function} fetchFunction - Function that takes page and limit
 * @param {Object} options - Options including initial page, limit, etc.
 * @returns {Object} - Extended data object with pagination helpers
 */
export const usePaginatedData = (fetchFunction, options = {}) => {
  const {
    initialPage = 1,
    initialLimit = 10,
    ...restOptions
  } = options

  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const fetchData = useCallback(() => {
    return fetchFunction({ page, limit })
  }, [fetchFunction, page, limit])

  const result = useAsyncData(fetchData, [page, limit], restOptions)

  const goToPage = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit)
    setPage(1) // Reset to first page
  }, [])

  return {
    ...result,
    page,
    limit,
    goToPage,
    changeLimit,
    pagination: result.data?.pagination || {
      currentPage: page,
      totalPages: 1,
      total: 0
    }
  }
}

export default useAsyncData