const { checkout } = require("../controllers/payment.controller");
const { listUsers, refreshToken, updatePassword, getCart, updateCart, updatePhoneNumber, updatePhoneNumberOtpRequest, listAddress, addAddress, deleteAddress } = require("../controllers/user.controller");

const userRouter = require("express").Router();

userRouter.get("/list-users", async (req,res)=>{
    res.send( await listUsers( req.query ) );
})

userRouter.get("/refresh-token", async(req,res) => res.send( await refreshToken( req.user )  ));
userRouter.put("/update-password", async(req,res) => res.send( await updatePassword(req.body) ));
userRouter.get("/cart/:user_id", async(req,res) => res.send( await getCart(req.params.user_id) ) );

// new_cart = [ {}, {}, {} ]
userRouter.put("/cart", async(req,res) => res.send( await updateCart({ user_id:req.userId, new_cart:req.body })));
userRouter.post("/update-phone-number-otp-request", async(req, res)=> res.send(await updatePhoneNumberOtpRequest(req.userId, req.body?.phoneNumber)))
userRouter.post("/update-phone-number", async(req, res)=> res.send(await updatePhoneNumber(req.userId, req.body?.phoneNumber)))

// checkout
userRouter.post("/checkout", async(req, res) => res.send( await checkout({ userId:req.userId, addressId:req.body.addressId }) ) )

// address
userRouter.get("/get-saved-address", async(req,res) => res.send( await listAddress(req.userId) ));
userRouter.post("/add-address", async(req,res) => res.send( await addAddress(req.userId, req.body) ));
userRouter.delete("/delete-address/:addressId", async(req,res) => res.send( await deleteAddress(req.params.addressId) ));


module.exports = { userRouter }