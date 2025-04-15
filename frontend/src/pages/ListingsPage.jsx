
import { useNavigate } from "react-router-dom";

export default function ListingsPage() {
  const navigate = useNavigate();
  return (
    <>
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Trova il tuo alloggio ideale
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Cerca stanze o appartamenti per studenti e lavoratori fuori sede
        </p>

        <form className="flex flex-col md:flex-row justify-center items-center gap-4 px-4 max-w-4xl mx-auto">
          <input type="text" placeholder="Filtra per città" className="input-style" />
          <select className="input-style">
            <option>Tutti i tipi</option>
          </select>
          <input type="number" placeholder="Prezzo massimo" className="input-style" />
          <input type="text" placeholder="Filtra per università" className="input-style" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">
            Cerca
          </button>
        </form>
      </section>

      {/* 👉 Inserisci la griglia qui sotto */}
      <section className="mt-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-left">
          Annunci recenti
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={`https://source.unsplash.com/400x250/?apartment,student&sig=${i}`}
                alt="Annuncio"
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                €450/mese
              </span>
            </div>
            <div className="p-4 text-left space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Stanza in centro a Roma
              </h3>
              <p className="text-sm text-gray-500">Vicino metro e università</p>
              <button
                  onClick={() => navigate(`/annuncio/${i}`)}
                  className="mt-2 text-sm bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Dettagli
                </button>
            </div>
          </div>
        ))}
      </div>
      </section>
    </>
  );
}
