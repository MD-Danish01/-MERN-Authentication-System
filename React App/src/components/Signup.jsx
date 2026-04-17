import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SIGNUP_URL = import.meta.env.VITE_SIGNUP_URL;
const ACCOUNT_URL = import.meta.env.VITE_ACCOUNT_URL;
const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;

const Signup = () => {
  const navigate = useNavigate();

  async function fetchUser() {
    const a = await fetch(ACCOUNT_URL, {
      credentials: "include",
    });
    const res = await a.json();


    if (res.ok) {
      navigate("/account");
    }
    if (res.message === "Access token expired") {
      const r = await fetch(REFRESH_URL, {
        credentials: "include",
      });
      const response = await r.json();
      if (response.ok) fetchUser();
    }
  }
  //check is user have a session
  useEffect(() => {
    fetchUser();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  //after sign up routre push to login page
  const onSubmit = async (data) => {
    let r = await fetch(SIGNUP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    let res = await r.text();
   
    if (r.ok) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                {...register("username", {
                  required: { value: true, message: "This field is required" },
                  maxLength: {
                    value: 10,
                    message: "Username should be less than 10 characters.",
                  },
                })}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.username && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: { value: true, message: "This field is required" },
                  minLength: {
                    value: 8,
                    message: "Password should be at least 8 characters.",
                  },
                })}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition duration-200 mt-6"
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>

            {errors.myform && (
              <span className="text-red-500 text-sm text-center block">
                {errors.myform.message}
              </span>
            )}
          </form>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <span> Already have an account? </span>
            <button
              className="text-blue-400 px-6 py-2 rounded-lg hover:text-blue-600 transition"
              onClick={() => {
                navigate("/login");
              }}
            >
              <span className="font-semibold">Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
