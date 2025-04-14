import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");
      try {
        const res = await axios.get(`http://localhost:3001/listings/${id}`);
        setFormData({ ...res.data, services: res.data.services || [] });
      } catch (err) {
        alert("Errore nel caricamento dell'annuncio");
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: type === "number" ? parseFloat(value) : value });
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
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:3001/listings/${id}`, {
        ...formData,
        services: JSON.stringify(formData.services),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Annuncio aggiornato!");
      navigate("/i-miei-annunci");
    } catch (err) {
      alert("Errore durante l'aggiornamento dell'annuncio");
    }
  };

  const servicesOptions = ["wifi", "lavatrice", "riscaldamento", "animali_ammessi"];

  if (!formData) return <p className="p-4">Caricamento...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Modifica Annuncio</h2>
      <input name="title" value={formData.title} onChange={handleChange} className="w-full border p-2" />
      <input name="city" value={formData.city} onChange={handleChange} className="w-full border p-2" />
      <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2" />
      <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full border p-2" />
      <select name="type" value={formData.type} onChange={handleChange} className="w-full border p-2">
        <option value="stanza_singola">Stanza singola</option>
        <option value="stanza_doppia">Stanza doppia</option>
        <option value="intero_appartamento">Intero appartamento</option>
      </select>
      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border p-2" />
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
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Salva modifiche</button>
    </form>
  );
}
