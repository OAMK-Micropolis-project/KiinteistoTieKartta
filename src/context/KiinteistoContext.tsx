import { createContext } from 'react';
import type { Kiinteisto, kiinteistoAction } from '../types';

export const KiinteistoContext = createContext<Kiinteisto[]>([]);
export const KiinteistoDispatchContext = createContext<{dispatch: React.Dispatch<kiinteistoAction>} | null>(null);
