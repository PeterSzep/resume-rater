const StatsCard = ({icon, title, optionalText, text, outOf} : {icon: string, title: string, optionalText?: string, text: string, outOf?: string}) => {
  return (
    <div className="glass-card-light p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-primary bg-primary/10 p-2 rounded-lg material-symbols-outlined">
          {icon}
        </span>
        {optionalText && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">
            {optionalText}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mt-1">
        {text}{outOf && <span className="text-lg text-slate-400 font-normal">{outOf}</span>}
      </h3>
    </div>
  );
};

export default StatsCard;
