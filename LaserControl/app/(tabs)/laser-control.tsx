import { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';

const ESP32_IP = "http://192.168.31.110";  

export default function LaserControlScreen() {
  const [isLaserOn, setIsLaserOn] = useState(false);

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 20, marginBottom: 10 },
});
