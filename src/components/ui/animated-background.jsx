import React from 'react'

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-white">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100" />
      
      {/* Animated orbs */}
      <div className="absolute -top-10 -left-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute -top-10 -right-10 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-10 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      <div className="absolute -bottom-10 right-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-6000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      
      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-50 animate-float shadow-xl" />
      <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full opacity-50 animate-float animation-delay-2000 shadow-xl" />
      <div className="absolute bottom-1/4 left-1/2 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-50 animate-float animation-delay-4000 shadow-xl" />
      <div className="absolute top-1/3 right-1/4 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full opacity-50 animate-float animation-delay-6000 shadow-xl" />
      
      {/* Geometric shapes */}
      <div className="absolute top-1/2 right-1/4 w-40 h-40 border-4 border-purple-300 rounded-2xl opacity-40 animate-spin-slow" />
      <div className="absolute bottom-1/3 left-1/3 w-32 h-32 border-4 border-pink-300 rounded-full opacity-40 animate-spin-slow animation-delay-4000" />
      <div className="absolute top-1/3 left-1/4 w-28 h-28 border-4 border-blue-300 rounded-lg opacity-40 animate-spin-slow animation-delay-2000" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e0e7ff 1px, transparent 1px),
            linear-gradient(to bottom, #e0e7ff 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Additional decorative elements */}
      <div className="absolute top-10 right-10 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
      <div className="absolute bottom-10 left-10 w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 left-10 w-2 h-2 bg-blue-500 rounded-full animate-pulse animation-delay-4000" />
      <div className="absolute bottom-1/2 right-10 w-2 h-2 bg-yellow-500 rounded-full animate-pulse animation-delay-6000" />
    </div>
  )
}