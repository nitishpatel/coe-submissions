import React from "react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-6 w-full">
      <div className="flex items-center">
        <svg
          width="100px"
          height="40px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95043 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95044C4.00437 6.17301 6.173 4.00437 8.95043 3.35288C10.9563 2.88238 13.0437 2.88238 15.0496 3.35288C17.827 4.00437 19.9956 6.173 20.6471 8.95043C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496Z"
            stroke="#0095FF"
            stroke-width="1.5"
          />
          <path
            d="M20.6471 15.0496C21.1176 13.0437 21.1176 10.9563 20.6471 8.95043C19.9956 6.173 17.827 4.00437 15.0496 3.35288C13.0437 2.88238 10.9563 2.88238 8.95043 3.35288C6.173 4.00437 4.00437 6.17301 3.35288 8.95044C2.88237 10.9563 2.88237 13.0437 3.35288 15.0496C4.00437 17.827 6.17301 19.9956 8.95043 20.6471"
            stroke="#363853"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M14.5 12H9.5M12 14.5L12 9.5"
            stroke="#0095FF"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        <h1 className="text-lg">CountPlusPlus</h1>
      </div>
      <div
        id="menu"
        className="max-md:absolute max-md:top-0 max-md:left-0 max-md:w-0 max-md:transition-all max-md:duration-300 max-md:overflow-hidden max-md:h-full max-md:bg-white/50 max-md:backdrop-blur max-md:flex-col max-md:justify-center flex items-center gap-8 font-medium"
      >
        <button
          id="close-menu"
          className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
      <button className="hidden md:block bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-full font-medium transition">
        Contact Us
      </button>
    </nav>
  );
};

export default Navbar;
