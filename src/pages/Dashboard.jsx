export default function Dashboard() {
  return (
    <div className="bg-dark min-h-screen text-white p-4">

      {/* TOP CARD */}
      <div className="bg-gradient-to-r from-gold to-yellow p-4 rounded-xl text-black">
        <h2>Total Assets</h2>
        <p className="text-2xl font-bold">S/ 0.00</p>

        <div className="flex justify-between text-sm mt-2">
          <span>Today's Income</span>
          <span>+S/ 0.00</span>
        </div>

        <div className="flex gap-3 mt-4">
          <button className="bg-green px-4 py-2 rounded text-white">Recharge</button>
          <button className="bg-red px-4 py-2 rounded text-white">Withdraw</button>
        </div>
      </div>

      {/* PRODUCTS */}
      <h3 className="mt-6 font-bold text-gold">Investment Products</h3>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-dark2 p-3 rounded border border-gold">10% / day<br/>S/ 20.00</div>
        <div className="bg-dark2 p-3 rounded border border-gold">8% / day<br/>S/ 50.00</div>
      </div>

    </div>
  )
}
