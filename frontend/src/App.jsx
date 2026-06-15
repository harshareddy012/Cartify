import React from 'react'
import { Routes, Route } from "react-router";

// Components
import Navbar from './components/Navbar.jsx';

// Hooks – wire up auth interceptor and user sync at root level
import useAuthReq from './Hooks/useAuthReq.js';
import useUserSync from './Hooks/useUserSync.js';

// Pages
import CreatePage from "./pages/CreatePage";
import EditProductPage from "./pages/EditProductPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound404 from "./pages/NotFound404";

const App = () => {
  // 1. Sets up the axios interceptor to attach Clerk JWT to every request
  useAuthReq();
  // 2. Syncs the signed-in Clerk user into our Neon DB
  useUserSync();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditProductPage />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
