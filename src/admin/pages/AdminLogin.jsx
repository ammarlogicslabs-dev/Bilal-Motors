import { Navigate } from 'react-router-dom'

/** Old admin login URL — redirect to the shared login page. */
function AdminLogin() {
  return <Navigate to="/login" replace />
}

export default AdminLogin
