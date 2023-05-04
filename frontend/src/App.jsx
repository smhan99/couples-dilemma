import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RestaurantList from "./pages/RestaurantList";

function App() {
  return (
    <>
      <div>
        <RestaurantList/>
        <h1>Let's Eat</h1>
        <Login />
        <Signup />
      </div>
    </>
  );
}

export default App;
