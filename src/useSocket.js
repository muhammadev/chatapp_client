import { useState } from "react";
import io from "socket.io-client";

// const endpoint = `${process.env.REACT_APP_SERVER_URL}`;

export default function useSocket() {
  // useSocket creates a socket instance

  const [socket, setSocket] = useState(null);

  const createSocket = (id) => {
    try {
      setSocket(
        io("http://localhost", {
          query: {
            user: id,
          },
        })
      );
    } catch (err) {
      console.log(err);
      setSocket(null);
    }
  };

  return {
    socket,
    setSocket: createSocket,
  };
}
