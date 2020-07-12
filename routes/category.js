const {userById}=require("../controllers/user");
const {requireSignInForAuth, isAuth, isAdmin}=require("../controllers/auth");
const {categoryById, create, read, update, remove, list}=require("../controllers/category");

const express=require("express");
// const expressJwt=require("express-jwt"); // for authorisation check

const router=express.Router();

router.param('userid', userById);
router.post('/category/create/:userid',requireSignInForAuth, isAuth, isAdmin, create);
router.get("/category/:categoryid", read)
router.put("/category/:categoryid/:userid", requireSignInForAuth, isAuth, isAdmin, update);
router.delete("/category/:categoryid/:userid", requireSignInForAuth, isAuth, isAdmin, remove);
router.get("/categories", list);

router.param('categoryid',  categoryById);
module.exports = router;