import React, { useEffect } from 'react'
import Reports from '../components/Reports'
import Navbar from '../components/Navbar'
import { useAuth } from "../context/Auth-context";

import { useNavigate } from 'react-router-dom'

const Report = () => {
  const { isAuth, authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  if (!isAuth) return null;
  return (
    <div>
      <Navbar />
      <Reports />
    </div>
  )
}

export default Report
