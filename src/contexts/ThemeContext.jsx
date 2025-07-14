import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark') // Default to dark theme

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme')
    
    // If no saved preference, check system preference, otherwise default to dark
    let initialTheme = savedTheme
    if (!savedTheme) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      initialTheme = systemPrefersDark ? 'dark' : 'light'
      // Don't save system preference automatically - let user choose
    }
    
    setTheme(initialTheme || 'dark')
    applyTheme(initialTheme || 'dark')
  }, [])

  const applyTheme = (themeName) => {
    const root = document.documentElement
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark')
    
    // Add theme class - shadcn uses 'dark' class for dark mode
    if (themeName === 'dark') {
      root.classList.add('dark')
    }
    // Light theme is default (no class needed)
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        themeName === 'light' ? '#ffffff' : '#000000'
      )
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  const setSpecificTheme = (themeName) => {
    if (themeName !== theme) {
      setTheme(themeName)
      localStorage.setItem('theme', themeName)
      applyTheme(themeName)
    }
  }

  const value = {
    theme,
    toggleTheme,
    setTheme: setSpecificTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext