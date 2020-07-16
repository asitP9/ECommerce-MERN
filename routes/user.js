const {userById, read, update}=require("../controllers/user");
const {requireSignInForAuth, isAuth, isAdmin}=require("../controllers/auth");

const express=require("express");
// const expressJwt=require("express-jwt"); // for authorisation check

const router=express.Router();


router.param('userid', userById);

// Here below to test the isAdmin and isAuth functionality you have to go to postman and login first then u 
// will get a Token, in the requestProfile add the token in the headers as 
// Authorization: Bearer "ur token not in double quotes" and send the request
router.get("/secret/:userid", requireSignInForAuth, isAuth, isAdmin, (req, res)=>{
    res.status(200).json({
        user:req.profile
        // user:req.profile
    })
})


router.get("/user/:userid", requireSignInForAuth, isAuth, read);
router.put("/user/:userid", requireSignInForAuth, isAuth, update);


module.exports = router;