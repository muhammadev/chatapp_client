import { useContext } from "react";
import { Link } from "react-router-dom";
import SearchUsers from "./SearchUsers";
// import errorContext from "../errorContext";
import userContext from "../userContext";

export default function Home() {
  // const { error, setError } = useContext(errorContext);
  const { user, isFetched } = useContext(userContext);

  if (isFetched) {
    if (user) {
      return (
        <div className="w-11/12 md:w-2/3 capitalize absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-center text-3xl md:text-5xl my-4 w-full ">
            welcome {user?.fullname?.split(" ")[0]}
          </h1>
          <SearchUsers />
        </div>
      );
    }
    return (
      <div className="h-screen capitalize flex flex-col justify-center items-center">
        <h1 className="text-2xl md:text-4xl my-4">welcome to chat app</h1>
        <Link
          to="/register"
          className="p-4 border text-white border-blue-800 bg-blue-600 hover:bg-blue-700"
        >
          Register Now!
        </Link>
        <p className="lowercase">
          have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-900">
            login
          </Link>
        </p>
      </div>
    );
  } else {
    return (
      <div className="h-screen capitalize flex flex-col justify-center items-center">
        loading...
      </div>
    );
  }
}
