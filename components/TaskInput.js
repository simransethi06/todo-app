import React, { useState, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated } from "react-native";

export default function TaskInput({ onAdd, categories = [] }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState(categories[0] || "General");
  const scale = useRef(new Animated.Value(1)).current;

  const handleAdd = () => {
    if (!text.trim()) return;
    const task = { text: text.trim(), category, createdAt: Date.now() };
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }),
    ]).start();
    onAdd(task);
    setText("");
  };

  return (
    <Animated.View style={[styles.wrap, { transform: [{ scale }] }]}>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Add a task..."
          placeholderTextColor="#8f8aa3"
          value={text}
          onChangeText={setText}
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd} activeOpacity={0.8}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoryRow}>
        <Text style={styles.catLabel}>Category:</Text>
        <View style={styles.chips}>
          {[...new Set(["General", ...categories])].map((c, index) => ( // ✅ remove duplicates
            <TouchableOpacity
              key={`${c}-${index}`}
              style={[styles.chip, c === category && styles.chipActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.chipText, c === category && { color: "white" }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 10 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "#FAF8FF",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE8FF",
    fontSize: 16,
    color: "#3b3358",
  },
  addBtn: {
    marginLeft: 8,
    backgroundColor: "#7C6BF0",
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6e5de6",
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  addText: { color: "white", fontSize: 28, lineHeight: 28 },
  categoryRow: { marginTop: 10 },
  catLabel: { color: "#7a6f9a", fontSize: 13, marginBottom: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    borderWidth: 1,
    borderColor: "#E6E0F6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#8E7BF5", borderColor: "#8E7BF5" },
  chipText: { color: "#5b5075" },
});

