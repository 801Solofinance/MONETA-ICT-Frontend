import { createContext, useState } from "react"

export const AppContext = createContext()

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(false)

  return (
    <AppContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <LoadingOverlay />}
    </AppContext.Provider>
  )
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
