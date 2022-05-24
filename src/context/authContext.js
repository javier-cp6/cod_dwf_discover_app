import { useState, useEffect, createContext } from "react"
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth"; // conexión a Google
import { auth } from "../config/firebaseConfig" // instancia del módulo auth

export const AuthContext = createContext()

const proveedorGoogle = new GoogleAuthProvider() // proveedor de Google para identificar el método de acceso

export const AuthContextProvider = (props) => {
    const [ user, setUser ] = useState(null)

    const signInGoogle = async () => {
        try {
            const resultado = await signInWithPopup(auth, proveedorGoogle) // login con popup
            // console.log({resultado})
            return resultado
        } catch (error) {
            console.log({error})
            throw error
        }
    }

    const salir = () => signOut(auth)

    useEffect(() => {
        return onAuthStateChanged(auth, (usuario) => {
            // cuando el user está logueado, devuelve la info del usuario. De lo contrario, devuelve null
            setUser(usuario)
        })
    })

    return <AuthContext.Provider value={{user, signInGoogle, salir}}>
        {props.children}
    </AuthContext.Provider>
}