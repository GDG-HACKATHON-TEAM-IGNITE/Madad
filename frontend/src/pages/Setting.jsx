import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Settings from '../components/Settings'
import { useAuth } from "../context/Auth-context";

import { useNavigate } from 'react-router-dom'

const Setting = () => {
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
      <Settings />
    </div>
  )
}

export default Setting
