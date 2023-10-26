import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Homepage} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes>
    </Router>
  );
}

export default App;
