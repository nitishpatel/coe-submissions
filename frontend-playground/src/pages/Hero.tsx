import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4">
      <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center">
        The Best Counter in the World
      </h5>

      <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6">
        Counter for your everyday needs
      </p>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => {
            navigate("/counter");
          }}
          className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Hero;
