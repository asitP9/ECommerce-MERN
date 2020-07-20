const Product=require("../models/product");
const fs=require("fs");
const {errorHandler} = require("../helpers/dbErrorHandler");
// The following packages will be used to handl thefile upload in the form through the postman as to create a product,
// we need to upload an image as well
const formidable=require("formidable");
const _=require("lodash");
const { query } = require("express");
const { json } = require("body-parser");




// This creation of product is very important as it needs form data and photo upload data
exports.create=(req, res)=>{

    let form=new formidable.IncomingForm();
    // This variable keepextension is to keep the same extension as of image i.e. png, or jpg etc
    form.keepExtensions=true;
    form.parse(req, (err, fields, files)=>{
        if(err){
            return res.status(400).json({
                error:"Image could not be uploaded"
            })
        }

        let product=new Product(fields);
        const {name, description, price, category, quantity, photo, shipping}=fields;
        if(!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error:"All fields are required"
            });
        }

        // 1 KB = 1000
        if(files.photo){
            // console.log("FILE PHOTO DETAILS => ",files.photo)
            if(files.photo.size>1000000)//more than 1 MB
                return res.status(400).json({
                    error:"Image should be less than 1 MB size"
                });
            product.photo.data=fs.readFileSync(files.photo.path);
            product.photo.contentType=files.photo.type;
        }

        product.save((err, result)=>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            return res.json({
                result
            })
        })

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

    
    exports.read=(req, res)=>{
        req.product.photo=undefined;
        res.status(200).json(
            req.product
        )
    }


    exports.remove=(req, res)=>{
        let product=req.product;
        product.remove((err, deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.status(200).json({
            // deletedProduct,
            "message":"Product Deletion Succeeds"
        })
        })
    }

    // The update method will be same as create method with little modification
    exports.update=(req, res)=>{
        let form=new formidable.IncomingForm();
    // This variable keepextension is to keep the same extension as of image i.e. png, or jpg etc
        form.keepExtensions=true;
        form.parse(req, (err, fields, files)=>{
            if(err){
                return res.status(400).json({
                    error:"Image could not be uploaded"
                })
            }

            let product=req.product;
            product=_.extend(product, fields);

            const {name, description, price, category, quantity, photo, shipping}=fields;
            if(!name || !description || !price || !category || !quantity || !shipping)
                return res.status(400).json({
                    error:"All fields are required"
                });

            // 1 KB = 1000
            if(files.photo){
                // console.log("FILE PHOTO DETAILS => ",files.photo)
                if(files.photo.size>1000000)//more than 1 MB
                    return res.status(400).json({
                        error:"Image should be less than 1 MB size"
                    });
                product.photo.data=fs.readFileSync(files.photo.path);
                product.photo.contentType=files.photo.type;
            }

            product.save((err, result)=>{
                if(err){
                    res.status(400).json({
                        error: errorHandler(err)
                    })
                }
                res.json({
                    result
                })
            })

    })
    }


 /*    
    Return the product based on sell or arrival: New Arrival Features and Most Sold Products or most 
    Popular Products
    by sell = /products?sortBy=sold&order=desc&limit=4
    by arrival = /products?sortBy=createdAt&order=desc&limit=4
    if no params are setInterval, then all products are returned 
*/
exports.list=(req, res)=>{

    let orderBy = req.query.order?req.query.order:"asc";
    let sortBy=req.query.sortBy?req.query.sortBy:"_id";
    let limit=req.query.limit?parseInt(req.query.limit):6;

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, orderBy]])
    .limit(limit)
    .exec((err, products)=>{
        if(err){
            return res.status(400).json({
                error: "Products not found.."
            })
        }
        return res.json(products);
    })
}


/* 
It will find the products based on the requested product category, Other products that have the 
same category will be returned 
*/
exports.listRelated=(req, res)=>{
    let limit=req.query.limit?parseInt(req.query.limit):6;
    // $ne is given to make sure it should not fetch the current product (EXCLUDING)
    Product.find({
        _id:{$ne: req.product}, category:req.product.category
    })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products)=>{
        if(err){
            res.status(400).json({
                error: "Products not found.."
            })
        }
        res.json(
                products
            )
    })
}


exports.listCategories=(req, res)=>{
    Product.distinct("category",{}, (err, products)=>{
        if(err){
            res.status(400).json({
                error: "Products not found.."
            })
        }
        res.json(
                products
            )
    })
}


/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
 
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
 
    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);
 
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
 
    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

// Be cautious of res.send and res.json if json, it wont be able to fetch the image
exports.photo=(req, res, next)=>{
    console.log(req.product.photo);
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}
