import { Query } from "appwrite";
import {
    Account,
    Client,
    Databases,
    ID,
    Models,
    TablesDB,
} from "react-native-appwrite";
import "react-native-url-polyfill/auto";

const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "68f8eca50022e7d7ec23";
const APPWRITE_PLATFORM_NAME = "FHU Social Club";
const DATABASE_ID = "6908d1d90025814f7d9e";
const MEMBERS_TABLE_ID = "members";

export interface MemberRow extends Models.Row {
  firstName: string;
  lastName: string;
  emailAddress: string;
  club?: string;
  phoneNumber: string;
  email: string;
  memberId: string;
}

export interface EventsRow extends Models.Row {
  eventName: string;
  eventDate: string;
  description: string;
  club?: string;
  location: string;
}

export function createAppwriteService() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setPlatform(APPWRITE_PLATFORM_NAME);

  const account = new Account(client);
  const databases = new Databases(client);
  const table = new TablesDB(client);

  

  async function registerWithEmail({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    await account.create({ userId: ID.unique(), email, password, name });
    await account.createEmailPasswordSession({ email, password });

    return await account.get<Models.User<Models.Preferences>>();
  }

  async function loginWithEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    await account.createEmailPasswordSession({ email, password });

    return await account.get<Models.User<Models.Preferences>>();
  }

  async function getCurrentUser() {
    try {
      const user = await account.get<Models.User<Models.Preferences>>();
      return user;
    } catch {
      return null;
    }
  }

  async function logoutCurrentDevice() {
    await account.deleteSession({ sessionId: "current" });
  }

  const getMemberByUserId = async (memberId: string): Promise<MemberRow> => {
    const response = await table.listRows<MemberRow>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_TABLE_ID,
      queries: [Query.equal("memberId", memberId), Query.limit(1)],
    });

    return response.rows[0] ?? null;
  };

  const getEvents = async (): Promise<EventsRow[]> => {
    try {
      const res = await table.listRows<EventsRow>({
        databaseId: DATABASE_ID,
        tableId: "events",
        queries: [Query.orderAsc("eventDate")],
      });
      return res.rows;
    } catch (err) {
      console.error("Error fetching events:", err);
      return [];
    }
  };

  return {
    client,
    account,
    databases,
    registerWithEmail,
    loginWithEmail,
    getCurrentUser,
    logoutCurrentDevice,
    getMemberByUserId,
    createAppwriteService,
    getEvents,
  };
}

// export const appwrite = {
//     client,
//     account,
//     databases,
//     registerWithEmail,
//     loginWithEmail,
//     getCurrentUser,
//     logoutCurrentDevice
// }
