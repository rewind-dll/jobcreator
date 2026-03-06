import { JobGrade } from './JobCreator';

interface GradeListProps {
  grades: JobGrade[];
  onUpdate: (id: string, updates: Partial<JobGrade>) => void;
  onRemove: (id: string) => void;
}

export default function GradeList({ grades, onUpdate, onRemove }: GradeListProps) {
  return (
    <div className="space-y-3">
      {grades.map((grade, index) => (
        <div
          key={grade.id}
          className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/10"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-2xl w-14 h-14 flex items-center justify-center font-bold text-xl shrink-0 border border-cyan-500/30 shadow-inner">
                {grade.grade}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Grade Name
                </label>
                <input
                  type="text"
                  value={grade.name}
                  onChange={(e) => onUpdate(grade.id, { name: e.target.value })}
                  placeholder="officer"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-950 transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Label
                </label>
                <input
                  type="text"
                  value={grade.label}
                  onChange={(e) => onUpdate(grade.id, { label: e.target.value })}
                  placeholder="Officer"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-950 transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">$</span>
                  <input
                    type="number"
                    value={grade.salary}
                    onChange={(e) => onUpdate(grade.id, { salary: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-950 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => onRemove(grade.id)}
              disabled={grades.length <= 1}
              className="text-red-400/70 hover:text-red-400 disabled:text-zinc-700 disabled:cursor-not-allowed transition-all mt-7 group/delete"
              title={grades.length <= 1 ? 'At least one grade is required' : 'Remove grade'}
            >
              <svg className="w-5 h-5 group-hover/delete:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
