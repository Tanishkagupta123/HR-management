import React from 'react';

export default function PerformanceManagement() {
  return (
    <div className="bg-white p-8 rounded-3xl border shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-violet-950 mb-2">Performance Management</h1>
        <p className="text-slate-600">Track KPIs, employee reviews, goal setting, promotion tracking, and feedback workflows.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-100 p-6 bg-slate-50 shadow-sm">
          <h2 className="text-xl font-bold text-violet-950 mb-3">KPI Tracking</h2>
          <p className="text-slate-600">Monitor employee performance against business goals and key performance indicators.</p>
        </section>

        <section className="rounded-3xl border border-slate-100 p-6 bg-slate-50 shadow-sm">
          <h2 className="text-xl font-bold text-violet-950 mb-3">Employee Reviews</h2>
          <p className="text-slate-600">Manage performance reviews, feedback sessions, and appraisal notes.</p>
        </section>

        <section className="rounded-3xl border border-slate-100 p-6 bg-slate-50 shadow-sm">
          <h2 className="text-xl font-bold text-violet-950 mb-3">Goal Setting</h2>
          <p className="text-slate-600">Define objectives and goals for employees, teams, and departments.</p>
        </section>

        <section className="rounded-3xl border border-slate-100 p-6 bg-slate-50 shadow-sm">
          <h2 className="text-xl font-bold text-violet-950 mb-3">Promotion Tracking</h2>
          <p className="text-slate-600">Track promotion cycles and candidate readiness at a glance.</p>
        </section>

        <section className="rounded-3xl border border-slate-100 p-6 bg-slate-50 shadow-sm">
          <h2 className="text-xl font-bold text-violet-950 mb-3">Feedback System</h2>
          <p className="text-slate-600">Capture peer and manager feedback for continuous performance improvement.</p>
        </section>
      </div>
    </div>
  );
}
