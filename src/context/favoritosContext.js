// 1. import createContext
import { useState, useEffect, createContext } from "react"

// 2. crear context, instanciación
export const FavoritosContext = createContext()
// 3. crear provider (función que se va a parecer a un componente)
const FavoritosContextProvider = (props) => {
    const [ favoritos, setFavoritos ] = useState([])
    // 4. definir una función que haga uso de setFavoritos (que reciba nuevos valores para agregar) y de ser necesario realice validaciones

    const anadirAFavoritos = (lugar) => {
        setFavoritos([...favoritos, lugar])
    }

    // useEffect para 2 situaciones: cuando inicia o cuando cambia el contexto
    useEffect(() => {
        const favoritosStorage = JSON.parse(localStorage.getItem("descubre_favoritos"))
        // console.log({favoritosStorage})
        if(favoritosStorage){
            setFavoritos(favoritosStorage)
        }
    }, [])

    useEffect(() => {
        // validar que si la longitud de favoritos es igual a 0, no fuerce la actualización
        if(favoritos.length === 0) return
        localStorage.setItem("descubre_favoritos", JSON.stringify(favoritos))
    }, [favoritos])

    // 5. return
    return (
        <FavoritosContext.Provider value={{favoritos, anadirAFavoritos }} >
            {/* con props.children se indica que el componente va a renderizar componentes hijos que no se conocen */}
            {props.children}
        </FavoritosContext.Provider>
    )
}

export default FavoritosContextProvider