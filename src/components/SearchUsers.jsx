import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import userContext from "../userContext";
import useUsers from "../useUsers";
export default function SearchUsers() {
  // doFetch & get users & process them...

  const { user: currentUser } = useContext(userContext);

  const [matchedUsers, setMatchedUsers] = useState([]);
  const { users, fetched } = useUsers();

  const filterByKeyword = (keyword) => {
    const matched = [];
    users?.forEach((user) => {
      let { fullname, username } = user;
      fullname = fullname.toLocaleLowerCase();
      username = username.toLocaleLowerCase();
      if (
        keyword &&
        (fullname.startsWith(keyword) || username.startsWith(keyword)) &&
        username !== currentUser.username
      ) {
        matched.push(user);
      }
    });
    setMatchedUsers(matched);
  };

  if (!fetched) return <div className="text-center">loading...</div>;

  return (
    <div className="absolute w-full md:mt-4 text-center">
      <h3 className="md:text-xl">search a name to chat with</h3>
      <div className="m-auto w-full border border-gray-300 bg-gray-100 rounded focus-within:bg-gray-200 focus-within:border-b-0 placeholder-gray-500">
        <input
          className="focus:outline-none p-2 w-full bg-transparent"
          type="text"
          name="search"
          id="search"
          placeholder="enter a name"
          autoComplete="off"
          onChange={(e) => {
            filterByKeyword(e.target.value.toLocaleLowerCase().trim());
          }}
        />
        {matchedUsers.length ? (
          <div className="rounded-sm">
            {matchedUsers.map((user, i) => {
              return (
                <div key={user.username}>
                  <Link
                    to={`/chat-room/${user._id}`}
                    className="hover:bg-gray-300 p-2 flex justify-start rounded"
                  >
                    <p className="">{user.fullname}</p>
                    <p className="text-sm text-gray-700 leading-relaxed mx-2">
                      @{user.username}
                    </p>
                  </Link>
                  {i !== matchedUsers.length - 1 ? (
                    <div className="w-10/12 h-1 m-auto border-b border-gray-300"></div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
