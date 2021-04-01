import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Notifications({
  notifications,
  setNotifications,
  socket,
}) {
  useEffect(() => {
    // on unmounting, empty the notifications
    return () => {
      setNotifications([]);
    }
  }, [notifications, socket]);

  return (
    <div className="w-full h-full bg-gray-50 relative flex flex-col p-10">
      {notifications.length
        ? notifications.map((message) => {
        // destructure message data
        const { text, _id: msgId, from: { _id: senderId, username: senderUsername }} = message;

        return (
          <Link
            className="border rounded-sm"
            key={msgId}
            to={`/room/${senderId}`}
          >
            <p className="">{text.slice(0, 15)}</p>
            <small>from {senderUsername}</small>
          </Link>
        );
      })
      : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          you have no notifications
        </div>
      )
    }
    </div>
  );
}
