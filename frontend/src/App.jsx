import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Preferences from "./pages/Preferences";
import RestaurantList from "./pages/RestaurantList";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/couples-dilemma/" element={<Dashboard />} />
          <Route
            path="/couples-dilemma/preferences"
            element={<Preferences />}
          />
          <Route
            path="/couples-dilemma/restaurant-list"
            element={<RestaurantList />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
