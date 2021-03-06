// react imports
import { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// components imports
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Profile from "./components/Profile";
import ChatRoom from "./components/room/ChatRoom";

// custom hooks
import useSocket from "./useSocket";
import Notifications from "./components/Notifications";

// contexts
import userContext from "./userContext";
// import chatContext from "./chatContext";

// App component
function App() {
  // TODO: remove all console logs before production

  // notificatoins are messages sent earlier to this user and not marked seen || messages sent while user is outside sender's room
  // notifications are fetched from server-side on socket creation and sent to 'notifications' event
  const [notifications, setNotifications] = useState([]);

  // **** contexts ****
  const { user, isFetched: isFetchedUserContext } = useContext(userContext);

  // **** custom hooks ****
  const { socket, setSocket } = useSocket();

  // **** methods ****
  const notificationsOnLogin = (undeliveredMessages) => {
    // emit to server to mark as delivered
    socket?.emit("delivered", undeliveredMessages);

    // notifications must be pushed as an array
    undeliveredMessages = Array.isArray(undeliveredMessages)
      ? undeliveredMessages
      : [undeliveredMessages];

    // assign besides the notifications state not overwrite the old notifications
    setNotifications([...notifications, ...undeliveredMessages]);
  };
  const pushNotification = (message) => {
    if (user?.inRoomWith !== message.from.username) {
      socket?.emit("delivered", message);
      setNotifications([...notifications, message]);
    }
  };

  // **** useEffects ****
  // connect socket
  useEffect(() => {
    if (isFetchedUserContext && user) {
      setSocket(user._id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  // disconnect socket on unmount
  useEffect(() => {
    if (socket) {
      if (!user && isFetchedUserContext) {
        socket.disconnect();
      }
      return () => {
        socket.disconnect();
      };
    }
  }, [socket, user]);

  // listen to socket events unspecific to chat rooms
  useEffect(() => {
    if (socket) {
      socket.on("notifications on login", notificationsOnLogin);
      socket.on("notification", pushNotification);
      return () => {
        socket.off("notifications on login");
        socket.off("notification");
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <Router>
      <div className="h-screen flex flex-col">
        {user?.inRoomWith ? null : <Header notifications={notifications} />}
        <div className="flex-grow mt-10">
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/notifications">
              <Notifications
                socket={socket}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
            <Route path="/room/:id">
              <ChatRoom
                socket={socket}
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
