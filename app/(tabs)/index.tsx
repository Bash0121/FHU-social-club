import { APPWRITE_CONFIG, createAppwriteService } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Homepage({}) {
  type Event = {
    $id: string;
    location: string;
    eventName: string;
    eventDate: string;
    description: string;
    club?: string;
  };
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [profileVisability, setProfileVisability] = useState(false);

  const appwriteService = useMemo(() => createAppwriteService(APPWRITE_CONFIG), []);

  useEffect(() => {
    const loadEvents = async () => {
      const data = await appwriteService.getEvents();
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

  const profileOn = (event: any) => {
    setSelectedEvent(event);
    setProfileVisability(true);
  };

  const profileOff = () => {
    setSelectedEvent(null);
    setProfileVisability(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.eventName}</Text>
            <Text style={styles.mainPageStats}>{item.club}</Text>
            <TouchableOpacity onPress={() => profileOn(item)}>
              <Ionicons name="arrow-forward-circle-outline" size={60} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      />

      {profileVisability && selectedEvent && (
        <Modal visible={profileVisability}>
          <View>
            <TouchableOpacity onPress={profileOff}>
              <Ionicons name="close-circle" size={60} style={styles.modalIcon}/>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContainer}>
            {selectedEvent && (
              <>
                <Text style={styles.modalPageName}>
                  {selectedEvent?.eventName}
                </Text>
                <Text style={styles.modalPageStats}>
                  {new Date(selectedEvent.eventDate).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </Text>
                <Text style={styles.modalPageStats}>{selectedEvent?.club}</Text>

                <Text style={styles.modalPageStats}>
                  {selectedEvent?.location}
                </Text>
                <Text style={styles.modalPageStats}>
                  {selectedEvent?.description}
                </Text>
                <View style={styles.separator}></View>
              </>
            )}
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "black" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "white" },
  card: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: 'yellow'
  },
  name: { fontSize: 25, fontWeight: "600", color: 'white'},
  date: { color: "#555", marginTop: 5 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  modalContainer: {
    alignItems: "center",
    backgroundColor: 'black',
    flex: 1
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "white"
  },
  icon: {
    color: "white",
    textAlign: "right",
  },
  modalIcon: {
    color: "white",
    textAlign: "left",
    backgroundColor: "black"

  },
  mainPageName: {
    fontSize: 25,
    fontWeight: "bold",
    color: 'white'
  },
  mainPageStats: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'white'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
    backgroundColor: "yellow"
  },
  modalPageName: {
    fontSize: 40,
    fontWeight: "bold",
    color: 'white'
  },
  modalPageStats: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
    color: 'white',
    textAlign: "center",
    margin: 20
  },
  Hline: {
    borderBottomWidth: 2,
    borderBottomColor: "yellow"
  }
});
