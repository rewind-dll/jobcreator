import { useState, useEffect } from 'react';
import { fetchNui, useNuiEvent } from '../hooks/useNui';
import EditJobForm from './EditJobForm';

interface Job {
  name: string;
  label: string;
  whitelisted: boolean;
  grades: JobGrade[];
}

interface JobGrade {
  id: number;
  job_name: string;
  grade: number;
  name: string;
  label: string;
  salary: number;
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadJobs = async (): Promise<void> => {
    setLoading(true);
    const result = await fetchNui<Job[]>('getAllJobs', {}, [
      { name: 'police', label: 'LSPD', whitelisted: true, grades: [
        { id: 1, job_name: 'police', grade: 0, name: 'recruit', label: 'Recruit', salary: 1000 },
        { id: 2, job_name: 'police', grade: 1, name: 'officer', label: 'Officer', salary: 2000 }
      ]},
      { name: 'ambulance', label: 'EMS', whitelisted: true, grades: [
        { id: 3, job_name: 'ambulance', grade: 0, name: 'trainee', label: 'Trainee', salary: 900 }
      ]}
    ]);
    setJobs(result || []);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useNuiEvent('refreshJobs', () => {
    loadJobs();
    setSelectedJob(null);
  });

  const filteredJobs = jobs.filter(job => 
    job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedJob) {
    return <EditJobForm job={selectedJob} onBack={() => setSelectedJob(null)} />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-zinc-800/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white text-2xl font-bold">Manage Jobs</h2>
            <p className="text-zinc-400 text-sm mt-0.5">Edit existing jobs and their grades</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
            <span className="text-zinc-400">{jobs.length} jobs</span>
          </div>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs..."
            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-zinc-500 text-sm">Loading jobs...</div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <svg className="w-16 h-16 text-zinc-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-zinc-500">No jobs found</p>
            <p className="text-zinc-600 text-sm mt-1">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredJobs.map((job) => (
              <button
                key={job.name}
                onClick={() => setSelectedJob(job)}
                className="group bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 hover:border-cyan-500/30 transition-all duration-300 text-left hover:shadow-lg hover:shadow-cyan-900/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">{job.label}</h3>
                      <span className="text-zinc-600 text-sm font-mono">({job.name})</span>
                      {job.whitelisted && (
                        <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-0.5 rounded-full border border-cyan-500/30">
                          Whitelisted
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>{job.grades.length} grade{job.grades.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>${Math.min(...job.grades.map(g => g.salary))} - ${Math.max(...job.grades.map(g => g.salary))}</span>
                      </div>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-zinc-600 group-hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
