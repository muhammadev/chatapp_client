// react imports
import { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

// components imports
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Profile from "./components/Profile";
import ChatRoom from "./components/ChatRoom";

// other imports
import useToken from "./useToken";
import useAuthenticateUser from "./useAuthenticateUser";
import useSocket from "./useSocket";
import userContext from "./userContext";

// App component
function App() {
  // **** contexts ****
  const { setUserContext } = useContext(userContext);


  // **** custom hooks ****
  const { socket, setSocket } = useSocket();
  // get token
  const { token } = useToken();

  // authenticate user by token, if any
  const {
    fetched: fetchedAuthenticatedUser,
    authenticatedUser,
  } = useAuthenticateUser(token);



  // **** useEffects ****
  // set user context value, and create socket instance
  useEffect(() => {
    console.log("did I run?", authenticatedUser);
    if (fetchedAuthenticatedUser) {
      setUserContext(authenticatedUser);

      if (authenticatedUser) {
        setSocket(authenticatedUser.username);
      }
    }
  }, [fetchedAuthenticatedUser]);

  // disconnect socket on unmount
  useEffect(() => {
    if (socket) {
      return () => {
        console.log("unmounted App component");
        socket.disconnect();
      };
    }
  }, [socket]);

  return (
    <Router>
      <Header authenticatedUser={authenticatedUser} />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/users/:id">
          <Profile authenticatedUser={authenticatedUser} token={token} />
        </Route>
        <Route path="/chat-room/:id">
          <ChatRoom socket={socket} />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
