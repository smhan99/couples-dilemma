import { AuthProvider } from "./Context/AuthContext";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Preferences from "./pages/Preferences";
import RestaurantList from "./pages/RestaurantList";

function App() {
  return (
    <AuthProvider>
      <h1>Let's Eat</h1>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
