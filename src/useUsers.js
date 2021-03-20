import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useFetch from "./useFetch";
import useToken from "./useToken";

// useUsers is a custom hook
// it fetches all users in db and returns them [JUST FOR NOW -- POSSIBLE LATER UPDATES]
export default function useUsers() {
  const mountedRef = useRef(true); // used to prevent setting states after unmount
  const history = useHistory();
  const { setResponse, error: serverError } = useFetch();
  const { token } = useToken();

  const [fetched, setFetched] = useState(() => {
    const status = token ? false : true; // if no token then no need to wait for fetching
    return status;
  });

  const fetchUsers = () => {
    const url = '/users';
    const headers = new Headers();
    headers.set("Authentication", token);
    const options = {
      method: "GET",
      headers,
    };

    const callback = ({ ok, data }) => {
      if (mountedRef.current) {
        if (ok) {
          setUsers(data.users);
          setFetched(true);
        } else {
          history.push("/login");
        }
      }
    };

    setResponse(url, options, callback);
  };

  const [users, setUsers] = useState(null);

  useEffect(() => {
    if (mountedRef.current && token) fetchUsers(token);

    return () => {
      mountedRef.current = false;
    };
  }, [token]);

  return { users, fetched, setUsers: fetchUsers, serverError };
}
