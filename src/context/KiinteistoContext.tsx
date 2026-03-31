import { createContext } from 'react';
import type { Kiinteisto } from '../types';

export const KiinteistoContext = createContext<Kiinteisto[]>([]);
