import { useEffect, useReducer } from "react";
import type { Kiinteisto, kiinteistoAction } from "../types";
import { KiinteistoContext, KiinteistoDispatchContext } from "./KiinteistoContext";

async function initData(dispatch: React.Dispatch<kiinteistoAction>) {
  const result = await window.electronFs.readFile()
  if (result) {
    const kiinteistot = JSON.parse(result) as Kiinteisto[];
    dispatch({ type: 'SET_DATA', payload: kiinteistot });
    console.log("Data initialized successfully");
  } else {
    console.error("Failed to initialize data");
  }
}

export function KiinteistoProvider({ children }: { children: React.ReactNode }) {
  const [kiinteistot, dispatch] = useReducer(dataReducer, [] as Kiinteisto[])

  useEffect(() => {
      initData(dispatch);
  }, []);

  return (
    <KiinteistoContext.Provider value={kiinteistot}>
      <KiinteistoDispatchContext.Provider value={{ dispatch }}>
        {children}
      </KiinteistoDispatchContext.Provider>
    </KiinteistoContext.Provider>
  );
}

function dataReducer(kiinteistot: Kiinteisto[], action: kiinteistoAction): Kiinteisto[] {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload;
    case 'GET_DATA_BY_ID':
      return [kiinteistot.find(k => k.id === action.id)].filter(Boolean) as Kiinteisto[];
    case 'ADD_DATA':
      return [...kiinteistot, action.payload];
    case 'UPDATE_DATA':
      return kiinteistot.map((item) => (item.id === action.payload.id ? action.payload : item));
    case 'REMOVE_DATA':
      return kiinteistot.filter((item) => item.id !== action.payload.id);
    default:
      throw new Error(`Unknown action type: ${action}`);
  }
}
