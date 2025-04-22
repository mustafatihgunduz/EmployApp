import { Routes, Route, Navigate } from "react-router-dom";
import AdminPanel from "../pages/AdminPanel";
import UserPanel from "../pages/UserPanel";
import Application from "../FormApplication/page";
import LoginPage from "../pages/LoginPage";
import { auth } from "../../firebase_config";
import { useState, useEffect } from "react";
import useCheckIsHeAdmin from "../store/useCheckIsHeAdmin";
import { onAuthStateChanged } from "firebase/auth";

const Router = () => {
  const { isAdmin, isLoading } = useCheckIsHeAdmin();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading || authLoading) return <div>Yükleniyor...</div>;

  return (
    <Routes>
      <Route path="/" element={<Application />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={isAdmin ? <AdminPanel /> : <Navigate to="/user" />}
      />
      <Route
        path="/user"
        element={user ? <UserPanel /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default Router;
