const User=require("../models/user");
const Product=require("../models/product");


exports.userById=(req, res, next, id)=>{
    User.findById(id).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error: "User not found"
            })
        }
        req.profile=user;
        next();
    })
}

exports.productById=(req, res, next, id)=>{
    Product.findById(id).exec((err, product)=>{
            if(err || !product){
                return res.status(400).json({
                    error:"Product not found"
                })
            }
            req.product=product;
            next();
        })
} 