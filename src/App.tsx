import React, { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, Terminal, FileCode, Info, AlertTriangle, CheckCircle2, Copy, Download, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock Python Script Content for display
const pythonCode = `import hashlib
import json
import os
import logging

# --- CONFIGURATION ---
DB_FILE = "users.json"
LOG_FILE = "security.log"
MAX_ATTEMPTS = 3

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def login():
    username = input("Username: ")
    password = input("Password: ")
    users = load_users()
    
    if username not in users:
        print("Invalid credentials.")
        return

    user = users[username]
    if user["locked"]:
        print("Account locked for security reasons.")
        return

    if hash_password(password) == user["password"]:
        print("Login successful!")
        user["attempts"] = 0
    else:
        user["attempts"] += 1
        if user["attempts"] >= MAX_ATTEMPTS:
            user["locked"] = True
            print("Account locked.")
        else:
            print(f"Failed. Attempts left: {MAX_ATTEMPTS - user['attempts']}")
    save_users(users)`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'code' | 'docs'>('demo');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'error' | 'warn' | 'success' }[]>([]);
  const [copied, setCopied] = useState(false);

  const addLog = (msg: string, type: 'info' | 'error' | 'warn' | 'success') => {
    setLogs(prev => [{ msg, type }, ...prev].slice(0, 10));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    const correctUser = "admin";
    const correctPass = "password123";

    if (username === correctUser && password === correctPass) {
      addLog(`Successful login: User '${username}'`, 'success');
      setAttempts(0);
      alert("Login Successful! (Simulation)");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        addLog(`CRITICAL: Account '${username}' LOCKED after 3 failed attempts.`, 'error');
      } else {
        addLog(`Failed login attempt: User '${username}' (Attempt ${newAttempts})`, 'warn');
      }
    }
    setUsername('');
    setPassword('');
  };

  const resetSimulation = () => {
    setAttempts(0);
    setIsLocked(false);
    setLogs([]);
    addLog("System initialized. Waiting for login...", 'info');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase italic font-serif">IAM Security Lab</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50">Identity & Access Management Simulation</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('demo')}
            className={`px-4 py-2 text-xs uppercase tracking-widest border border-[#141414] transition-all ${activeTab === 'demo' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/10'}`}
          >
            Interactive Demo
          </button>
          <button 
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-xs uppercase tracking-widest border border-[#141414] transition-all ${activeTab === 'code' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/10'}`}
          >
            Python Source
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 text-xs uppercase tracking-widest border border-[#141414] transition-all ${activeTab === 'docs' ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/10'}`}
          >
            Documentation
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'demo' && (
            <motion.div 
              key="demo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {/* Login Terminal */}
              <div className="bg-[#141414] text-[#E4E3E0] rounded-lg overflow-hidden shadow-2xl border border-[#141414]">
                <div className="bg-[#2A2A2A] p-3 flex items-center justify-between border-b border-[#333]">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">iam_lockout.py - terminal</span>
                </div>
                
                <div className="p-8 font-mono text-sm min-h-[400px] flex flex-col justify-center">
                  <div className="mb-8 text-center">
                    <Lock className={`w-12 h-12 mx-auto mb-4 ${isLocked ? 'text-red-500' : 'text-emerald-500 opacity-50'}`} />
                    <h2 className="text-xl font-bold mb-2">System Access</h2>
                    <p className="text-xs opacity-50">Enter credentials to authenticate</p>
                  </div>

                  {isLocked ? (
                    <div className="text-center p-6 border border-red-500/30 bg-red-500/10 rounded">
                      <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-500 font-bold uppercase tracking-tighter">Account Locked</p>
                      <p className="text-[10px] mt-2 opacity-70">Security protocol triggered after 3 failed attempts.</p>
                      <button 
                        onClick={resetSimulation}
                        className="mt-6 px-4 py-2 bg-red-500 text-white text-[10px] uppercase tracking-widest hover:bg-red-600 transition-colors"
                      >
                        Reset System
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-6 max-w-xs mx-auto">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Username</label>
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-transparent border-b border-[#E4E3E0]/30 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="e.g. admin"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Password</label>
                        <input 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-transparent border-b border-[#E4E3E0]/30 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#E4E3E0] text-[#141414] font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors flex items-center justify-center gap-2"
                      >
                        Authenticate <ChevronRight className="w-4 h-4" />
                      </button>
                      {attempts > 0 && (
                        <p className="text-center text-[10px] text-red-400 uppercase tracking-widest">
                          Login failed. Attempts left: {3 - attempts}
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>

              {/* Security Logs */}
              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 border border-[#141414] shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif italic font-bold text-lg">Security Event Log</h3>
                    <Terminal className="w-5 h-5 opacity-30" />
                  </div>
                  <div className="space-y-3 font-mono text-[11px]">
                    {logs.length === 0 ? (
                      <p className="opacity-30 italic">No events recorded...</p>
                    ) : (
                      logs.map((log, i) => (
                        <div key={i} className={`p-2 border-l-2 flex justify-between items-center ${
                          log.type === 'success' ? 'border-emerald-500 bg-emerald-50' :
                          log.type === 'error' ? 'border-red-500 bg-red-50' :
                          log.type === 'warn' ? 'border-amber-500 bg-amber-50' :
                          'border-[#141414] bg-gray-50'
                        }`}>
                          <span>{log.msg}</span>
                          <span className="opacity-30 text-[9px]">{new Date().toLocaleTimeString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-[#141414] text-[#E4E3E0] p-6 rounded-lg">
                  <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-500" /> Security Concepts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-white/10 rounded">
                      <p className="text-[10px] font-bold uppercase mb-1">SHA-256 Hashing</p>
                      <p className="text-[9px] opacity-60">Passwords are never stored in plain text. They are converted into irreversible cryptographic hashes.</p>
                    </div>
                    <div className="p-3 border border-white/10 rounded">
                      <p className="text-[10px] font-bold uppercase mb-1">Account Lockout</p>
                      <p className="text-[9px] opacity-60">Prevents Brute Force attacks by disabling access after multiple failed attempts.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div 
              key="code"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-[#141414] text-[#E4E3E0] rounded-lg overflow-hidden border border-[#141414] shadow-2xl"
            >
              <div className="bg-[#2A2A2A] p-4 flex items-center justify-between border-b border-[#333]">
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs font-mono uppercase tracking-widest">iam_lockout.py</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-emerald-400/90">
                  <code>{pythonCode}</code>
                </pre>
              </div>
            </motion.div>
          )}

          {activeTab === 'docs' && (
            <motion.div 
              key="docs"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-12 border border-[#141414] shadow-xl max-w-4xl mx-auto"
            >
              <h2 className="text-4xl font-serif italic font-bold mb-8 border-b border-[#141414] pb-4">Project Documentation</h2>
              
              <section className="mb-10">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 text-emerald-600">Overview</h3>
                <p className="leading-relaxed mb-4">
                  This project demonstrates a fundamental Identity and Access Management (IAM) security control: <strong>Account Lockout Policy</strong> combined with <strong>Cryptographic Hashing</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-6 bg-gray-50 border border-[#141414]/10 rounded-xl">
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> Authentication</h4>
                    <p className="text-sm opacity-70">Verifying the identity of a user based on credentials (Username/Password).</p>
                  </div>
                  <div className="p-6 bg-gray-50 border border-[#141414]/10 rounded-xl">
                    <h4 className="font-bold mb-2 flex items-center gap-2"><Shield className="w-4 h-4" /> Authorization</h4>
                    <p className="text-sm opacity-70">Ensuring only authenticated users can access the system resources.</p>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 text-emerald-600">How to Run Locally</h3>
                <ol className="space-y-4 list-decimal list-inside text-sm leading-relaxed">
                  <li>Ensure you have <strong>Python 3.x</strong> installed.</li>
                  <li>Copy the code from the <strong>Python Source</strong> tab.</li>
                  <li>Create a new file named <code>iam_lockout.py</code> in VS Code.</li>
                  <li>Paste the code and save.</li>
                  <li>Open your terminal and run: <code className="bg-gray-100 px-2 py-1 rounded">python iam_lockout.py</code></li>
                  <li>Use default credentials: <strong>admin</strong> / <strong>password123</strong></li>
                </ol>
              </section>

              <section>
                <h3 className="text-xs uppercase tracking-[0.3em] font-bold mb-4 text-emerald-600">Example Output</h3>
                <div className="bg-[#141414] text-emerald-400 p-6 rounded font-mono text-xs leading-relaxed">
                  <p>Username: admin</p>
                  <p>Password: wrongpass</p>
                  <p className="text-red-400">Login failed. Attempts left: 2</p>
                  <p className="mt-4">...</p>
                  <p>Password: wrongpass</p>
                  <p className="text-red-500 font-bold">Account locked for security reasons.</p>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#141414] p-8 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-30">Cybersecurity Internship Mini Project &copy; 2026</p>
      </footer>
    </div>
  );
}
