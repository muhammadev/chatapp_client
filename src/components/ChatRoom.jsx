import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useChat from "../useChat";
import useUser from "../useUser";
import userContext from "../userContext";

export default function ChatRoom(props) {
  const { id } = useParams();
  const { user } = useContext(userContext);
  const { user: partner } = useUser(id);
  const { chat, setChat } = useChat(props.socket);

  useEffect(() => {
    console.log(props);
  })

  const [message, setMessage] = useState("");
  const sendMessage = (message) => {
    message = {
      content: message,
      from: user.username,
      to: partner.username,
      id: chat.length > 0 ? (chat[chat.length - 1].id + 1) : 0
    };

    setChat(message, partner);
  };

  return (
    <div>
      {/* messages */}
      <div>
        {chat.length > 0
          ? chat.map(({ content, from, id }) => (
              <p key={id}>
                <span>{from}</span>: <span>{content}</span>
              </p>
            ))
          : null}
      </div>

      {/* textarea */}
      <textarea
        className="border"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      ></textarea>
      <input
        type="button"
        value="Send"
        onClick={() => {
          if (message.length !== 0) {
            sendMessage(message);
            setMessage("");
          }
        }}
      />
    </div>
  );
}
