import { Scenario, ScenarioFrame } from 'src/models/Scenario';
import { api } from '@/utils/api';

class ScenarioService {
  async getScenarios(): Promise<Scenario[]> {
    return await api<Scenario[]>('scenarios/all');
  }

  async getActiveScenarios(): Promise<Scenario[]> {
    return await api<Scenario[]>('scenarios/active');
  }

  async getScenariosWithMessage(): Promise<Scenario[]> {
    return await api<Scenario[]>('scenarios/getScenariosWithMessage');
  }

  async storeScenarioJobTriggers(): Promise<void> {
    return await api<void>('scenarios/storeScenarioJobTriggers');
  }

  async getScenarioById(scenarioId: string): Promise<Scenario> {
    return await api<Scenario>(`scenarios/getScenarioById/${scenarioId}`);
  }

  async getScenarioByDeviceId(deviceId: string): Promise<Scenario> {
    return await api<Scenario>(`scenarios/getScenarioByDeviceId/${deviceId}`);
  }

  async getScenarioByDeviceIdAndTag(deviceId: string, tag: string): Promise<Scenario> {
    return await api<Scenario>(`scenarios/getScenarioByDeviceIdAndTag/${deviceId}/${tag}`);
  }

  async createScenario(scenario: ScenarioFrame): Promise<Scenario> {
    return await api<Scenario>('scenarios/create', {
      method: 'POST',
      body: scenario,
    });
  }

  async muteScenario(scenarioId: string, minutes: number): Promise<Scenario> {
    return await api<Scenario>(`scenarios/mute/${scenarioId}/${minutes}`, {
      method: 'POST',
    });
  }

  async editScenario(scenario: Scenario): Promise<Scenario> {
    return await api<Scenario>('scenarios/edit', {
      method: 'PUT',
      body: scenario,
    });
  }

  async removeScenarioActiveAtHour(scenarioId: string): Promise<Scenario> {
    return await api<Scenario>(`scenarios/removeScenarioActiveAtHour/${scenarioId}`, {
      method: 'PUT',
    });
  }

  async removeScenarioActiveAtDay(scenarioId: string): Promise<Scenario> {
    return await api<Scenario>(`scenarios/removeScenarioActiveAtDay/${scenarioId}`, {
      method: 'PUT',
    });
  }

  async resolveScenario(scenarioId: string, scenarioLevel: string): Promise<Scenario> {
    return await api<Scenario>(`scenarios/resolveScenario/${scenarioId}/${scenarioLevel}`, {
      method: 'PUT',
    });
  }

  async setScenarioActiveAtHour(scenarioId: string, activeHours: Array<number>): Promise<Scenario> {
    return await api<Scenario>(`scenarios/setScenarioActiveAtHour/${scenarioId}/${activeHours}`, {
      method: 'PUT',
    });
  }

  async setScenarioActiveAtDay(scenarioId: string, activeDays: Array<number>): Promise<Scenario> {
    return await api<Scenario>(`scenarios/setScenarioActiveAtDay/${scenarioId}/${activeDays}`, {
      method: 'PUT',
    });
  }

  async deleteScenario(scenarioId: string): Promise<void> {
    await api(`scenarios/delete/${scenarioId}`, {
      method: 'DELETE',
    });
  }
}

export default new ScenarioService();
