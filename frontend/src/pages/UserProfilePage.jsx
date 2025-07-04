// 📁 src/pages/UserProfilePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function UserProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    birthYear: "",
    phone: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("profile");
    if (saved) setProfile(JSON.parse(saved));A
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profilo aggiornato!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Profilo Utente</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          placeholder="Nome"
          value={profile.firstName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Cognome"
          value={profile.lastName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="birthYear"
          placeholder="Anno di nascita"
          value={profile.birthYear}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Telefono"
          value={profile.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="bio"
          placeholder="Scrivi una breve presentazione"
          rows="4"
          value={profile.bio}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Salva Profilo
        </button>
      </form>
      <div className="text-center mt-4">
        <Link to="/" className="text-blue-600 hover:underline">
          Torna alla Home
        </Link>
      </div>
    </div>
  );
}
