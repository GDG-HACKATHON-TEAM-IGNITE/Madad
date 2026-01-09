import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import { useAuth } from "../context/Auth-context";
import "remixicon/fonts/remixicon.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear stored role and other user data
      localStorage.removeItem('userRole');
      localStorage.removeItem('mongo_id');
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { to: "/home", label: "Home", icon: "ri-home-5-line" },
    { to: "/safescore", label: "Safety Score", icon: "ri-shield-line" },
    { to: "/chatbot", label: "Chatbot", icon: "ri-robot-2-line" },
    { to: "/reports", label: "Reports", icon: "ri-alert-line" },
    { to: "/friend-map", label: "Friend Map", icon: "ri-map-pin-user-line" },
    { to: "/setting", label: "Settings", icon: "ri-settings-3-line" },
  ];

  return (
    <>
      {/* NAVBAR */}
      <div className="w-full fixed top-0 h-19.5 bg-white flex items-center justify-between px-6 lg:px-10 z-999">
        {/* LOGO */}
        <div className="text-2xl lg:text-[36px] font-semibold">
          AegisHer
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden lg:flex items-center gap-12 text-[18px] font-semibold">
          {navLinks.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              className="flex items-center gap-2 hover:text-[#A7C7E7] transition"
            >
              <i className={item.icon}></i>
              {item.label}
            </NavLink>
          ))}

          {isAuth ? (
            <button
              onClick={handleLogout}
              className="py-2 px-8 border-2 border-black rounded-[10px] hover:bg-black hover:text-white transition"
            >
              <i className="ri-logout-circle-r-line"></i>
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="py-2 px-8 border-2 border-black rounded-[10px] hover:bg-black hover:text-white transition"
            >
              <i className="ri-login-circle-line"></i>
              Login
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          <i className={open ? "ri-close-line" : "ri-menu-line"}></i>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed top-18 left-0 w-full bg-white shadow-md flex flex-col gap-4 px-6 py-6 lg:hidden z-998">
          {navLinks.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-lg font-semibold"
            >
              <i className={item.icon}></i>
              {item.label}
            </NavLink>
          ))}

          {isAuth ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="mt-2 py-3 border-2 border-black rounded-[10px] flex items-center justify-center gap-2"
            >
              <i className="ri-logout-circle-r-line"></i>
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
              className="mt-2 py-3 border-2 border-black rounded-[10px] flex items-center justify-center gap-2"
            >
              <i className="ri-login-circle-line"></i>
              Sign in
            </button>
          )}
        </div>
      )}

      {/* SPACER */}
      <div className="h-18"></div>
    </>
  );
};

export default Navbar;
