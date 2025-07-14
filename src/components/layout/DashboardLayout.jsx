import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { DashboardHeader } from './DashboardHeader'

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container-fluid section-padding">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}