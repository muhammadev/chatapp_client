import { createContext, useState } from "react";

const errorContext = createContext({
  error: null,
  setError: () => {},
});

export function ErrorProvider({ children }) {
  const [error, setError] = useState();

  const updateError = (err) => {
    console.log({err});
    setError(err);
  };

  return (
    <errorContext.Provider
      value={{
        error,
        setError: updateError,
      }}
    >
      {children}
    </errorContext.Provider>
  );
}

export default errorContext;
