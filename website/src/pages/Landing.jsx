import React from 'react'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';
import CartBottomBar from '../components/CartBottomBar';
import CartDrawer from '../components/CartDrawer';

function Landing() {
  return (
    <div>
       <Header/>
       <Outlet />
       <Footer />

       <CartBottomBar />   {/* mobile summary */}
       <CartDrawer /> 
    </div>
  )
}

export default Landing;