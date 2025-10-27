import React from 'react'

export const TableSkeleton = ({ 
  rows = 5, 
  columns = 6, 
  showHeader = true,
  showCheckbox = false
}) => {
  return (
    <div className="w-full">
      {/* Table Header Skeleton */}
      {showHeader && (
        <div className="grid gap-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 rounded-t-lg border-b" 
             style={{ gridTemplateColumns: `${showCheckbox ? '1fr ' : ''}repeat(${columns - (showCheckbox ? 1 : 0)}, 1fr)` }}>
          {showCheckbox && (
            <div className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          )}
          {Array.from({ length: columns - (showCheckbox ? 1 : 0) }, (_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      )}
      
      {/* Table Body Skeleton */}
      <div className="divide-y divide-border">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="grid gap-4 p-4 hover:bg-muted/50 transition-colors"
            style={{ gridTemplateColumns: `${showCheckbox ? '1fr ' : ''}repeat(${columns - (showCheckbox ? 1 : 0)}, 1fr)` }}
          >
            {showCheckbox && (
              <div className="flex items-center">
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2"></div>
              </div>
            )}
            
            {Array.from({ length: columns - (showCheckbox ? 1 : 0) }, (_, colIndex) => (
              <div key={colIndex} className="flex items-center">
                {/* Vary skeleton content based on column position */}
                {colIndex === 0 ? (
                  // Customer column with avatar
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  </div>
                ) : colIndex === 1 ? (
                  // Product column with thumbnail
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex-1 space-y-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                    </div>
                  </div>
                ) : colIndex === columns - 2 ? (
                  // Status column with badges
                  <div className="space-y-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                ) : colIndex === columns - 1 ? (
                  // Actions column
                  <div className="flex justify-end">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ) : (
                  // Regular data columns
                  <div className="space-y-1 w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Table Footer Skeleton */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950 dark:to-gray-950 rounded-b-lg border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-36 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SalesTableSkeleton = () => {
  return (
    <TableSkeleton 
      rows={8} 
      columns={7} 
      showHeader={true} 
      showCheckbox={true}
    />
  )
}

export default TableSkeleton