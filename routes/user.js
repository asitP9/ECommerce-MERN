const {userById}=require("../controllers/user");
const {requireSignInForAuth}=require("../controllers/auth");

const express=require("express");
// const expressJwt=require("express-jwt"); // for authorisation check

const router=express.Router();


router.param('userid', userById);

router.get("/secret/:userid",requireSignInForAuth, (req, res)=>{
    console.log("REQUEST PARAMS..", req.profile)
    res.status(200).json({
        user:req.profile
        // user:req.profile
    })
})


module.exports = router;