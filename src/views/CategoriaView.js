import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { obtenerCategoriaPorId } from "../services/categoriaService"
import CategoriasMenu from "../components/CategoriasMenu"

export default function CategoriaView() {
    const [ categoria, setCategoria ] = useState(null)

    const { catId } = useParams()

    useEffect(() => {
        const getCategoria = async () => {
            try {
                const catObtenida = await obtenerCategoriaPorId(catId)
                setCategoria(catObtenida)
            } catch (error) {
                console.log(error)
            }
        }
        getCategoria()
    }, [catId])

    // si la categoría no está lista (inicialmente es null), muestra Cargando. Así también se evita que se muestre un mensaje de error
    if(!categoria) {
        return <h4>Loading...</h4>
    }

    return (
      <div className="row">
        <h1 className="mb-4">{categoria.cat_nom}</h1>
        <div className="col-12 col-md-4">
            <CategoriasMenu />
        </div>
        <div className="col-12 col-md-8">
          <h4 className="mb-3">Recommended places</h4>
          <div className="row">
            {categoria.lugares.map(
              (
                { lug_nom, lug_dir, lug_desc, lug_img, lug_id, categoriaId },
                i
              ) => (
                <div className="card-group col-md-12 col-lg-4" key={i}>
                  <div className="card mb-3">
                    <img src={lug_img} className="card-img-top" alt={lug_nom} />
                    <div className="card-body">
                      <h5 className="card-title">{lug_nom}</h5>
                      <p className="card-text">{lug_desc}</p>
                      <p className="card-text">
                        <i className="fa-solid fa-location-dot text-success me-2" />
                        {lug_dir}
                      </p>
                      <Link
                        className="btn btn-success"
                        to={`/detallelugar/${categoriaId}/${lug_id}`}
                      >
                        Explore place
                      </Link>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
}
