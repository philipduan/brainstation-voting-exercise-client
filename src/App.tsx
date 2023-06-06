import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import Candidates from "./pages/candidates";
import PrivateRoute from "./utils/privateRoute";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/candidates",
      element: (
        <PrivateRoute>
          <Candidates />
        </PrivateRoute>
      ),
    },
  ],
  { basename: "/brainstation-voting-exercise-client" }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
