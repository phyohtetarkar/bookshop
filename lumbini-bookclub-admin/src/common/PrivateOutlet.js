import { Navigate, Outlet } from "react-router-dom";
import { firebaseAuth } from "../firebase.config";

function PrivateOutlet() {
  const auth = firebaseAuth;

  return auth.currentUser ? <Outlet /> : <Navigate to="sign-in" replace />;
}

export default PrivateOutlet;
