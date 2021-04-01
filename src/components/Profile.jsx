import { useContext } from "react";
import { useHistory } from "react-router";
import userContext from "../userContext";

export default function Profile() {
  const { user, isFetched, setUser } = useContext(userContext);
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    history.push("/");
  }

  return (
    <div className="h-full flex justify-center items-center text-center">
      {isFetched && user ? (
        <div>
          <h3 className="text-2xl">{user.fullname}</h3>
          <button
            className="w-40 h-10 border border-black hover:bg-red-400 cursor-pointer"
            onClick={() => {
              logout();
            }}
          >Log Out</button>
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
