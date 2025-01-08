import React, { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const VerifyToken = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useContext(AuthContext); // Access setAuthState from context

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      alert("Invalid or missing token.");
      navigate("/login");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/auth/verify-token`, {
        params: { token },
      })
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          alert(response.data);
          navigate("/login");
          return;
        } else {
          localStorage.setItem("accessToken", response.data.token);

          // Update the auth state with the user's info
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            admin: response.data.admin,
          });

          alert("Login successful!");
          navigate("/"); // Redirect to homepage or dashboard
          return;
        }
      })
      .catch((error) => {
        alert("login error");
        navigate("/login");
        return;
      });
  }, []);

  return <p>Verifying your login...</p>;
};

export default VerifyToken;
