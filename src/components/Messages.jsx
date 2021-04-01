import { useEffect } from "react";
import { ReactComponent as TickIcon } from "../assets/tick.svg";

export default function Messages({ messages, user }) {
  useEffect(() => {
    window.scroll(0, window.innerHeight + 1000); // scroll down on each message
  });

  return (
    <div className="flex-grow pb-10 pt-2">
      {messages.map(({ _id, text, from, delivered, seen }) => (
        <p className="group px-2 md:px-8 py-4" key={_id}>
          <strong className="text-gray-500">{from.fullname}</strong>:{" "}
          <span>{text}</span>
          {from.username === user.username ? (
            <span
              className={`hidden group-hover:inline-block mx-2 w-3 fill-current ${
                seen
                  ? "text-white bg-blue-500 rounded-full"
                  : delivered
                  ? "text-black"
                  : "text-gray-300"
              }`}
            >
              <TickIcon />
            </span>
          ) : null}
        </p>
      ))}
    </div>
  );
}
