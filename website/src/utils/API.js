import { useDispatch } from "react-redux";
import { decrementOrderCount, incrementOrderCount } from "../redux/slices/cartSlice";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;



function getHeaders()
{
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ localStorage.getItem("token") }`
    };
}

function searchQueryParser( params )
{
    const query = {};
    if(params.searchText){ query.searchText = params.searchText }
    if(params.page){ query.page = params.page }
    if(params.category){ query.category = params.category }
    if(params.subCategory){ query.subCategory = params.subCategory }
    if(params.limit){ query.limit = params.limit }

    const urlQuery = new URLSearchParams(query);
    return urlQuery;
}

export const API = {
    website_data: async () => {
        try{
            const response = await fetch(`${VITE_SERVER_URL}/public/website-data`)
            return await response.json();
        }catch(err){
            return { success:false, error:err.message }
        }
    } ,
    GENERAL:{
        categories: async () => {
             try{
                const response = await fetch(`${VITE_SERVER_URL}/public/categories`)
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        subCategories: async () => {
             try{
                const response = await fetch(`${VITE_SERVER_URL}/public/sub-categories`)
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        categoryPageData: async ( category_id ) => {
             try{
                const response = await fetch(`${VITE_SERVER_URL}/public/category-page-data?category_id=${category_id}`)
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        products: async (params) => {
            try{
                
                const response = await fetch(`${VITE_SERVER_URL}/public/products?${searchQueryParser(params)}`)
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        products_grouped_by_category: async() => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/public/products-grouped-by-category`)
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        product_details: async( id ) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/public/product-details/${id}`)
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        block_user_from_support: async(email, secret_key) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/public/block-user?email=${email}&secret_key=${secret_key}`);
                return await response.json();
            }catch(err){ return {success:false, error:err.message}}
        }
    },
    register: async (data) => {
        try{
            const response = await fetch(`${VITE_SERVER_URL}/public/register`,{
                method:"POST",
                headers:{ "Context-Type":"application/json" },
                body:JSON.stringify( data )
            })
            return await response.json();
        }catch(err){
            return { success:false, error:err.message }
        }
    },
    register_with_google: async (data) => {
        try{
            // data = { email, name, picture }
            const response = await fetch(`${VITE_SERVER_URL}/public/register-with-google`,{
                method:"POST",
                headers:{ "Content-Type":"application/json" },
                body:JSON.stringify( data )
            })
            return await response.json();
        }catch(err){
            return { success:false, error:err.message }
        }
    },
    login_with_email: async(data) => {
        try{
            const response = await fetch(`${VITE_SERVER_URL}/public/login-with-password`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            })
            return await response.json()
        }catch(err){return {success:false, error:err.message}}
    },
    refresh_token: async() => {
        try{
            const response = await fetch(`${VITE_SERVER_URL}/user/refresh-token`,{
                headers:getHeaders()
            })
            return await response.json();
        }catch(err){
            return {success:false, error:err.message}
        }
    },
    login_with_otp: async(email) => {
        try{
            const response = await fetch(`${VITE_SERVER_URL}/public/login-with-otp`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({email:email})
            })
            return await response.json()
        }catch(err){return {success:false, error:err.message}}
    },
    verify_otp: async(data) => {
        try{
            const response = await fetch(`${VITE_SERVER_URL}/public/verify-otp`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            })
            return await response.json()
        }catch(err){return {success:false, error:err.message}}
    },
    ADMIN:{
        overview: async() => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/admin/overview`,{
                    headers:getHeaders()
                })
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        update_website_flash_title: async ( data ) => {
            try{
                console.log(data);

                const response = await fetch(`${VITE_SERVER_URL}/admin/edit-flash-title`,{
                    headers:getHeaders(),
                    method:"POST",
                    body:JSON.stringify(data)
                })
                return await response.json();

            }catch(err){
                return { success:false, error:err.message }
            }
        },
         'edit-banner-images-desktop': async ( data ) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/admin/edit-banner-images-desktop`,{
                    headers:getHeaders(),
                    method:"PUT",
                    body:JSON.stringify(data)
                })
                return await response.json();
                
            }catch(err){
                return { success:false, error:err.message }
            }
        },
         'edit-banner-images-mobile': async ( data ) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/admin/edit-banner-images-mobile`,{
                    headers:getHeaders(),
                    method:"PUT",
                    body:JSON.stringify(data)
                })
                return await response.json();
                
            }catch(err){
                return { success:false, error:err.message }
            }
        },
        CATEGORY:{
            create_category: async( data ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/category`,{
                        headers:getHeaders(),
                        method:"POST",
                        body:JSON.stringify(data)
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            edit_category: async( id, data ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/category/${id}`,{
                        headers:getHeaders(),
                        method:"PUT",
                        body:JSON.stringify(data)
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            delete_category: async( id ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/category/${id}`,{
                        headers:getHeaders(),
                        method:"DELETE"
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            }
        },
        SUB_CATEGORY:{
            create_sub_category: async( data ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/sub-category`,{
                        headers:getHeaders(),
                        method:"POST",
                        body:JSON.stringify(data)
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            edit_sub_category: async( id, data ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/sub-category/${id}`,{
                        headers:getHeaders(),
                        method:"PUT",
                        body:JSON.stringify(data)
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            delete_sub_category: async( id ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/sub-category/${id}`,{
                        headers:getHeaders(),
                        method:"DELETE"
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            }
        },
        PRODUCT:{
            create_product: async (data) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/add-product`,{
                        headers:getHeaders(),
                        method:"POST",
                        body:JSON.stringify(data)
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            edit_product: async( id, data ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/edit-product/${id}`,{
                        headers:getHeaders(),
                        method:"PUT",
                        body:JSON.stringify(data)
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            delete_product: async( id ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/delete-product/${id}`,{
                        headers:getHeaders(),
                        method:"DELETE"
                    })
                    return await response.json();
                    
                }catch(err){
                    return { success:false, error:err.message }
                }
            }
        },
        USER:{
            list_users: async(params) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/users?${searchQueryParser(params)}`,{
                        headers:getHeaders()
                    });
                    return await response.json();
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            make_admin: async( email ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/make-admin/${email}`,{
                        headers:getHeaders()
                    });
                    return await response.json();
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            revoke_admin: async( email ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/revoke-admin/${email}`,{
                        headers:getHeaders()
                    });
                    return await response.json();
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            delete_user: async( id ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/delete-user/${id}`,{
                        headers:getHeaders(),
                        method:"DELETE"
                    });
                    return await response.json();
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            block_user: async( email ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/block-user/${email}`,{
                        headers:getHeaders(),
                        method:"PUT"
                    });
                    return await response.json();
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
            unblock_user: async( email ) => {
                try{
                    const response = await fetch(`${VITE_SERVER_URL}/admin/unblock-user/${email}`,{
                        headers:getHeaders(),
                        method:"PUT"
                    });
                    return await response.json();
                }catch(err){
                    return { success:false, error:err.message }
                }
            },
        },
        mobile_messages : async() => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/admin/mobile-messages`,{
                    headers:getHeaders()
                })
                return await response.json();
            }catch(err){
                return { success:false, error:err.message }
            }
        }
    },
    USER:{
        update_password: async(payload) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/user/update-password`,{
                    method:"PUT",
                    headers:getHeaders(),
                    body:JSON.stringify(payload)
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        get_cart: async(user_id) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/user/cart/${user_id}`,{
                    headers:getHeaders()
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        update_cart: async(payload) => {
            try{
                // payload = cart = [ {product}]
                const response = await fetch(`${VITE_SERVER_URL}/user/cart`,{
                    method:"PUT",
                    headers:getHeaders(),
                    body:JSON.stringify(payload)
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        update_phone_number_call_otp: async(phoneNumber) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/user/update-phone-number`,{
                    method:"POST",
                    headers:getHeaders(),
                    body:JSON.stringify({phoneNumber:phoneNumber})
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        update_phone_number_call_otp: async(phoneNumber) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/user/update-phone-number-otp-request`,{
                    method:"POST",
                    headers:getHeaders(),
                    body:JSON.stringify({phoneNumber:phoneNumber})
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        update_phone_number: async(phoneNumber) => {
            try{
                const response = await fetch(`${VITE_SERVER_URL}/user/update-phone-number`,{
                    method:"POST",
                    headers:getHeaders(),
                    body:JSON.stringify({phoneNumber:phoneNumber})
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        list_address: async() => {
             try{
                const response = await fetch(`${VITE_SERVER_URL}/user/get-saved-address`,{
                    headers:getHeaders()
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        add_address: async(payload) => {
             try{
                // payload = { address:"TEXT", pincode:507170, metaData:{} }
                const response = await fetch(`${VITE_SERVER_URL}/user/add-address`,{
                    method:"POST",
                    headers:getHeaders(),
                    body:JSON.stringify(payload)
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        },
        delete_address: async(addressId) => {
             try{
                const response = await fetch(`${VITE_SERVER_URL}/user/delete-address/${addressId}`,{
                    method:"DELETE",
                    headers:getHeaders()
                })
                return await response.json();
            }catch(err){
                return {success:false, error:err.message}
            }
        }
    },
    TOOLS : {
        timestamp_formatter: (timestamp) => {
            return new Intl.DateTimeFormat("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "medium"
            }).format(new Date(timestamp));
        },
        formatPrice : (price) => {
                return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
        },
        formatDate : (date) => {
            return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        }
    }
}