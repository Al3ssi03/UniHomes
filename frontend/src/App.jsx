import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListingsPage from "./pages/ListingsPage";
import CreateListingForm from "./components/CreateListingForm";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import UserListingsPage from "./pages/UserListingsPage";
import InboxPage from "./pages/InboxPage";
import EditListingPage from "./pages/EditListeningPage";
import ListingDetailPage from "./pages/ListingDetailPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="p-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<ListingsPage />} />
          <Route path="/crea" element={<CreateListingForm />} />
          <Route path="/auth" element={<LoginRegisterPage />} />
          <Route path="/i-miei-annunci" element={<UserListingsPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/modifica/:id" element={<EditListingPage />} />
          <Route path="/annuncio/:id" element={<ListingDetailPage />} />
        </Routes>
      </main>
    </Router>
  );
}
