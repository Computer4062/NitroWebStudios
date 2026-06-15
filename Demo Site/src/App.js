import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import "@/App.css";

import { AppProvider, useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Vehicles from "@/pages/Vehicles";
import VehicleDetail from "@/pages/VehicleDetail";
import Service from "@/pages/Service";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell({ children }) {
  const { isRTL } = useApp();
  return (
    <div className={isRTL ? "font-arabic" : ""} dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <Toaster
        position={isRTL ? "bottom-left" : "bottom-right"}
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#000000",
            border: "1px solid #000000",
            borderRadius: 0,
            fontFamily: "Playfair Display, serif",
            letterSpacing: "0.04em",
          },
        }}
      />
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicle/:id" element={<VehicleDetail />} />
          <Route path="/service" element={<Service />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

function App() {
  return (
    <div className="App">
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </div>
  );
}

export default App;
