import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const Navbar = () => {
  // const [ref, inView, entry] = useInView();
  const [show, setShow] = useState(false);

  const handleScroll = () => setShow(window.scrollY > 20);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        show ? "after:opacity-100 text-white" : "after:opacity-0 text-black",
        "after:absolute after:top-0 after:left-0 after:will-change-[opacity] after:pointer-events-none after:h-full after:w-full after:z-10 after:transition-opacity after:duration-200 after:bg-black",
        "w-full z-50 fixed top-0"
      )}
    >
      <div className="h-14 px-4 xl:px-5 flex items-center justify-between z-20 relative">
        <Link to="/" className="p-4">
          Logo
        </Link>

        <div className="flex gap-2 p-4">
          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
