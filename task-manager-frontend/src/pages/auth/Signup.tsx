import React from "react";

const Signup = () => {
  return (
    <div className="flex flex-col justify-center sm:h-screen p-4">
      <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8">
        <div className="text-center mb-12">
          <a href="javascript:void(0)">Register for TaskPlusPlus</a>
        </div>

        <form aria-label="signup-form">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="text-slate-900 text-sm font-medium mb-2 block">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label htmlFor="full-name" className="text-slate-900 text-sm font-medium mb-2 block">
                Full Name
              </label>
              <input
                name="full-name"
                id="full-name"
                type="text"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter Full name"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-slate-900 text-sm font-medium mb-2 block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="text-slate-900 text-sm font-medium mb-2 block">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                className="text-slate-900 bg-white border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                placeholder="Enter confirm password"
              />
            </div>
          </div>

          <div className="mt-12">
            <button
              type="button"
              className="w-full py-3 px-4 text-sm tracking-wider font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer"
            >
              Register
            </button>
          </div>
          <p className="text-slate-600 text-sm mt-6 text-center">
            Already have an account?{" "}
            <a
              href="javascript:void(0);"
              className="text-blue-600 font-medium hover:underline ml-1"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
