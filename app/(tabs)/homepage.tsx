import { getEvents } from "@/lib/events";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";


export default function Homepage() {

  type Event = {
    $id : string
    eventName : string
    eventDate : string
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents();
      setEvents(data);
      setLoading(false);
    };
    loadEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
  data={events}
  keyExtractor={(item) => item.$id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.eventName}</Text>
      <Text style={styles.date}>
        {new Date(item.eventDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </Text>
    </View>
  )}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: "600" },
  date: { color: "#555", marginTop: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});