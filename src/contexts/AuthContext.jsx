import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      
      // If no token, immediately logout without making API call
      if (!token) {
        dispatch({ type: 'LOGOUT' })
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        const data = await authService.getCurrentUser()
        if (data?.user) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: data })
        } else {
          dispatch({ type: 'LOGOUT' })
        }
      } catch (error) {
        dispatch({ type: 'LOGOUT' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.login(credentials)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await authService.register(userData)
      dispatch({ type: 'LOGIN_SUCCESS', payload: response })
      return response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      // Even if logout fails on server, clear local state
      dispatch({ type: 'LOGOUT' })
    }
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}