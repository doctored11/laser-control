import React, { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, Switch, StyleSheet, Alert } from "react-native";
import Slider from "@react-native-community/slider";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ColorWheelScreen from "../ColorWheelScreen";

const Tab = createMaterialTopTabNavigator();
const ESP32_IP = "http://192.168.31.110";


function SlidersScreen() {
  const [isLaserOn, setIsLaserOn] = useState(false);
  const [intensity, setIntensity] = useState([0, 0, 0]);
  const [currentValues, setCurrentValues] = useState("0|0|0");

  const debounceTimers = useRef<(NodeJS.Timeout | null)[]>([null, null, null]);

  
  useEffect(() => {
    setCurrentValues(intensity.join("|"));
  }, [intensity]);


  useEffect(() => {
    intensity.forEach((value, channel) => {
      if (debounceTimers.current[channel]) {
        clearTimeout(debounceTimers.current[channel]!);
      }

      debounceTimers.current[channel] = setTimeout(async () => {
        console.log("отправили ", value, "|", channel, " _", Date.now());
        await fetch(`${ESP32_IP}/set_intensity?channel=${channel}&value=${value}`);
      }, 500);
    });

   
    return () => {
      debounceTimers.current.forEach((timer) => {
        if (timer) clearTimeout(timer);
      });
    };
  }, [intensity]);

  const handleSliderChange = useCallback((channel: number, value: number) => {
    console.log("ИЗМЕНИЛИ НА ", value);
    setIntensity((prev) => {
      const newIntensity = [...prev];
      newIntensity[channel] = value; 
      return newIntensity;
    });

   
    if (debounceTimers.current[channel]) {
      clearTimeout(debounceTimers.current[channel]!);
    }
  }, []);

  const handleSlidingComplete = useCallback((channel: number, value: number) => {
    console.log("ЗАКОНЧИЛИ НА ", value);
    setIntensity((prev) => {
      const newIntensity = [...prev];
      newIntensity[channel] = value; 
      return newIntensity;
    });
  }, []);

  const toggleLaser = async () => {
    const newState = !isLaserOn;
    setIsLaserOn(newState);
    await fetch(`${ESP32_IP}/toggle?state=${newState ? 1 : 0}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Лазер {isLaserOn ? "Включен" : "Выключен"}
      </Text>
      <Switch value={isLaserOn} onValueChange={toggleLaser} />

      {["Лазер 1", "Лазер 2", "Лазер 3"].map((label, index) => (
        <View key={index}>
          <Text style={styles.text}>{label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
           
            onValueChange={(value) => handleSliderChange(index, value)}
            onSlidingComplete={(value) => handleSlidingComplete(index, value)}
          />
        </View>
      ))}

      <Text style={styles.currentValuesText}>
        Текущие значения: {currentValues}
      </Text>
    </View>
  );
}




export default function LaserControlScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#6200ea" },
        tabBarLabelStyle: { fontSize: 16, color: "white" },
        tabBarIndicatorStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen name="Ползунки" component={SlidersScreen} />
      <Tab.Screen name="Световой круг" component={ColorWheelScreen} />
    </Tab.Navigator>
    // <SlidersScreen></SlidersScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: { fontSize: 20, marginBottom: 10 },
  slider: { width: 300, height: 40, marginBottom: 20 },
  currentValuesText: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
});
