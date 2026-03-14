import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const Authentication = () => {
  const [login, setlogin] = useState(true);
  return (
    <>
      {login ? (
        <div className="relative">
          <Login />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <span>Don't have an account?{" "}</span>
            <button
              className="text-blue-400 px-6 py-2 rounded-lg hover:text-blue-600 transition"
              onClick={() => {
                setlogin(false);
              }}
            >
              <span className="font-semibold">Sign Up</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <Signup />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <span> Already have an account?{" "}</span>
            <button
              className="text-blue-400 px-6 py-2 rounded-lg hover:text-blue-600 transition"
              onClick={() => {
                setlogin(true);
              }}
            >
              <span className="font-semibold">Login</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Authentication;
