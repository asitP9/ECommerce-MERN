exports.userSignupValidator=(req, res, next)=>{
    req.check("name","Please enter a name").notEmpty();
    req.check("name","Name shouldn't be greater than 32 characters").isLength({
        maxLength:32
    });


    req.check("email","Please enter an email").notEmpty();
    req.check("email","Email shouldn't be greater than 32 characters")
    .isLength({
        min:4,
        max:32})
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @");


    req.check("password","Please enter a password").notEmpty();
    req.check("password","Password must contain atleast 6 characters").isLength({
        min:6
    })
    .matches(/\d/)
    .withMessage("Password must contain atleast a number");

    const errors=req.validationErrors();

    if(errors){
        const firstError=errors.map((error)=>error.msg)[0];
        return res.status(400).json({
            error:firstError
        })
    }

    next();
}