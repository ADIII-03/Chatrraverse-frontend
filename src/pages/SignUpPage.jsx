import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { axiosInstance } from '../lib/axios';

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

 const { mutate, isPending, error } = useMutation({
  mutationFn: async () => {
    const response = await axiosInstance.post('/auth/signup', signupData);
    return response.data;
  },
  onSuccess: async () => {
    try {
      // fetch user explicitly after signup
      const { data: user } = await axiosInstance.get('/auth/me');
      queryClient.setQueryData(['authUser'], user);
      
      navigate('/onboarding'); // now user data is fresh and onboarding page can read it properly
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // if fetching user fails, redirect to login
      navigate('/login');
    }
  }
});


  const handleSignup = (e) => {
    e.preventDefault();
    mutate();
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
  <div className="flex flex-col lg:flex-row w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden border border-blue-200 bg-white">
    
    {/* LEFT - SIGNUP FORM */}
    <div className="w-full lg:w-1/2 p-6 sm:p-10 bg-white">
      {/* LOGO */}
      <div className="mb-6 flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="w-10 h-10" />
        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary font-mono">
          Chattraverse
        </span>
      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-error mb-4 text-sm">
          <span>{error.response?.data?.message || "Something went wrong!"}</span>
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500">
            Join Chattraverse and start your communication adventure!
          </p>
        </div>

        {/* FULL NAME */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="input input-bordered w-full placeholder:text-gray-400 placeholder-opacity-50"
            value={signupData.fullName}
            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="example@email.com"
            className="input input-bordered w-full placeholder:text-gray-400 placeholder-opacity-50"
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            required
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="********"
            className="input input-bordered w-full placeholder:text-gray-400 placeholder-opacity-50"
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be at least 6 characters long.
          </p>
        </div>

        {/* TERMS CHECKBOX */}
        <div className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="checkbox checkbox-sm mt-1" required />
          <p>
            I agree to the <span className="text-blue-600 hover:underline">terms</span> and
            <span className="text-blue-600 hover:underline ml-1">privacy policy</span>.
          </p>
        </div>

        {/* SUBMIT BUTTON */}
        <button className="btn btn-primary w-full mt-2" type="submit">
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Loading...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>

    {/* RIGHT - ILLUSTRATION */}
    <div className="hidden lg:flex w-full lg:w-1/2 bg-blue-50 items-center justify-center p-10">
      <div className="text-center space-y-5">
        <img src="/Video call-amico.png" className="w-full max-w-sm mx-auto" alt="illustration" />
        <h2 className="text-xl font-semibold text-blue-700">
          Connect with language partners worldwide
        </h2>
        <p className="text-gray-600">
          Practice conversations, make friends, and improve your language skills together.
        </p>
      </div>
    </div>
  </div>
</div>

  );
};

export default SignUpPage;
