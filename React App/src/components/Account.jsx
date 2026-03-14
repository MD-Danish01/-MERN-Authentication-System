import { useEffect, useState } from "react";

const Account = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetchData();
  }, [""]);

  const fetchData = async () => {
    let r = await fetch("http://localhost:3000/account", {
      credentials: "include",
    });
    let res = await r.json();
    setUsername(res.username);
  };

  return (
    <div>
      <h3>Account Page</h3>
      <span>welcome {username}</span>
    </div>
  );
};

export default Account;
