import { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useUser from "../useUser";
import userContext from "../userContext";
// import chatContext from "../chatContext";
import useToken from "../useToken";
import useFetch from "../useFetch";
import Messages from "./Messages";
// import { ReactComponent as TickIcon } from "../assets/tick.svg";

export default function ChatRoom({ socket }) {
  // get id from url parameters
  const { id } = useParams();
  // fetch participant's data by id
  const { user: participant } = useUser(id);
  // get token from localStorage
  const { token } = useToken();
  // useFetch custom hook
  const { setResponse } = useFetch();

  // get user context object
  const { user, isFetched, setUser } = useContext(userContext);

  const [chat, setChat] = useState([]); // array of messages
  const [isFetchedChat, setIsFetchedChat] = useState(false);
  const [message, setMessage] = useState(""); // value of textarea

  // **** methods ****
  // get chat of this room on every render
  const fetchRoomChat = () => {
    const url = `/api/users/${id}/messages`;
    const headers = new Headers();
    headers.set("Authentication", token);
    const options = {
      method: "GET",
      headers,
    };

    const callback = ({ ok, data }) => {
      if (ok) {
        const messages = Array.isArray(data.messages)
          ? data.messages
          : [data.messages];

        setChat(messages);
        setIsFetchedChat(true);
      } else {
        console.log("couldn't fetch room chat ", data);
      }
    };

    setResponse(url, options, callback);
  };
  const receiveMessage = (message) => {
    // add to chat array
    setChat([...chat, message]);
  };
  // method for emitting a message to server and adding the current version of the message temporarily to chat array until receing the 'sent' event
  const sendMessage = () => {
    // format the message
    let newMessage = {
      _id: uuidv4(), // temporary id to be used as a key to the rendered message element -- as soon as the reformated message comes from server it will no longer be existed
      text: message,
      from: user,
      to: participant,
      delivered: false,
      seen: false,
    };

    console.log("sending a message...", newMessage, chat);
    chat.push(newMessage);
    // temporarily add to chat array
    setChat(chat);

    // send to server
    socket?.emit("message", newMessage); // server will save it as a Message model and send it back to update the chat context

    // reset message state
    setMessage("");
  };

  // **** useEffect callbacks ****
  // if not authenticated push to login
  const history = useHistory();
  useEffect(() => {
    if (!user && isFetched) {
      history.push("/login");
    }
  }, [user]);

  // set inRoomWith participant
  useEffect(() => {
    if (isFetched && user) {
      user.inRoomWith = participant?.username;
      setUser(user);

      return () => {
        user.inRoomWith = null;
        setUser(user);
      };
    }
  });

  // fetch chat messages of this room
  useEffect(() => {
    fetchRoomChat();
  }, [id]);

  useEffect(() => {
    if (socket && user && participant) {
      socket.on("message", receiveMessage);
      socket.on("delivered", () => {
        console.log(
          "I may update the chat array 'cause I received a 'delivered' event"
        );
        fetchRoomChat();
      });
      socket.on("seen", fetchRoomChat);

      return () => {
        socket.off("message");
        socket.off("delivered");
        socket.off("seen");
      };
    }
  });

  useEffect(() => {
    console.table(chat);

    if (socket && participant && chat.length > 0) {
      let unseenMessages = chat.filter(
        (msg) => msg.from.username === participant.username && !msg.seen
      );
      console.log("unseenMessages: ", unseenMessages);
      if (unseenMessages.length > 0) {
        console.log("sending 'seen' event");
        socket.emit("seen", unseenMessages);
      }
    }
  }, [socket, participant, chat]);

  return (
    <div className="w-full h-full bg-gray-50 relative flex flex-col">
      {/* TODO: add a header (participant's data and options) */}

      {/* messages */}
      {isFetchedChat ? (
        <Messages messages={chat} user={user} />
      ) : (
        <div>loading...</div>
      )}

      {/* textarea */}
      <div className="w-full h-10 fixed bottom-1 flex">
        <textarea
          className="h-full px-2 sm:px-4 flex-grow border border-gray-300 focus:border-gray-400 shadow-inner outline-none resize-none leading-9 rounded-full"
          placeholder="type a message"
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></textarea>
        <input
          className="w-20 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-full"
          type="button"
          value="Send"
          onClick={() => {
            if (message.length !== 0) {
              sendMessage(message);
            }
          }}
        />
      </div>
    </div>
  );
}
