import { useContext } from "react";
import { KiinteistoContext } from "./KiinteistoContext";

export function useKiinteistot() {
  return useContext(KiinteistoContext);
}
