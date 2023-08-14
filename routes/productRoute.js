const express = require("express");
const productRoute = express.Router();
const mongoose = require('mongoose');
const productSchema = require('../schema/productSchema');


mongoose.connect("mongodb+srv://mobashir:mobashir123@cluster0.sv5dvda.mongodb.net/Reflect?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected with mongodb");
    })
    .catch((err) => {
        console.log(err);
    });
const productModel = new mongoose.model("Events", productSchema);


productRoute.post("/createEvent", async (req, res) => {
    const bodyData = req.body;
    const eventName = bodyData.eventName;
    const location = bodyData.location;
    const capacity = bodyData.capacity;
    const date = bodyData.date;
    const detail = bodyData.detail;
    const viewable=bodyData.viewable;
    // console.log(title,price,discount,detail,imgurl)

    const output = await productModel.create({
        eventName,location,capacity,date,detail,viewable
    });
    res.status(200).json({
        success: true,
        output
    })
})

// get all event 
productRoute.get("/getevents", async (req, res) => {

    const output = await productModel.find({"viewable":true});
    res.status(200).json({
        success: true,
        output
    })
});
// get all event for admin
productRoute.get("/getevents/admin", async (req, res) => {

    const output = await productModel.find();
    res.status(200).json({
        success: true,
        output
    })
});
// get  event by id 
productRoute.get("/geteventByid/:eventId", async (req, res) => {
    const queryParams = req.params;
    const eventId = queryParams.eventId;
    console.log(eventId);

    const output = await productModel.find({_id:eventId});
    res.status(200).json({
        success: true,
        output
    })
});
// update single event 
productRoute.post("/updateeventByid", async (req, res) => {
    const bodyData = req.body;
    const eventName = bodyData.eventName;
    const location = bodyData.location;
    const capacity = bodyData.capacity;
    const date = bodyData.date;
    const detail = bodyData.detail;
    const viewable=bodyData.viewable;
    const eventId = bodyData.eventId;
    console.log(eventId);

    const output = await productModel.updateOne({_id:eventId},{$set:{eventName,location,capacity,date,detail,viewable}})


    res.status(200).json({
        success: true,
        output
    })
});

// search product 
productRoute.post("/eventSearch", async (req, res) => {
    const bodyData = req.body;
    const search = bodyData.search;
    console.log(search);

    const productData = await productModel.find({$and:[{"viewable":true,$or:[{eventName:{'$regex':new RegExp(search,"i")}},{location:{'$regex':new RegExp(search,"i")}},{detail:{'$regex':new RegExp(search,"i")}}]}]})
    console.log(productData);
    res.status(200).json({
        success: true,
        productData
    })
})

module.exports = productRoute;