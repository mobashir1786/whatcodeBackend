const express = require("express");
const userRoute = express.Router();
const mongoose = require('mongoose');
const userSchema = require('../schema/userSchema')
const bcrypt = require("bcryptjs");
const productSchema = require('../schema/productSchema');
mongoose.connect("mongodb+srv://mobashir:mobashir123@cluster0.sv5dvda.mongodb.net/Reflect?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected with mongodb");
    })
    .catch((err) => {
        console.log(err);
    });


// signup
const userModel = new mongoose.model("Users", userSchema)
userRoute.post("/signup", async (req, res) => {

    const bodyData = req.body;
    const firstName = bodyData.firstName;
    const lastName = bodyData.lastName;
    const number = bodyData.number;
    const email = bodyData.email;
    const password = bodyData.password;
    console.log(firstName,lastName, number, email, password);

    const output = await userModel.create({
        firstName,lastName, number, email, password
    });
    const token = output.getJwtToken();
    output.token = token;
    await output.save();

    res.status(200).json({
        success: true,
        message: "User Register Successfully",
        "token": token
    })
})

//login routes
userRoute.post('/login', async (req, res) => {
    const bodyData = req.body;
    const email = bodyData.email;
    const password = bodyData.password;
    const userData = await userModel.findOne({ email: email });
    console.log(userData);
    let token = userData.getJwtToken();
    if (!userData) {
        return res.json({ status: 200, message: "User Not Exist Please Register First", "key": 0, "token": null })
    } else {
        const result2 = await bcrypt.compare(password, userData.password);
        if (result2) {
            console.log("match");
            userData.token = token;
            await userData.save();
            return res.json({ status: 200, message: "User Successfully Login", "key": 1, "token": token })
        } else {
            return res.json({ status: 200, message: "Email Id Or Password Did Not Match", "key": 0, "token": null })
        }

    }
})

// add to cart 
userRoute.post('/addtocart', async (req, res) => {
    const bodyData = req.body;
    const prod_ID= bodyData.prod_id;
    const hallQuantity=bodyData.hallQuantity;

    let cookie = bodyData.token;
    const user = await userModel.findOne({token:cookie});
    if(user.cart.length == 1){
        if(user.cart[0].event_ID == ""){
            user.cart = [];
        }
    }
    let userCart = user.cart;
    
    let checkFlag = 0;
    for(let i=0;i<userCart.length;i++){
        let singleCart = userCart[i];
        if(singleCart.event_ID === prod_ID){
            checkFlag = 1;
            singleCart.hallQuantity = hallQuantity;
            break;
        }
    }
    if(checkFlag === 0){
        user.cart.push({event_ID:prod_ID,hallQuantity:hallQuantity});
    }
    await user.save();
    const lengthOfCart = user.cart.length;
    res.status(200).json({
        success: true,
        user,
        lengthOfCart
    })
})

//fetch cart
const productModel = new mongoose.model("Events", productSchema);
userRoute.post('/fetchCart', async(req, res) => {
    try{
        const body = req.body;
    const token = body.token;
    // console.log(token);
    const user = await userModel.findOne({token:token});
    // console.log(user);
    let cartData  = user.cart;
    if(cartData.length == 1){
        if(cartData[0].event_ID == ""){
            cartData = [];
        }
    }
    let fullCartDetails = [];
    for(let i=0;i<cartData.length;i++){
        let e = cartData[i];
        let prodid = e.event_ID;
        let singleProd = await productModel.findOne({_id: prodid});
        // console.log(singleProd);
        console.log(singleProd);
        singleProd = singleProd._doc;
        let singleProd_ = {...singleProd, hallQuantity:e.hallQuantity}
        fullCartDetails.push(singleProd_);
    }
    // console.log(fullCartDetails);
    res.status(200).json({
        success: true,
        fullCartDetails
    })
    }catch(e){
        let err = new Error(e);
        console.log(e.message);
    }
})

// place order
userRoute.post('/placeorder',async(req,res)=>{
    const body=req.body;
    const token=body.token;

    console.log(token);
    const user = await userModel.findOne({token:token});
    user.cart = [];
    user.save();

    res.status(200).json({
        success: true,
    })

})

// order detail 
userRoute.post("/orderdetail", async (req, res) => {

    const bodyData = req.body;
    const name = bodyData.name;
    const number = bodyData.number;
    const pincode = bodyData.pincode;
    const state = bodyData.state;
    const add = bodyData.add;
    console.log(name, number, pincode, state,add );

    const token=bodyData.token;
    const user = await userModel.findOne({token:token});
    let userOrder = user.order;
    let firstFlag = 0;
    if(userOrder.length == 1){
        let oneOrder = userOrder[0];
        let oneAddress = oneOrder.addressDetails;
        if(oneAddress.key == 0){
            firstFlag = 1;
        }
    }
    let finalOrderCart = [];
    let cart_ = user.cart;
    for(let i=0;i<cart_.length;i++){
        let oneCart = cart_[i];
        let prodid = oneCart.prod_ID;
        let singleProd = await productModel.findOne({_id: prodid});
        let finalObject = {
            prod_ID:prodid,
            prod_mrp: singleProd.price,
            prod_discount: singleProd.discount,
            prod_total: (singleProd.price - Math.floor((singleProd.price*singleProd.discount)/100)),
            quantity: oneCart.quantity
        }
        finalOrderCart.push(finalObject);

    }
    if(firstFlag == 1){
        let orderArray = [{
            addressDetails: {
                name:name,
                number:number,
                pincode:pincode,
                state:state,
                add: add
            },
            cart:finalOrderCart
        }];
        user.order = orderArray;
    }else{
        let orderObject = {
            addressDetails: {
                name:name,
                number:number,
                pincode:pincode,
                state:state,
                add: add
            },
            cart:finalOrderCart
        };
        user.order.push(orderObject);
    }

    user.cart = [{prod_ID:"", quantity:0}];
    await user.save();

    res.status(200).json({
        success: true,
        user
    })
})

module.exports = userRoute;