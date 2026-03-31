import { useContext } from "react";
import { KiinteistoContext, KiinteistoDispatchContext } from "./KiinteistoContext";

export function useKiinteistot() {
  return useContext(KiinteistoContext);
}

export function useKiinteistoDispatch() {
  return useContext(KiinteistoDispatchContext);
}