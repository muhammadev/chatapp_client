import { Link } from "react-router-dom";
import { ReactComponent as LeftArrow } from "../../assets/left-arrow.svg";

export default function RoomHeader({ participant }) {
  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md flex justify-around">
      <Link
        className="w-12 p-3 hover:bg-gray-100 cursor-pointer outline-none"
        to="/"
      >
        <LeftArrow />
      </Link>
      <div className="flex justify-around flex-grow p-3 leading-tight">
        <p>{participant?.fullname}</p>
        <p>{participant?.online ? "online" : "offline"}</p>
      </div>
    </div>
  );
}
