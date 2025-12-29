const initSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

   socket.on("send-location", ( {
          latitude,
          longitude,
        }) => {
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });
};

export default initSockets;
