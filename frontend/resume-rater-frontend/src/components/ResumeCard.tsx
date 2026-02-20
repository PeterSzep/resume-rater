import { type ResumeStats } from "../types/resumeTypes";

const ResumeCard = ({ resume }: { resume: ResumeStats[] }) => {
  return (
    <tbody className="divide-y divide-slate-100">
      {resume.map((r) => (
        <tr key={r.id} className="hover:bg-white/50 transition-colors">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <span className="material-symbols-outlined text-primary text-xl">
                  description
                </span>
              </div>
              <span className="font-semibold text-slate-900">
                {r.name}
              </span>
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
            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default ResumeCard;
