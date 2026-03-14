import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Authentication from "./components/Authentication";
import Account from "./components/Account";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Authentication />
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
