import React, { useState } from "react";
import "../App.css"; // Import your CSS file for styling
import { Link, useNavigate } from "react-router-dom";
import { request } from "../request";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = { name, email, password, phone };
      await request("POST", "auth/register", data);
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <input
            className="login-input"
            required
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="login-input"
            required
            type="phone"
            placeholder="Add +91 in front of your number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            className="login-input"
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Password [more then 6 letters]"
            required
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="login-button" type="submit">
          Register
        </button>
        <div style={{ marginTop: "10px" }}>
          <Link className="link-style" to="/login" type="submit">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
