import React from "react";
import Navbar from "../components/Navbar";

const MainLayout = ({children}) => {

  return (
    <section className="bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/gridBackground.png')] w-full bg-no-repeat bg-cover bg-center text-sm min-h-screen flex flex-col">
      <Navbar />
      {children}
    </section>
  );
};

export default MainLayout;
