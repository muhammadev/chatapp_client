import { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import useUser from "../../useUser";
import userContext from "../../userContext";
import useToken from "../../useToken";
import useFetch from "../../useFetch";
import Messages from "./Messages";
import RoomHeader from "./RoomHeader";

export default function ChatRoom({ socket, notifications, setNotifications }) {
  // **** variables, hooks, contexts, etc ****
  const { id } = useParams(); // get id from url parameters
  const { user: participant, setUser: setParticipant } = useUser(id); // fetch participant's data by id
  const { token } = useToken(); // get token from localStorage
  const { setResponse } = useFetch(); // useFetch custom hook
  const { user, isFetched: isFetchedUser, setUser } = useContext(userContext); // get user context object
  const [chat, setChat] = useState([]); // array of messages
  const [isFetchedChat, setIsFetchedChat] = useState(false);
  const [message, setMessage] = useState(""); // value of textarea

  // **** methods ****
  const fetchRoomChat = () => { // get chat of this room on every render
    const url = `/api/chat`;
    const headers = new Headers();
    headers.set("Authentication", token);
    headers.set("participants", JSON.stringify([user._id, participant._id]));
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
        window.scroll(0, document.body.scrollHeight + 1000);
      } else {
        console.log("couldn't fetch room chat ", data);
      }
    };

    setResponse(url, options, callback);
  };
  const sendMessage = () => {// method for emitting a message to server and adding the current version of the message temporarily to chat array until receing the 'sent' event
    // format the message
    let newMessage = {
      _id: uuidv4(), // temporary id to be used as a key to the rendered message element -- as soon as the reformated message comes from server it will no longer be existed
      text: message,
      from: user,
      to: participant,
      delivered: false,
      seen: false,
    };

    setChat([...chat, newMessage]);
    window.scroll(0, document.body.scrollHeight + 1000); // scroll down on each message

    // send to server
    socket?.emit("message", newMessage); // server will save it as a Message model and send it back to update the chat context

    // reset message state
    setMessage("");
  };
  const receiveMessage = (message) => {
    if (message.from.username === participant.username) {
      // add to chat array
      setChat([...chat, message]);
    }
  };
  const updateParticipant = (participantId) => {
    if (participant?._id === participantId) {
      setParticipant(id)
    }
  }

  // **** useEffect callbacks ****
  useEffect(() => {
    if (user && participant) {
      fetchRoomChat();
    }
  }, [id, participant, user])
  const history = useHistory();
  useEffect(() => {
    // if not authenticated push to login
    if (!user && isFetchedUser) {
      history.push("/login");
    }

    // set inRoomWith prop
    if (user && participant) {
      user.inRoomWith = participant.username;
      setUser(user);
    }

    // empty notifications of this room
    let updatedNotifications = notifications?.filter(notif => {
      // if notif is found in chat array, return false >> filter it
      let result = true;
      chat.forEach(msg => {
        if (msg._id === notif._id) {
          result = false;
        }
      })
      return result;
    })
    setNotifications([...updatedNotifications]);

    // send 'seen' event for unseen messages
    if (socket && participant && chat.length > 0) {
      let unseenMessages = chat.filter(
        (msg) => msg.from.username === participant.username && !msg.seen
      );
      if (unseenMessages.length > 0) {
        socket.emit("seen", unseenMessages);
      }
    }

    // room socket listeners
    if (socket && user && participant) {
      socket.on("participant status", updateParticipant);
      socket.on("message", receiveMessage);
      socket.on("delivered", fetchRoomChat);
      socket.on("seen", fetchRoomChat);
    }

    // scroll down on each message
    window.scroll(0, document.body.scrollHeight + 1000);

    // clean up
    return () => {
      // clear inRoomWith prop
      if (user) {
        // why cloning? to force re render in App component
        // simply assigning new value to inRoomWith doesn't make React rerender all the components. Read context caveats.
        const clonedUser = {...user};
        clonedUser.inRoomWith = null;
        setUser(clonedUser);
      }

      // cancel room socket listeners
      if (socket) {
        socket.off("participant status");
        socket.off("message");
        socket.off("delivered");
        socket.off("seen");
      }
    }
  }, [id, socket, user, participant, chat]);

  // **** JSX ****
  let absoluteCenterStyle = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
  let textAreaStyle = "h-full px-2 sm:px-4 flex-grow border border-gray-300 focus:border-gray-400 shadow-inner outline-none resize-none leading-9 rounded-full";
  let sendBtnStyle = "w-20 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white rounded-full";
  return (
    <div className="w-full h-full bg-gray-100 relative flex flex-col">
      {/* TODO: add a header (participant's data and options) */}
      <RoomHeader participant={participant} />

      {/* messages */}
      {isFetchedChat ? (
        <Messages messages={chat} user={user} />
      ) : (
        <div className={absoluteCenterStyle}>loading...</div>
      )}

      {/* textarea */}
      <div className="w-full h-10 fixed bottom-1 flex">
        <textarea
          className={textAreaStyle}
          placeholder="type a message"
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              console.log("key pressed: ", e.key);
              sendMessage();
            }
          }}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        ></textarea>
        <input
          className={sendBtnStyle}
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
