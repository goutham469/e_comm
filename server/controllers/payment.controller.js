const { ObjectId } = require("mongodb")
const { db } = require("../utils/db")

async function checkout({ userId, addressId }){
    try{
        // get the cart details
        const cartDetails = await db.cart.findOne({ user_id:new ObjectId(userId) });
        const orderItems = cartDetails.cartItems;

        if(!cartDetails || orderItems.length == 0){
            return {success:false, error:"Your Cart is Empty"}
        }
        const { DELIVERY_ADDRESS_MANDATE } = process.env;

        if(DELIVERY_ADDRESS_MANDATE == 'TRUE'){
            // get the saved address
            const deliveryAddress = await db.address.findOne({ _id:new ObjectId(addressId) });
            if(!deliveryAddress){
                return { success:false, error:"No Delivery Address Found." }
            }

            // generate a payment
            const payload =
            {
                userId:new ObjectId(),
                initiatedOn:new Date(),
                completedOn:null,
                orderItems:orderItems ? orderItems : [],
                isPaymentCompleted:false,
                paymentMode: 'CASHFREE',
                totalBill: orderItems.reduce( (item, x) => x += ( item.price * discount/100 * orderCount ), 0 ) ,
                metaData:{
                    address:deliveryAddress
                }
            }

            db.payments.insertOne(payload);

        }else{
            // generate a payment
            const payload =
            {
                userId:new ObjectId(),
                initiatedOn:new Date(),
                completedOn:null,
                orderItems:orderItems ? orderItems : [],
                isPaymentCompleted:false,
                paymentMode: 'CASHFREE',
                totalBill: orderItems.reduce( (item, x) => x += ( item.price * discount/100 * orderCount ), 0 ) ,
                metaData:{}
            }

            db.payments.insertOne(payload);
        }


        return { success:false, error:"incomplete route" }
        

    }catch(err){
        return {success:false, error:err.message}
    }
}


module.exports = { checkout }