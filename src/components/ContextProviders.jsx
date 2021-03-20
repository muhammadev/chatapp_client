// collect contexts' providers and render them here

import { UserProvider } from "../userContext";

export default function ContextCollections({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
