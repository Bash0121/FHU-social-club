import { Query } from "react-native-appwrite";
import { databases } from "./appwrite";

const DATABASE_ID = "6908d1d90025814f7d9e";
const COLLECTION_ID = "events";

export async function getEvents() {
  try {
const res = await databases.listDocuments(
  DATABASE_ID,
  COLLECTION_ID,
  [Query.orderAsc("eventDate")]);
    

    const events = res.documents.map((doc) => ({
      $id: doc.$id,
      eventName: doc.eventName,
      eventDate: doc.eventDate,
    }));

    return events;
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}
