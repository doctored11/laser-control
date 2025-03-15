import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useDeviceSync<T>(
  globalState: T,
  setLocalState: (state: T) => void
) {
  useFocusEffect(
    useCallback(() => {
      setLocalState(globalState);
    }, [globalState, setLocalState])
  );
}