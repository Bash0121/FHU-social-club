import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const { user, member, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(tabs)");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          If you want to see this page, then please{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => router.replace("/auth")}
          >
            Log In
          </Text>
        </Text>
      </View>
    );
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome {user.name}!</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
        <Text style={styles.label}>Club</Text>
        <Text style={styles.value}>{member.club ?? "No club a"}</Text>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center'}}>
        <View style={styles.separator}></View>
        </View>
        
      </View>
    );
  }
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
    backgroundColor: 'black'
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "white",
    marginBottom: 32,
  },
  label: {
    color: "white",
    fontSize: 20,
    marginBottom: 6,
  },
  value: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
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
    borderColor: 'white'
  },
  buttonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  linkText: {
    color: "#5ea0ff",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: "#ff6b6b",
    marginBottom: 12,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
});
