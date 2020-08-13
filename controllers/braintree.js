const dotenv=require("dotenv");
const braintree= require("braintree");

dotenv.config();

const gateway=braintree.connect(
    {
        environment: braintree.Environment.Sandbox,
        merchantId: process.env.BRAINTREE_MERCHANT_ID,
        publicKey: process.env.BRAINTREE_PUBLIC_KEY,
        privateKey:process.env.BRAINTREE_PRIVATE_KEY
    }
);

exports.generateToken=(req, res)=>{
    gateway.clientToken.generate({},function(err, response){
        if(err){
            return res.status(400).send(err);
        }
        else{
            return res.send(response);
        }
    })
} 

exports.processPayment = (req, res)=>{
    let nonceFromTheClient=req.body.noonceFromClient;
    let amountFromTheClient=req.body.amount;
    let newTransaction=gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce:nonceFromTheClient,
        options:{
            submitForSettlement:true
        }
    },
    (error, result)=>{
        if(error){
            res.status(500).json(error);
        }
        else{
            res.status(200).json(result);
        }
    }
    )
}
