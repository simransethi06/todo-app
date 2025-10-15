// components/TaskItem.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TaskItem({ item, onToggle, onDelete, onEdit }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.left} onPress={() => onToggle(item.id)}>
        <View style={[styles.checkbox, item.done && styles.checked]}>
          {item.done ? <Text style={styles.checkMark}>✓</Text> : null}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.body} onLongPress={() => onEdit(item)} activeOpacity={0.8}>
        <Text style={[styles.text, item.done && styles.textDone]}>{item.text}</Text>
        <View style={styles.meta}>
          <Text style={styles.cat}>{item.category}</Text>
          {item.dueDate ? <Text style={styles.date}> • {new Date(item.dueDate).toLocaleDateString()}</Text> : null}
        </View>
      </TouchableOpacity>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.trashBtn}>
          <Text style={styles.trashText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#bfaef7",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    borderWidth: 1,
    borderColor: "#F4F0FF",
  },
  left: { paddingRight: 10 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#d4c9ff",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: "#BFA8FF", borderColor: "#BFA8FF" },
  checkMark: { color: "white", fontWeight: "700" },
  body: { flex: 1 },
  text: { fontSize: 16, color: "#372b4f", marginBottom: 6 },
  textDone: { textDecorationLine: "line-through", color: "#9b91b3" },
  meta: { flexDirection: "row", alignItems: "center" },
  cat: { fontSize: 12, color: "#7a6f9a" },
  date: { fontSize: 12, color: "#7a6f9a" },
  right: { marginLeft: 12 },
  trashBtn: { padding: 6 },
  trashText: { fontSize: 18 },
});
