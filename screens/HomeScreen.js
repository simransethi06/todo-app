// // screens/HomeScreen.js
// import React, { useState, useEffect, useMemo } from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, TextInput, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import TaskInput from "../components/TaskInput";
// import TaskItem from "../components/TaskItem";

// const STORAGE_KEY = "tasks_v2";
// const CATEGORIES_KEY = "categories_v1";

// export default function HomeScreen({ navigation }) {
//   const [tasks, setTasks] = useState([]);
//   const [categories, setCategories] = useState(["Work", "Personal", "Shopping"]);
//   const [filter, setFilter] = useState("All");
//   const [search, setSearch] = useState("");
//   const headerFade = useMemo(() => new Animated.Value(0), []);
//   const [editing, setEditing] = useState(null);

//   useEffect(() => { 
//     loadAll(); 
//     Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start(); 
//   }, []);

//   const loadAll = async () => {
//     try {
//       const stored = await AsyncStorage.getItem(STORAGE_KEY);
//       const cats = await AsyncStorage.getItem(CATEGORIES_KEY);
//       if (stored) setTasks(JSON.parse(stored));
//       if (cats) setCategories(JSON.parse(cats));
//     } catch (e) { console.warn(e); }
//   };

//   const persist = async (newTasks) => {
//     setTasks(newTasks);
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
//   };

//   // ✅ Fix: generate truly unique IDs
//   const addTask = (payload) => {
//     const newTask = {
//       id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`, // unique ID
//       text: payload.text,
//       category: payload.category || "General",
//       createdAt: payload.createdAt || Date.now(),
//       done: false,
//     };
//     persist([newTask, ...tasks]);

//     if (!categories.includes(newTask.category)) {
//       const nc = [...categories, newTask.category];
//       setCategories(nc);
//       AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(nc));
//     }
//   };

//   const toggleTask = (id) => {
//     const nt = tasks.map(t => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : null } : t);
//     persist(nt);
//   };

//   const removeTask = (id) => {
//     Alert.alert("Remove task", "Are you sure you want to delete this task?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => persist(tasks.filter(t => t.id !== id)) },
//     ]);
//   };

//   const startEdit = (item) => {
//     setEditing(item);
//     Alert.prompt
//       ? Alert.prompt("Edit task", null, [
//           { text: "Cancel", style: "cancel", onPress: () => setEditing(null) },
//           { text: "Save", onPress: (text) => saveEdit(item.id, text) },
//         ], "plain-text", item.text)
//       : simpleEditFallback(item);
//   };

//   const simpleEditFallback = (item) => {
//     const newText = item.text;
//     saveEdit(item.id, newText);
//   };

//   const saveEdit = (id, newText) => {
//     if (!newText || !newText.trim()) return setEditing(null);
//     persist(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
//     setEditing(null);
//   };

//   const logout = () => {
//     signOut(auth).then(() => navigation.replace("Login"));
//   };

//   // filters
//   const filtered = tasks.filter(t => {
//     if (filter === "Active" && t.done) return false;
//     if (filter === "Done" && !t.done) return false;
//     if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   const total = tasks.length;
//   const done = tasks.filter(t => t.done).length;

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.header, { opacity: headerFade }]}>
//         <View>
//           <Text style={styles.title}>Good day ✨</Text>
//           <Text style={styles.subtitle}>Organize your tasks — pastel & calm</Text>
//         </View>

//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate("Profile", { total, done })}>
//             <Text style={styles.profileText}>👑</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.signout} onPress={logout}>
//             <Text style={styles.signoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>

//       <View style={styles.panel}>
//         <TaskInput onAdd={addTask} categories={categories} />

//         <View style={styles.filterRow}>
//           <View style={styles.filterTabs}>
//             {["All", "Active", "Done"].map((f) => (
//               <TouchableOpacity key={f} style={[styles.tab, filter === f && styles.tabActive]} onPress={() => setFilter(f)}>
//                 <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>{f}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <TextInput
//             placeholder="Search tasks..."
//             placeholderTextColor="#9f95b6"
//             value={search}
//             onChangeText={setSearch}
//             style={styles.search}
//           />
//         </View>

