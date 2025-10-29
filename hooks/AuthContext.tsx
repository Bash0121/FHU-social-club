// import { appwrite } from "@/lib/appwrite";
// import { createContext, useEffect, useState } from "react";
// import { Models } from "react-native-appwrite";

// const AuthContext = createContext(undefined)

// export function AuthProvider({children} : {children:React.ReactNode}) {

//     const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null)
//     const [loading, setLoading] = useState(true)

//     useEffect( ()=> {
//         (async() => {
//         const currentUser = await appwrite.getCurrentUser
//         setUser(currentUser)
//         setLoading(false)

//     })()
// }, [] )

// async function login(email:string, password:string) {
//     const loggedInUser = await appwrite.loginWithEmail({email, password})
//     setUser(loggedInUser)
// }

// async function register(email:string, password:string, name:string) {
//     const loggedInUser = await appwrite.registerWithEmail({email, password, name})
//     setUser(loggedInUser)
// }

// return (
//     <AuthContext.Provider></AuthContext.Provider>
// )

// }