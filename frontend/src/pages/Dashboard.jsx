import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "expense",
  });

  const navigate = useNavigate();

  const loadData = async () => {
    const txRes = await API.get("/transactions");
    const sumRes = await API.get("/transactions/summary/data");

    setTransactions(txRes.data);
    setSummary(sumRes.data);
  };

  useEffect(() => {
    loadData().catch(() => {
      localStorage.removeItem("token");
      navigate("/login");
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTransaction = async (e) => {
    e.preventDefault();

    await API.post("/transactions", {
      title: form.title,
      amount: Number(form.amount),
      type: form.type,
    });

    setForm({
      title: "",
      amount: "",
      type: "expense",
    });

    loadData();
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    loadData();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getDateKey = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const last7DaysData = () => {
    const map = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const key = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });

      map[key] = {
        date: key,
        income: 0,
        expense: 0,
      };
    }

    transactions.forEach((t) => {
      const key = getDateKey(t.createdAt);

      if (map[key]) {
        if (t.type === "income") {
          map[key].income += t.amount;
        } else {
          map[key].expense += t.amount;
        }
      }
    });

    return Object.values(map);
  };

  const monthlyData = () => {
    const map = {};

    transactions.forEach((t) => {
      const key = new Date(t.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      if (!map[key]) {
        map[key] = {
          month: key,
          income: 0,
          expense: 0,
        };
      }

      if (t.type === "income") {
        map[key].income += t.amount;
      } else {
        map[key].expense += t.amount;
      }
    });

    return Object.values(map);
  };

  const pieData = [
    {
      name: "Income",
      value: summary.income,
    },
    {
      name: "Expense",
      value: summary.expense,
    },
  ];

  return (
    <div className="dashboard">
      <div className="topbar">
        <div className="profile">
          <img
            src={user?.image}
            alt="profile"
            className="profile-img"
          />

          <div>
            <h2>Welcome, {user?.name}</h2>
            <p>{user?.email}</p>
          </div>
        </div>

        <button className="btn danger" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="summary">
        <div className="box">
          <h3>Total Earned</h3>
          <p>₹{summary.income}</p>
        </div>

        <div className="box">
          <h3>Total Spent</h3>
          <p>₹{summary.expense}</p>
        </div>

        <div className="box">
          <h3>Balance</h3>
          <p>₹{summary.balance}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-card">
          <h2>Last 7 Days Income vs Expense</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7DaysData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#22c55e" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Monthly Income vs Expense</h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="income" stroke="#22c55e" />
              <Line dataKey="expense" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Income / Expense Ratio</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                <Cell fill="#22c55e" />
                <Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <form className="card form" onSubmit={addTransaction}>
        <h2>Add Transaction</h2>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <input
          name="amount"
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />

        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button className="btn" type="submit">
          Add
        </button>
      </form>

      <div className="card full">
        <h2>Transactions</h2>

        {transactions.length === 0 && <p>No transactions yet.</p>}

        {transactions.map((t) => (
          <div className="transaction" key={t._id}>
            <div>
              <b>{t.title}</b>
              <p>
                {t.type} • ₹{t.amount} •{" "}
                {new Date(t.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            <button
              className="small danger"
              onClick={() => deleteTransaction(t._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;