//         <View style={styles.progressRow}>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: total ? `${Math.round((done / total) * 100)}%` : "0%" }]} />
//           </View>
//           <Text style={styles.progressText}>{done}/{total} done</Text>
//         </View>

//         <FlatList
//           data={filtered}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}
//           renderItem={({ item }) => (
//             <TaskItem
//               item={item}
//               onToggle={toggleTask}
//               onDelete={removeTask}
//               onEdit={startEdit}
//             />
//           )}
//           ListEmptyComponent={() => (
//             <View style={{ padding: 30, alignItems: "center" }}>
//               <Text style={{ color: "#9787b8" }}>No tasks yet — add your first task ✨</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F7F5FB" },
//   header: {
//     paddingTop: 54,
//     paddingHorizontal: 20,
//     paddingBottom: 18,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   title: { fontSize: 20, color: "#3b3358", fontWeight: "700" },
//   subtitle: { fontSize: 13, color: "#7e739a", marginTop: 4 },
//   headerRight: { flexDirection: "row", alignItems: "center" },
//   profileBtn: { marginRight: 10, backgroundColor: "#F0EBFF", padding: 10, borderRadius: 10 },
//   profileText: { fontSize: 18 },
//   signout: { backgroundColor: "#FCECEF", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
//   signoutText: { color: "#c24a5d" },
//   panel: { paddingHorizontal: 20, paddingTop: 6, flex: 1 },
//   filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
//   filterTabs: { flexDirection: "row" },
//   tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: "#EFE8FF", marginRight: 8 },
//   tabActive: { backgroundColor: "#EDE6FF", borderColor: "#D7C8FF" },
//   tabText: { color: "#7f7498" },
//   tabTextActive: { color: "#5f4bd6", fontWeight: "700" },
//   search: {
//     width: 120,
//     padding: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#EEE6FF",
//     backgroundColor: "#FBF9FF",
//     fontSize: 13,
//     color: "#4a3f66",
//   },
//   progressRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   progressBar: { flex: 1, height: 10, backgroundColor: "#F3EFFF", borderRadius: 10, marginRight: 12 },
//   progressFill: { height: 10, backgroundColor: "#BFA8FF", borderRadius: 10 },
//   progressText: { width: 60, textAlign: "right", color: "#7b6f98" },
// });

// import React, { useState, useEffect, useMemo } from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, TextInput, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import TaskInput from "../components/TaskInput";
// import TaskItem from "../components/TaskItem";

// const STORAGE_KEY = "tasks_v2";
// const CATEGORIES_KEY = "categories_v1";

// export default function HomeScreen({ navigation }) {
//   const [tasks, setTasks] = useState([]);
//   const [categories, setCategories] = useState(["Work", "Personal", "Shopping"]);
//   const [filter, setFilter] = useState("All");
//   const [search, setSearch] = useState("");
//   const headerFade = useMemo(() => new Animated.Value(0), []);
//   const [editing, setEditing] = useState(null);

//   useEffect(() => { 
//     loadAll(); 
//     Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start(); 
//   }, []);

//   const loadAll = async () => {
//     try {
//       const stored = await AsyncStorage.getItem(STORAGE_KEY);
//       const cats = await AsyncStorage.getItem(CATEGORIES_KEY);
//       if (stored) setTasks(JSON.parse(stored));
//       if (cats) setCategories(JSON.parse(cats));
//     } catch (e) { console.warn(e); }
//   };

//   const persist = async (newTasks) => {
//     setTasks(newTasks);
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
//   };

//   // ✅ Unique IDs for tasks
//   const addTask = (payload) => {
//     const newTask = {
//       id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`, // unique ID
//       text: payload.text,
//       category: payload.category || "General",
//       createdAt: payload.createdAt || Date.now(),
//       done: false,
//     };
//     persist([newTask, ...tasks]);

//     if (!categories.includes(newTask.category)) {
//       const nc = [...categories, newTask.category];
//       setCategories(nc);
//       AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(nc));
//     }
//   };

//   const toggleTask = (id) => {
//     const nt = tasks.map(t => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : null } : t);
//     persist(nt);
//   };

