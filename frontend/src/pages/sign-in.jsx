import { useState } from "react";
import LoginForm from "../my-components/login-form";
import SignUpForm from "../my-components/signup-form";
import { useUserStore } from "../stores/user-store";
import { Navigate } from "react-router-dom";

function SignInRoute() {
  const [formType, setFormType] = useState("login");
  const user = useUserStore((s) => s.userData.userId);
  const userLoading = useUserStore((s) => s.userLoading);

  if (userLoading) return <h1>Loading...</h1>;
  if (user) return <Navigate to="/" />;

  return (
    <div className="w-full grid place-items-center h-[80vh] ">
      {formType === "login" ? (
        <LoginForm setFormType={setFormType} />
      ) : (
        <SignUpForm setFormType={setFormType} />
      )}
    </div>
  );
}

export default SignInRoute;
