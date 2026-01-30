import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Sports from './pages/Sports';
import SocialWork from './pages/SocialWork';
import Gallery from './pages/Gallery';
import GalleryAlbum from './pages/GalleryAlbum';
import Members from './pages/Members';
import News from './pages/News';
import NewsDetails from './pages/NewsDetails';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import AdminEvents from './admin/AdminEvents';
import AdminSports from './admin/AdminSports';
import AdminSocialWork from './admin/AdminSocialWork';
import AdminGallery from './admin/AdminGallery';
import AdminSliderImages from './admin/AdminSliderImages';
import AdminMembers from './admin/AdminMembers';
import AdminNews from './admin/AdminNews';
import AdminContact from './admin/AdminContact';
import AdminPages from './admin/AdminPages';
import AdminSettings from './admin/AdminSettings';
import AdminSEO from './admin/AdminSEO';
import AdminUsers from './admin/AdminUsers';
import AdminBackups from './admin/AdminBackups';
import AdminSecurity from './admin/AdminSecurity';
import AdminActivityLogs from './admin/AdminActivityLogs';

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';
import CookieConsent from './components/CookieConsent';

// 404 Page
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
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
