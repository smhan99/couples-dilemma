import { AuthProvider } from "./Context/AuthContext";
import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <h1>Let's Eat</h1>
      <Dashboard />
    </AuthProvider>
  );
}

export default App;
