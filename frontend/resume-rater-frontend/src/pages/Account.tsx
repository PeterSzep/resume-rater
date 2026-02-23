import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import { deleteUser } from "../api/users";

const Account = () => {
  const { user, logout } = useUser();

  const formattedLastLogin = user?.last_login
    ? new Date(user.last_login).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const handleDeleteAccount = async () => {
    if (user) {
      try {
        await deleteUser(user);
        logout(true);
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again later.");
      }
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden main-gradient font-display">
      <Navbar user={user} />

      <main className="flex-1 flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-[640px] flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="text-slate-500">
              Update your profile settings and manage your account security.
            </p>
          </div>

          {/* Card */}
          <div className="glass-card-light rounded-xl p-8 shadow-xl shadow-primary/5">
            {/* Account Details */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">
                  person
                </span>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Account Details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5 border-b border-slate-200 pb-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <p className="text-base font-medium text-slate-900">
                    {user?.full_name ?? "—"}
                  </p>
                </div>

                <div className="space-y-1.5 border-b border-slate-200 pb-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <div className="flex justify-between items-center">
                    <p className="text-base font-medium text-slate-900">
                      {user?.email ?? "—"}
                    </p>
                    <span className="material-symbols-outlined text-green-500 text-sm">
                      verified
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 border-b border-slate-200 pb-4">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Last Login
                  </label>
                  <p className="text-base font-medium text-slate-900">
                    {formattedLastLogin}
                  </p>
                </div>
              </div>
            </section>

            {/* Sign Out */}
            <div className="mt-10">
              <button
                onClick={() => logout(false)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all duration-200 group"
              >
                <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">
                  logout
                </span>
                Sign Out
              </button>
            </div>

            {/* Divider */}
            <div className="my-10 border-t-2 border-dashed border-slate-200" />

            {/* Danger Zone */}
            <section className="rounded-lg bg-red-50/50 border border-red-100 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="material-symbols-outlined text-red-600">
                  warning
                </span>
                <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Once you delete your account, there is no going back. Please be
                certain. All your AI-generated resume ratings will be
                permanently removed.
              </p>
              <button
                className="w-full bg-glaucous text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-900 transition-all shadow-lg shadow-red-500/10"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </section>
          </div>
        </div>
      </main>

      <div className="fixed -bottom-24 -left-24 size-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed top-1/2 -right-24 size-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -z-10" />
    </div>
  );
};

export default Account;
