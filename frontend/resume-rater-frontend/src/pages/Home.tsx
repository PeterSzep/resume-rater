import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import ResumeCard from "../components/ResumeCard";
import UploadResume from "../components/UploadResume";
import { type ResumeStats } from "../types/resumeTypes";
import { getResumesForAccount, getLatestResumesForAccount } from "../api/resumes";
import { getRatingsForAccount, getRatingsForResume } from "../api/ratings";


const Home = () => {
  const { user } = useUser();

  const [latestResumes, setLatestResumes] = useState<ResumeStats[]>([]);
  const [highestScore, setHighestScore] = useState<number | "N/A">("N/A");
  const [averageScore, setAverageScore] = useState<number | "N/A">("N/A");
  const [resumeCount, setResumeCount] = useState<number | "N/A">("N/A");
  const [ratingsCount, setRatingsCount] = useState<number | "N/A">("N/A");

  useEffect(() => {
    if (!user) return;

    getResumesForAccount(user)
      .then((resumes) => {
        setResumeCount(resumes.length);
      })
      .catch(() => setResumeCount("N/A"));
    
    getLatestResumesForAccount(user).then(async (resumes) => {
      const resumeStats = await Promise.all(
        resumes.map(async (resume) => {
          const ratings = await getRatingsForResume(user.user_id, resume.resume_id);
          const latest = ratings[0];
          const score = latest?.overall_score ?? 0;
          return {
            resume_id: resume.resume_id,
            name: resume.original_filename,
            date: new Date(resume.uploaded_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            score,
            status: (score >= 80 ? "Optimized" : "Needs Improvement") as ResumeStats["status"],
          };
        })
      );
      setLatestResumes(resumeStats);
    }).catch(() => setLatestResumes([]));

    getRatingsForAccount(user)
      .then((ratings) => {
        if (ratings.length === 0) {
          setHighestScore("N/A");
          setAverageScore("N/A");
          setRatingsCount("N/A");
        } else {
          const max = Math.max(...ratings.map((r) => r.overall_score));
          setHighestScore(max);
          const avg = ratings.reduce((sum, r) => sum + r.overall_score, 0) / ratings.length;
          setAverageScore(avg);
          setRatingsCount(ratings.length);
        }
      })
      .catch(() => setHighestScore("N/A"));
  }, [user]);

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
              text={String(highestScore)}
              outOf="/100"
            />

            <StatsCard icon="description" title="Total Resumes" text={String(resumeCount)} />

            <StatsCard icon="fact_check" title="Reviews Completed" text={String(ratingsCount)} />

            <StatsCard
              icon="analytics"
              title="Average Score"
              text={String(averageScore)}
              optionalText="Overall"
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
                  <ResumeCard resume={latestResumes} />
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

export default Home;