//   const removeTask = (id) => {
//     Alert.alert("Remove task", "Are you sure you want to delete this task?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => persist(tasks.filter(t => t.id !== id)) },
//     ]);
//   };

//   const startEdit = (item) => {
//     setEditing(item);
//     Alert.prompt
//       ? Alert.prompt("Edit task", null, [
//           { text: "Cancel", style: "cancel", onPress: () => setEditing(null) },
//           { text: "Save", onPress: (text) => saveEdit(item.id, text) },
//         ], "plain-text", item.text)
//       : simpleEditFallback(item);
//   };

//   const simpleEditFallback = (item) => {
//     const newText = item.text;
//     saveEdit(item.id, newText);
//   };

//   const saveEdit = (id, newText) => {
//     if (!newText || !newText.trim()) return setEditing(null);
//     persist(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
//     setEditing(null);
//   };

//   const logout = () => {
//     signOut(auth).then(() => navigation.replace("Login"));
//   };

//   // filters
//   const filtered = tasks.filter(t => {
//     if (filter === "Active" && t.done) return false;
//     if (filter === "Done" && !t.done) return false;
//     if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   const total = tasks.length;
//   const done = tasks.filter(t => t.done).length;

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.header, { opacity: headerFade }]}>
//         <View>
//           <Text style={styles.title}>Welcome!</Text>
//           <Text style={styles.subtitle}>Organize your tasks — pastel & calm</Text>
//         </View>

//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate("Profile", { total, done })}>
//             <Text style={styles.profileText}>👤</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.signout} onPress={logout}>
//             <Text style={styles.signoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>

//       <View style={styles.panel}>
//         <TaskInput onAdd={addTask} categories={categories} />

//         <View style={styles.filterRow}>
//           <View style={styles.filterTabs}>
//             {["All", "Active", "Done"].map((f, index) => ( // ✅ Added index to key
//               <TouchableOpacity
//                 key={`${f}-${index}`}
//                 style={[styles.tab, filter === f && styles.tabActive]}
//                 onPress={() => setFilter(f)}
//               >
//                 <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>{f}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <TextInput
//             placeholder="Search tasks..."
//             placeholderTextColor="#9f95b6"
//             value={search}
//             onChangeText={setSearch}
//             style={styles.search}
//           />
//         </View>

//         <View style={styles.progressRow}>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: total ? `${Math.round((done / total) * 100)}%` : "0%" }]} />
//           </View>
//           <Text style={styles.progressText}>{done}/{total} done</Text>
//         </View>

//         <FlatList
//           data={filtered}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}
//           renderItem={({ item }) => (
//             <TaskItem
//               item={item}
//               onToggle={toggleTask}
//               onDelete={removeTask}
//               onEdit={startEdit}
//             />
//           )}
//           ListEmptyComponent={() => (
//             <View style={{ padding: 30, alignItems: "center" }}>
//               <Text style={{ color: "#9787b8" }}>No tasks yet — add your first task ✨</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F7F5FB" },
//   header: {
//     paddingTop: 54,
//     paddingHorizontal: 20,
//     paddingBottom: 18,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   title: { fontSize: 20, color: "#3b3358", fontWeight: "700" },
//   subtitle: { fontSize: 13, color: "#7e739a", marginTop: 4 },
//   headerRight: { flexDirection: "row", alignItems: "center" },
//   profileBtn: { marginRight: 10, backgroundColor: "#F0EBFF", padding: 10, borderRadius: 10 },
//   profileText: { fontSize: 18 },
//   signout: { backgroundColor: "#FCECEF", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
//   signoutText: { color: "#c24a5d" },
//   panel: { paddingHorizontal: 20, paddingTop: 6, flex: 1 },
//   filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
//   filterTabs: { flexDirection: "row" },
//   tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: "#EFE8FF", marginRight: 8 },
//   tabActive: { backgroundColor: "#EDE6FF", borderColor: "#D7C8FF" },
//   tabText: { color: "#7f7498" },
//   tabTextActive: { color: "#5f4bd6", fontWeight: "700" },
//   search: {
//     width: 120,
//     padding: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#EEE6FF",
//     backgroundColor: "#FBF9FF",
//     fontSize: 13,
//     color: "#4a3f66",
//   },
//   progressRow: { marginTop: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
//   progressBar: { flex: 1, height: 10, backgroundColor: "#F3EFFF", borderRadius: 10, marginRight: 12 },
//   progressFill: { height: 10, backgroundColor: "#BFA8FF", borderRadius: 10 },
//   progressText: { width: 60, textAlign: "right", color: "#7b6f98" },
// });


