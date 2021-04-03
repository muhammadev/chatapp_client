// import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Notifications({ notifications }) {
  return (
    <div className="w-full h-full bg-gray-50 relative flex flex-col p-10">
      <h1 className="text-3xl">Notificatoins</h1>
      {notifications.length ? (
        notifications.map((message) => {
          // destructure message data
          const {
            text,
            _id: msgId,
            from: { _id: senderId, username: senderUsername },
          } = message;

          return (
            <Link className="my-4 p-4 bg-white border border-gray-300 hover:border-black" key={msgId} to={`/room/${senderId}`}>
              <small>{senderUsername}:</small>
              <p className="bg-gray-100 inline-block px-2 mx-4">
                {text.length > 20 ? text.slice(0, 20) + "..." : text}
              </p>
            </Link>
          );
        })
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          you have no notifications
        </div>
      )}
    </div>
  );
}
