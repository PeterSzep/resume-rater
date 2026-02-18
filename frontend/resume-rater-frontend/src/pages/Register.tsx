import { Link } from 'react-router-dom'
import { regsiterUser } from '../api/users';

export default function Register() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
      const result = await regsiterUser(name, email, password);
      console.log('Registration successful:', result);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row font-display bg-alice-blue dark:bg-background-dark text-slate-900 dark:text-white overflow-x-hidden">

      <div className="relative hidden lg:flex w-full lg:w-[45%] gradient-bg flex-col items-center justify-center p-12 overflow-hidden">
        <div className="abstract-shape bg-sky-blue w-72 h-72 top-[-15%] left-[-15%] rounded-full" />
        <div className="abstract-shape bg-alice-blue w-96 h-96 bottom-[-20%] right-[-10%] rounded-full" />

        <div className="z-10 w-full max-w-md">
          <div className="mb-12 flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md p-2.5 rounded-xl border border-white/30">
              <span className="material-symbols-outlined text-white text-3xl">rocket_launch</span>
            </div>
            <h2 className="text-white text-2xl font-black tracking-tight">ResumeAI</h2>
          </div>

          <div className="glass-card rounded-2xl p-10 shadow-2xl">
            <h3 className="text-white text-4xl font-extrabold leading-tight mb-6">
              Increase your interview callbacks by 3x.
            </h3>
            <p className="text-alice-blue/90 text-xl leading-relaxed font-medium">
              Our advanced AI engine analyzes over 50 data points to instantly align your resume with top-tier industry standards.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8">
            {['ATS Optimization', 'Skill Gap Analysis', 'Instant Scoring', 'Industry Benchmarks'].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/95">
                <span className="material-symbols-outlined text-sky-blue bg-white/10 p-1 rounded-full text-sm">check</span>
                <span className="text-base font-semibold">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-12 md:p-16 bg-white dark:bg-background-dark">

        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-blue text-2xl">rocket_launch</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">ResumeAI</span>
        </div>

        <div className="w-full max-w-[440px]">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white sm:text-4xl mb-3">
              Land Your Dream Job with AI
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Create your account to start optimizing your career.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">account_circle</span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2" htmlFor="retype-password">
                  Retype Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_reset</span>
                  <input
                    id="retype-password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-blue focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

      
            <button
              type="submit"
              className="w-full bg-slate-blue hover:bg-slate-blue/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-blue/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              Create Account
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </form>

          <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-blue font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
