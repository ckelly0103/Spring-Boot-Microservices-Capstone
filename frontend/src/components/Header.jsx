import './Header.css'

function Header({ onLogout, currentView, onNavigate }) {
  return (
    <div className="header">
      <h1>ADP Customer Connect</h1>
      <div className="header-nav">
        <button 
          className={`btn ${currentView === 'customers' ? 'primary' : 'secondary'}`} 
          onClick={() => onNavigate('customers')}
        >
          Customers
        </button>
        <button 
          className={`btn ${currentView === 'events' ? 'primary' : 'secondary'}`} 
          onClick={() => onNavigate('events')}
        >
          Events
        </button>
        <button className="btn secondary" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Header
