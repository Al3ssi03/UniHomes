// 📁 src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ListingsPage from "./pages/ListingsPage";
import CreateListingForm from "./components/CreateListingForm";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import UserListingsPage from "./pages/UserListingsPage";
import InboxPage from "./pages/InboxPage";
import EditListingPage from "./pages/EditListingPage";
import ListingDetailPage from "./pages/ListingDetailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UserProfilePage from "./pages/UserProfilePage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ListingsPage />} />
        <Route path="/crea" element={<CreateListingForm />} />
        <Route path="/auth" element={<LoginRegisterPage />} />
        <Route path="/i-miei-annunci" element={<UserListingsPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/modifica/:id" element={<EditListingPage />} />
        <Route path="/annuncio/:id" element={<ListingDetailPage />} />
        <Route path="/recupera-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/profilo" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}