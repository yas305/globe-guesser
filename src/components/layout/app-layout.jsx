import React from 'react'

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <header className="w-full bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-center">Globe Guesser</h1>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 flex flex-col gap-6">
        {children}
      </main>
    </div>
  )
}

export default AppLayout