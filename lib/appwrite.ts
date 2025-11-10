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

const getAppWriteConfig = () => {
  const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
  const platform = process.env.EXPO_PUBLIC_APPWRITE_PLATFORM;
  const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
  const membersTableId = process.env.EXPO_PUBLIC_APPWRITE_MEMBERS_TABLE_ID;

  if (!endpoint || !projectId || !platform || !databaseId || !membersTableId) {
    throw new Error(
      "Missing required AppWrite environment variables. " +
      "Please check your .env file and ensure all EXPO_PUBLIC_APPWRITE_* variables are set."
    );
  }

  return {
    endpoint,
    projectId,
    platform,
    databaseId,
    membersTableId,
  };
};

export const APPWRITE_CONFIG = getAppWriteConfig();

export interface MemberRow extends Models.Row {
  firstName: string;
  lastName: string;
  emailAddress: string | undefined;
  club?: string | undefined;
  phoneNumber: string | undefined;
  memberId: string;
}

export interface EventsRow extends Models.Row {
  eventName: string;
  eventDate: string;
  description: string;
  club?: string;
  location: string;
}

export type MemberInput = {
  firstName?: string;
  lastName?: string;
  userID?: string;
  club?: string | undefined;
  phoneNumber?: string | undefined;
  emailAddress?: string | undefined;
};

export type AppWriteConfig = {
  endpoint: string;
  projectId: string;
  platform: string; // e.g. 'com.example.app'
  databaseId: string; // TablesDB database id
  membersTableId: string; // Members table id
};
// The returned shape of the service for easy typing elsewhere
export type AppWriteService = ReturnType<typeof createAppwriteService>;

export function createAppwriteService(config: AppWriteConfig) {
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

  const account = new Account(client);
  const databases = new Databases(client);
  const table = new TablesDB(client);

  

 const registerWithEmail = async ({
    email,
    password,
    name,
    phoneNumber,
    club
  }: {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    club: string
  }): Promise<Models.User<Models.Preferences> | null> => {
    try {
      await account.create({ userId: ID.unique(), email, password, name });
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get<Models.User<Models.Preferences>>();
      await createMemberForUser(user, { emailAddress: email, phoneNumber, club });

      return user;
    } catch (exception) {
      console.error("[registerWithEmail] Error during registration:", exception);
      return null;
    }
  };

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
      databaseId: config.databaseId,
      tableId: config.membersTableId,
      queries: [Query.equal("memberId", memberId), Query.limit(1)],
    });

    return response.rows[0] ?? null;
  };

  const createMemberForUser = async (
    user: Models.User<Models.Preferences>,
    extra?: Partial<MemberInput>
  ): Promise<MemberRow> => {
    const [firstName = "", lastName = ""] = (user.name || "").split(" ");
    const email = user.email ?? extra?.emailAddress ?? null;

    return table.createRow<MemberRow>({
      databaseId: config.databaseId,
      tableId: config.membersTableId,
      rowId: ID.unique(),
      data: {
        firstName: extra?.firstName ?? firstName,
        lastName: extra?.lastName ?? lastName,
        memberId: user.$id,
        club: extra?.club ?? undefined,
        phoneNumber: extra?.phoneNumber ?? undefined,
        emailAddress: email,
      },
      // You can add explicit permissions here if you prefer:
      // permissions: [
      //   Permission.read(Role.user(user.$id)),
      //   Permission.update(Role.user(user.$id)),
      //   Permission.delete(Role.user(user.$id)),
      // ],
    });
  };

  const ensureMemberForUser = async (
    user: Models.User<Models.Preferences>,
    extra?: Partial<MemberInput>
  ): Promise<MemberRow> => {
    const existing = await getMemberByUserId(user.$id);
    return existing ?? (await createMemberForUser(user, extra));
  };

  const updateMember = async (
    rowId: string,
    data: Partial<MemberInput>
  ): Promise<MemberRow> => {
    return table.updateRow<MemberRow>({
      databaseId: config.databaseId,
      tableId: config.membersTableId,
      rowId,
      data,
    });
  };


  const getEvents = async (): Promise<EventsRow[]> => {
    try {
      const res = await table.listRows<EventsRow>({
        databaseId: config.databaseId,
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

    createMemberForUser,
    ensureMemberForUser,
    updateMember,
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
