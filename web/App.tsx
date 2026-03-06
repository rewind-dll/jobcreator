import { useState, useCallback } from 'react';
import { isDebug, useNuiEvent, fetchNui } from './hooks/useNui';
import CreateJob from './components/CreateJob';
import ManageJobs from './components/ManageJobs';

type Tab = 'create' | 'manage';

export default function App() {
  const [visible, setVisible] = useState(isDebug);
  const [activeTab, setActiveTab] = useState<Tab>('create');

  useNuiEvent('open', () => setVisible(true));
  useNuiEvent('close', () => setVisible(false));

  const handleClose = useCallback(() => {
    setVisible(false);
    fetchNui('close', {}, { success: true });
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-[760px] max-w-[92vw] max-h-[92vh] bg-zinc-950 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-800/50">
        <div className="relative px-8 py-6 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-1">
              <h1 className="text-white text-3xl font-bold tracking-tight">Job Manager</h1>
              <p className="text-zinc-400 text-sm">Create and manage jobs with ease</p>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-zinc-300 transition-all hover:rotate-90 duration-300 text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-800/50"
            >
              ×
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Job
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Jobs
              </div>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'create' ? <CreateJob /> : <ManageJobs />}
        </div>
      </div>
    </div>
  );
}
