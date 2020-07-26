const {userById}=require("../controllers/user");
const {requireSignInForAuth, isAuth, isAdmin}=require("../controllers/auth");
const {create,productById, read, remove, update, list, listRelated, listCategories, listBySearch, photo, listSearch}
        =require("../controllers/product");

const express=require("express");
// const expressJwt=require("express-jwt"); // for authorisation check

const router=express.Router();


router.get('/product/:productid', read);
router.post('/product/create/:userid',requireSignInForAuth, isAuth, isAdmin, create);
router.delete('/product/:productid/:userid',requireSignInForAuth, isAuth, isAdmin, remove);
router.put('/product/:productid/:userid',requireSignInForAuth, isAuth, isAdmin, update);

router.get("/products", list);
// Everytime we have productId in the route VREyeParameters, then the router.param will run and 
// req.product is available after that
router.get("/products/related/:productid", listRelated);
router.get("/products/categories", listCategories);
// route - make sure its post
router.post("/products/by/search", listBySearch);

router.get("/product/photo/:productid", photo);
router.get("/products/search/", listSearch)

router.param('userid', userById);
router.param('productid', productById);


module.exports = router;