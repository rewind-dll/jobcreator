import { useState } from 'react';
import { fetchNui, useNuiEvent } from '../hooks/useNui';
import GradeList from './GradeList';
import { JobGrade } from './CreateJob';

interface EditJobFormProps {
  job: {
    name: string;
    label: string;
    whitelisted: boolean;
    grades: Array<{
      id: number;
      job_name: string;
      grade: number;
      name: string;
      label: string;
      salary: number;
    }>;
  };
  onBack: () => void;
}

export default function EditJobForm({ job, onBack }: EditJobFormProps) {
  const [jobLabel, setJobLabel] = useState(job.label);
  const [grades, setGrades] = useState<JobGrade[]>(
    job.grades.map(g => ({
      id: g.id.toString(),
      grade: g.grade,
      name: g.name,
      label: g.label,
      salary: g.salary
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useNuiEvent('jobDeleted', () => {
    onBack();
  });

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
    if (!jobLabel.trim() || grades.length === 0) {
      return;
    }

    setIsSubmitting(true);

    const jobData = {
      name: job.name, // Cannot change job name
      label: jobLabel,
      grades: grades.map(g => ({
        grade: g.grade,
        name: g.name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        label: g.label,
        salary: g.salary
      }))
    };

    await fetchNui('updateJob', jobData);
    setIsSubmitting(false);
  };

  const handleDelete = async (): Promise<void> => {
    setIsSubmitting(true);
    await fetchNui('deleteJob', { jobName: job.name });
    setIsSubmitting(false);
    setShowDeleteConfirm(false);
  };

  const isValid = jobLabel.trim().length > 0 && grades.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-zinc-800/50">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-white text-2xl font-bold">Edit Job</h2>
            <p className="text-zinc-400 text-sm mt-0.5">Modify job details and grades</p>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-cyan-500/20 text-cyan-400 rounded-xl px-3 py-1.5 text-sm font-mono border border-cyan-500/30">
              {job.name}
            </div>
            <span className="text-zinc-600 text-sm">Internal name (cannot be changed)</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        <div>
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

        <div className="pt-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h3 className="text-white text-xl font-bold">Grades & Ranks</h3>
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

      <div className="bg-zinc-900/50 px-8 py-5 flex items-center justify-between border-t border-zinc-800/50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting}
            className="text-red-400 hover:text-red-300 transition-colors text-sm font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Job
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
            <p className="text-zinc-400 text-sm font-medium">
              {grades.length} grade{grades.length !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white transition-all text-sm font-semibold disabled:cursor-not-allowed shadow-lg shadow-cyan-900/30 disabled:shadow-none"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-red-500/20 rounded-xl p-3">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-white text-lg font-bold mb-1">Delete Job</h3>
                <p className="text-zinc-400 text-sm">
                  Are you sure you want to delete <span className="text-white font-semibold">"{job.label}"</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:text-zinc-600 text-white transition-all text-sm font-semibold disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
