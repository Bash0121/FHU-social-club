import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function AuthScreen() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
   useEffect(() => {
           if (!loading && !user) {
             router.replace("/auth");
           }
         }, [user, loading]);
       
         if (!user) {
           return (
             <View style={{ flex: 1, justifyContent: "center" }}>
               <ActivityIndicator size="large" />
             </View>
           );
         }

if (loading) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}


if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }}

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
      backgroundColor: "#ff4d4d",
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

  });
  