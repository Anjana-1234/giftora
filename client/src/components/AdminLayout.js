import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Replaces the customer Navbar/Footer for anything under /admin.
// Keeps it deliberately plain — just enough to say "you're in the
// admin area" and offer a way out.
function AdminLayout({ children }) {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login');
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
        <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
          🌸 GiftOra Admin
        </span>

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