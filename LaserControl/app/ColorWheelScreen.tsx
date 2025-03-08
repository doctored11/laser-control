import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import WheelColorPicker from "react-native-wheel-color-picker";
import { useLaserController } from "./LaserController";

export default function ColorWheelScreen() {
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const { setLaserIntensity, intensity } = useLaserController();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    console.log("цвет меняется ", color);
    const rgb = hexToRgb(color);

  
  };

  // useEffect(() => {
  //   const hexColor = rgbToHex(intensity);
  //   if(hexColor)
  //   setSelectedColor(hexColor);
  //   console.log("эффект ", hexColor, intensity);
  // }, [intensity]);

  const handleColorConfirm = (color: string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return;
    Object.values(rgb).map((value, index) => {
      setLaserIntensity(index, value);
    });
    console.log("конфирм ", color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Выбери цвет</Text>
      <View style={styles.picker}>
        <WheelColorPicker
          color={selectedColor}
          onColorChange={handleColorChange}
          onColorChangeComplete={handleColorConfirm}
          thumbSize={50}
          swatches={false}
          sliderHidden={true}
          sliderSize={400}
        />
      </View>

      <Text style={styles.colorText}>
        Цвет: {selectedColor} (
        {Object.values(hexToRgb(selectedColor) || {}).join(", ")})
      </Text>
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

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (hex.length !== 6) {
    return null;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function rgbToHex(rgb: number[]): string {
  rgb.length = 3;

  const toHex = (x: number) => x.toString(16).padStart(2, "0");
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}
