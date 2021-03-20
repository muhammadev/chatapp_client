import { useState, useEffect } from "react";

export default function useChat(socket) {
  const [chat, setChat] = useState([]);

  /*
    ++ one: user set up a 'message' listener
    ++ two: user send and recieve messages
    ++ three: on sending/recieving messages, the chat array gets updated
  */

  useEffect(() => {
    socket.on("message", (message, from) => {
      
      setChat([...chat, message]);
    });

    return () => {
      socket.removeAllListeners();
    };
  });

  // extractable function to emit a message
  const sendMessage = (message, to) => {
    socket.emit("message", message, to);
    setChat([...chat, message]);
  };

  // this hook should set up a room and its listeners and set up the chat messages array and its updaters
  // and only return the chat array
  return { chat, setChat: sendMessage };
}
