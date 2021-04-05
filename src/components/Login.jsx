import { useEffect, useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import useFetch from "../useFetch";
import userContext from "../userContext";
import useToken from "../useToken";

export default function Login() {
  const history = useHistory();

  const { setToken } = useToken();
  const { user, setUser } = useContext(userContext);

  const { setResponse } = useFetch();

  useEffect(() => {
    // if current user exists, redirect to home page
    if (user) history.push("/");
  }, [user, history]);

  // form data states
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(null);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const updateErrors = (errors) => {
    errors?.forEach((error) => {
      const [param, msg] = error;

      switch (param) {
        case "email":
          setEmailErr(msg);
          break;
        case "password":
          setPwErr(msg);
          break;
        default:
          break;
      }
    });
  };

  const handleSubmit = () => {
    let formData = {
      email,
      password: pw,
    };

    const url = `/login`;

    let headers = new Headers();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    let options = {
      method: "POST",
      headers,
      body: JSON.stringify(formData),
    };

    const completeLogin = ({ ok, status, data }) => {
      if (ok) {
        const { token, user } = data;
        setToken(token);
        setUser(user);
      } else {
        const { errors } = data;
        if (!errors) setGlobalError(data.errorMessage);
        const formatedErrors = errors?.map((err) => [err.param, err.msg]);
        updateErrors(formatedErrors);
      }
    };

    setResponse(url, options, completeLogin);
  };

  // if (error) {
  //   return <ServerDown err={error} />
  // }

  const inputGroupStyle = "my-2 flex flex-col w-4/5 md:w-1/3 m-auto";
  const inputSyle =
    "px-2 py-1 text-sm rounded-sm border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 focus:bg-indigo-100 focus:text-black focus:outline-none";
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-10">Log In</h1>
      <form className="w-full">
        <p className="text-center text-red-500">
          {globalError ? "incorrect email or password" : ""}
        </p>
        <div className={inputGroupStyle}>
          <label htmlFor="email">email</label>
          <input
            className={inputSyle}
            type="email"
            id="email"
            name="email"
            placeholder="Ex: john499@example.com"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErr(null);
            }}
            required
            autoComplete="new-password"
          />
          <span className="text-sm text-red-700">{emailErr}</span>
        </div>
        <div className={inputGroupStyle}>
          <label htmlFor="password">password</label>
          <input
            className={inputSyle}
            type="password"
            id="password"
            name="password"
            onChange={(e) => {
              setPw(e.target.value);
            }}
            autoComplete="new-password"
            required
          />
          <span className="text-sm text-red-700">{pwErr}</span>
        </div>
        <div className="my-2 flex flex-col w-40 m-auto">
          <button
            type="submit"
            className="p-2 rounded-sm border border-indigo-300 bg-indigo-50 hover:bg-indigo-100"
            disabled={!email || !pw || emailErr || pwErr ? true : false}
            onClick={(e) => {
              e.preventDefault(); // prevent default submition
              let isEmailValid = !emailErr && email.length,
                isPwValid = !pwErr && pw.length >= 8;

              let isValidationPassed = isEmailValid && isPwValid;

              if (isValidationPassed) {
                handleSubmit();
              } else {
                setGlobalError("something is wrong");
              }
            }}
          >
            Submit
            <span></span>
          </button>
        </div>
        <p className="lowercase text-center">
          don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-500 hover:text-indigo-900"
          >
            register
          </Link>
        </p>
      </form>
    </div>
  );
}
