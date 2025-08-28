import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user-store";
import api from "../lib/axios-utils";

function LoginForm({ setFormType }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const nav = useNavigate();
  const setTempToken = useUserStore((s) => s.setTempToken);

  async function onSubmit(data) {
    try {
      const response = await api.post("/auth/login", data);
      const { token } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      setTempToken(token);
      nav("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("root", {
          type: "server",
          message: error.response.data.message ?? error.message,
        });
      } else {
        setError("root", { message: "Unexpected error!" });
      }
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] max-w-4xl ">
        <div className="w-full flex flex-col gap-8 items-center  px-6">
          <div className="w-full">
            <input
              className="bg-white/30 backdrop-blur-2xl p-4 rounded-full w-full placeholder:text-gray-300! "
              placeholder="Your Email: example@mail.ex"
              type="text"
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 mt-4">{errors.email.message}</p>
            )}
          </div>
          <div className="w-full">
            <input
              className="bg-white/30 backdrop-blur-2xl p-4 rounded-full w-full  placeholder:text-gray-300!"
              placeholder="Your Password"
              type="password"
              {...register("password", {
                required: "please enter your password!",
              })}
            />
            {errors.password && (
              <p className="text-red-500 mt-4">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="sign-btn w-full">
            Sign In
          </button>
          {errors.root && (
            <p className="text-red-500 mt-4">{errors.root.message} </p>
          )}
        </div>
      </form>
      <div className="flex p-4 w-full justify-center gap-2 mb-auto">
        <p>Don't have account? </p>
        <button type="button" onClick={() => setFormType("signUp")}>
          <span className=" underline hover:text-amber-500 cursor-pointer">
            create one
          </span>
        </button>
      </div>
    </>
  );
}

export default LoginForm;
