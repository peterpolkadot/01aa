export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
          Coming Soon
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-8">
          Something amazing is in the works
        </p>
        <div className="flex gap-4 justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </main>
  )
}