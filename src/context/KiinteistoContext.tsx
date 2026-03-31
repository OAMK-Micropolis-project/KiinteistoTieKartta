import { createContext } from 'react';
import type { KiinteistoContextType } from './KiinteistoProvider';

export const KiinteistoContext = createContext<KiinteistoContextType>({
  kiinteistot: [],
  something: () => {},
});
