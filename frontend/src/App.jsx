import  { useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import VerifyEmail from "./components/VerifyEmail"
import Products from "./pages/Products"
import SplashScreen from "./components/SplashScreen"
import GiftBundles from "./pages/GiftBundles"
import EcoBlog from "./pages/EcoBlog"
import EcoBlogDetail from "./pages/EcoBlogDetail"

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gift-bundles" element={<GiftBundles />} />
        <Route path="/eco-blog" element={<EcoBlog />} />
        <Route path="/eco-blog/:slug" element={<EcoBlogDetail />} />
      </Routes>
    </Router>
  )
}

export default App
