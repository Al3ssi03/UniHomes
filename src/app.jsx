// 📁 src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListingsPage from "./pages/ListingsPage";
import CreateListingForm from "./components/CreateListingForm";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import UserListingsPage from "./pages/UserListingsPage";
import EditListingPage from "./pages/EditListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import InboxPage from "./pages/InboxPage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/crea" element={<CreateListingForm />} />
        <Route path="/auth" element={<LoginRegisterPage />} />
        <Route path="/i-miei-annunci" element={<UserListingsPage />} />
        <Route path="/modifica/:id" element={<EditListingPage />} />
        <Route path="/annuncio/:id" element={<ListingDetailPage />} />
        <Route path="/inbox" element={<InboxPage />} />
      </Routes>
    </Router>
  );
}
