import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import WheelColorPicker from "react-native-wheel-color-picker";

export default function ColorWheelScreen() {
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Выбери цвет</Text>
      <View style={styles.picker}>
        <WheelColorPicker
          color={selectedColor}
          onColorChange={handleColorChange}
          thumbSize={50}
          swatches={false}
          sliderHidden={true}
          sliderSize={400}
        />
      </View>
      <Text style={styles.colorText}>Цвет: {selectedColor}</Text>
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
  picker:{
    borderColor: "#191",
    borderWidth: 3,
    width:"100%",
    flex:1
  },
  text: { fontSize: 20, marginBottom: 20 },
  colorText: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
});
