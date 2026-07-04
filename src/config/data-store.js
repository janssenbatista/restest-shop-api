import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const storeFilePath = resolve(__dirname, '../data/store.json');

const emptyStore = {
  users: [],
  products: [],
};

function normalizeStore(store) {
  return {
    users: Array.isArray(store?.users) ? store.users : [],
    products: Array.isArray(store?.products) ? store.products : [],
  };
}

async function ensureStoreFile() {
  await mkdir(dirname(storeFilePath), { recursive: true });

  try {
    await readFile(storeFilePath, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeFile(storeFilePath, `${JSON.stringify(emptyStore, null, 2)}\n`);
      return;
    }

    throw err;
  }
}

export async function readStore() {
  await ensureStoreFile();

  const raw = await readFile(storeFilePath, 'utf8');
  return normalizeStore(JSON.parse(raw));
}

export async function writeStore(store) {
  await ensureStoreFile();

  const normalizedStore = normalizeStore(store);
  await writeFile(storeFilePath, `${JSON.stringify(normalizedStore, null, 2)}\n`);
}

export async function modifyStore(mutator) {
  const currentStore = await readStore();
  const nextStore = (await mutator(structuredClone(currentStore))) ?? currentStore;

  await writeStore(nextStore);
  return normalizeStore(nextStore);
}