import { useState, useRef, useCallback } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import Slider from "@react-native-community/slider";

const ESP32_IP = "http://192.168.31.110";  

export default function LaserControlScreen() {
  const [isLaserOn, setIsLaserOn] = useState(false);
  const [intensity, setIntensity] = useState([0, 0, 0]);
  const [currentValues, setCurrentValues] = useState(""); 

  
  const debounceTimers = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

  
  const handleSliderChange = useCallback((channel: number, value: number) => {
    
    setIntensity((prev) => {
      const newIntensity = [...prev];
      newIntensity[channel] = value;
      return newIntensity;
    });

    
    if (debounceTimers.current[channel]) {
      clearTimeout(debounceTimers.current[channel]!);
    }

    
    debounceTimers.current[channel] = setTimeout(async () => {
      try {
        const response = await fetch(`${ESP32_IP}/set_intensity?channel=${channel}&value=${value}`);
        if (!response.ok) throw new Error("Ошибка запроса");

        setCurrentValues(() => {
          const newValues = [...intensity];
          newValues[channel] = value;
          return newValues.join("|");
        });
      } catch (error) {
        Alert.alert("Ошибка", "Не удалось связаться с ESP32");
      }
    }, 500); 
  }, [intensity]);

  const toggleLaser = async () => {
    const newState = !isLaserOn;
    setIsLaserOn(newState);

    try {
      const response = await fetch(`${ESP32_IP}/toggle?state=${newState ? 1 : 0}`);
      if (!response.ok) throw new Error("Ошибка запроса");
    } catch (error) {
      Alert.alert("Ошибка", "Не удалось связаться с ESP32");
      setIsLaserOn(!newState); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Лазер {isLaserOn ? 'Включен' : 'Выключен'}</Text>
      <Switch value={isLaserOn} onValueChange={toggleLaser} />

      {["Лазер 1", "Лазер 2", "Лазер 3"].map((label, index) => (
        <View key={index}>
          <Text style={styles.text}>{label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            value={intensity[index]}
            onValueChange={(value) => handleSliderChange(index, value)}
          />
        </View>
      ))}

      <Text style={styles.currentValuesText}>
        Текущие значения: {currentValues}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, marginBottom: 10 },
  slider: { width: 300, height: 40, marginBottom: 20 },
  currentValuesText: { fontSize: 18, marginTop: 20, fontWeight: 'bold' }
});
