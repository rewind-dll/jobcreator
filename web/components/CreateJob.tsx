import { useState } from 'react';
import { fetchNui } from '../hooks/useNui';
import GradeList from './GradeList';

export interface JobGrade {
  id: string;
  grade: number;
  name: string;
  label: string;
  salary: number;
}

export default function CreateJob() {
  const [jobName, setJobName] = useState('');
  const [jobLabel, setJobLabel] = useState('');
  const [grades, setGrades] = useState<JobGrade[]>([
    { id: '1', grade: 0, name: 'recruit', label: 'Recruit', salary: 0 }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddGrade = () => {
    const newGrade: JobGrade = {
      id: Date.now().toString(),
      grade: grades.length,
      name: `grade${grades.length}`,
      label: `Grade ${grades.length}`,
      salary: 0
    };
    setGrades([...grades, newGrade]);
  };

  const handleRemoveGrade = (id: string) => {
    if (grades.length <= 1) return;
    const filtered = grades.filter(g => g.id !== id);
    const reindexed = filtered.map((g, index) => ({ ...g, grade: index }));
    setGrades(reindexed);
  };

  const handleUpdateGrade = (id: string, updates: Partial<JobGrade>) => {
    setGrades(grades.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const handleSubmit = async (): Promise<void> => {
    if (!jobName.trim() || !jobLabel.trim()) {
      return;
    }

    if (grades.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const jobData = {
      name: jobName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      label: jobLabel,
      grades: grades.map(g => ({
        grade: g.grade,
        name: g.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        label: g.label,
        salary: g.salary
      }))
    };

    await fetchNui('createJob', jobData);
    setIsSubmitting(false);
  };

  const isValid = jobName.trim().length > 0 && jobLabel.trim().length > 0 && grades.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
              Job Name
            </label>
            <input
              type="text"
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="police"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900 transition-all"
            />
            <p className="text-zinc-500 text-xs mt-2 ml-1">
              Internal identifier (lowercase, no spaces)
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block text-zinc-300 text-xs font-semibold uppercase tracking-wider mb-2.5">
              Job Label
            </label>
            <input
              type="text"
              value={jobLabel}
              onChange={(e) => setJobLabel(e.target.value)}
              placeholder="Los Santos Police Department"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900 transition-all"
            />
            <p className="text-zinc-500 text-xs mt-2 ml-1">
              Display name visible to players
            </p>
          </div>
        </div>

        <div className="pt-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-white text-xl font-bold">Grades & Ranks</h2>
              <p className="text-zinc-500 text-sm mt-0.5">Configure hierarchy and compensation</p>
            </div>
            <button
              onClick={handleAddGrade}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-cyan-900/30 hover:shadow-cyan-900/50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Grade
            </button>
          </div>

          <GradeList
            grades={grades}
            onUpdate={handleUpdateGrade}
            onRemove={handleRemoveGrade}
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 px-8 py-5 flex items-center justify-end gap-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 mr-auto">
          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
          <p className="text-zinc-400 text-sm font-medium">
            {grades.length} grade{grades.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white transition-all text-sm font-semibold disabled:cursor-not-allowed shadow-lg shadow-cyan-900/30 disabled:shadow-none"
        >
          {isSubmitting ? 'Creating...' : 'Create Job'}
        </button>
      </div>
    </div>
  );
}
