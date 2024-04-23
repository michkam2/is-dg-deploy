import { Module } from './Module';

interface Collection {
  uid: string;
  name: string;
  modules?: Array<Module>;
}

interface CollectionInput {
  name: string;
  modules?: Array<Module> | null;
}

export type { Collection, CollectionInput };
