import { Link } from "react-router-dom"

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black flex justify-around text-gold py-2 border-t border-gold">
      <Link to="/home">Home</Link>
      <Link to="/invest">Invest</Link>
      <Link to="/finance">Finance</Link>
      <Link to="/products">Products</Link>
      <Link to="/profile">Profile</Link>
    </div>
  )
}
