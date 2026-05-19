import { Link } from "react-router-dom";
import React from "react";
function App() {
  return (
    <div className="home">
      <div className="card">
        <h1>Expense Tracker</h1>
        <p>Full MERN project with login, register, add expense/income, delete transaction and summary.</p>
        <div className="row">
          <Link className="btn" to="/login">Login</Link>
          <Link className="btn secondary" to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default App;
