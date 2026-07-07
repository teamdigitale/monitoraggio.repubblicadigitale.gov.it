import axios from 'axios';
import type { PrimoServizioCittadino, RicercaMultiplaResult } from './types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const api = axios.create({ baseURL });

export async function ricercaSingola(
  criterio: string
): Promise<PrimoServizioCittadino[]> {
  const { data } = await api.post<PrimoServizioCittadino[]>('/cittadino/ricerca', {
    criterioRicerca: criterio,
  });
  return data;
}

export async function ricercaMultipla(
  criteri: string[]
): Promise<RicercaMultiplaResult> {
  const { data } = await api.post<RicercaMultiplaResult>(
    '/cittadino/ricerca-multipla',
    { criterioRicercaMultipla: criteri }
  );
  return data;
}
