import { ReactComponent as TickIcon } from "../../assets/tick.svg";

export default function Messages({ messages, user }) {
  return (
    <div className="flex-grow pb-10 pt-2">
      {messages.length > 0 ? messages.map(({ _id, text, from, delivered, seen }) => {
        let isOwn = from.username === user.username;
        return (
          <p
            className={`group px-2 md:px-8 py-4 mb-1 ${isOwn ? "text-right bg-gray-50" : "bg-white"}`}
            key={_id}
          >
            {isOwn ? (
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
            <span>{text}</span>
          </p>
        );
      }) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">what are you? enemies? start talking!</div>
      )}
    </div>
  );
}
