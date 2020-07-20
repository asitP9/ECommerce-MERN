const Category=require("../models/category");
const {errorHandler} = require("../helpers/dbErrorHandler");
const category = require("../models/category");

exports.create=(req, res)=>{
    const category=new Category(req.body);
    category.save((err, data)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.status(200).json({
            data
        })
    })
}

exports.categoryById=(req, res, next, id)=>{
    category.findById(id).exec((err, category)=>{
        if(err || !category){
            return res.status(400).json({
                error: "category doen't exist"
            });
        }
        req.category=category;
        next();
    })
}

exports.read=(req, res)=>{
    res.status(200).json(
        req.category
    )
}

exports.update=(req, res)=>{
    const category=req.category;
    category.name=req.body.name;
    category.save((err, data)=>{
        if(err){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            data
        })
    })
}

exports.remove=(req, res)=>{
    let category=req.category;
    category.remove((err, deletedCategory)=>{
        if(err){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            "message": "category successfully deleted"
        });
    })
}

exports.list=(req, res)=>{
    Category.find().exec((err, data)=>{
        if(err){
            res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    })
}


// update