// import React, { useState, useEffect, useMemo } from "react";
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, TextInput, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import TaskInput from "../components/TaskInput";
// import TaskItem from "../components/TaskItem";

// const STORAGE_KEY = "tasks_v2";
// const CATEGORIES_KEY = "categories_v1";

// export default function HomeScreen({ navigation }) {
//   const [tasks, setTasks] = useState([]);
//   const [categories, setCategories] = useState(["Work", "Personal", "Shopping"]);
//   const [filter, setFilter] = useState("All");
//   const [search, setSearch] = useState("");
//   const [userName, setUserName] = useState(""); // ✅ added userName
//   const headerFade = useMemo(() => new Animated.Value(0), []);
//   const [editing, setEditing] = useState(null);

//   useEffect(() => { 
//     loadAll(); 
//     Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start(); 

//     // ✅ set user name
//     if (auth.currentUser && auth.currentUser.displayName) {
//       setUserName(auth.currentUser.displayName);
//     } else if (auth.currentUser && auth.currentUser.email) {
//       setUserName(auth.currentUser.email.split("@")[0]); // fallback to email prefix
//     }
//   }, []);

//   const loadAll = async () => {
//     try {
//       const stored = await AsyncStorage.getItem(STORAGE_KEY);
//       const cats = await AsyncStorage.getItem(CATEGORIES_KEY);
//       if (stored) setTasks(JSON.parse(stored));
//       if (cats) setCategories(JSON.parse(cats));
//     } catch (e) { console.warn(e); }
//   };

//   const persist = async (newTasks) => {
//     setTasks(newTasks);
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
//   };

//   const addTask = (payload) => {
//     const newTask = {
//       id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
//       text: payload.text,
//       category: payload.category || "General",
//       createdAt: payload.createdAt || Date.now(),
//       done: false,
//     };
//     persist([newTask, ...tasks]);

//     if (!categories.includes(newTask.category)) {
//       const nc = [...categories, newTask.category];
//       setCategories(nc);
//       AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(nc));
//     }
//   };

//   const toggleTask = (id) => {
//     const nt = tasks.map(t => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : null } : t);
//     persist(nt);
//   };

//   const removeTask = (id) => {
//     Alert.alert("Remove task", "Are you sure you want to delete this task?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => persist(tasks.filter(t => t.id !== id)) },
//     ]);
//   };

//   const startEdit = (item) => {
//     setEditing(item);
//     Alert.prompt
//       ? Alert.prompt("Edit task", null, [
//           { text: "Cancel", style: "cancel", onPress: () => setEditing(null) },
//           { text: "Save", onPress: (text) => saveEdit(item.id, text) },
//         ], "plain-text", item.text)
//       : simpleEditFallback(item);
//   };

//   const simpleEditFallback = (item) => {
//     const newText = item.text;
//     saveEdit(item.id, newText);
//   };

//   const saveEdit = (id, newText) => {
//     if (!newText || !newText.trim()) return setEditing(null);
//     persist(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
//     setEditing(null);
//   };

//   const logout = () => {
//     signOut(auth).then(() => navigation.replace("Login"));
//   };

//   const filtered = tasks.filter(t => {
//     if (filter === "Active" && t.done) return false;
//     if (filter === "Done" && !t.done) return false;
//     if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
//     return true;
//   });

//   const total = tasks.length;
//   const done = tasks.filter(t => t.done).length;

//   return (
//     <View style={styles.container}>
//       <Animated.View style={[styles.header, { opacity: headerFade }]}>
//         <View>
//           <Text style={styles.title}>Welcome{userName ? `, ${userName}` : ""}!</Text> {/* ✅ show name */}
//           <Text style={styles.subtitle}>Your Day, Lightly Organized</Text>
//         </View>

