import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const apiRoute = "http://localhost:3000/auth/register";
  const navigate = useNavigate();

  const handleSubmit = () => {
    setError("");
    setSuccess(false);
    if (
      username.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setError("Please fill in all fields");
      setSuccess("");
      return null;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return null;
    }

    axios
      .post(apiRoute, {
        username: username,
        password: password,
      })
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((err) => {
        setError(err.response?.data);
      });
  };

  return (
    <div className="w-dvw h-full">
      <div className="flex flex-col items-center px-12 py-20 bg-[#38a3a5] w-max mx-auto mt-40 rounded-2xl">
        <h1 className="text-[#e0e0e0] text-3xl">Register</h1>
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
          <input
            className="bg-[#2e8485] pl-3 py-1 rounded-2xl focus:ring-1 focus:ring-cyan-100 outline-0"
            type="password"
            name="confirm-password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Already have an account?{" "}
            <Link to={"/login"} className=" text-blue-800 underline">
              Sign in now!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
