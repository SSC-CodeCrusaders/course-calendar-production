import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Sidebar from "./Components/Sidebar";
export default function App() {
  return (
      <Router>
        <Header />
        <Routes>
        <Route path="/*" element={<Sidebar />} />  {/* Sidebar handles its own routing */}
        </Routes>
      </Router>
  );
};
