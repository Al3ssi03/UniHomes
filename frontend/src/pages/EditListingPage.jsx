// 📁 src/pages/EditListingPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const servicesOptions = [
    { key: "wifi", label: "📶 WiFi", icon: "📶" },
    { key: "lavatrice", label: "🧺 Lavatrice", icon: "🧺" },
    { key: "riscaldamento", label: "🔥 Riscaldamento", icon: "🔥" },
    { key: "animali_ammessi", label: "🐕 Animali ammessi", icon: "🐕" },
    { key: "parking", label: "🅿️ Parcheggio", icon: "🅿️" },
    { key: "cucina", label: "🍳 Cucina attrezzata", icon: "🍳" },
    { key: "terrazzo", label: "🌿 Terrazzo/Balcone", icon: "🌿" },
    { key: "aria_condizionata", label: "❄️ Aria condizionata", icon: "❄️" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");
      try {
        const res = await axios.get(`http://localhost:5000/api/announcements/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          titolo: res.data.titolo || '',
          città: res.data.città || '',
          indirizzo: res.data.indirizzo || '',
          prezzo: res.data.prezzo || '',
          tipologia: res.data.tipologia || '',
          descrizione: res.data.descrizione || '',
          università: res.data.università || '',
          servizi: res.data.servizi ? JSON.parse(res.data.servizi) : [],
          disponibile_da: res.data.disponibile_da || ''
        });
      } catch (err) {
        console.error("Errore nel caricamento:", err);
        alert("❌ Errore nel caricamento dell'annuncio");
        navigate("/i-miei-annunci");
      }
    };
    fetchData();
  }, [id, navigate]);
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "number" ? parseFloat(value) : value 
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleServiceToggle = (service) => {
    setFormData((prev) => {
      const newServices = prev.servizi.includes(service)
        ? prev.servizi.filter((s) => s !== service)
        : [...prev.servizi, service];
      return { ...prev, servizi: newServices };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titolo?.trim()) newErrors.titolo = "Il titolo è obbligatorio";
    if (!formData.città?.trim()) newErrors.città = "La città è obbligatoria";
    if (!formData.indirizzo?.trim()) newErrors.indirizzo = "L'indirizzo è obbligatorio";
    if (!formData.prezzo || formData.prezzo <= 0) newErrors.prezzo = "Il prezzo deve essere maggiore di 0";
    if (!formData.tipologia) newErrors.tipologia = "Il tipo di alloggio è obbligatorio";
    if (!formData.descrizione?.trim()) newErrors.descrizione = "La descrizione è obbligatoria";
    if (!formData.disponibile_da) newErrors.disponibile_da = "La data di disponibilità è obbligatoria";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      await axios.put(`http://localhost:5000/api/announcements/${id}`, {
        titolo: formData.titolo,
        città: formData.città,
        indirizzo: formData.indirizzo,
        prezzo: formData.prezzo,
        tipologia: formData.tipologia,
        descrizione: formData.descrizione,
        università: formData.università,
        servizi: JSON.stringify(formData.servizi),
        disponibile_da: formData.disponibile_da
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
        alert("🎉 Annuncio aggiornato con successo!");
      navigate("/i-miei-annunci");
    } catch (err) {
      console.error("Errore nell'aggiornamento:", err);
      alert("❌ Errore nell'aggiornamento dell'annuncio: " + (err.response?.data?.message || "Errore sconosciuto"));
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento annuncio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            ✏️ Modifica annuncio
          </h1>
          <p className="text-xl text-gray-600">
            Aggiorna i dettagli del tuo alloggio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              📝 Informazioni di base
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Titolo dell'annuncio *</label>
                <input
                  name="titolo"
                  value={formData.titolo}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.titolo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.titolo && <p className="text-red-500 text-sm">{errors.titolo}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Città *</label>
                <input
                  name="città"
                  value={formData.città}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.città ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.città && <p className="text-red-500 text-sm">{errors.città}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Indirizzo *</label>
                <input
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.indirizzo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.indirizzo && <p className="text-red-500 text-sm">{errors.indirizzo}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo di alloggio *</label>
                <select
                  name="tipologia"
                  value={formData.tipologia}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.tipologia ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleziona il tipo</option>
                  <option value="stanza_singola">🛏️ Stanza singola</option>
                  <option value="stanza_doppia">🛏️🛏️ Stanza doppia</option>
                  <option value="intero_appartamento">🏠 Intero appartamento</option>
                </select>
                {errors.tipologia && <p className="text-red-500 text-sm">{errors.tipologia}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Università nelle vicinanze</label>
              <input
                name="università"
                value={formData.università}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-500">Aiuta gli studenti a trovare alloggi vicino alla loro università</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              💰 Dettagli
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Prezzo mensile (€) *</label>
                <input
                  name="prezzo"
                  type="number"
                  value={formData.prezzo}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.prezzo ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.prezzo && <p className="text-red-500 text-sm">{errors.prezzo}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Disponibile dal *</label>
                <input
                  type="date"
                  name="disponibile_da"
                  value={formData.disponibile_da}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.disponibile_da ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.disponibile_da && <p className="text-red-500 text-sm">{errors.disponibile_da}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Descrizione *</label>
              <textarea
                name="descrizione"
                value={formData.descrizione}
                onChange={handleChange}
                rows="4"
                className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.descrizione ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.descrizione && <p className="text-red-500 text-sm">{errors.descrizione}</p>}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-gray-700">Servizi inclusi</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {servicesOptions.map((service) => (
                  <label key={service.key} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.servizi.includes(service.key)}
                      onChange={() => handleServiceToggle(service.key)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{service.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/i-miei-annunci")}
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              ← Annulla
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </span>
              ) : (
                "💾 Salva modifiche"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}