import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerLugar } from "../services/lugarService";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// para utilizar un context, se requiere importar: useContext de React y el contexto en sí
import { FavoritosContext } from "../context/favoritosContext";
import { AuthContext } from "../context/authContext";

// DatePicker
import TextField from '@mui/material/TextField'; 
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { crearReserva } from "../services/reservaService";
import Swal from "sweetalert2"

export default function DetalleLugarView() {
  const [miLugar, setMiLugar] = useState(null);

  const [ fecha, setFecha ] = useState(new Date())

  const navigate = useNavigate()

  const { catId, lugId } = useParams();

  // const contexto = useContext(FavoritosContext)
  // console.log(FavoritosContext)
  const { favoritos, anadirAFavoritos } = useContext(FavoritosContext)
  // console.log(favoritos, anadirAFavoritos)

  const { user } = useContext(AuthContext)

  const addAFavoritos = () => {
    if(user){
      anadirAFavoritos(miLugar)
    }else{
      navigate('/login')
    }
  }

  const manejarReserva = async () => {
    try {
      const nuevaReserva = {
        res_fecha:fecha.getTime(), //timestamp
        lug_id: lugId,
        uid:user.uid
      }
      await crearReserva(nuevaReserva)
      Swal.fire({
        icon:"success",
        title:"Your reservation was booked"
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getLugar = async () => {
      try {
        const lugObtenido = await obtenerLugar(catId, lugId);
        setMiLugar(lugObtenido);
      } catch (error) {
        console.log(error);
      }
    };
    getLugar();
  }, []);

  return (
    <>
      {/* puede pasar que al querer renderizar a partir de un objeto, una variable, un estado, un props, etc. esa referencia no tenga una propiedad que se esté buscando. En ese caso, se puede realizar una validación con un operador ternario y renderizar una cosa u otra */}
      {miLugar ? (
        <div>
          <div className="d-flex justify-content-between">
            <h2>{miLugar.lug_nom}</h2>
            {/* <button className="btn btn-outline-success" onClick={() => {anadirAFavoritos(miLugar)}}>
              Agregar a favoritos
            </button> */}
            <button className="btn btn-outline-success" onClick={addAFavoritos}>
              Add to bookmarks
            </button>
          </div>

          <div className="row mt-4">
            <div className="col-12 col-lg-8 mb-3">
              <div className="div-img-detalle img-fluid d-flex justify-content-center overflow-hidden">
                <img className="img-detalle" src={miLugar.lug_img} alt={miLugar.lug_nom} />
              </div>
            </div>

            {/* DatePicker */}
            <div className="col-12 col-lg-4">
              <div className="card">
                <div className="card-body">
                  <p>
                    <i className="fa-solid fa-location-dot me-2 text-success"></i>
                    {miLugar.lug_dir}
                  </p>
                  <p className="lead mt-3">{miLugar.lug_desc}</p>
                
                  <div className="d-flex flex-column">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Choose booking date"
                        value={fecha}
                        onChange={(nuevaFecha) => {
                          setFecha(nuevaFecha);
                          // console.log(nuevaFecha.getTime())
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </div>
                <div className="d-grid">
                  <button className="btn btn-success mt-2" disabled={!user ? true : false} onClick={manejarReserva}>Book now!</button>
                </div>
              </div>
            </div>
          </div>
            
            <MapContainer 
              style={{ height: "500px", marginTop: "20px" }}
              center={miLugar.lug_coords}
              zoom={18}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={miLugar.lug_coords}>
                <Popup>
                  <i className="fa-solid fa-location-arrow text-success me-2 fa-2x"></i>
                  <h6>{miLugar.lug_nom}</h6>
                  <small>{miLugar.lug_desc}</small>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
