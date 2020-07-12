const Product=require("../models/product");
const fs=require("fs");
const {errorHandler} = require("../helpers/dbErrorHandler");
// The following packages will be used to handl thefile upload in the form through the postman as to create a product,
// we need to upload an image as well
const formidable=require("formidable");
const _=require("lodash");




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

