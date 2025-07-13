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
import Contact from "./pages/Contact"
import Search from "./pages/Search"
import TopPicks from "./pages/TopPicks"
import Categories from "./pages/Categories"
import { useNavigate } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreenRedirect />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/gift-bundles" element={<GiftBundles />} />
        <Route path="/eco-blog" element={<EcoBlog />} />
        <Route path="/eco-blog/:slug" element={<EcoBlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/top-picks" element={<TopPicks />} />
        <Route path="/categories" element={<Categories />} />
      </Routes>
    </Router>
  )
}

// Componente para mostrar el splash y redirigir a /home
function SplashScreenRedirect() {
  const navigate = useNavigate();
  return <SplashScreen onFinish={() => navigate("/home", { replace: true })} />;
}

export default App
