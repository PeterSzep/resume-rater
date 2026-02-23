import ResumeCard from "./ResumeCard";
import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import type { ResumeStats } from "../types/resumeTypes";
import { getLatestResumesForAccount, getResumesForAccount } from "../api/resumes";
import { getRatingsForResume } from "../api/ratings";

const ResumesTable = ({ isHome }: { isHome: boolean }) => {
  const { user } = useUser();

  const [resumes, setResumes] = useState<ResumeStats[]>([]);

  useEffect(() => {
    if (!user) return;

    async function fetchResumeStats() {
      const rawResumes = await (isHome
        ? getLatestResumesForAccount(user!)
        : getResumesForAccount(user!));

      return Promise.all(
        rawResumes.map(async (resume) => {
          const ratings = await getRatingsForResume(user!.user_id, resume.resume_id);
          const score = ratings[0]?.overall_score ?? 0;
          return {
            resume_id: resume.resume_id,
            name: resume.original_filename,
            date: new Date(resume.uploaded_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            score,
            status: (score >= 80 ? "Optimized" : "Needs Improvement") as ResumeStats["status"],
          };
        }),
      );
    }

    fetchResumeStats()
      .then(setResumes)
      .catch(() => setResumes([]));
  }, [user]);

  return (
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
          <ResumeCard
            resume={resumes}
            onDelete={(id) => setResumes((prev) => prev.filter((r) => r.resume_id !== id))}
          />
        </table>
      </div>
    </div>
  );
};

export default ResumesTable;
