import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import FriendMap from '../components/FriendMap'
import { useAuth } from "../context/Auth-context";
import { useNavigate } from "react-router-dom";

const FriendMapPage = () => {
    const { isAuth } = useAuth();
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
            <div className="pt-24 px-4 pb-10 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center lg:text-left">Live Friend Map</h1>
                <FriendMap />
            </div>
        </div>
    )
}

export default FriendMapPage
