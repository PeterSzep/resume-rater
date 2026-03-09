const CIRCUMFERENCE = 2 * Math.PI * 42;

const ScoreCard = ({score, resultText } : {score: number, resultText: string}) => {
  const offset = CIRCUMFERENCE * (1 - score / 100);
  return (
    <div className="p-8 rounded-2xl shadow-lg flex flex-col items-center text-center bg-white/70 backdrop-blur-md border border-white/40">
      <div className="relative size-40 flex items-center justify-center mb-4">
        <svg className="size-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-slate-200 stroke-current"
            cx="50"
            cy="50"
            fill="transparent"
            r="42"
            strokeWidth="8"
          />
          <circle
            className="text-primary stroke-current"
            cx="50"
            cy="50"
            fill="transparent"
            r="42"
            strokeLinecap="round"
            strokeWidth="8"
            style={{ strokeDasharray: CIRCUMFERENCE, strokeDashoffset: offset }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-slate-900 leading-none">
            {score}
          </span>
          <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            / 100
          </span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-1">
        {resultText}
      </h3>
    </div>
  );
};

export default ScoreCard;
