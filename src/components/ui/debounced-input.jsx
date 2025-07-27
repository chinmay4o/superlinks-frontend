import React, { useState, useEffect } from 'react'
import { Input } from './input'
import { Textarea } from './textarea'

export function DebouncedInput({ 
  value, 
  onChange, 
  delay = 500, 
  type = 'input',
  ...props 
}) {
  const [localValue, setLocalValue] = useState(value || '')

  // Update local value when prop value changes
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue)
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [localValue, delay, onChange, value])

  const handleChange = (e) => {
    setLocalValue(e.target.value)
  }

  const Component = type === 'textarea' ? Textarea : Input

  return (
    <Component
      {...props}
      value={localValue}
      onChange={handleChange}
    />
  )
}