//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate("Profile", { total, done })}>
//             <Text style={styles.profileText}>👤</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.signout} onPress={logout}>
//             <Text style={styles.signoutText}>Logout</Text>
//           </TouchableOpacity>
//         </View>
//       </Animated.View>

//       <View style={styles.panel}>
//         <TaskInput onAdd={addTask} categories={categories} />

//         <View style={styles.filterRow}>
//           <View style={styles.filterTabs}>
//             {["All", "Active", "Done"].map((f, index) => (
//               <TouchableOpacity
//                 key={`${f}-${index}`}
//                 style={[styles.tab, filter === f && styles.tabActive]}
//                 onPress={() => setFilter(f)}
//               >
//                 <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>{f}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//           <TextInput
//             placeholder="Search tasks..."
//             placeholderTextColor="#9f95b6"
//             value={search}
//             onChangeText={setSearch}
//             style={styles.search}
//           />
//         </View>

//         <View style={styles.progressRow}>
//           <View style={styles.progressBar}>
//             <View style={[styles.progressFill, { width: total ? `${Math.round((done / total) * 100)}%` : "0%" }]} />
//           </View>
//           <Text style={styles.progressText}>{done}/{total} done</Text>
//         </View>

//         <FlatList
//           data={filtered}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}
//           renderItem={({ item }) => (
//             <TaskItem
//               item={item}
//               onToggle={toggleTask}
//               onDelete={removeTask}
//               onEdit={startEdit}
//             />
//           )}
//           ListEmptyComponent={() => (
//             <View style={{ padding: 30, alignItems: "center" }}>
//               <Text style={{ color: "#9787b8" }}>No tasks yet — add your first task ✨</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F7F5FB" },
//   header: {
//     paddingTop: 54,
//     paddingHorizontal: 20,
//     paddingBottom: 18,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "transparent",
//   },
//   title: { fontSize: 20, color: "#3b3358", fontWeight: "700" },
//   subtitle: { fontSize: 13, color: "#9787b8" },
//   headerRight: { flexDirection: "row", alignItems: "center" },
//   profileBtn: { marginRight: 12 },
//   profileText: { fontSize: 24 },
//   signout: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: "#e2d9f9", borderRadius: 8 },
//   signoutText: { color: "#7C6BF0", fontWeight: "600" },
//   panel: { flex: 1, paddingHorizontal: 20 },
//   filterRow: { marginTop: 14, marginBottom: 8 },
//   filterTabs: { flexDirection: "row", marginBottom: 8 },
//   tab: { marginRight: 12, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, backgroundColor: "#f1edf9" },
//   tabActive: { backgroundColor: "#7C6BF0" },
//   tabText: { color: "#7a6f9a" },
//   tabTextActive: { color: "white" },
//   search: {
//     backgroundColor: "#FAF8FF",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#EEE8FF",
//     color: "#3b3358",
//   },
//   progressRow: { marginBottom: 12 },
//   progressBar: { height: 6, width: "100%", backgroundColor: "#E6E0F6", borderRadius: 6, overflow: "hidden" },
//   progressFill: { height: 6, backgroundColor: "#7C6BF0", borderRadius: 6 },
//   progressText: { fontSize: 12, color: "#7a6f9a", marginTop: 4, textAlign: "right" },
// });


import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, TextInput, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import TaskInput from "../components/TaskInput";
import TaskItem from "../components/TaskItem";

