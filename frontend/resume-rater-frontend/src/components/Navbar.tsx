import { Link, useLocation } from "react-router-dom";
import {type User } from "../context/UserContext";

const Navbar = ({ user }: { user: User | null }) => {
  const { pathname } = useLocation();

  const navLink = (to: string, label: string) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={
          active
            ? "text-sm font-semibold text-primary border-b-2 border-primary pb-1"
            : "text-sm font-medium text-slate-600 hover:text-primary transition-colors"
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md px-6 lg:px-20">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">
              auto_awesome
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              AI Resume
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {navLink("/home", "Home")}
            {navLink("/resumes", "Resumes")}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Signed in as
            </span>
            <span className="text-sm font-bold text-slate-900">
              {user?.full_name ?? "—"}
            </span>
          </div>
          <Link
            to="/account"
            className="size-10 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-xl">
              account_circle
            </span>
          </Link>
          <button className="md:hidden text-slate-600">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
