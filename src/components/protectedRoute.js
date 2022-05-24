import { useContext } from "react"
import { AuthContext } from "../context/authContext"
import { Navigate } from "react-router-dom"


export default function ProtectedRoute(props) {

    const { user } = useContext(AuthContext)

    if(user) {
        // si user está logueado
        return props.children // el componente hijo de ProtectedRoute
    }
    // si user no está logueado, no renderiza ningún componente y lo redirige a login
    return (<Navigate to="/login" replace />
  )
}
