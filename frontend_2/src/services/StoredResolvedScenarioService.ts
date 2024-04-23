import { StoredResolvedScenario } from 'src/models/StoredResolvedScenario';
import { api } from '@/utils/api';

class StoredResolvedScenarioService {
  async getStoredResolvedScenarioDataByMessageAction(): Promise<StoredResolvedScenario> {
    return await api<StoredResolvedScenario>('storedResolvedScenario/message');
  }

  async getStoredResolvedScenarioDataByJobAction(): Promise<StoredResolvedScenario> {
    return await api<StoredResolvedScenario>('storedResolvedScenario/job');
  }
}

export default new StoredResolvedScenarioService();
