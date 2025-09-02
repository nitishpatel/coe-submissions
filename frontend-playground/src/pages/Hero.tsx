import React from "react";
import Navbar from "../components/Navbar";

const Hero = () => {
  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col justify-center items-center px-4">
        <h5 className="text-4xl md:text-7xl font-medium max-w-[850px] text-center">
          The Best Counter in the World
        </h5>

        <p className="text-sm md:text-base mx-auto max-w-2xl text-center mt-6">
          Counter for your everyday needs
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button className="bg-slate-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
            Get Started
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
