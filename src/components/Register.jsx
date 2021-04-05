import { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import useFetch from "../useFetch";
import useToken from "../useToken";
import userContext from "../userContext";

export default function Register() {
  const history = useHistory();

  const { setResponse, error: serverError } = useFetch();
  const { setToken } = useToken();
  const { user, setUser } = useContext(userContext);

  useEffect(() => {
    // if current user exists, redirect to home page
    if (user) history.push("/");
  }, [user, history]);

  // form data states
  const [fullname, setFullname] = useState("");
  const [fullnameErr, setFullnameErr] = useState("");
  const [username, setUsername] = useState("");
  const [usernameErr, setUsernameErr] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [cpw, setCpw] = useState("");
  const [cpwErr, setCpwErr] = useState("");

  const handleSubmit = async () => {
    let formData = {
      fullname,
      username,
      email,
      password: pw,
    };

    let url = `/register`;

    let headers = new Headers();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    let options = {
      method: "POST",
      headers,
      body: JSON.stringify(formData),
    };

    // useFetch's callback
    const completeRegisteration = ({ ok, data }) => {
      if (ok) {
        const { token, user: userData } = data;
        setToken(token);
        setUser(userData);
      } else {
        const { errors } = data;
        const formatedErrors = errors.map((err) => [err.param, err.msg]);
        updateErrors(formatedErrors);
      }
    };

    setResponse(url, options, completeRegisteration);
  };

  const updateErrors = (errors) => {
    errors.forEach((error) => {
      const [param, msg] = error;

      switch (param) {
        case "fullname":
          setFullnameErr(msg);
          break;
        case "username":
          setUsernameErr(msg);
          break;
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

  const inputGroupStyle = "my-2 flex flex-col w-4/5 md:w-1/3 m-auto";
  const inputSyle =
    "px-2 py-2 text-sm rounded border border-indigo-300 bg-gray-50 hover:bg-indigo-100 focus:bg-indigo-100 focus:text-black focus:outline-none";
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl mb-10">Register</h1>
      <form className="w-full">
        <div className={inputGroupStyle}>
          <label htmlFor="fullname">full name</label>
          <input
            className={inputSyle}
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Ex: John Snow"
            onChange={(e) => {
              setFullname(e.target.value);
              // if no errors set fullnameErr to ""
              if (e.target.value.length < 2 || e.target.value.length > 50) {
                setFullnameErr(
                  "fullname shoule be at least 2 characters and not exceed 50 characters"
                );
              } else {
                setFullnameErr("");
              }
            }}
            required
          />
          <span className="text-sm text-red-700">{fullnameErr}</span>
        </div>
        <div className={inputGroupStyle}>
          <label htmlFor="username">username</label>
          <input
            className={inputSyle}
            type="text"
            id="username"
            name="username"
            placeholder="Ex: johnsnow432"
            onChange={(e) => {
              const { value } = e.target;

              setUsername(value);

              // if no errors set usernameErr to ""
              if (
                value.includes(" ") ||
                !/^(?=[a-z_\d]*[a-z])[a-z_\d]{2,20}$/.test(value)
              ) {
                setUsernameErr(
                  "username must be 2-20 characters long, and contains letters and numbers only"
                );
              } else {
                setUsernameErr("");
              }
            }}
            required
          />
          <span className="text-sm text-red-700">{usernameErr}</span>
        </div>
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

              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                  e.target.value
                )
              ) {
                setEmailErr("Email is not valid");
              } else {
                setEmailErr("");
              }
            }}
            required
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

              if (e.target.value.length < 8) {
                setPwErr("password should contains at least 8 characters");
              } else {
                setPwErr("");
              }

              // check if cpw existed then validate if true
              if (cpw.length) {
                if (e.target.value !== cpw) {
                  setCpwErr("password doesn't match");
                } else {
                  setCpwErr("");
                }
              }
            }}
            autoComplete="new-password"
            required
          />
          <span className="text-sm text-red-700">{pwErr}</span>
        </div>
        <div className={inputGroupStyle}>
          <label htmlFor="cpassword">confirm password</label>
          <input
            className={inputSyle}
            type="password"
            id="cpassword"
            name="cpassword"
            onChange={(e) => {
              setCpw(e.target.value);

              if (e.target.value !== pw) {
                setCpwErr("password doesn't match");
              } else {
                setCpwErr("");
              }
            }}
            autoComplete="new-password"
            required
          />
          <span className="text-sm text-red-700">{cpwErr}</span>
        </div>
        <div className="my-2 flex flex-col w-40 m-auto">
          <input
            type="submit"
            value="Submit"
            className="p-2 rounded-sm border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 disabled:bg-gray-100 disabled:text-gray-500"
            disabled={
              !fullname ||
              !username ||
              !email ||
              !pw ||
              !cpw ||
              fullnameErr ||
              usernameErr ||
              emailErr ||
              pwErr ||
              cpwErr
                ? true
                : false
            }
            onClick={async (e) => {
              // form validation
              e.preventDefault();

              let isFullnameValid = !fullnameErr,
                isUsernameValid = !usernameErr,
                isEmailValid = !emailErr && email.length,
                isPwValid = !pwErr && pw.length >= 8,
                isConfirmed = !cpwErr;

              let isValidationPassed =
                isFullnameValid &&
                isUsernameValid &&
                isEmailValid &&
                isPwValid &&
                isConfirmed;

              if (isValidationPassed) {
                handleSubmit();
              } else {
                setCpw("something is wrong");
              }
            }}
          />
        </div>
        <p className="lowercase text-center mt-2">
          have an account?{" "}
          <Link to="/login" className="text-indigo-500 hover:text-indigo-900">
            login
          </Link>
        </p>
      </form>
    </div>
  );
}
