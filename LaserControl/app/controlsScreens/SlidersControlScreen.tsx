import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useLaser } from "../context/LaserContext";
import { useFocusEffect } from "@react-navigation/native";
import { debounce } from "../utils/debounce"; 
import { useDeviceSync } from "../hooks/useDeviceSync";

export default function SliderControlScreen() {
  const { isLaserOn, intensity, setLaserIntensity, toggleLaser } = useLaser();
  const [localIntensity, setLocalIntensity] = useState([0, 0, 0]);

  useDeviceSync(intensity, setLocalIntensity);


  const debouncedSetGlobal = useCallback(
    debounce((index: number, value: number) => {
      setLaserIntensity(index, value);
    }, 300),
    []
  );

  const handleSliderChange = (index: number, value: number) => {
    setLocalIntensity(prev => {
      const newIntensity = [...prev];
      newIntensity[index] = value;
      return newIntensity;
    });
    
    debouncedSetGlobal(index, value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Лазер {isLaserOn ? "Включен" : "Выключен"}
      </Text>
      <Switch value={isLaserOn} onValueChange={toggleLaser} />

      {["Лазер 1", "Лазер 2", "Лазер 3"].map((label, index) => (
        <View key={index} style={styles.sliderContainer}>
          <Text style={styles.text}>{label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={localIntensity[index]}
            onValueChange={(value) => handleSliderChange(index, value)}
          />
          <Text style={styles.valueText}>{localIntensity[index]}</Text>
        </View>
      ))}
      <Text>Глобал цвет: {intensity.join(", ")}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sliderContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
  },
  slider: {
    width: 300,
    height: 40,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
});