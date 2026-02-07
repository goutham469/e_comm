const express = require("express")
const { getCategories, getSubCategories, getProducts, websiteData, categoryPageData, getProductsGroupByCategory, productDetails } = require("../controllers/general.controller")
const { enrollUser, enrollUserByGoogle, handleLogin, refreshToken, blockUserFromSupport, requestOTPForLogin, verifyOTP } = require("../controllers/user.controller")
const publicRoute = express.Router()

// Authentication
publicRoute.post("/enroll", async (req,res) => res.send( await enrollUser( req.body ) ))
publicRoute.post("/register-with-google", async(req,res) => res.send( await enrollUserByGoogle( req.body ) ))
publicRoute.post("/login-with-password", async(req,res) => res.send( await handleLogin( req.body ) ) );

publicRoute.post("/login-with-otp", async(req,res) => {
    // console.log(req.body);
    res.send( await requestOTPForLogin( req.body?.email ) )
} );
publicRoute.post("/verify-otp", async(req, res) => {
    const { email=null, otp=null, hashedOTP=null } = req.body;
    res.send( await verifyOTP(email, otp, hashedOTP) )
})

// general routes
publicRoute.get("/website-data", async (req,res) => res.send( await websiteData() ) )
publicRoute.get("/categories", async (req,res) => res.send( await getCategories() ))
publicRoute.get("/sub-categories", async (req,res) => res.send( await getSubCategories() ))
publicRoute.get("/products", async (req,res) => res.send( await getProducts( req.query )) )
publicRoute.get("/products-grouped-by-category", async(req,res) => res.send( await getProductsGroupByCategory() ) )
publicRoute.get("/product-details/:id", async (req, res) => res.send( await productDetails(req.params.id) ) )

publicRoute.get("/category-page-data", async (req,res) => res.send( await categoryPageData( req.query.category_id ) ));

// support
publicRoute.get("/block-user", async(req,res) => res.send( await blockUserFromSupport( req.params.email, req.params.secret_key ) ))


// secret protected + routes

module.exports = { publicRoute }