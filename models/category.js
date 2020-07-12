// crypto is a core module to hash the password and uuid is a package to generate unique strings
const mongoose=require("mongoose");


const categorySchema=new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required: true,
        maxLength:32
    }    
},{
    timestamps:true
}
)


module.exports = mongoose.model("Category", categorySchema);

