import { useEffect, useState } from 'react'
import { Aside } from '../../parts/aside/Aside'
import { Nav } from '../../parts/nav/Nav'
import { auth } from '../../services/auth'

export const Home = () => {

  const [isAdmin, setIsAdmin] = useState()

  useEffect(() => {
    const fetchIsAdmin = async () => {
      setIsAdmin(await auth.isUserAdmin())
    }
    fetchIsAdmin()
  }, [])

  console.log(isAdmin)

  return (
    <div className='Home' >
      <Nav />
      {isAdmin ? (
        <>
          <Aside />
        </>
      ) :
      (null)}
      
    </div>
  )
}
