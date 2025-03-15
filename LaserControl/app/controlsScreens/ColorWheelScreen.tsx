import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import WheelColorPicker from "react-native-wheel-color-picker";
import { useLaser } from "../context/LaserContext";
import { useFocusEffect } from "expo-router";
import { debounce } from "../utils/debounce";
import { hexToRgb, rgbToHex } from "../utils/colorUtils";
import { useDeviceSync } from "../hooks/useDeviceSync";

export default function ColorWheelScreen() {
  const { setLaserIntensity, intensity } = useLaser();

  const [localColor, setLocalColor] = useState(rgbToHex(intensity));

  useDeviceSync(intensity, (state) => setLocalColor(rgbToHex(state)));

  const debouncedSetGlobal = useCallback(
    debounce((color: string) => {
      const rgb = hexToRgb(color);
      if (!rgb) return;
      Object.values(rgb).forEach((value, index) => {
        setLaserIntensity(index, value);
      });
    }, 300),
    []
  );

  const handleColorChange = (color: string) => {
    setLocalColor(color);
    debouncedSetGlobal(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Выбери цвет</Text>
      <View style={styles.picker}>
        <WheelColorPicker
          color={rgbToHex(intensity)}
          onColorChange={handleColorChange}
          // onColorChangeComplete={handleColorConfirm}
          thumbSize={50}
          swatches={false}
          sliderHidden={true}
          sliderSize={400}
        />
      </View>

      <Text style={styles.colorText}>
        Цвет: {rgbToHex(intensity)} (
        {Object.values(hexToRgb(rgbToHex(intensity)) || {}).join(", ")})
      </Text>
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
    borderColor: "#000",
    borderWidth: 3,
  },
  picker: {
    borderColor: "#191",
    borderWidth: 3,
    width: "100%",
    flex: 1,
  },
  text: { fontSize: 20, marginBottom: 20 },
  colorText: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
});
