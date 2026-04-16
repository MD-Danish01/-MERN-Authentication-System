import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ACCOUNT_URL = import.meta.env.VITE_ACCOUNT_URL;
const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;

const Account = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [copAssTok, setCopAssTok] = useState(false);
  const [copRefTok, setCopRefTok] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const r = await fetch(ACCOUNT_URL, {
        credentials: "include",
      });
      const res = await r.json();
      if (res.message === "Unauthorized") {
        navigate("/");
      }
      if (res.message === "Access token expired") {
        setIsLoggedIn(false);
        // console.log("/refresh api call");
        const a = await fetch(REFRESH_URL, {
          credentials: "include",
        });
        const response = await a.json();
        // console.log(response);
        if (!a.ok && !response.ok) {
          navigate("/");
        } else {
          fetchData();
        }
      }
      // console.log(res);
      setIsLoggedIn(true);
      setUsername(res.username || "");
      setAccessToken(res.AccessToken || "");
      setRefreshToken(res.refreshToken || "");
    } catch (err) {
      console.error("Failed to fetch account:", err);
    }
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value || "");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      fetch(LOGOUT_URL, {
        credentials: "include",
      }).then((res) => {
        if (res.ok) {
          setIsLoggedIn(false);
          setUsername("");
          setAccessToken("");
          setRefreshToken("");
          navigate("/");
        }
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Auth Process Demo
        </h1>
        <p className="text-gray-600 mt-1">Signed in as {username || "User"}</p>

        <div className="mt-6 grid gap-4">
          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Access Token
              </h2>
              <button
                onClick={() => {
                  copyToClipboard(accessToken);
                  setCopAssTok(true);
                  setTimeout(() => setCopAssTok(false), 2000);
                }}
                className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 ${copAssTok ? "bg-green-200" : ""}`}
                type="button"
              >
                Copy
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-800 break-all font-mono">
              {isLoggedIn && accessToken
                ? accessToken
                : "No access token available"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Refresh Token
              </h2>
              <button
                onClick={() => {
                  copyToClipboard(refreshToken);
                  setCopRefTok(true);
                  setTimeout(() => setCopRefTok(false), 2000);
                }}
                className={`text-sm px-3 py-1.5 rounded-md border border-gray-300 ${copRefTok ? "bg-green-200" : ""}`}
                type="button"
              >
                Copy
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-800 break-all font-mono">
              {isLoggedIn && refreshToken
                ? refreshToken
                : "No refresh token available"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            type="button"
          >
            Refresh Data
          </button>
          <button
            onClick={() => handleLogout()}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            type="button"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
