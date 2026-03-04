import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUp, SignUpButton, UserButton } from '@clerk/clerk-react';

import { Routes , Route , Link} from "react-router";


//  imprtig the components 
import Navbar from './components/Navbar.jsx';


// importing the pages 

import CreatePage from "./pages/CreatePage"
import EditProductPage from "./pages/EditProductPage"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import ProfilePage from "./pages/ProfilePage"


const App = () => {
  return (
<div className='max-h-screen bg-base-100' > 
<Navbar/>
  <main className=' max-w-5 mx-auto px-'>

    {/* adding the pages */}
<Routes>

  <Route  path='/' element={<HomePage/>} />   {/* h0me page route link */}
<Route  path='Product/:id' element={<ProductPage/>}  />   {/* product page route link  */}
<Route path='Profile' element={<ProfilePage/>}  />  {/* profile page  */}
<Route path='create' element={<CreatePage/>}  />
<Route  path='edit/:id' element={<EditProductPage/>} />

</Routes>
  </main>

</div>
  )
}




export default App
