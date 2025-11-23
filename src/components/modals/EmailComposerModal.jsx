import React, { useState, useEffect } from 'react'
import { X, Send, Paperclip, Smile } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import toast from 'react-hot-toast'

const EmailComposerModal = ({ 
  isOpen, 
  onClose, 
  customerEmail, 
  customerName,
  productTitle,
  userEmail,
  userName,
  purchaseId,
  onSendEmail 
}) => {
  const [emailData, setEmailData] = useState({
    to: customerEmail || '',
    cc: userEmail || '',
    subject: '',
    body: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  // Set default subject when modal opens
  useEffect(() => {
    if (isOpen && productTitle) {
      setEmailData(prev => ({
        ...prev,
        to: customerEmail || '',
        cc: userEmail || '',
        subject: `Regarding your purchase of ${productTitle}`,
        body: `Hi ${customerName || 'there'},\n\nI hope you're enjoying your purchase of "${productTitle}".\n\nBest regards,\n${userName || 'Support Team'}`
      }))
    }
  }, [isOpen, customerEmail, userEmail, productTitle, customerName, userName])

  const handleSend = async () => {
    if (!emailData.body.trim()) {
      toast.error('Please enter a message')
      return
    }

    setIsLoading(true)
    try {
      await onSendEmail(emailData)
      toast.success('Email sent successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to send email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
    if (e.ctrlKey && e.key === 'Enter') {
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">New Message</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Email Form */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Recipients */}
          <div className="p-4 space-y-3 border-b border-gray-100">
            {/* To Field */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 w-12 text-right">To</label>
              <Input
                value={emailData.to}
                readOnly
                className="flex-1 bg-gray-50 border-gray-200 text-gray-600"
              />
            </div>

            {/* CC Field */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 w-12 text-right">Cc</label>
              <Input
                value={emailData.cc}
                onChange={(e) => setEmailData(prev => ({ ...prev, cc: e.target.value }))}
                className="flex-1"
                placeholder="Add Cc recipients"
              />
            </div>

            {/* Subject Field */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700 w-12 text-right">Subject</label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="flex-1"
                placeholder="Enter subject"
              />
            </div>
          </div>

          {/* Message Body */}
          <div className="flex-1 p-4">
            <Textarea
              value={emailData.body}
              onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
              placeholder="Type your message here..."
              className="w-full h-full min-h-[200px] resize-none border-0 focus:ring-0 text-sm leading-relaxed"
              style={{ boxShadow: 'none' }}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSend}
                disabled={isLoading || !emailData.body.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </div>
                )}
              </Button>
              
              <Button
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </Button>
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="text-xs text-gray-500">
              Press Ctrl+Enter to send
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailComposerModal