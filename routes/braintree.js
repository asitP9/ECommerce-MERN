const {requireSignInForAuth, isAuth}=require("../controllers/auth");
const express=require("express");
const router=express.Router();
const {userById}=require("../controllers/user");
const {generateToken}=require("../controllers/braintree");


router.param('userid', userById);
router.get("/braintree/getToken/:userid", requireSignInForAuth, isAuth, generateToken)


module.exports = router;