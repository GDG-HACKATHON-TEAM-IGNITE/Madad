import React from "react";
import { useSOSLocation } from "../hooks/useSOSLocation/useSOSLocation.js";

const SOSButton = () => {
  const { startSOS, stopSOS } = useSOSLocation();

  return (
    <div>
      <button onClick={startSOS} style={{ background: "red", color: "white" }}>
        SEND SOS
      </button>

      <button onClick={stopSOS}>
        STOP SOS
      </button>
    </div>
  );
};

export default SOSButton;
//use not operator update the code to work on same click....