import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Tournaments from './pages/Tournaments';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Booking from './pages/Booking';
import About from './pages/About';
import DnDTracker from './pages/DnDTracker';
import CartBar from './components/CartBar';
import AiAssistant from './components/AiAssistant';
import { UserRole } from './types';
import { CartProvider } from './contexts/CartContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { ProductProvider } from './contexts/ProductContext';
import { TournamentProvider } from './contexts/TournamentContext';

const AppContent: React.FC = () => {
  const { user } = useUser();

  const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: UserRole[] }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-neo-bg">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/about" element={<About />} />
            <Route path="/booking" element={<Booking />} />

            <Route path="/dnd" element={
              user ? <DnDTracker user={user} /> : <Navigate to="/" replace />
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile user={user!} />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.STAFF]}>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>

        <Footer />
        <CartBar />
        <AiAssistant />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <ProductProvider>
        <TournamentProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </TournamentProvider>
      </ProductProvider>
    </UserProvider>
  );
};

export default App;