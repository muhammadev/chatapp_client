import { createContext, useEffect, useState } from "react";
import useFetch from "./useFetch";
import useToken from "./useToken";

const userContext = createContext({
  user: null,
  setUser: () => {},
  isFetched: false,
});

export default userContext;

export function UserProvider({ children }) {
  const { setResponse } = useFetch();
  const { token } = useToken();
  const [user, setUser] = useState(null);
  // isFetched value is independent on the result of authenticating, it means that the process is done
  const [isFetched, setIsFetched] = useState(() => {
    // if no token set isFetched as true, no need to wait for fetching
    const status = token ? false : true;
    return status;
  });

  const updateUser = (user) => {
    setUser(user);
    setIsFetched(true);
  };

  useEffect(() => {
    if (token) {
      setIsFetched(false);
      const url = `/api/users/auth`;

      const headers = new Headers();
      headers.set("Authentication", token);
  
      const options = {
        method: "GET",
        headers,
      };
      const callback = ({ ok, status, data }) => {
        setIsFetched(true);
        if (ok) {
          let userData = data.user;
          userData['inRoomWith'] = null;
          setUser(userData);
        } else {
          console.log({status}, data);
          setUser(null);
        }
      };
  
      setResponse(url, options, callback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <userContext.Provider
      value={{ user, isFetched, setUser: updateUser }}
    >
      {children}
    </userContext.Provider>
  );
}
