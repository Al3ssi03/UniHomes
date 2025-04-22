// 📁 src/components/LoginRegisterPage.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(() => true);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";
    try {
      const res = await axios.post(`http://localhost:3001/auth/${endpoint}`, form);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      alert("Errore durante la richiesta");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white border shadow rounded mt-10">
      <h2 className="text-xl font-bold text-blue-700 mb-4 text-center">
        {isLogin ? "Login" : "Registrati"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isLogin ? "Login" : "Registrati"}
        </button>
        {isLogin && (
          <div className="text-center mt-2">
            <Link to="/recupera-password" className="text-sm text-blue-600 hover:underline">
              Hai dimenticato la password?
            </Link>
          </div>
        )}
        <p className="text-sm text-center text-gray-600">
          {isLogin ? "Non hai un account?" : "Hai già un account?"} {" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Registrati" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
