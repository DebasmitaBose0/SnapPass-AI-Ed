import crypto from 'crypto';
import { EventEmitter } from 'events';

const jobs = new Map();
const jobEvents = new EventEmitter();
jobEvents.setMaxListeners(200);

export function getJobEventEmitter() {
  return jobEvents;
}

export function createJob({ payload }) {
  const jobId = crypto.randomUUID();
  const job = {
    id: jobId,
    status: 'queued',
    progress: 0,
    stage: '',
    createdAt: Date.now(),
    payload,
    processedUrl: null,
    error: null,
  };
  jobs.set(jobId, job);
  jobEvents.emit(`job:${jobId}:update`, job);
  return jobId;
}

export function getJob(jobId) {
  return jobs.get(jobId) || null;
}

export function updateJob(jobId, patch) {
  const job = jobs.get(jobId);
  if (!job) return null;
  const next = { ...job, ...patch };
  jobs.set(jobId, next);
  jobEvents.emit(`job:${jobId}:update`, next);
  return next;
}

export function clearJob(jobId) {
  const job = jobs.get(jobId);
  if (job) {
    jobEvents.emit(`job:${jobId}:done`, null);
    jobEvents.removeAllListeners(`job:${jobId}:update`);
    jobEvents.removeAllListeners(`job:${jobId}:done`);
  }
  jobs.delete(jobId);
}

export function getAllJobs() {
  return Array.from(jobs.values()).map(j => ({
    id: j.id,
    status: j.status,
    progress: j.progress,
    stage: j.stage,
    createdAt: j.createdAt,
  }));
}

export function cleanupStaleJobs(maxAgeMs = 3600000) {
  const cutoff = Date.now() - maxAgeMs;
  for (const [id, job] of jobs) {
    if (job.createdAt < cutoff) {
      clearJob(id);
    }
  }
}

