// Profile component runs as personal profile and other users' profiles
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import useFetch from "../useFetch";
import useToken from "../useToken";
import useAuthenticateUser from "../useAuthenticateUser";
// import localIpAddress from "./getLocalIP";

export default function Profile() {
  const { authenticatedUser } = useAuthenticateUser();
  const { token } = useToken();
  const history = useHistory();
  const { id } = useParams();
  const setResponse = useFetch();

  const [userProfileData, setUserProfileData] = useState(null);

  const getUser = () => {
    const headers = new Headers();
    headers.set("Authentication", token);
    const options = {
      method: "GET",
      headers,
    };
    setResponse(
      `/users/${id}`,
      options,
      ({ ok, status, data }) => {
        if (!ok && status === 401) {
          history.push("/login");
        } else if (ok) {
          setUserProfileData(data.user);
        } else {
          console.log({ ok, status, data });
        }
      }
    );
  };

  useEffect(() => {
    if (authenticatedUser && authenticatedUser._id !== id) {
      getUser();
    } else if (authenticatedUser && authenticatedUser._id === id) {
      setUserProfileData(authenticatedUser);
    }
  }, [authenticatedUser, token]);

  return (
    // his name, his username, friends number
    <div className="h-screen flex flex-col items-center justify-center">
      {userProfileData ? (
        <div>
          <div className="flex justify-center">
            <h1>{userProfileData.fullname}</h1>
            <h3 className="mx-2 leading-relaxed text-gray-700 text-sm">
              @{userProfileData.username}
            </h3>
          </div>
          <form
            className="flex my-4"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <input
              type="text"
              name="message"
              placeholder={`send a message to ${userProfileData.fullname}`}
              className="border border-indigo-400 bg-indigo-50 rounded-sm p-1 focus:outline-none focus:bg-indigo-100"
            />
            <input
              type="submit"
              value="Send"
              className="text-gray-900 border border-indigo-400 p-2 text-center bg-indigo-50 cursor-pointer hover:bg-indigo-100"
            />
          </form>
        </div>
      ) : (
        <div>loading...</div>
      )}
    </div>
  );
}
