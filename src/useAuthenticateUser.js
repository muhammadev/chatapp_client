import { useEffect, useRef, useState } from "react";
import useFetch from "./useFetch";

// useAuthenticateUser is a custom hook
// its purpose is to send the localStorage token to the server to verify it
// then, if verified, sets the user data to authenticatedUser state
// and if not verified, redirect user to login page
export default function useAuthenticateUser(token) {
  const { setResponse } = useFetch();

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // ref used later to prevent setting states after unmount
  // const isMounted = useRef(true);

  // fetched value is independent on the result of authenticating, it means that the process is done
  const [fetched, setFetched] = useState(() => {
    // if no token set fetched as true, no need to wait for fetching
    const status = token ? false : true;
    return status;
  });

  // authenticating method
  const authenticateUser = (token) => {
    setFetched(false);
    const url = `/users/authenticate-user`;

    const headers = new Headers();
    headers.set("Authentication", token);

    const options = {
      method: "GET",
      headers,
    };
    const checkUser = ({ ok, status, data }) => {
      console.log("it ran and got here");
      setFetched(true);
      if (ok) {
        setAuthenticatedUser(data.user);
      } else {
        setAuthenticatedUser(null);
      }
    };

    setResponse(url, options, checkUser);
  };

  useEffect(() => {
    if (token) {
      console.log("did it run too?");
      authenticateUser(token);
    }
  }, []);

  return {
    fetched,
    authenticatedUser,
    setAuthenticatedUser: authenticateUser,
  };
}
