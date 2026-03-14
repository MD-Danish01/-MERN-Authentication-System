import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const [Logedin, setLogedin] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const r = await fetch("http://localhost:3000/account", {
        credentials: "include",
      });
      const res = await r.json();
      if (res.message === "Unauthorized") {
        navigate("/");
      }
      if (res.message === "Access token expired") {
        setLogedin(false);
        console.log("/refresh api call");
        const a = await fetch("http://localhost:3000/refresh", {
          credentials: "include",
        });
        const response = await a.json();
        console.log(response);
        if (!response.ok) {
          navigate("/");
        } else {
          fetchData();
        }
      }
      console.log(res);
      setLogedin(true);
      setUsername(res.username || "");
    } catch (err) {
      console.error("Failed to fetch account:", err);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <h3 className="text-2xl font-bold text-gray-800">Account Page</h3>
        <span className="text-gray-600 mt-2">welcome {username}</span>
      </div>
    </>
  );
};

export default Account;
