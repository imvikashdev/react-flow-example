import { WorkFlowDto } from '@/store/workflow';
import { openDB } from 'idb';

async function openDatabase() {
  return openDB('flow-craft', 1, {
    upgrade(db) {
      db.createObjectStore('workflows');
    },
  });
}

export async function saveWorkflows(workflows: Array<WorkFlowDto>) {
  const db = await openDatabase();
  const tx = db.transaction('workflows', 'readwrite');
  const result = await tx.store.put(workflows, 'workflows');
  if (result) {
    return true;
  } else {
    return false;
  }
}

export async function getWorkflows() {
  const db = await openDatabase();
  const tx = db.transaction('workflows', 'readonly');
  return tx.store.get('workflows');
}
