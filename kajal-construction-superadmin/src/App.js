import "./App.css";
import React, { useEffect } from "react";
import Home from "./pages/Home";
import Master from "./pages/Master";
import Login from "./pages/Login";
import Notfound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Rates from "./pages/Rates/Rates";
import Abstract from "./pages/Abstract/Abstract";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

function App() {
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("user"));
    if (!data) {
      <Navigate to="/login" />;
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/master" element={<Master />} />
          <Route path="/login" element={<Login />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/abstract" element={<Abstract />} />
          <Route path="/*" element={<Notfound />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
