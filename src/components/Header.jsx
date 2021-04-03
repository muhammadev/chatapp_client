import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import userContext from "../userContext";

export default function Header({ notifications }) {
  const [pathname, setPathname] = useState(null);
  const location = useLocation();

  const { user } = useContext(userContext);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, [location, setPathname]);

  const linkStyle =
    "sm:mx-4 md:mx-8 p-1 hover:bg-gray-100 border border-transparent hover:border-gray-300 rounded-sm";
  const activeLink = " bg-gray-100 border-gray-300 ";
  return (
    <div className="fixed z-10 bg-white shadow-md top-0 left-0 w-full flex justify-around py-2">
      <h4 className="text-xl font-mono">Chit Chat</h4>
      {user ? (
        <ul className="flex justify-center">
          <Link
            className={linkStyle + (pathname === "/" ? activeLink : "")}
            to="/"
          >
            <li>Home</li>
          </Link>
          <Link
            className={linkStyle + (pathname === "/profile" ? activeLink : "")}
            to="/profile"
          >
            <li>Profile</li>
          </Link>
          <Link
            className={
              linkStyle + (pathname === "/notifications" ? activeLink : "")
            }
            to="/notifications"
          >
            <li className="flex">
              <p>Notifications</p>
              {pathname === "/notifications" ? null : notifications.length > 0 ? (
                <span className="w-4 h-4 bg-gray-400 rounded-full text-center text-xs leading-normal">
                  {notifications.length}
                </span>
              ) : null}
            </li>
          </Link>
        </ul>
      ) : (
        <ul className="flex justify-center">
          <Link
            className={linkStyle + (pathname === "/" ? activeLink : "")}
            to="/"
          >
            <li>Home</li>
          </Link>
          <Link
            className={linkStyle + (pathname === "/register" ? activeLink : "")}
            to="/register"
          >
            <li>Register</li>
          </Link>
          <Link
            className={linkStyle + (pathname === "/login" ? activeLink : "")}
            to="/login"
          >
            <li>Login</li>
          </Link>
        </ul>
      )}
    </div>
  );
}
