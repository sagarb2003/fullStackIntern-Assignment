"use client"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/auth/auth.slice";
import useAuthSession from "../hooks/useAuthSession";
import axios from "axios";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { user } = useAuthSession();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/user", {
        username,
        password,
      });
      if (response.status === 200) {
        const { token, username } = response.data;
        localStorage.setItem("token", token);
        dispatch(setToken(token));
        dispatch(setUser({ username }));
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 className="text-xl font-bold">Welcome, {user.username}</h2>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default HomePage;
