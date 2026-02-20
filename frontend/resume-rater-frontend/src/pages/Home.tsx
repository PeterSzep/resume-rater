import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ResumeCard from "../components/ResumeCard";
import UploadResume from "../components/UploadResume";
import { type ResumeStats } from "../types/resumeTypes";

{/*Mock Resume Data*/ }
const recentResumes: ResumeStats[] = [
  {
    id: 1,
    name: "Software Engineer Senior Role",
    date: "Oct 24, 2023",
    status: "Optimized",
    score: 98,
  },
  {
    id: 2,
    name: "Product Manager CV - Final",
    date: "Oct 22, 2023",
    status: "Needs Improvement",
    score: 65,
  },
  {
    id: 3,
    name: "Data Scientist Draft 2",
    date: "Oct 20, 2023",
    status: "Optimized",
    score: 82,
  },
];

export default function Home() {
  const { user } = useUser();

  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden main-gradient font-display">
      {/* Navbar */}
      <Navbar user={user} />

      {/* Main */}
      <main className="flex-1 px-6 lg:px-20 py-10">
        <div className="mx-auto max-w-7xl">
          {/* Welcome */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {firstName}!
            </h2>
            <p className="text-slate-500 mt-1">
              Here's how your resumes are performing today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <StatsCard
              icon="military_tech"
              title="Highest Score"
              optionalText="+2.4%"
              text="98"
              outOf="/100"
            />

            <StatsCard icon="description" title="Total Resumes" text="12" />

            <StatsCard icon="fact_check" title="Reviews Completed" text="45" />

            <StatsCard
              icon="analytics"
              title="Average Score"
              text="82"
              optionalText="Overral"
              outOf="/100"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Recent Activity
              </h2>
              <button className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View all resumes
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>

            <div className="glass-card-light rounded-xl overflow-hidden shadow-sm border border-primary/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Resume Name
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Date Reviewed
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        AI Score
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <ResumeCard resume={recentResumes} />
                </table>
              </div>
            </div>
          </div>
          <UploadResume />
        </div>
      </main>
    </div>
  );
}
