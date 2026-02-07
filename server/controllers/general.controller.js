const { ObjectId } = require("mongodb");
const { db } = require("../utils/db")

async function websiteData(){
    try{
        const websiteData = await db.website.find().toArray();

        const categories = await getCategories();
        const subCategories = await getSubCategories();


        return { success:true, data:{ websiteData:websiteData[0], categories:categories?.data.categories, subCategories:subCategories?.data.subCategories } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function getCategories(){
    try{
        const categories = await db.categories.find().toArray();
        return { success:true, data:{ categories } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function getSubCategories(){
    try{
        const subCategories = await db.subCategories.find().toArray();
        return { success:true, data:{ subCategories } }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function getProducts({
  page = 1,
  limit = 20,
  category,
  subCategory,
  sortBy,
  filters = {},
  searchText
})
{
  try
  {
    page = Math.max(Number(page), 1);
    limit = Number(limit);

    const skip = (page - 1) * limit;

    const searchQuery = { isDeleted: false };

    if (category && ObjectId.isValid(category))
      searchQuery.categoryId = new ObjectId(category);

    if (subCategory && ObjectId.isValid(subCategory))
      searchQuery.subCategoryId = new ObjectId(subCategory);

    if (searchText)
    {
      searchQuery.$or = [
        { slug: { $regex: searchText, $options: "i" } },
        { name: { $regex: searchText, $options: "i" } }
      ];
    }

    /* ✅ SAFE FILTERS */
    const allowedFilters = ["brand", "price", "rating"];
    for (const key of allowedFilters)
    {
      if (filters[key] !== undefined)
        searchQuery[key] = filters[key];
    }

    const productsCount =
      await db.products.countDocuments(searchQuery);

    let cursor = db.products.find(searchQuery);

    /* ✅ SAFE SORTING */
    const allowedSorts = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      newest: { createdAt: -1 }
    };

    if (sortBy && allowedSorts[sortBy])
      cursor = cursor.sort(allowedSorts[sortBy]);

    const products = await cursor
      .skip(skip)
      .limit(limit)
      .toArray();

    return {
      success: true,
      data: {
        products,
        productsCount,
        page,
        limit,
        totalPages: Math.ceil(productsCount / limit),
      }
    };
  }
  catch (err)
  {
    return { success: false, error: err.message };
  }
}

async function getProductsGroupByCategory() {
    try {
        const response1 = await getCategories();
        const categories = response1.data.categories;

        const payload = await Promise.all(
            categories.map(async (category) => {
                const productsResponse = await getProducts({
                    category: String(category._id)
                });

                return {
                    category,
                    products: productsResponse.data.products
                };
            })
        );

        return { success: true, data: { data: payload } };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function productDetails( id )
{
    try{
        console.log(id);

        const product = await db.products.find({ _id:new ObjectId(id) }).toArray();
        if(product && product.length > 0)
        {
            return {success:true, data:{ product:product[0] }}
        }
        else{
            return {success:false, error:"Product not Found"}
        }
    }catch(err){
        return { success:false, error:err.message }
    }
}

async function categoryPageData( category_id ){
    try{
        let subCategories = await db.subCategories.find().toArray();
        subCategories = subCategories.filter( x => x.categoryId == category_id );

        let products = await getProducts({ category:category_id });
        products = products.data
        return { success:true, data:{ subCategories:subCategories, products:products } }
    }catch(err){
        return { success:false, error:err.message }
    }
}


module.exports = { websiteData, getCategories, getSubCategories, getProducts, categoryPageData, getProductsGroupByCategory, productDetails }