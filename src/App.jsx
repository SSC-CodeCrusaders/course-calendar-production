import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Download from "./Components/Download";

export default function App() {
  return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Download />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </Router>
  );
};
