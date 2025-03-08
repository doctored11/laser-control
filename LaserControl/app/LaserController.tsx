import { useState, useRef, useCallback, useEffect } from "react";

const ESP32_IP = "http://192.168.31.110";

export function useLaserController() {
  const [isLaserOn, setIsLaserOn] = useState(false);
  const [intensity, setIntensity] = useState([0, 0, 0]);
  const debounceTimers = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);
  
  useEffect(()=>{console.log('родительский эффект, ', intensity)},[intensity])

  const sendIntensityUpdate = useCallback((channel: number, value: number) => {
    if (debounceTimers.current[channel]) {
      clearTimeout(debounceTimers.current[channel]!);
    }

    debounceTimers.current[channel] = setTimeout(async () => {
      console.log(`Отправка на ESP32 -> Канал: ${channel}, Значение: ${value}`);
      await fetch(`${ESP32_IP}/set_intensity?channel=${channel}&value=${value}`);
    }, 300);
  }, []);

  const setLaserIntensity = useCallback((channel: number, value: number) => {
    setIntensity((prev) => {
      const newIntensity = [...prev];
      newIntensity[channel] = Math.round(value); 
      return newIntensity;
    });
    sendIntensityUpdate(channel, value);
  }, [sendIntensityUpdate]);

  const toggleLaser = async () => {
    const newState = !isLaserOn;
    setIsLaserOn(newState);
    await fetch(`${ESP32_IP}/toggle?state=${newState ? 1 : 0}`);
  };

  return {
    isLaserOn,
    intensity,
    setLaserIntensity,
    toggleLaser,
  };
}
