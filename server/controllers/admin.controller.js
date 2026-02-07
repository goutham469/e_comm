const { ObjectId } = require("mongodb");
const { db } = require("../utils/db");
const { analyticsOverview } = require("./analytics.controller");


async function adminOverview()
{
  try{
    return { success:true, data:{ analytics:await analyticsOverview() } }
  }catch(err){
    return {success:false, error:err.message}
  }
}

// user
async function makeAdmin(email) {
  try {
    console.log(email);
    
    const updateStatus = await db.user.updateOne(
      { "email":email },
      { $set: { role: "ADMIN" } }
    );

    console.log( updateStatus )

    if (updateStatus.matchedCount === 0) {
      return { success: false, error: "User not found" };
    }

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
} 
async function revokeAdmin(email) {
  try {
    const user = await db.user.findOne(
      { email },
      { projection: { role: 1 } }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role !== "ADMIN") {
      return { success: false, error: "User is not an ADMIN" };
    }

    const adminCount = await db.user.countDocuments({ role: "ADMIN" });

    if (adminCount <= 1) {
      return {
        success: false,
        error: "At least one ADMIN must exist on the platform"
      };
    }

    const updateStatus = await db.user.updateOne(
      { email },
      { $set: { role: "USER" } }
    );

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function blockUser(email) {
  try {
    const user = await db.user.findOne(
      { email },
      { projection: { role: 1 } }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role !== "ADMIN") {
      const updateStatus = await db.user.updateOne(
                                                    { email },
                                                    { $set: { isBlocked: true } }
                                                  );

      return { success: true, data: updateStatus };
    }

    const adminCount = await db.user.countDocuments({ role: "ADMIN" });

    if (adminCount <= 1) {
      return {
        success: false,
        error: "At least one ADMIN must exist on the platform"
      };
    }

    const updateStatus = await db.user.updateOne(
      { email },
      { $set: { isBlocked: true } }
    );

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function unBlockUser(email) {
  try {
    const user = await db.user.findOne(
      { email },
      { projection: { role: 1 } }
    );

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const updateStatus = await db.user.updateOne(
      { email },
      { $set: { isBlocked: false } }
    );

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function listUsers({ page = 0, limit = 20, name = null, email = null }) {
  try {
    let searchQuery = {};
    // console.log("search started");

    if (name) {
      searchQuery.name = { $regex: name, $options: "i" };
    }

    if (email) {
      searchQuery.email = { $regex: email, $options: "i" };
    }

    const users = await db.user
      .find(searchQuery)
      .skip(page * limit)
      .limit(limit)
      .toArray();

    // console.log(users);

    return {
      success: true,
      data: { users, page, limit }
    };

  } catch (err) {
    return { success: false, error: err.message };
  }
}


// category
async function addCategory(data)
{
  try{
    const { name, icon } = data;

    const insertStatus = await db.categories.insertOne({
      name,
      icon,
      createdAt: new Date()
    });

    return { success: true, data: insertStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function editCategory(data) {
  try {
    const { id, name, icon } = data;

    const updateStatus = await db.categories.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, icon } }
    );

    if (updateStatus.matchedCount === 0) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function deleteCategory(id) {
  try {
    const subCategoryCount = await db.subCategories.countDocuments({
      categoryId: new ObjectId(id)
    });

    if (subCategoryCount > 0) {
      return {
        success: false,
        error: "Delete sub-categories first"
      };
    }

    const deleteStatus = await db.categories.deleteOne({
      _id: new ObjectId(id)
    });

    return { success: true, data: deleteStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// sub-category
async function addSubCategory(data) {
  try {
    const { name, icon, categoryId } = data;

    const categoryExists = await db.categories.findOne({
      _id: new ObjectId(categoryId)
    });

    if (!categoryExists) {
      return { success: false, error: "Category not found" };
    }

    const insertStatus = await db.subCategories.insertOne({
      name,
      icon,
      categoryId: new ObjectId(categoryId),
      createdAt: new Date()
    });

    return { success: true, data: insertStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function editSubCategory(data) {
  try {
    const { id, name, icon } = data;

    const updateStatus = await db.subCategories.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, icon } }
    );

    if (updateStatus.matchedCount === 0) {
      return { success: false, error: "Sub-category not found" };
    }

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function deleteSubCategory(id) {
  try {
    const deleteStatus = await db.subCategories.deleteOne({
      _id: new ObjectId(id)
    });

    if (deleteStatus.deletedCount === 0) {
      return { success: false, error: "Sub-category not found" };
    }

    return { success: true, data: deleteStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

// product
async function addProduct(data, adminId = null) {
  try {
    const {
      name,
      slug,
      description,
      shortDescription,
      thumbnail,
      images = [],
      videoUrl,
      categoryId,
      subCategoryId,
      price,
      discount = 0,
      stock,
      attributes = {},
      availableCoupons = [],
      status = "ACTIVE", // will be INACTIVE 
      visibility = "PUBLIC"
    } = data;

    // 1️⃣ Validate required fields
    if (!name || !price || !categoryId || !subCategoryId || !slug) {
      return { success: false, error: "Missing required fields", fields:{ name:name, categoryId:categoryId?categoryId:"missing", subCategoryId:subCategoryId?subCategoryId:"missing", slug: slug?slug:"missing" } };
    }

    // 2️⃣ Prevent duplicate slug
    const existingProduct = await db.products.findOne({ slug });
    if (existingProduct) {
      return { success: false, error: "Product already exists" };
    }
 
    // 3️⃣ Calculate selling price
    const sellingPrice = price - (price * discount) / 100;

    // 4️⃣ Insert product
    const insertStatus = await db.products.insertOne({
      name,
      slug,
      description,
      shortDescription,
      thumbnail,
      images,
      videoUrl,
      categoryId: new ObjectId(categoryId),
      subCategoryId: new ObjectId(subCategoryId),
      price,
      discount,
      sellingPrice,
      stock,
      attributes,
      availableCoupons,

      ratingAverage: 0,
      ratingCount: 0,
      reviewCount: 0,

      status,
      visibility,
      isDeleted: false,

      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: adminId ? new ObjectId(adminId) : null
    });

    return { success: true, data: insertStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function editProduct(productId, data, adminId = null) {
  try {
    const {
      name,
      description,
      shortDescription,
      thumbnail,
      images,
      videoUrl,
      categoryId,
      subCategoryId,
      price,
      discount,
      stock,
      attributes,
      availableCoupons,
      status,
      visibility
    } = data;

    const updateData = {
      updatedAt: new Date(),
      updatedBy: adminId ? new ObjectId(adminId) : null
    };

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (thumbnail) updateData.thumbnail = thumbnail;
    if (images) updateData.images = images;
    if (videoUrl) updateData.videoUrl = videoUrl;
    if (categoryId) updateData.categoryId = new ObjectId(categoryId);
    if (subCategoryId) updateData.subCategoryId = new ObjectId(subCategoryId);
    if (stock !== undefined) updateData.stock = stock;
    if (attributes) updateData.attributes = attributes;
    if (availableCoupons) updateData.availableCoupons = availableCoupons;
    if (status) updateData.status = status;
    if (visibility) updateData.visibility = visibility;

    // Recalculate price if needed
    if (price !== undefined) updateData.price = price;
    if (discount !== undefined) updateData.discount = discount;

    if (price !== undefined || discount !== undefined) {
      const product = await db.products.findOne({
        _id: new ObjectId(productId)
      });

      if (!product) {
        return { success: false, error: "Product not found" };
      }

      const finalPrice = price ?? product.price;
      const finalDiscount = discount ?? product.discount;

      updateData.sellingPrice =
        finalPrice - (finalPrice * finalDiscount) / 100;
    }

    const updateStatus = await db.products.updateOne(
      { _id: new ObjectId(productId), isDeleted: false },
      { $set: updateData }
    );

    if (updateStatus.matchedCount === 0) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: updateStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}
async function deleteProduct(productId, adminId = null) {
  try {
    const deleteStatus = await db.products.updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          isDeleted: true,
          status: "INACTIVE",
          updatedAt: new Date(),
          updatedBy: adminId ? new ObjectId(adminId) : null
        }
      }
    );

    if (deleteStatus.matchedCount === 0) {
      return { success: false, error: "Product not found" };
    }

    return { success: true, data: deleteStatus };

  } catch (err) {
    return { success: false, error: err.message };
  }
}

module.exports = {
  adminOverview,
  makeAdmin, revokeAdmin, listUsers,blockUser, unBlockUser,
  addCategory, editCategory,  deleteCategory,
  addSubCategory, editSubCategory,  deleteSubCategory,
  addProduct, editProduct, deleteProduct,
};
