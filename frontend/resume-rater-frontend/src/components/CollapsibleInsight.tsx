const CollapsibleInsight = ({ title, icon, items, variant = "strength" }: { title: string; icon: string; items: { text: string; icon: string }[]; variant?: "strength" | "weakness" }) => {
  const itemBg = variant === "weakness" ? "bg-red-100/30 border-red-100" : "bg-emerald-50/30 border-emerald-100";
  return (
    <details
      className="group bg-white border border-slate-200 rounded-xl overflow-hidden"
      open
    >
      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
        <div className="flex items-center gap-3">
          <span className={`material-symbols-outlined ${icon} ${variant} p-1.5 rounded-lg text-xl`}>
            {icon}
          </span>
          <span className="font-bold text-slate-800">{title}</span>
        </div>
        <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">
          expand_more
        </span>
      </summary>
      <div className="px-4 pb-4 space-y-3">
        <div className="flex flex-col gap-3">
            {items.map((item, index) => (
              <div key={index} className={`flex gap-3 items-start p-2 rounded-lg border ${itemBg}`}>
                <span className={`material-symbols-outlined ${item.icon} text-sm mt-1`}>
                  {item.icon}
                </span>
                <p className="text-xs text-slate-700 leading-normal font-medium">
                  {item.text}
                </p>
              </div>
            ))}
        </div>
      </div>
    </details>
  );
};

export default CollapsibleInsight;
