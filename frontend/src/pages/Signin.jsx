import React, { useState, useEffect } from 'react'
import Sign from '../components/Sign'
import PoliceSign from '../components/PoliceSign'

const Signin = () => {
  const [view, setView] = useState('selection'); // 'selection' | 'user' | 'police'

  // Check localStorage for saved role preference on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'user' || savedRole === 'police') {
      setView(savedRole);
    }
  }, []);

  if (view === 'user') {
    // Pass a way to go back if needed (optional, or rely on browser back if it was route)
    // But since it's conditional rendering, we can pass a prop or just wrap it.
    // However, Sign component doesn't have a back button prop in previous code.
    // User requested "Same UI", so maybe we don't touch Sign.jsx internals too much
    // UNLESS we wrap it with a "Back" button container.
    return (
      <div className="relative">
        <button
          onClick={() => {
            localStorage.removeItem('userRole');
            setView('selection');
          }}
          className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/80 rounded-full shadow-sm text-sm font-medium hover:bg-white"
        >
          ← Back
        </button>
        <Sign />
      </div>
    )
  }

  if (view === 'police') {
    return <PoliceSign onBack={() => {
      localStorage.removeItem('userRole');
      setView('selection');
    }} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4">
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full">

        {/* User Card */}
        <div
          onClick={() => {
            localStorage.setItem('userRole', 'user');
            setView('user');
          }}
          className="flex-1 bg-white rounded-3xl p-10 shadow-lg cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
        >
          <div className="h-40 bg-[#dbeafe] rounded-2xl mb-6 flex items-center justify-center">
            <span className="text-6xl">👤</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-[#3b82f6]">Civilian</h2>
          <p className="text-gray-500">
            Login to access safety features, SOS alerts, and community maps.
          </p>
        </div>

        {/* Police Card */}
        <div
          onClick={() => {
            localStorage.setItem('userRole', 'police');
            setView('police');
          }}
          className="flex-1 bg-white rounded-3xl p-10 shadow-lg cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
        >
          <div className="h-40 bg-[#e2e8f0] rounded-2xl mb-6 flex items-center justify-center">
            <span className="text-6xl">👮‍♂️</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 group-hover:text-[#2c3e50]">Police</h2>
          <p className="text-gray-500">
            Official portal for station verification, monitoring, and response.
          </p>
        </div>

      </div>
    </div>
  )
}

export default Signin