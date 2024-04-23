import { Command } from './Command';
import { DataPoint } from './DataPoint';
import { JobStatusEnum } from './JobStatusEnum';

interface Job {
  uid: string;
  deviceId: string;
  name: string;
  noOfCmds: number;
  noOfReps: number;
  status: JobStatus;
  currentStatus: JobStatusEnum;
  commands: Command[];
  toCancel: boolean;
  paused: boolean;
  createdAt: number;
  startedAt: number;
  finishedAt: number;
  scheduledDays: number[];
  scheduledHour: number;
  scheduledMinute: number;
}

interface JobDevice extends Job {
  deviceName: string;
}

interface JobStatus {
  uid: string;
  jobId: string;
  retCode: JobStatusEnum;
  code: JobStatusEnum;
  currentStep: number;
  totalSteps: number;
  currentCycle: number;
  data: DataPoint[];
  createdAt: number;
  lastUpdated: Date;
}

interface JobToRun {
  recipeId: string;
  deviceId: string;
  repetitions: number;
  scheduledDays: number[];
  scheduledHour: number;
  scheduledMinute: number;
}

export type { Job, JobStatus, JobToRun, JobDevice };
