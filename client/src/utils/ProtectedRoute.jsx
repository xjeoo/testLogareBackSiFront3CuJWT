import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const authData = useAuth();
  const apiRoute = "http://localhost:3000/auth/verify";

  const [authorized, setAuthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authData.isLoading)
      axios
        .post(
          apiRoute,
          {},
          {
            headers: {
              authorization: `Bearer ${authData.data.access_token}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.status === 201)
            localStorage.setItem("userData", JSON.stringify(res.data));

          setAuthorized(true);
          console.log(res);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          console.log(authData.access_token);
          setAuthorized(false);
          authData.logout();
          navigate("/login");
        });
  }, [authData.isLoading]);
  if (authData.isLoading) return <h1>Loading...</h1>;
  else return { authorized } ? <Outlet /> : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
