import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Account from "./components/Account";
import Login from "./components/Login";
import Signup from "./components/Signup";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Home />
      </>
    ),
  },
  {
    path: "/signup",
    element: (
      <>
        <Signup />
      </>
    ),
  },
  {
    path: "/account",
    element: (
      <>
        <Account />
      </>
    ),
  },
  {
    path: "/login",
    element: (
      <>
        <Login />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
