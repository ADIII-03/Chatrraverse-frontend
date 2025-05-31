import { useState } from "react";
import { Link } from "react-router"; // corrected from "react-router" to "react-router-dom"
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData, {
      onSuccess: () => {
        setLoginData({ email: "", password: "" }); // Clear form fields on success
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-base-100" data-theme="mytheme">
      <div className="w-full max-w-5xl bg-white shadow-xl border border-primary/20 rounded-xl flex flex-col lg:flex-row overflow-hidden">
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-mono">
              Chattraverse
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error shadow-sm mb-4 text-sm">
              <span>{error?.response?.data?.message || "Login failed"}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-neutral">Welcome Back 👋</h2>
              <p className="text-sm text-neutral/70 mt-1">
                Sign in to continue your language journey
              </p>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-base">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-center text-sm mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* Illustration Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary/10 items-center justify-center p-10">
          <div className="text-center max-w-md">
            <img
              src="/Video call-amico.png"
              alt="Language learning illustration"
              className="w-full h-auto object-contain mb-6"
            />
            <h2 className="text-xl font-semibold text-primary mb-2">
              Connect with language partners worldwide
            </h2>
            <p className="text-neutral/70 text-sm">
              Practice conversations, make friends, and improve your language
              skills together in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
