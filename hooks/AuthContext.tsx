import { createAppwriteService, MemberRow } from "@/lib/appwrite";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";

type AuthContextType = {
    user:Models.User<Models.Preferences> | null,
    loading: boolean,
    login: (email:string, password:string) => Promise<void>,
    register: (email:string, password:string, name:string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({children} : {children:React.ReactNode}) {

    const appwriteService = createAppwriteService(null)

    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
    const [member, setMember] = useState<MemberRow | null>(null)
    const [loading, setLoading] = useState(true)

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


async function login(email:string, password:string) {
    await appwriteService.loginWithEmail({email, password})
    const currentUser = await appwriteService.getCurrentUser()
    setUser(currentUser)
}

async function register(email:string, password:string, name:string) {
    await appwriteService.registerWithEmail({email, password, name})
    const currentUser = await appwriteService.getCurrentUser()
    setUser(currentUser)
}

async function logout() {
    try {
        await appwriteService.logoutCurrentDevice()
    } catch (err) {
        console.log("Logout failed:", err);
    } finally {
    setUser(null)
    }
}

const loadUser = useCallback( ()=> {
    setLoading(true)
    try {
        const user = await appwriteService.getCurrentUser()
        if (user) {
            const member = await appwriteService.getMemberByUserId(user.$id)
            setMember(member??null)
        }
    }

}, [appwriteService])

return (
    <AuthContext.Provider value={{user, loading, login, register, logout}} >
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