import { api } from '@/utils/api';
import { Collection, CollectionInput } from '@/models/Collection';

class CollectionService {
  async getCollections(): Promise<Collection[]> {
    let collections = await api<Collection[]>('collection');

    // Filter out null modules
    collections = collections.map((collection) => {
      if (collection.modules) {
        collection.modules = collection.modules.filter((module) => module !== null);
        // Additional filter for null devices in each module
        collection.modules = collection.modules.map((module) => {
          if (module.devices) {
            module.devices = module.devices.filter((device) => device !== null && device.deactivated === false);
          }
          return module;
        });
      }
      return collection;
    });

    return collections;
  }

  async getCollection(uid: string): Promise<Collection> {
    const collection = await api<Collection>(`collection/${uid}`);

    if (collection.modules) {
      collection.modules = collection.modules.filter((module) => module !== null);

      collection.modules = collection.modules.map((module) => {
        if (module.devices) {
          module.devices = module.devices.filter((device) => device !== null && device.deactivated === false);
        }
        return module;
      });
    }

    return collection;
  }

  async createCollection(collection: CollectionInput): Promise<Collection> {
    return await api<Collection>('collection/create', {
      method: 'POST',
      body: collection,
    });
  }

  async updateCollection(uid: string, collection: CollectionInput): Promise<Collection> {
    collection.modules = null;
    return await api<Collection>(`collection/update/${uid}`, {
      method: 'PUT',
      body: collection,
    });
  }

  async deleteCollection(uid: string): Promise<Collection> {
    return await api<Collection>(`collection/delete/${uid}`, {
      method: 'DELETE',
    });
  }
}

export default new CollectionService();
