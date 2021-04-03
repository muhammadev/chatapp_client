import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useFetch from "./useFetch";
import useToken from "./useToken";

// useUsers is a custom hook
// it fetches all users in db and returns them [JUST FOR NOW -- POSSIBLE LATER UPDATA]
export default function useUser(id) {
  const mountedRef = useRef(true); // used to prevent setting states after unmount
  const history = useHistory();
  const { setResponse, error: serverError} = useFetch();
  const { token } = useToken();

  const [isFetched, setIsFetched] = useState(false);

  const [user, setUser] = useState(null);

  const fetchUser = (id) => {
    console.log("useUser is called to fetch: ", id);
    const url = `/api/users/${id}`;
    const headers = new Headers();
    headers.set("Authentication", token);
    const options = {
      method: "GET",
      headers,
    };

    const callback = ({ ok, data }) => {
      if (mountedRef.current) {
        setIsFetched(true)
        if (ok) {
          setUser(data.user);
        } else {
          console.log("was not okay, ", data);
          history.push("/login");
        }
      }
    };

    setResponse(url, options, callback);
  };

  useEffect(() => {
    if (mountedRef.current && token) fetchUser(id);

    return () => {mountedRef.current = false};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, id])

  return { isFetched, user, setUser: fetchUser, serverError };
}
