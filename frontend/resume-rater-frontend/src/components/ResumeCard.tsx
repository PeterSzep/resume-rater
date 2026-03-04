import { useEffect, useRef, useState } from "react";
import { type ResumeStats } from "../types/resumeTypes";
import { useUser } from "../context/UserContext";
import { deleteResume } from "../api/resumes";
import { BASE_URL } from "../api";

const ResumeCard = ({ resume, onDelete }: { resume: ResumeStats[]; onDelete: (resumeId: number) => void }) => {
  const { user } = useUser();

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (resumeId: number, accountId: number) => {
    try {
      await deleteResume(accountId, resumeId);
      onDelete(resumeId);
      window.location.reload();
    } catch (error) {
      alert("Failed to delete resume: " + (error as Error).message);
    }
  }

  return (
    <tbody className="divide-y divide-slate-100">
      {resume.map((r) => (
        <tr key={r.resume_id} className="hover:bg-white/50 transition-colors">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <span className="material-symbols-outlined text-primary text-xl">
                  description
                </span>
              </div>
              <span className="font-semibold text-slate-900 max-w-[200px] truncate" title={r.name}>{r.name}</span>
            </div>
          </td>
          <td className="px-6 py-4 text-sm text-slate-500">{r.date}</td>
          <td className="px-6 py-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                r.status === "Optimized"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {r.status}
            </span>
          </td>
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-32 bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full"
                  style={{ width: `${r.score}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-900">
                {r.score}
              </span>
            </div>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="relative inline-block" ref={openMenuId === r.resume_id ? menuRef : undefined}>
              <button
                onClick={() => setOpenMenuId(openMenuId === r.resume_id ? null : r.resume_id)}
                className="p-2 text-slate-400 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>

              {openMenuId === r.resume_id && (
                <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-100 z-10 py-1">
                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                      window.open(`${BASE_URL}/resumes/${r.resume_id}/file`, "_blank");
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      visibility
                    </span>
                    Show Resume
                  </button>
                  <button
                    onClick={() => setOpenMenuId(null)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      rate_review
                    </span>
                    Review Again
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      setOpenMenuId(null);
                      handleDelete(r.resume_id, user!.user_id);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default ResumeCard;
