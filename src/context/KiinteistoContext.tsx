import { createContext } from 'react';
import type { KiinteistoStore } from '../context/kiinteistoStore';

export const KiinteistoContext = createContext<KiinteistoStore | null>(null);
