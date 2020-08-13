const {requireSignInForAuth, isAuth}=require("../controllers/auth");
const express=require("express");
const router=express.Router();
const {userById}=require("../controllers/user");
const {generateToken, processPayment}=require("../controllers/braintree");


router.param('userid', userById);
router.get("/braintree/getToken/:userid", requireSignInForAuth, isAuth, generateToken);
router.post("/braintree/payment/:userid", requireSignInForAuth, isAuth, processPayment);

module.exports = router;