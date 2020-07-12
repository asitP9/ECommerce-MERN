const {userById}=require("../controllers/user");
const {requireSignInForAuth, isAuth, isAdmin}=require("../controllers/auth");
const {create,productById, read, remove, update}=require("../controllers/product");

const express=require("express");
// const expressJwt=require("express-jwt"); // for authorisation check

const router=express.Router();


router.get('/product/:productid', read);
router.post('/product/create/:userid',requireSignInForAuth, isAuth, isAdmin, create);
router.delete('/product/:productid/:userid',requireSignInForAuth, isAuth, isAdmin, remove);
router.put('/product/:productid/:userid',requireSignInForAuth, isAuth, isAdmin, update);


router.param('userid', userById);
router.param('productid', productById);


module.exports = router;