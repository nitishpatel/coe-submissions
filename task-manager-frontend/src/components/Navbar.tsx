import React from "react";
import { useIsAuthenticated } from "../store/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isAuthed = useIsAuthenticated();

  return (
    <nav className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 border-b border-white/25 w-full">
      <a href="/" aria-label="TodoPlusPlus" className="flex items-center gap-2">
        <img
          src="https://t3.ftcdn.net/jpg/16/47/47/38/360_F_1647473878_ZeyVlN9FkrIeO6AC8q5S4eIpEi7USbJ9.jpg"
          alt="TodoPlusPlus"
          className="h-10 w-auto"
        />
        <span className="sr-only">TodoPlusPlus</span>
      </a>

      {/* Mobile menu container (kept empty to preserve original UI) */}
      <ul
        className={[
          "max-md:absolute max-md:h-full max-md:z-50 max-md:w-full max-md:top-0",
          menuOpen ? "max-md:left-0" : "max-md:-left-full",
          "transition-all duration-300 max-md:backdrop-blur max-md:bg-white/70 max-md:text-base",
          "flex flex-col md:flex-row items-center justify-center gap-8 font-medium",
        ].join(" ")}
      >
        {menuOpen && (
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition absolute top-4 right-4"
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
        )}
      </ul>

      <button
        aria-label="Open menu"
        className="md:hidden"
        onClick={() => setMenuOpen(true)}
      >
        <svg
          className="size-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <button className="max-md:hidden px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-full" onClick={()=>{
        if(isAuthed){
          // implement logout
        }else{
          toast("Contact us at : info@todoplusplus.in")
        }
      }}>
        {isAuthed ? "Logout" : "Contact Us"}
      </button>
    </nav>
  );
};

export default Navbar;
