import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSOS } from "../context/SosContext";

const RADIUS = 45;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Sosring = () => {
  const TOTAL_TIME = 5;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const navigate = useNavigate();
  const { startSOS } = useSOS();

  useEffect(() => {
    if (timeLeft === 0) {
      startSOS();               // ✅ activate
      navigate("/activeSos");   // ✅ move to active page
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, startSOS, navigate]);

  const progress =
    (timeLeft / TOTAL_TIME) * CIRCUMFERENCE;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-white">
      <h2 className="text-2xl font-semibold bg-linear-to-bl from-red-400 via-red-600 to-red-800 text-transparent bg-clip-text">
        Activating SOS
      </h2>

      <p className="mt-2 text-gray-600">
        Emergency alert will be sent in{" "}
        <span className="font-semibold bg-linear-to-bl from-red-400 via-red-600 to-red-800 text-transparent bg-clip-text">
          {timeLeft}
        </span>{" "}
        seconds
      </p>

      {/* Ring */}
      <div className="mt-6">
        <svg width="120" height="120">
  <defs>
    <linearGradient id="sosRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      {/* bright red */}
      <stop offset="0%" stopColor="#FF3B3B" />
      {/* strong red */}
      <stop offset="50%" stopColor="#E60023" />
      {/* dark red */}
      <stop offset="100%" stopColor="#FF3B3B" />
    </linearGradient>
  </defs>

  {/* Background ring */}
  <circle
    cx="60"
    cy="60"
    r={RADIUS}
    stroke="#E5E7EB"
    strokeWidth="8"
    fill="none"
  />

  {/* Progress ring */}
  <circle
    cx="60"
    cy="60"
    r={RADIUS}
    stroke="url(#sosRingGradient)"
    strokeWidth="8"
    fill="none"
    strokeDasharray={CIRCUMFERENCE}
    strokeDashoffset={CIRCUMFERENCE - progress}
    strokeLinecap="round"
    transform="rotate(-90 60 60)"
    style={{ transition: "stroke-dashoffset 1s linear" }}
  />
</svg>


      </div>

      {/* Cancel */}
      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-3 border bg-linear-to-bl from-red-400 via-red-600 to-red-800 text-white rounded-lg font-medium hover:bg-red-50"
      >
        Cancel Alert
      </button>
    </div>
  );
};

export default Sosring;

