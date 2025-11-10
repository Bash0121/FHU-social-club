import { APPWRITE_CONFIG, createAppwriteService, MemberInput, MemberRow } from "@/lib/appwrite";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Models } from "react-native-appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  member: MemberRow | null;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string,
    club: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateMember: (data: Partial<MemberInput>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children} : {children:React.ReactNode}) {

    const appwriteService = useMemo(()=> createAppwriteService(APPWRITE_CONFIG), [])

    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
    const [member, setMember] = useState<MemberRow | null>(null)
    const [loading, setLoading] = useState(true)
        const [error, setError] = useState("")


    useEffect( ()=> {
        const init = async() => {
            try {
        const currentUser = await appwriteService.getCurrentUser()
        setUser(currentUser)
    } catch (err) {
        setUser(null)
    } finally {
        setLoading(false)
    }

    }; init()
}, [] )


const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError("");
      try {
        const loggedInUser = await appwriteService.loginWithEmail({
          email,
          password,
        });
        if (!loggedInUser) {
          setError("Login failed. Check your credentials.");
        } else {
          setUser(loggedInUser);
          const member = await appwriteService.getMemberByUserId(
            loggedInUser.$id
          );
          setMember(member ?? null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Login failed");
      } finally {
        setLoading(false);
      }
    },
    [appwriteService]
  );

const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      phoneNumber: string,
      club: string
    ) => {
      setLoading(true);
      setError("");
      try {
        const loggedInUser = await appwriteService.registerWithEmail({
          email,
          password,
          name,
          phoneNumber,
          club,
        });
        if (!loggedInUser) {
          setError("Registration failed. Please try again.");
        } else {
          setUser(loggedInUser);
          const member = await appwriteService.getMemberByUserId(
            loggedInUser.$id
          );
          setMember(member ?? null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Registration failed");
      } finally {
        setLoading(false);
      }
    },
    [appwriteService]
  );

 const logout = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      await appwriteService.logoutCurrentDevice();
      setUser(null);
      setMember(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  }, [appwriteService]);

const loadAuthState = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loggedInUser = await appwriteService.getCurrentUser();
      if (loggedInUser) {
        setUser(loggedInUser);
        const member = await appwriteService.getMemberByUserId(
          loggedInUser.$id
        );
        setMember(member ?? null);
      } else {
        setUser(null);
        setMember(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load auth state");
      setUser(null);
      setMember(null);
    } finally {
      setLoading(false);
    }
  }, [appwriteService]);

useEffect(()=> {loadAuthState()}, [loadAuthState])
 
const refresh = useCallback(async () => {loadAuthState();}, [loadAuthState]);

const updateMember = useCallback(
    async (data: Partial<MemberInput>) => {
      if (!member) throw new Error("No member to update");
      setLoading(true);
      try {
        const updated = await appwriteService.updateMember(member.$id, data);
        setMember(updated);
      } finally {
        setLoading(false);
      }
    },
    [member, appwriteService]
  );

return (
    <AuthContext.Provider value={{
        user,
        member,
        loading,
        error,
        login,
        register,
        logout,
        refresh,
        updateMember,
      }}>

        {children}
    </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if(!context) {
        throw new Error("useAuth must be used inside <AuthProvider />")
    }
    return context
}