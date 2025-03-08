// SlidersControlScreen.tsx
import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useLaserController } from "./LaserController";

export default function SlidersControlScreen() {
  const { isLaserOn, intensity, setLaserIntensity, toggleLaser } = useLaserController();
  const [localColor, setLocalColor] = useState([0, 0, 0]);

  const handleSliderChange = (index: number, value: number) => {
    setLaserIntensity(index, value);
    const newRgbColor: [number, number, number] = [...localColor] as [number, number, number];
    newRgbColor[index] = value;
    setLocalColor(newRgbColor); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Лазер {isLaserOn ? "Включен" : "Выключен"}</Text>
      <Switch value={isLaserOn} onValueChange={toggleLaser} />

      {["Лазер 1", "Лазер 2", "Лазер 3"].map((label, index) => (
        <View key={index} style={styles.sliderContainer}>
          <Text style={styles.text}>{label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1} 
            value={localColor[index]}
            onValueChange={(value) => {
                handleSliderChange(index, value);
            }}
          />
          <Text style={styles.valueText}>{intensity[index]}</Text>
        </View>
      ))}
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
