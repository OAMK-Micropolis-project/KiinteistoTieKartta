import { useContext } from "react";
import { KiinteistoContext } from "./KiinteistoContext";

export function useKiinteistot() {
  const context = useContext(KiinteistoContext);
  if (!context) throw new Error("useKiinteisto must be used inside provider");
  return context;
}
