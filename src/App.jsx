import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Download from "./Components/Download";
import UserInput from "./Components/UserInput"

export default function App() {
  return (
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<UserInput />} />
          <Route path="/download" element={<Download />} />
        </Routes>
      </Router>
  );
};
