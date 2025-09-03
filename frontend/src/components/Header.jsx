import './Header.css'

function Header({ onLogout }) {
  return (
    <div className="header">
      <h1>ADP Customer Connect</h1>
      <button className="btn secondary" onClick={onLogout}>
        Logout
      </button>
    </div>
  )
}

export default Header
