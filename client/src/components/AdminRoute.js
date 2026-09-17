import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any admin page with this. It blocks rendering until we know
// whether the logged-in user (if any) is an admin, and redirects
// straight to the admin login screen otherwise — never the customer one.
function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#e91e8c', fontSize: '18px' }}>Loading... 🌸</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;