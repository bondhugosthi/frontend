import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context
import { AuthProvider } from './context/AuthContext';

// Shared UI
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Public Pages (lazy)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Sports = lazy(() => import('./pages/Sports'));
const SocialWork = lazy(() => import('./pages/SocialWork'));
const Gallery = lazy(() => import('./pages/Gallery'));
const GalleryAlbum = lazy(() => import('./pages/GalleryAlbum'));
const Members = lazy(() => import('./pages/Members'));
const News = lazy(() => import('./pages/News'));
const NewsDetails = lazy(() => import('./pages/NewsDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));

// Admin Pages (lazy)
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const Dashboard = lazy(() => import('./admin/Dashboard'));
const AdminEvents = lazy(() => import('./admin/AdminEvents'));
const AdminSports = lazy(() => import('./admin/AdminSports'));
const AdminSocialWork = lazy(() => import('./admin/AdminSocialWork'));
const AdminGallery = lazy(() => import('./admin/AdminGallery'));
const AdminSliderImages = lazy(() => import('./admin/AdminSliderImages'));
const AdminMembers = lazy(() => import('./admin/AdminMembers'));
const AdminNews = lazy(() => import('./admin/AdminNews'));
const AdminContact = lazy(() => import('./admin/AdminContact'));
const AdminPages = lazy(() => import('./admin/AdminPages'));
const AdminSettings = lazy(() => import('./admin/AdminSettings'));
const AdminSEO = lazy(() => import('./admin/AdminSEO'));
const AdminUsers = lazy(() => import('./admin/AdminUsers'));
const AdminBackups = lazy(() => import('./admin/AdminBackups'));
const AdminSecurity = lazy(() => import('./admin/AdminSecurity'));
const AdminActivityLogs = lazy(() => import('./admin/AdminActivityLogs'));

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';

// 404 Page
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              } />
              
              <Route path="/about" element={
                <>
                  <Navbar />
                  <About />
                  <Footer />
                </>
              } />
              
              <Route path="/events" element={
                <>
                  <Navbar />
                  <Events />
                  <Footer />
                </>
              } />
              
              <Route path="/events/:id" element={
                <>
                  <Navbar />
                  <EventDetails />
                  <Footer />
                </>
              } />
              
              <Route path="/sports" element={
                <>
                  <Navbar />
                  <Sports />
                  <Footer />
                </>
              } />
              
              <Route path="/social-work" element={
                <>
                  <Navbar />
                  <SocialWork />
                  <Footer />
                </>
              } />
              
              <Route path="/gallery" element={
                <>
                  <Navbar />
                  <Gallery />
                  <Footer />
                </>
              } />
              
              <Route path="/gallery/:id" element={
                <>
                  <Navbar />
                  <GalleryAlbum />
                  <Footer />
                </>
              } />
              
              <Route path="/members" element={
                <>
                  <Navbar />
                  <Members />
                  <Footer />
                </>
              } />
              
              <Route path="/news" element={
                <>
                  <Navbar />
                  <News />
                  <Footer />
                </>
              } />
              
              <Route path="/news/:id" element={
                <>
                  <Navbar />
                  <NewsDetails />
                  <Footer />
                </>
              } />
              
              <Route path="/contact" element={
                <>
                  <Navbar />
                  <Contact />
                  <Footer />
                </>
              } />
              
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="sports" element={<AdminSports />} />
                <Route path="social-work" element={<AdminSocialWork />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="slider-images" element={<AdminSliderImages />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="news" element={<AdminNews />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="home-edit" element={<AdminPages defaultPageName="home" lockPageSelect />} />
                <Route path="about-edit" element={<AdminPages defaultPageName="about" lockPageSelect />} />
                <Route path="contact-edit" element={<AdminPages defaultPageName="contact" lockPageSelect />} />
                <Route path="footer-edit" element={<AdminPages defaultPageName="footer" lockPageSelect />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="seo" element={<AdminSEO />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="backups" element={<AdminBackups />} />
                <Route path="security" element={<AdminSecurity />} />
                <Route path="activity-logs" element={<AdminActivityLogs />} />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={
                <>
                  <Navbar />
                  <NotFound />
                  <Footer />
                </>
              } />
            </Routes>
          </Suspense>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <CookieConsent />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
