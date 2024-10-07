import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutUs from "./Components/AboutUs";
import Faq from "./Components/Faq";
import Tutorial from "./Components/Tutorial";
import Download from "./Components/Download";
import Sas from "./Components/Sas";
import Navbar from "./Components/NavBar"; // Ensure the Navbar component is imported

export default function App() {
  return (
      <Router>
        <Navbar /> {/* Navbar at the top of every page */}
        <Routes>
          <Route path="/" element={<Download />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/tutorial" element={<Tutorial />} />
          <Route path="/download" element={<Download />} />
          <Route path="/sas" element={<Sas />} />
        </Routes>
      </Router>
  );
};
