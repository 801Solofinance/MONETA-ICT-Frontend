export default function Profile() {
  return (
    <div className="bg-dark min-h-screen text-white p-4">

      <h2 className="text-gold text-xl font-bold">MonetaICT</h2>
      <p>ID: +51 123***789</p>
      <p>Invite Code: 5KA80X</p>

      <div className="bg-dark2 p-4 mt-4 rounded border border-gold">
        <p>Total Assets: S/ 0.00</p>
        <p>Today's Income: +S/ 0.00</p>
        <p>Total Income: S/ 0.00</p>
      </div>

      <ul className="mt-4 space-y-2">
        <li>My Orders</li>
        <li>Bank Cards</li>
        <li>Recharge Records</li>
        <li>Withdrawal Records</li>
        <li>My Team</li>
        <li>Messages</li>
        <li>Change Password</li>
        <li>Support</li>
        <li>Logout</li>
      </ul>

    </div>
  )
}
