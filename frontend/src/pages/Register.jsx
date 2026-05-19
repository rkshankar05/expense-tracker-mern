import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [form, setForm] = useState({
  name: "",
  email: "",
  password: "",
  image: "",
});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input
              name="image"
              placeholder="Profile Image URL"
              value={form.image}
              onChange={handleChange}
            />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button className="btn" type="submit">Create Account</button>
        <p>Already have account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

export default Register;
