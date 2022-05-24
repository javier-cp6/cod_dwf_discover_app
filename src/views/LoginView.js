import { useContext } from 'react'
import { AuthContext } from '../context/authContext'
import { useNavigate } from 'react-router-dom'

export default function LoginView() {

  const { signInGoogle } = useContext(AuthContext)
  
  const navigate = useNavigate()

  const loguear = async () => {
    const rpta = await signInGoogle()
    if(rpta.user.uid){
      // console.log(rpta)
      navigate('/')
    }
  }

  return (
    <div>
      <h1 className='mb-3'>Login with your Google account!</h1>
      <button className='btn btn-danger btn-lg' onClick={loguear}>
        Login
      </button>
    </div>
  )
}