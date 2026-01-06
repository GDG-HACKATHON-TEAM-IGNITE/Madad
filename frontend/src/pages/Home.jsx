import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Video from '../components/Video'
import Cards from '../components/Cards'
import InfiniteScroll from '../components/InfiniteScroll'
import RealCards from '../components/RealCards'
import Works from '../components/Works'
import Self_defence from '../components/Self_defence'
import Footer from '../components/Footer'
import { useAuth } from "../context/Auth-context";
import { useNavigate } from "react-router-dom";

const Home = () => {
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
      <Hero />
      <Video />
      <InfiniteScroll />
      <Cards />
      <RealCards />
      <Works />
      <Self_defence />
      <Footer />
    </div>
  )
}

export default Home
