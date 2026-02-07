import { createSlice } from "@reduxjs/toolkit";
import { API } from "../../utils/API";

const defaultUserState = {
                            user_id:null,
                            name:null,
                            email:null,
                            role:'USER',
                            profile_pic:null,
                            userDetails:{}
                        }

const userSlice = createSlice({
    name:"user",
    initialState: localStorage.getItem("user") && localStorage.getItem("user") != "undefined" ? JSON.parse( localStorage.getItem("user") ) : defaultUserState ,
    reducers:{
        user_slice_login: async ( state,action ) => {
            // console.log(action.payload);
            localStorage.setItem( "user" , JSON.stringify(action.payload) );
            
            return action.payload;
        },
        user_slice_logout: (state,action) => {
            localStorage.clear();
            return defaultUserState;
        } 
    }
})

export const { user_slice_login , user_slice_logout } = userSlice.actions; 
export default userSlice.reducer;