const STORAGE_KEY = "tasks_v2";
const CATEGORIES_KEY = "categories_v1";

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState(["Work", "Personal", "Shopping"]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const headerFade = useMemo(() => new Animated.Value(0), []);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadAll();
    Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }).start();

    if (auth.currentUser && auth.currentUser.displayName) {
      setUserName(auth.currentUser.displayName);
    } else if (auth.currentUser && auth.currentUser.email) {
      setUserName(auth.currentUser.email.split("@")[0]);
    }
  }, []);

  const loadAll = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const cats = await AsyncStorage.getItem(CATEGORIES_KEY);
      if (stored) setTasks(JSON.parse(stored));
      if (cats) setCategories(JSON.parse(cats));
    } catch (e) {
      console.warn(e);
    }
  };

  const persist = async (newTasks) => {
    setTasks(newTasks);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));
  };

  const addTask = (payload) => {
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      text: payload.text,
      category: payload.category || "General",
      createdAt: payload.createdAt || Date.now(),
      done: false,
    };
    persist([newTask, ...tasks]);

    if (!categories.includes(newTask.category)) {
      const nc = [...categories, newTask.category];
      setCategories(nc);
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(nc));
    }
  };

  const toggleTask = (id) => {
    const nt = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : null } : t
    );
    persist(nt);
  };

  const removeTask = (id) => {
    Alert.alert(
      "Remove task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => persist(tasks.filter((t) => t.id !== id)) },
      ],
      { cancelable: true }
    );
  };

  const startEdit = (item) => {
    setEditing(item);
    if (Alert.prompt) {
      Alert.prompt(
        "Edit task",
        "",
        [
          { text: "Cancel", style: "cancel", onPress: () => setEditing(null) },
          { text: "Save", onPress: (text) => saveEdit(item.id, text) },
        ],
        "plain-text",
        item.text
      );
    } else {
      // fallback for Android / unsupported platforms
      Alert.alert("Edit task", item.text, [{ text: "OK", onPress: () => setEditing(null) }]);
    }
  };

  const saveEdit = (id, newText) => {
    if (!newText || !newText.trim()) return setEditing(null);
    persist(tasks.map((t) => (t.id === id ? { ...t, text: newText } : t)));
    setEditing(null);
  };

  const logout = () => {
    signOut(auth).then(() => navigation.replace("Login"));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "Active" && t.done) return false;
    if (filter === "Done" && !t.done) return false;
    if (search && !t.text.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = tasks.length;
  const done = tasks.filter((t) => t.done).length;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View>
          <Text style={styles.title}>
            Welcome{userName ? `, ${userName}` : ""}!
          </Text>
          <Text style={styles.subtitle}>Your Day, Lightly Organized</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate("Profile", { total, done })}
          >
            <Text style={styles.profileText}>👤</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signout} onPress={logout}>
            <Text style={styles.signoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.panel}>
        <TaskInput onAdd={addTask} categories={categories} />

        <View style={styles.filterRow}>
          <View style={styles.filterTabs}>
            {["All", "Active", "Done"].map((f, index) => (
              <TouchableOpacity
                key={`${f}-${index}`}
                style={[styles.tab, filter === f && styles.tabActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.tabText, filter === f && styles.tabTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#9f95b6"
            value={search}
            onChangeText={setSearch}
            style={styles.search}
          />
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: total ? `${Math.round((done / total) * 100)}%` : "0%" },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {done}/{total} done
          </Text>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TaskItem item={item} onToggle={toggleTask} onDelete={removeTask} onEdit={startEdit} />
          )}
          ListEmptyComponent={() => (
            <View style={{ padding: 30, alignItems: "center" }}>
              <Text style={{ color: "#9787b8" }}>No tasks yet — add your first task ✨</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F5FB" },
  header: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  title: { fontSize: 20, color: "#3b3358", fontWeight: "700" },
  subtitle: { fontSize: 13, color: "#9787b8" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  profileBtn: { marginRight: 12 },
  profileText: { fontSize: 24 },
  signout: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e2d9f9",
    borderRadius: 8,
  },
  signoutText: { color: "#7C6BF0", fontWeight: "600" },
  panel: { flex: 1, paddingHorizontal: 20 },
  filterRow: { marginTop: 14, marginBottom: 8 },
  filterTabs: { flexDirection: "row", marginBottom: 8 },
  tab: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#f1edf9",
  },
  tabActive: { backgroundColor: "#7C6BF0" },
  tabText: { color: "#7a6f9a" },
  tabTextActive: { color: "white" },
  search: {
    backgroundColor: "#FAF8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEE8FF",
    color: "#3b3358",
  },
  progressRow: { marginBottom: 12 },
  progressBar: {
    height: 6,
    width: "100%",
    backgroundColor: "#E6E0F6",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: "#7C6BF0", borderRadius: 6 },
  progressText: { fontSize: 12, color: "#7a6f9a", marginTop: 4, textAlign: "right" },
});
