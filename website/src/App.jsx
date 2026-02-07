import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './utils/router'
import { ToastContainer } from 'react-toastify'
import { Provider, useDispatch } from 'react-redux'
import { store } from './redux/store'
import { useEffect } from 'react'
import { API } from './utils/API'
import { user_slice_login } from './redux/slices/userSlice'
import { cart_slice_update } from './redux/slices/cartSlice'

function App() {
  const dispatch = useDispatch();

  // all user data is retrived when refreshed
  async function refreshData(){
    const JSONUser = localStorage.getItem("user");
    const user = JSON.parse(JSONUser);

    const response = await API.register_with_google({ email:user.email });

    if(response.success){
      const { user_details, token, cart } = response.data;
      
      // update cart
      if(cart){
        dispatch( cart_slice_update({ isOpen:false, cartItems:cart }) )
      }
      // update user profile
      const payload = {
                        email:user.email,
                        name:user_details.name, 
                        user_id:user_details._id, 
                        profile_pic:user_details.profile_pic,
                        role:user_details.role,
                        userDetails:user_details 
                      }
      // dispatch( user_slice_login( payload ))
      // update with new token
      localStorage.setItem("token", token);
    }
  }
  
  useEffect(()=>{
    if(localStorage.getItem("token")){
      refreshData()
    }
  },[])

  
  return <div>
          <RouterProvider
            router={ router }
          ></RouterProvider>
        </div>
}

export default App
