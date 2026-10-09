import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Replaces the customer Navbar/Footer for anything under /admin.
function AdminLayout({ children }) {

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // The Navbar's Dashboard link passes the page the admin came from.
  // If they arrived another way (e.g. straight after login), go to the shop.
  const backTo = location.state?.from || '/shop';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf6f8' }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 30px',
        backgroundColor: '#7a3159',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <button
            onClick={() => navigate(backTo)}
            aria-label="Go back to the site"
            title="Back to the site"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.35)',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1
            }}
          >
            ←
          </button>

          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
            🌸 GiftOra Admin
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: 'white',
              color: '#7a3159',
              border: 'none',
              padding: '7px 18px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}

export default AdminLayout;