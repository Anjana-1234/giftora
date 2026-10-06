import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any admin page with this. It blocks rendering until we know
// whether the logged-in user (if any) is an admin, and redirects to
// the login page with the admin tab pre-selected otherwise.
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
    return <Navigate to="/login?as=admin" replace />;
  }

  return children;
}

export default AdminRoute;