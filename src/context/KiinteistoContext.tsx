import { createContext } from 'react';
import type { KiinteistoStore } from '../types';

export const KiinteistoContext = createContext<KiinteistoStore | null>(null);
