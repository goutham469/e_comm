import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/API";
import { toast } from "react-toastify";
import { user_slice_login } from "../redux/slices/userSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { cart_slice_update } from "../redux/slices/cartSlice";

const VITE_GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;


function GoogleAuth()
{
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function onSuccess( data )
  {
    const credential = data.credential;
    const decodedCredentials = jwtDecode(credential);
    const { email, name, picture } = decodedCredentials;

    const response = await API.register_with_google({ email, name, picture });

    if( !response.success ){ toast.error(response.error); return; }

    const user_details = response.data.user_details;
    const cart = response.data.cart;

    if(cart){
      dispatch( cart_slice_update({ isOpen:false, cartItems:cart }) )
    }

    dispatch( user_slice_login({
       email,
       name, 
       user_id:user_details._id, 
       profile_pic:user_details.profile_pic,
       role:user_details.role,
       userDetails:user_details 
      }) )

    const token = response.data.token;
    localStorage.setItem("token", token);

    toast.success("login success");
    navigate("/")
    
  }
  return <div>
            <GoogleOAuthProvider clientId={VITE_GOOGLE_OAUTH_CLIENT_ID}>
              <div className="flex justify-center transform hover:scale-105 transition-transform duration-200">
                <GoogleLogin
                  theme="filled_black" 
                  onSuccess={onSuccess} 
                  shape="pill" 
                  text='continue_with'
                  width="240"
                  size="medium"
                />
              </div>
            </GoogleOAuthProvider>
          </div>
}

export default GoogleAuth;