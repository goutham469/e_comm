const { db } = require("../utils/db")
 
async function changeFlashTitle({ text, href=null }){
    try{
        const oldSchema = await checkSchemaExists();
        oldSchema.flash_title.text = text;
        oldSchema.flash_title.href = href;

        const deleteStatus = await db.website.deleteOne({ id:1 });
        const insertStatus = await db.website.insertOne( oldSchema );

        return { success:true, data:{ deleteStatus, insertStatus } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function changeDesktopBannerImages( new_images ){
    try{
        const oldSchema = await checkSchemaExists();
        oldSchema.banner_desktop = new_images;

        const deleteStatus = await db.website.deleteOne({ id:1 });
        const insertStatus = await db.website.insertOne( oldSchema );

        return { success:true, data:{ deleteStatus, insertStatus } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function changeMobileBannerImages( new_images ){
    try{
        const oldSchema = await checkSchemaExists();
        oldSchema.banner_mobile = new_images;

        const deleteStatus = await db.website.deleteOne({ id:1 });
        const insertStatus = await db.website.insertOne( oldSchema );

        return { success:true, data:{ deleteStatus, insertStatus } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function changeUserServiceStatus(){
    try{
        const oldSchema = await checkSchemaExists();
        oldSchema.suspend_user_service = !oldSchema.suspend_user_service;

        const deleteStatus = await db.website.deleteOne({ id:1 });
        const insertStatus = await db.website.insertOne( oldSchema );

        return { success:true, data:{ deleteStatus, insertStatus } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

// messages + emails
async function getMobileMessages(){
    try{
        const messages = await db.mobileMessages.find().toArray();
        return { success:true, data:{messages} }
    }catch(err){
        return {success:false, error:err.message}
    }
}

const defaultWebsiteSchema = {
                                "id":1,
                                "flash_title":{
                                    "text":"Flat 25% off on electronics",
                                    "href":"electronics"
                                },
                                "banner_desktop":[
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    },
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    },
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    },
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    }
                                ],
                                "banner_mobile":[
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    },
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    },
                                    {
                                        "url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWTJXW2hMzKZMe6EwTAWAL-NMnsgObxWhZ-Q&s",
                                        "href":"target url"
                                    }
                                ],
                                "suspend_user_service":false,
                                "API_calls":0,
                                "website_calls":0
                            }

async function checkSchemaExists(){
    try{
        const records = await db.website.find().toArray();
        if( records.length > 0 ){
            return records[0]
        }
        await db.website.insertOne( defaultWebsiteSchema );
        return defaultWebsiteSchema;

    }catch(err){
        console.log(err);
        return defaultWebsiteSchema;
    }
}

module.exports = { 
    changeFlashTitle,
    changeDesktopBannerImages,
    changeMobileBannerImages,
    changeUserServiceStatus,
    
    getMobileMessages
}