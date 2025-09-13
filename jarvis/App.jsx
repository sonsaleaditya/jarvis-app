import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, ActivityIndicator, TextInput, Keyboard, Animated, Easing
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Voice from "@react-native-voice/voice";
import Tts from "react-native-tts";
import { GEMINI_API } from '@env';

export default function App() {
  const [response, setResponse] = useState("Hello, I am JARVIS. How can I assist you?");
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const glowAnim = useRef(new Animated.Value(1)).current;
  const glowLoop = useRef(null);

  // Animate glow when speaking
  useEffect(() => {
    if (isSpeaking) {
      glowLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: true, easing: Easing.inOut(Easing.ease) })
        ])
      );
      glowLoop.current.start();
    } else {
      if (glowLoop.current) glowLoop.current.stop();
      glowAnim.setValue(1);
    }
  }, [isSpeaking]);

  // Setup TTS and Voice
  useEffect(() => {
    // TTS settings
    Tts.setDefaultRate(0.5);
    Tts.voices().then(voices => {
      const maleVoice = voices.find(v =>
        v.name.toLowerCase().includes("male") ||
        v.name.toLowerCase().includes("daniel") ||
        v.name.toLowerCase().includes("fred")
      );
      if (maleVoice) Tts.setDefaultVoice(maleVoice.id);
    });

    // TTS event listeners
    const finishListener = Tts.addEventListener("tts-finish", () => setIsSpeaking(false));
    const cancelListener = Tts.addEventListener("tts-cancel", () => setIsSpeaking(false));

    // Speech recognition
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) setQuestion(e.value[0]);
    };

    // Cleanup
    return () => {
      finishListener.remove();
      cancelListener.remove();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Ask JARVIS
  const askJarvis = async () => {
    Keyboard.dismiss();
    if (!question.trim()) {
      setResponse("⚠️ Please type or say something for JARVIS.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${GEMINI_API}/api/jarvis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: question }),
      });
      const data = await res.json();
      const reply = data.reply || "No response received.";
      setResponse(reply);

      setQuestion("");

      // JARVIS speaks
      Tts.stop();
      setIsSpeaking(true);
      Tts.speak(reply);
    } catch (error) {
      console.error(error);
      setResponse("⚠️ Error connecting to JARVIS server.");
    } finally {
      setLoading(false);
    }
  };

  // Voice controls
  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start("en-US");
    } catch (e) { console.error(e); }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) { console.error(e); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>J.A.R.V.I.S</Text>

        <Animated.View style={[styles.glowCircle, { transform: [{ scale: glowAnim }] }]}>
          <View style={styles.innerCore} />
        </Animated.View>

        <View style={styles.responseBox}>
          {loading ? <ActivityIndicator size="large" color="#0ff" /> :
            <Text style={styles.responseText}>{response}</Text>
          }
        </View>

        <View style={styles.iconsRow}>
          <TouchableOpacity style={styles.iconButton}><Feather name="sun" size={28} color="#0ff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><MaterialIcons name="task" size={28} color="#0ff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Entypo name="network" size={28} color="#0ff" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}><Feather name="settings" size={28} color="#0ff" /></TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask JARVIS..."
          placeholderTextColor="#888"
          value={question}
          onChangeText={setQuestion}
          onSubmitEditing={askJarvis}
        />
        <TouchableOpacity style={styles.sendButton} onPress={isListening ? stopListening : startListening}>
          <Feather name={isListening ? "mic-off" : "mic"} size={24} color="#0ff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={askJarvis}>
          <Feather name="send" size={24} color="#0ff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scroll: { alignItems: "center", paddingTop: 20, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: "bold", color: "#0ff", letterSpacing: 2, marginBottom: 20 },
  glowCircle: {
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(0,255,255,0.1)",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#0ff", shadowOpacity: 1, shadowRadius: 20,
  },
  innerCore: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#0ff", shadowColor: "#0ff", shadowOpacity: 1, shadowRadius: 30 },
  responseBox: { marginTop: 25, width: "90%", minHeight: 100, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(0,255,255,0.2)", padding: 15 },
  responseText: { color: "#0ff", fontSize: 15, lineHeight: 22 },
  iconsRow: { flexDirection: "row", justifyContent: "space-around", width: "90%", marginTop: 25 },
  iconButton: { backgroundColor: "rgba(255,255,255,0.05)", padding: 12, borderRadius: 50, borderWidth: 1, borderColor: "rgba(0,255,255,0.3)" },
  inputContainer: { position: "absolute", bottom: 0, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, backgroundColor: "rgba(0,0,0,0.8)" },
  input: { flex: 1, borderWidth: 1, borderColor: "rgba(0,255,255,0.3)", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12, color: "#fff", backgroundColor: "rgba(255,255,255,0.05)", marginRight: 10 },
  sendButton: { backgroundColor: "rgba(0,255,255,0.1)", padding: 12, borderRadius: 25, borderWidth: 1, borderColor: "rgba(0,255,255,0.3)", shadowColor: "#0ff", shadowOpacity: 1, shadowRadius: 10, marginLeft: 5 },
});
