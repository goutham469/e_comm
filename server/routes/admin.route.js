const express = require("express");
const adminRouter = express.Router();

const {
  addCategory,
  editCategory,
  deleteCategory,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  addProduct,
  editProduct,
  deleteProduct,
  adminOverview,
  listUsers,
  makeAdmin,
  revokeAdmin,
  blockUser,
  unBlockUser
} = require("../controllers/admin.controller");
const { changeFlashTitle, changeMobileBannerImages, changeDesktopBannerImages, getMobileMessages } = require("../controllers/website.controller");
const { deleteUser } = require("../controllers/user.controller");

adminRouter.get("/overview", async (req,res)=> res.send( await adminOverview() ))

// CATEGORY ROUTES
adminRouter.post(
  "/category",
  async (req, res) => {
    const result = await addCategory(req.body);
    res.status(result.success ? 201 : 400).json(result);
  }
);

adminRouter.put(
  "/category/:id",
  async (req, res) => {
    const result = await editCategory({
      id: req.params.id,
      ...req.body
    });
    res.status(result.success ? 200 : 400).json(result);
  }
);

adminRouter.delete(
  "/category/:id",
  async (req, res) => {
    const result = await deleteCategory(req.params.id);
    res.send( result )
  }
);

// SUB-CATEGORY
adminRouter.post(
  "/sub-category",
  async (req, res) => {
    const result = await addSubCategory(req.body);
    res.json(result);
  }
); 

adminRouter.put(
  "/sub-category/:id",
  async (req, res) => {
    const result = await editSubCategory({
      id: req.params.id,
      ...req.body
    });
    res.json(result);
  }
);
 
adminRouter.delete(
  "/sub-category/:id",
  async (req, res) => {
    const result = await deleteSubCategory(req.params.id);
    res.json(result);
  }
);

adminRouter.post("/add-product", async (req,res) => res.send( await addProduct(req.body, req.userId) ))
adminRouter.put("/edit-product/:id", async(req,res) => { res.send( await editProduct(req.params.id, req.body, req.userId ) )})
adminRouter.delete("/delete-product/:id", async(req,res) => res.send( await deleteProduct(req.params.id, req.userId ) ))

// website management
adminRouter.post("/edit-flash-title", async (req, res) => res.send( await changeFlashTitle( req.body ) ))
adminRouter.put("/edit-banner-images-desktop", async (req, res) => res.send( await changeDesktopBannerImages( req.body ) ) )
adminRouter.put("/edit-banner-images-mobile", async (req, res) => res.send( await changeMobileBannerImages( req.body ) ) )

// user
adminRouter.get("/users", async(req,res)=> res.send( await listUsers( req.params ) ))
adminRouter.get("/make-admin/:email", async(req,res)=> res.send( await makeAdmin( req.params.email ) ))
adminRouter.get("/revoke-admin/:email", async(req,res)=> res.send( await revokeAdmin( req.params.email ) ))
adminRouter.delete("/delete-user/:id", async(req,res)=> res.send( await deleteUser( req.params.id ) ))
adminRouter.put("/block-user/:email", async(req,res)=> res.send( await blockUser( req.params.email ) ))
adminRouter.put("/unblock-user/:email", async(req,res)=> res.send( await unBlockUser( req.params.email ) ))

// Mobile messages
adminRouter.get("/mobile-messages", async(req, res) => res.send( await getMobileMessages() ))

module.exports = adminRouter;