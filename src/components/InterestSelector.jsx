export default function InterestSelector({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={`p-4 rounded-2xl border transition-all text-center text-sm font-medium ${
            selected.includes(opt)
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
