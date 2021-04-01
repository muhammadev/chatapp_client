// collect contexts' providers and render them here

import { UserProvider } from "../userContext";
// import { ChatContextProvider } from "../chatContext";

export default function ContextProviders({ children }) {
  return (
    <UserProvider>
      {children}
    </UserProvider>
  );
}
