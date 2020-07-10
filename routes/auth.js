const {signup, signin, signout, requireSignIn}=require("../controllers/auth");
const {userSignupValidator}=require("../validators");
const express=require("express");
// const expressJwt=require("express-jwt"); // for authorisation check

const router=express.Router();

// const user=require("../controllers/user");
// router.get('/myGet', hiUser);
router.post('/signup',userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);


router.get("/hello", requireSignIn , (req, res)=>{
    res.send("Hello there");
});

module.exports = router;