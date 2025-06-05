// 📁 src/components/CreateListingForm.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateListingForm() {
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    address: "",
    price: "",
    type: "",
    description: "",
    university: "",
    services: [],
    available_from: "",
    image: null,
  });

  const navigate = useNavigate();
  const servicesOptions = ["wifi", "lavatrice", "riscaldamento", "animali_ammessi"];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
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
    const userId = localStorage.getItem("userId");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "services") {
        data.append("servizi", JSON.stringify(value));
      } else if (key !== "image") {
        const mappedKey = {
          title: "titolo",
          city: "citt\u00e0",
          address: "indirizzo",
          price: "prezzo",
          type: "tipologia",
          description: "descrizione",
          university: "universit\u00e0",
          available_from: "disponibile_da",
        }[key];
        if (mappedKey) data.append(mappedKey, value);
      }
    });

    if (formData.image) {
      data.append("immagini", formData.image);
    }

    try {
      await axios.post("http://localhost:5000/api/announcements", data, {
        headers: {
          "user-id": userId,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/i-miei-annunci");
    } catch (err) {
      alert("Errore nella creazione dell'annuncio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-2xl mx-auto bg-white border shadow rounded space-y-4 mt-6">
      <h2 className="text-2xl font-bold text-blue-700">Pubblica un nuovo annuncio</h2>

      <input
        name="title"
        placeholder="Titolo"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="city"
        placeholder="Città"
        value={formData.city}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="address"
        placeholder="Indirizzo"
        value={formData.address}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="price"
        type="number"
        placeholder="Prezzo mensile"
        value={formData.price}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="">Tipo di alloggio</option>
        <option value="stanza_singola">Stanza singola</option>
        <option value="stanza_doppia">Stanza doppia</option>
        <option value="intero_appartamento">Intero appartamento</option>
      </select>
      <input
        name="university"
        placeholder="Università nelle vicinanze (opzionale)"
        value={formData.university}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Descrizione"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <div className="flex flex-wrap gap-3">
        {servicesOptions.map((service) => (
          <label key={service} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.services.includes(service)}
              onChange={() => handleServiceToggle(service)}
            />
            {service}
          </label>
        ))}
      </div>

      <input
        type="date"
        name="available_from"
        value={formData.available_from}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

      <input type="file" name="image" onChange={handleFileChange} className="w-full" required />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Pubblica Annuncio
      </button>
    </form>
  );
}
