import React, { useState, useCallback, useRef } from "react";
//TODO IP вынести или динамически определять [qr/ввод]
const ESP32_IP = "http://192.168.31.110";


interface LaserContextType {
  isLaserOn: boolean;
  intensity: number[];
  setLaserIntensity: (channel: number, value: number) => void;
  toggleLaser: () => Promise<void>;
}


const LaserContext = React.createContext<LaserContextType | undefined>(undefined);


export function LaserProvider({ children }: { children: React.ReactNode }) {
  const [isLaserOn, setIsLaserOn] = useState(false);
  const [intensity, setIntensity] = useState([0, 0, 0]);
  const debounceTimers = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);


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

  return (
    <LaserContext.Provider
      value={{ isLaserOn, intensity, setLaserIntensity, toggleLaser }}
    >
      {children}
    </LaserContext.Provider>
  );
}


export function useLaser(): LaserContextType {
  const context = React.useContext(LaserContext);
  if (!context) {
    throw new Error("нЕТ провайдера");
  }
  return context;
}