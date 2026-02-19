import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";
import { type LoginFieldErrors, loginSchema } from "../types/userTypes";
import { loginUser } from "../api/users";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const newErrors: LoginFieldErrors = {};

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const fieldErrors = z.flattenError(validation.error).fieldErrors;
      if (fieldErrors.email?.[0]) newErrors.email = fieldErrors.email[0];
      if (fieldErrors.password?.[0]) newErrors.password = fieldErrors.password[0];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setServerError(null);

    try {
      const result = await loginUser(email, password);
      //console.log("Login successful:", result);
      navigate("/home", { replace: true });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Login failed. Please try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row font-display bg-alice-blue dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">
      <div className="relative hidden lg:flex w-full lg:w-[45%] gradient-bg flex-col items-center justify-center p-8 overflow-hidden">
        <div className="abstract-shape bg-sky-blue w-72 h-72 top-[-15%] left-[-15%] rounded-full" />
        <div className="abstract-shape bg-alice-blue w-96 h-96 bottom-[-20%] right-[-10%] rounded-full" />

        <div className="z-10 w-full max-w-md">
          <div className="mb-8 flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30">
              <span className="material-symbols-outlined text-white text-2xl">
                rocket_launch
              </span>
            </div>
            <h2 className="text-white text-xl font-black tracking-tight">
              ResumeAI
            </h2>
          </div>

          <div className="glass-card rounded-2xl p-7 shadow-2xl">
            <h3 className="text-white text-3xl font-extrabold leading-tight mb-4">
              Welcome back. Your career awaits.
            </h3>
            <p className="text-alice-blue/90 text-base leading-relaxed font-medium">
              Log in to access your resume analysis, track your progress, and
              keep optimizing until you land the job you deserve.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5">
            {[
              "ATS Optimization",
              "Skill Gap Analysis",
              "Instant Scoring",
              "Industry Benchmarks",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white/95">
                <span className="material-symbols-outlined text-sky-blue bg-white/10 p-1 rounded-full text-sm">
                  check
                </span>
                <span className="text-sm font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-8 bg-white dark:bg-background-dark">
        <div className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500 text-2xl">
            rocket_launch
          </span>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            ResumeAI
          </span>
        </div>

        <div className="w-full max-w-[440px]">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white sm:text-3xl mb-2">
              Log in to your account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base">
              Continue optimizing your resume and career.
            </p>
          </div>

          <form className="space-y-3" action={handleSubmit}>
            <div>
              <label
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  mail
                </span>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-xl py-2.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.email ? "border-red-400" : "border-slate-200 dark:border-slate-800"}`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                  lock
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full bg-slate-50 dark:bg-slate-900/50 border rounded-xl py-2.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 ${errors.password ? "border-red-400" : "border-slate-200 dark:border-slate-800"}`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {serverError && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2.5">
                <span className="material-symbols-outlined text-red-500 text-base">error</span>
                <p className="text-red-600 dark:text-red-400 text-sm">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
            >
              Log In
              <span className="material-symbols-outlined text-xl">
                arrow_forward
              </span>
            </button>
          </form>

          <p className="mt-5 text-center text-slate-600 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/" className="text-blue-500 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
