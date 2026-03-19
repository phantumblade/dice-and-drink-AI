import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CartBar from './components/CartBar';

import { UserRole } from './types';
import { CartProvider } from './contexts/CartContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { ProductProvider } from './contexts/ProductContext';
import { TournamentProvider } from './contexts/TournamentContext';
import { CampaignProvider } from './contexts/CampaignContext';
import { ToastProvider } from './contexts/ToastContext';
import { NotificationProvider } from './contexts/NotificationContext';

const Catalog = lazy(() => import('./pages/Catalog'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Booking = lazy(() => import('./pages/Booking'));
const About = lazy(() => import('./pages/About'));
const DnDTracker = lazy(() => import('./pages/DnDTracker'));
const CampaignDetailsPage = lazy(() => import('./pages/CampaignDetailsPage'));

const ProtectedRoute: React.FC<{ children?: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const RouteLoader: React.FC = () => (
  <div className="flex min-h-[50vh] items-center justify-center bg-neo-bg px-4">
    <div className="border-2 border-black bg-white px-6 py-4 text-center font-black uppercase shadow-neo">
      Caricamento sezione...
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { user } = useUser();

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans bg-neo-bg">
        <Navbar />

        <main className="flex-grow">
          <Suspense fallback={<RouteLoader />}>
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

              <Route path="/campaigns/:id" element={<CampaignDetailsPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
        <CartBar />

      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <TournamentProvider>
              <CampaignProvider>
                <NotificationProvider>
                  <AppContent />
                </NotificationProvider>
              </CampaignProvider>
            </TournamentProvider>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </ToastProvider>
  );
};

export default App;
