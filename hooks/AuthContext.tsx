import { appwrite } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
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

    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect( ()=> {
        const init = async() => {
            try {
        const currentUser = await appwrite.getCurrentUser()
        setUser(currentUser)
    } catch (err) {
        setUser(null)
    } finally {
        setLoading(false)
    }

    }; init()
}, [] )


async function login(email:string, password:string) {
    await appwrite.loginWithEmail({email, password})
    const currentUser = await appwrite.getCurrentUser()
    setUser(currentUser)
}

async function register(email:string, password:string, name:string) {
    await appwrite.registerWithEmail({email, password, name})
    const currentUser = await appwrite.getCurrentUser()
    setUser(currentUser)
}

async function logout() {
    try {
        await appwrite.logoutCurrentDevice()
    } catch (err) {
        console.log("Logout failed:", err);
    } finally {
    setUser(null)
    }
}

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