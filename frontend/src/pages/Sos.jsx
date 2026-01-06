import React, { useEffect } from 'react'
import Qsos from '../components/Qsos'
import { useAuth } from "../context/Auth-context";

import { useNavigate } from 'react-router-dom'

const Sos = () => {
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
      <Qsos />
    </div>
  )
}

export default Sos
