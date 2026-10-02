import type { Credentials } from '../types/credentials';

const STORAGE_KEY = 'green-api-credentials';

let credentials: Credentials | null = null;

export function saveCredentials(next: Credentials): void {
  credentials = {
    idInstance: next.idInstance,
    apiTokenInstance: next.apiTokenInstance,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export function loadCredentials(): Credentials | null {
  if (credentials) {
    return credentials;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Credentials;
    if (!parsed.idInstance || !parsed.apiTokenInstance) {
      return null;
    }

    credentials = {
      idInstance: parsed.idInstance,
      apiTokenInstance: parsed.apiTokenInstance,
    };
    return credentials;
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  credentials = null;
  localStorage.removeItem(STORAGE_KEY);
}
