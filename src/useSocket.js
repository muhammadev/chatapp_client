import { useState } from "react";
import io from "socket.io-client";

// const endpoint = `${process.env.REACT_APP_SERVER_URL}`;

export default function useSocket() {
  // useSocket creates a socket instance

  const [socket, setSocket] = useState(null);

  const createSocket = (username) => {
    try {
      setSocket(
        io('http://192.168.1.6:3001', {
          query: {
            user: username,
          },
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  return {
    socket,
    setSocket: createSocket,
  };
}
