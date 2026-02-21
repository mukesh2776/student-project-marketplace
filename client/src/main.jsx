import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <App />
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: '#1a1a2e',
                                    color: '#fff',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                },
                                success: {
                                    iconTheme: {
                                        primary: '#10b981',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
)

