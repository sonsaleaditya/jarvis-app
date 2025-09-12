import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";


export default function App() {
  const [response, setResponse] = useState("Hello, I am JARVIS. How can I assist you?");

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>J.A.R.V.I.S</Text>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* JARVIS Core */}
        <View style={styles.glowCircle}>
          <View style={styles.innerCore} />
        </View>

        {/* Response Box */}
        <View style={styles.responseBox}>
          <Text style={styles.responseText}>{response}</Text>
        </View>

        {/* Floating Action Icons */}
        <View style={styles.iconsRow}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="sun" size={28} color="#0ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="task" size={28} color="#0ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Entypo name="network" size={28} color="#0ff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="settings" size={28} color="#0ff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Mic Button */}
      <TouchableOpacity style={styles.micButton}>
        <Feather name="mic" size={36} color="#0ff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center" },
  scroll: { alignItems: "center", padding: 20 },

  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: "bold",
    color: "#0ff",
    letterSpacing: 2,
  },

  glowCircle: {
    marginTop: 30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(0,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#0ff",
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  innerCore: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#0ff",
    shadowColor: "#0ff",
    shadowOpacity: 1,
    shadowRadius: 30,
  },

  responseBox: {
    marginTop: 25,
    width: "95%",
    minHeight: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.2)",
    padding: 15,
  },
  responseText: { color: "#0ff", fontSize: 15, lineHeight: 22 },

  iconsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "95%",
    marginTop: 25,
  },
  iconButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 12,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.3)",
  },

  micButton: {
    marginBottom: 25,
    backgroundColor: "rgba(0,255,255,0.1)",
    padding: 18,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(0,255,255,0.3)",
    shadowColor: "#0ff",
    shadowOpacity: 1,
    shadowRadius: 15,
  },
});
