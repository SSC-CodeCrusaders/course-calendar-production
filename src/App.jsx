import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import UserInput from "./Components/UserInputForm";
import Auth from "./Components/Auth";
import { useEffect, useState } from "react";
import { supabase } from './utils/supabaseClient';
import Sidebar from "./Components/Sidebar";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const ProtectedRoute = ({ element }) => {
    return user ? element : <Auth />;
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<UserInput />} />
        <Route path="/*" element={<Sidebar />} /> 
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
};
