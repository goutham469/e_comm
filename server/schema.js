const { ObjectId } = require("mongodb");

{
    "website"=[
        {
            "flash_title":{
                "text":"Flat 25% off on electronics",
                "href":"electronics"
            },
            "banner_desktop":[
                {
                    "url":"url",
                    "href":"target url"
                }
            ],
            "banner_mobile":[
                {
                    "url":"url",
                    "href":"target url"
                }
            ],
            "suspend_user_service":false,
            "API_calls":0,
            "website_calls":0
        }
    ],
    "cart"={
        "_id":"",
        "user_id":"",
        "cartItems":[{
                        "orderCount":1,
                        ...productData
                    }],
        "updatedAt":new Date()
    },
    address={
        _id:new ObjectId(),
        userId:new ObjectId(),
        savedOn:new Date(),
        address:"1-72/1, Madhapuram, Mudigonda, Khammam, Telangana, INDIA",
        pincode:507170,
        metaData:{}
    },
    payments={
        _id:new ObjectId(),
        userId:new ObjectId(),
        initiatedOn:new Date(),
        completedOn:new Date(),
        orderItems:[],
        isPaymentCompleted:false,
        paymentMode:[ 'RAZORPAY', 'CASHFREE', 'STRIPE', 'CASH_ON_DELIVERY' ],
        totalBill:0,
        metaData:{}
    }
}