import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import Navbar from './components/common/NavBar.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import RoleGuard from './components/common/RoleGuard.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="px-4 py-6 md:px-8">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/catalog" replace />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/catalog" replace /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/catalog" replace /> : <RegisterPage />}
          />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['Admin', 'Bibliotecario']}>
                  <AdminPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
