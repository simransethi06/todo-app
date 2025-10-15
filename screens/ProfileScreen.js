// screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "tasks_v2";

export default function ProfileScreen({ route, navigation }) {
  const [tasks, setTasks] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const st = await AsyncStorage.getItem(STORAGE_KEY);
    const arr = st ? JSON.parse(st) : [];
    setTasks(arr);
    calculateStreak(arr);
  };

  const calculateStreak = (taskArr) => {
    // naive streak: number of consecutive days (from today backward) when at least one task was completed
    const doneDates = taskArr.filter(t => t.done && t.completedAt).map(t => new Date(t.completedAt).toDateString());
    const uniqueDays = [...new Set(doneDates)].sort((a,b) => new Date(b) - new Date(a));
    if (uniqueDays.length === 0) { setStreak(0); return; }

    let count = 0;
    let day = new Date();
    for (;;) {
      const dayStr = day.toDateString();
      if (uniqueDays.includes(dayStr)) { count++; day.setDate(day.getDate() - 1); }
      else break;
    }
    setStreak(count);
  };

  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>Your Profile</Text>
        <Text style={styles.small}>Tasks completed: <Text style={styles.highlight}>{done}</Text></Text>
        <Text style={styles.small}>Total tasks: <Text style={styles.highlight}>{total}</Text></Text>
        <Text style={styles.small}>Daily streak: <Text style={styles.highlight}>{streak} 🔥</Text></Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F5FB", justifyContent: "center" },
  card: {
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 18,
    padding: 26,
    shadowColor: "#cbb9ff",
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  name: { fontSize: 20, fontWeight: "700", color: "#3b3358", marginBottom: 12 },
  small: { color: "#7f739a", marginTop: 8 },
  highlight: { color: "#6c53e6", fontWeight: "700" },
  btn: { marginTop: 20, backgroundColor: "#EDE6FF", padding: 14, borderRadius: 12, alignItems: "center" },
  btnText: { color: "#5f4bd6", fontWeight: "700" },
});
