import { useAuth } from "@/hooks/AuthContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const { user, loading, login, register, logout } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // only used in register
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "login") {
        await login(email.trim(), password);
        router.replace("(tabs)")
      } else {
        await register(email.trim(), password, name.trim());
        router.replace("(tabs)")
      }
    } catch (err: any) {
      // Appwrite throws rich errors (code, message, etc.)
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    // still checking existing session
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Checking session…</Text>
      </View>
    );
  }


  // if logged OUT, show login/register form
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {mode === "login" ? "Login" : "Create Account"}
      </Text>

      {mode === "register" && (
        <>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
            placeholder="Jane Doe"
          />
        </>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleSubmit}
        disabled={submitting}
      >

      {/* <TouchableOpacity style={styles.button} onPress={logout} disabled={submitting} ><Text>Logout</Text></TouchableOpacity> */}
        {submitting ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>
            {mode === "login" ? "Sign In" : "Sign Up"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setMode((m) => (m === "login" ? "register" : "login"))
        }
      >
        <Text style={styles.linkText}>
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  container: {
    flex: 1,
    paddingTop: 96,
    paddingHorizontal: 24,
    backgroundColor: "#0a0a0a",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    marginBottom: 32,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 6,
  },
  value: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    borderColor: "#333",
    borderWidth: 1,
    backgroundColor: "#1a1a1a",
    color: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: "yellow",
    borderWidth: 0.5,
    borderColor: 'white',
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    color: "yellow",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline"
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 12,
  },
});
