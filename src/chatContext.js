import { createContext, useState } from "react";

const chatContext = createContext({
  chat: {},
  setChat: () => {},
});

export default chatContext;

// chatContext Provider component
export function ChatContextProvider(props) {
  const [chat, setChat] = useState({});

  const updateChat = (newChat) => {
    setChat(newChat);
  };

  return (
    <chatContext.Provider value={{ chat, setChat: updateChat }}>
      {props.children}
    </chatContext.Provider>
  );
}
