import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateListingForm() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, [navigate]);

  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    price: "",
    type: "stanza_singola",
    description: "",
    services: [],
    available_from: "",
    images: null
  });

  const servicesOptions = ["wifi", "lavatrice", "riscaldamento", "animali_ammessi"];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, images: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const newServices = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services: newServices };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (key === "services") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:3001/listings", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Annuncio creato con successo!");
    } catch (err) {
      console.error(err);
      alert("Errore nella creazione dell'annuncio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <input name="title" placeholder="Titolo" value={formData.title} onChange={handleChange} className="w-full border p-2" />
      <input name="city" placeholder="Città" value={formData.city} onChange={handleChange} className="w-full border p-2" />
      <input name="address" placeholder="Indirizzo" value={formData.address} onChange={handleChange} className="w-full border p-2" />
      <input name="price" type="number" placeholder="Prezzo" value={formData.price} onChange={handleChange} className="w-full border p-2" />
      <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2">
        <option value="stanza_singola">Stanza singola</option>
        <option value="stanza_doppia">Stanza doppia</option>
        <option value="intero_appartamento">Intero appartamento</option>
      </select>
      <textarea name="description" placeholder="Descrizione" value={formData.description} onChange={handleChange} className="w-full border p-2" />
      <div className="flex flex-wrap gap-2">
        {servicesOptions.map((service) => (
          <label key={service} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.services.includes(service)}
              onChange={() => handleServiceToggle(service)}
            />
            {service}
          </label>
        ))}
      </div>
      <input name="available_from" type="date" value={formData.available_from} onChange={handleChange} className="w-full border p-2" />
      <input name="images" type="file" onChange={handleChange} className="w-full border p-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Pubblica Annuncio</button>
    </form>
  );
}
