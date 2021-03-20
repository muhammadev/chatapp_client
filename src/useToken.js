import { useState } from "react";

// useToken is a custom hook
// it checks if there's a token saved in localStorage
// then, it saves it to a state
// it has a method to set the token to the state and localStorage when changed, named as saveToken
// it returns the token state and the saveToken method as setToken for convenience reasons
export default function useToken() {
  const getToken = () => {
    let stringToken = localStorage.getItem("token");
    return stringToken;
  }

  const [token, setToken] = useState(getToken())

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken)
    setToken(userToken)
  }

  return {
    token,
    setToken: saveToken
  }
}