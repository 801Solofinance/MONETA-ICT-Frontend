export default function Recharge() {
  const amounts = [10000,5000,2000,1000,500,200,100,50]

  return (
    <div className="bg-dark min-h-screen text-white p-4">

      <h2 className="text-xl text-gold font-bold">Recharge</h2>
      <p>Minimum recharge S/ 50.00</p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {amounts.map(a=>(
          <button key={a} className="border border-gold p-2 rounded">
            S/ {a}
          </button>
        ))}
      </div>

      <input placeholder="Custom Amount" className="w-full p-2 bg-black border border-gray-700 rounded mt-3"/>

      <button className="bg-gold text-black w-full py-2 mt-4 rounded">Continue</button>

    </div>
  )
}
