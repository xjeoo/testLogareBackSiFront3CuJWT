import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const auth = useAuth();

  const apiRoute = "http://localhost:3000/auth/login";
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");
    setSuccess(false);
    if (username.trim() === "" || password.trim() === "") {
      setError("Please fill in all fields");
      setSuccess(false);
      return null;
    }

    axios
      .post(
        apiRoute,
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        // aici trebuie sa salvez tokenul
        setSuccess(true);
        setError("");
        auth.login(res.data);
        navigate("/");
      })
      .catch((err) => {
        setError(err.response?.data);
      });
  };

  return (
    <div className="w-dvw h-full">
      <div className="flex flex-col items-center px-12 py-20 bg-[#38a3a5] w-max mx-auto mt-40 rounded-2xl">
        <h1 className="text-[#e0e0e0] text-3xl">Login</h1>
        {error !== "" ? (
          <h2 className="text-xl pt-4 text-red-600  text-shadow-2xs text-shadow-gray-800">
            {error}
          </h2>
        ) : null}
        {success ? (
          <h2 className="text-xl pt-4 text-[#e0e0e0]">Success</h2>
        ) : null}

        <div className="flex flex-col gap-2.5 my-6">
          <input
            className="bg-[#2e8485] pl-3 py-1 rounded-2xl focus:ring-1 focus:ring-cyan-100 outline-0 mb-2"
            type="text"
            name="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="bg-[#2e8485] pl-3 py-1 rounded-2xl focus:ring-1 focus:ring-cyan-100 outline-0"
            type="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-center">
          <button
            className="text-2xl text-[#e0e0e0] px-4 py-2 bg-[#faa307] rounded-3xl mt-3 hover:bg-[#e89906] cursor-pointer"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <p className="text-[#eaeaea] text-[0.9em] mt-3">
            Don't have an account?{" "}
            <Link to={"/register"} className=" text-blue-800 underline">
              Register now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
