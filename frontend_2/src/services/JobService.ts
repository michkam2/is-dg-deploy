import { api } from '@/utils/api';
import { Job, JobToRun } from 'src/models/Job';

class JobService {
  async getAllJobs(): Promise<Job[]> {
    return await api<Job[]>('/api/jobs/job/getAllJobs');
  }

  async getJobsOnDevice(deviceId: string): Promise<Job[]> {
    return await api<Job[]>(`/jobs/job/getAllJobsOnDevice/${deviceId}/NONE/NONE`);
  }

  async getJobById(deviceId: string): Promise<Job> {
    return await api<Job>(`/jobs/job/getJobById/${deviceId}`);
  }

  async runJobFromRecipe(jobToRun: JobToRun): Promise<Job> {
    return await api<Job>(
      `jobs/job/runJobFromRecipe/${jobToRun.recipeId}/${jobToRun.deviceId}/${jobToRun.repetitions}/${jobToRun.scheduledDays}/${jobToRun.scheduledHour}/${jobToRun.scheduledMinute}`,
      {
        method: 'POST',
      },
    );
  }

  async skipStep(jobId: string): Promise<Job> {
    return await api<Job>(`jobs/job/skipStep/${jobId}`, {
      method: 'PUT',
    });
  }

  async skipCycle(jobId: string): Promise<Job> {
    return await api<Job>(`jobs/job/skipCycle/${jobId}`, {
      method: 'PUT',
    });
  }

  async pauseJob(jobId: string): Promise<Job> {
    return await api<Job>(`jobs/job/pauseJob/${jobId}`, {
      method: 'PUT',
    });
  }

  async continueJob(jobId: string): Promise<Job> {
    return await api<Job>(`jobs/job/continueJob/${jobId}`, {
      method: 'PUT',
    });
  }

  async cancelJob(jobId: string): Promise<Job> {
    return await api<Job>(`jobs/job/cancelJob/${jobId}`, {
      method: 'PUT',
    });
  }
}

export default new JobService();
