import { createContext, useState } from "react";

const userContext = createContext({
  user: null,
  setUser: () => {},
  fetched: false,
});

export default userContext;

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [fetched, setFetched] = useState(false);

  const updateUser = (user) => {
    setUser(user);
    setFetched(true);
  };
  return (
    <userContext.Provider
      value={{ user, fetched, setUserContext: updateUser }}
    >
      {children}
    </userContext.Provider>
  );
}
