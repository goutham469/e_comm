import Login from "../pages/Login";
import Register from "../pages/Register";

import { createBrowserRouter } from "react-router-dom"
import Landing from '../pages/Landing'
import Search from "../components/Search";
import MainPage from "../components/MainPage";
import Product from "../components/Product";
import Dashboard from "../pages/Dashboard";
import Profile from "../components/Profile";
import CategoryPage from "../pages/CategoryPage";
import Products from "../Admin/Products";
import Categories from "../Admin/Categories";
import SubCategories from "../Admin/SubCategories";
import Payments from "../Admin/Payments";
import CRM from "../Admin/CRM";
import Overview from "../Admin/Overview";
import Settings from "../Admin/Settings";
import Users from "../Admin/Users";
import ForgotPassword from "../pages/ForgotPassword";
import MobileMessages from "../Admin/MobileMessages";
import SavedLocations from "../components/SavedLocations";

export const router = createBrowserRouter([
    {
        path:'',
        element:<Landing/>,
        children:
        [ 
            {
                path:'',
                element:<MainPage/>
            },
            {
                path:'/search',
                element:<Search/>
            },
            {
                path:'/product/:id',
                element:<Product/>
            }
        ]
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    },
    {
        path:'/forgot-password',
        element:<ForgotPassword/>
    },
    {
        path:"/category",
        element:<CategoryPage />
    },
    {
        path:'/dashboard',
        element:<Dashboard/>,
        children:
        [
            {
                path:'',
                element:<Profile/>
            },
            {
                path:'saved-locations',
                element:<SavedLocations/>
            },
            {
                path:'overview',
                element:<Overview/>
            },
            {
                path:'settings',
                element:<Settings/>
            },
            {
                path:'users',
                element:<Users/>
            },
            {
                path:'products',
                element:<Products />
            },
            {
                path:'categories',
                element:<Categories/>
            },
            {
                path:'sub-categories',
                element:<SubCategories/>
            },
            {
                path:"payments-glance",
                element:<Payments/>
            },
            {
                path:"mobile-messages",
                element:<MobileMessages />
            },
            {
                path:'user-complaints',
                element:<CRM/>
            }
        ]
    },
    {
        path:'*',
        element:<p>404, Route not found.</p>
    }
])