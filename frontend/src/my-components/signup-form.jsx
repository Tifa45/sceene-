import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/user-store";

function SignUpForm({ setFormType }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({ mode: "onBlur" });

  const nav = useNavigate();
  const setTempToken = useUserStore((s) => s.setTempToken);

  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        data
      );
      const { token } = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      setTempToken(token);
      nav("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError("root", {
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
              placeholder="Your Full Name"
              type="text"
              {...register("fullName", {
                required: "Name is required!",
                minLength: {
                  value: 2,
                  message: "Name must be at least two chars",
                },
                validate: (v) =>
                  v.trim().length > 0 || "Name can not be empty!",
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 mt-4">{errors.fullName.message}</p>
            )}
          </div>
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
              className="bg-white/30 backdrop-blur-2xl p-4 rounded-full w-full placeholder:text-gray-300!"
              placeholder="Your Password"
              type="password"
              {...register("password", {
                required: "please enter your password!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 chars",
                },
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
        <p>Already have account? </p>
        <button type="button" onClick={() => setFormType("login")}>
          <span className=" underline hover:text-amber-500 cursor-pointer">
            log in
          </span>
        </button>
      </div>
    </>
  );
}

export default SignUpForm;
