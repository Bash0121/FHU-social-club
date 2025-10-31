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
        (async() => {
        const currentUser = await appwrite.getCurrentUser()
        setUser(currentUser)
        setLoading(false)

    })()
}, [] )


async function login(email:string, password:string) {
    const loggedInUser = await appwrite.loginWithEmail({email, password})
    setUser(loggedInUser)
}

async function register(email:string, password:string, name:string) {
    const loggedInUser = await appwrite.registerWithEmail({email, password, name})
    setUser(loggedInUser)
}

async function logout() {
    appwrite.logoutCurrentDevice()
    setUser(null)
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