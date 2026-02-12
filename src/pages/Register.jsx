import { useState } from "react"

export default function Register() {
  const [country, setCountry] = useState("PE")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [invite, setInvite] = useState("")

  const handleRegister = () => {
    const regex = country === "PE" ? /^\d{9}$/ : /^\d{10}$/
    if (!regex.test(phone)) return alert("Invalid phone number")
    if (password.length < 6) return alert("Password min 6 digits")
    if (password !== confirm) return alert("Passwords do not match")

    alert("Registered!")
  }

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col justify-center px-6">
      <h2 className="text-2xl font-bold text-gold text-center">Register</h2>
      <p className="text-gray-400 text-center">Create your account</p>

      <div className="bg-dark2 p-6 mt-6 rounded-xl">

        <select className="w-full p-2 bg-black border border-gold rounded mb-2" onChange={e=>setCountry(e.target.value)}>
          <option value="PE">+51 Peru</option>
          <option value="CO">+57 Colombia</option>
        </select>

        <input placeholder="Phone number" className="w-full p-2 bg-black border border-gray-700 rounded mb-2" />
        <input type="password" placeholder="Password (6 digits)" className="w-full p-2 bg-black border border-gray-700 rounded mb-2" />
        <input type="password" placeholder="Confirm password" className="w-full p-2 bg-black border border-gray-700 rounded mb-2" />
        <input placeholder="Invitation Code (Optional)" className="w-full p-2 bg-black border border-gray-700 rounded" />

        <button onClick={handleRegister} className="w-full bg-gold text-black py-2 mt-4 rounded font-bold">
          Register
        </button>

      </div>
    </div>
  )
}
