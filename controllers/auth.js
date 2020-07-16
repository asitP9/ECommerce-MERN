const User=require("../models/user")
const {errorHandler} = require("../helpers/dbErrorHandler");
const jwt=require('jsonwebtoken');// to generate signed token
const expressJwt=require("express-jwt"); // for authorisation check
const { findOneAndUpdate } = require("../models/user");
const dotenv=require("dotenv");

dotenv.config();

exports.signup=(req, res)=>{
   const user=new User(req.body);
   user.save((err, user)=>{
       if(err){
           return res.status(400).json(
               { error: errorHandler(err) }
            )
       }
       user.hashed_password=undefined;
       user.salt=undefined;
       return res.status(200).json({
           user:user
       })
   })
 
}

// exports.hiUser=(req, res)=>{
//     return res.status(200).json({
//         "user":"asit"
//     })
// }

exports.signin=(req, res)=>{
    // Find the user based on email
    const {email, password}=req.body;
    User.findOne({email}, (err, user)=>{
        if(err||!user){
            return res.status(400).json(
               { error:"User with that email doesn't exist!! Please Signup" }

            )
        }


        // If the user is found, make sure that the email and password match
        // create authenticate method in user model
        else if(!user.authenticate(password)){
            res.status(401).json({
                error:"Email and password dont match"
            })
        }
        else{
            // generate a signed token with user id and secret
            const token=jwt.sign({_id: user._id}, process.env.JWT_SECRET);

            // persist the token as t (any character) in cookie with the expiry date
            res.cookie('t', token, {expire: new Date()+9999} );

            // return response with user and token to frontend clients
            const {_id, name, email, role} = user;
            return res.json({token,
                user:{_id, name, email, role},
            })
        }
    })
}

exports.signout=(req, res)=>{
    res.clearCookie('t');
    res.status(200).json({
        message:"Logout Succeeds"
    })
}


// This function will check if only the authorised user can check other users Credentials, he shouldn't be seeing
exports.isAuth=(req, res, next)=>{
    let user=req.profile && req.auth && req.profile.id===req.auth._id;

    if(!user){
        res.status(403).json(
         { error: "Access Denied" }
      )
    }
    next();
}

// This function will check if the logged in user is the admin

exports.isAdmin=(req, res, next)=>{
    console.log("I AM ADMIN");
    if(req.profile.role === 0){
        res.status(403).json({
            error:"Admin Resource!!! Access Denied"
        })
    }
    next();
}




// The following will use the cookie parser to protect the user who have signed in
exports.requireSignIn=expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms: ['RS256']
})
exports.requireSignInForAuth=expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms: ['HS256']
})