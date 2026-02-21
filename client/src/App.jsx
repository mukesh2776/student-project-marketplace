import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import BankingDetails from './pages/BankingDetails'
import UploadProject from './pages/UploadProject'
import EditProject from './pages/EditProject'
import AdminDashboard from './pages/AdminDashboard'
import ForgotPassword from './pages/ForgotPassword'
import Contact from './pages/Contact'
import FAQs from './pages/FAQs'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import HelpCenter from './pages/HelpCenter'
import NotFound from './pages/NotFound'

function App() {
    return (
        <div className="min-h-screen bg-surface-50 flex flex-col">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/upload" element={<UploadProject />} />
                    <Route path="/edit-project/:id" element={<EditProject />} />
                    <Route path="/banking" element={<BankingDetails />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faqs" element={<FAQs />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}

export default App


