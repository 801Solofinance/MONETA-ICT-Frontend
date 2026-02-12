import { useState, useContext } from "react"
import { AppContext } from "./AppContext"

export default function Login() {
  const { setLoading } = useContext(AppContext)
  const [country, setCountry] = useState("PE")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    setLoading(true)
    setTimeout(() => {
      alert("Login Success")
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col justify-center px-6">

      <img src="/logo.png" className="w-24 mx-auto mb-6" />

      <h1 className="text-2xl font-bold text-gold text-center">Únete a MonetaICT Hoy</h1>
      <p className="text-gray-400 text-center mt-2">
        Comienza tu viaje de inversión con nosotros y transforma el mundo.
      </p>

      <div className="mt-8 bg-dark2 p-6 rounded-xl">

        <h2 className="text-lg font-bold mb-4">Log In</h2>

        <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full p-2 bg-black border border-gold rounded mb-2">
          <option value="PE">+51 Peru</option>
          <option value="CO">+57 Colombia</option>
        </select>

        <input placeholder="Phone Number" className="w-full p-2 bg-black border border-gray-700 rounded mb-2" />
        <input type="password" placeholder="Password (min 6 digits)" className="w-full p-2 bg-black border border-gray-700 rounded" />

        <button onClick={handleLogin} className="w-full bg-gold text-black font-bold py-2 mt-4 rounded">
          Sign In
        </button>

        <p className="text-sm text-gray-400 mt-2 text-center">Forgot password?</p>

      </div>
    </div>
  )
}
