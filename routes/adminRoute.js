const express = require("express");
const adminRoute = express.Router();
const mongoose = require('mongoose');
const adminSchema = require('../schema/adminSchema')
const bcrypt = require("bcryptjs");
mongoose.connect("mongodb+srv://mobashir:mobashir123@cluster0.sv5dvda.mongodb.net/Reflect?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connected with mongodb");
    })
    .catch((err) => {
        console.log(err);
    });


// signup
const adminModel = new mongoose.model("Admin", adminSchema)
adminRoute.post("/adminsignup", async (req, res) => {

    const bodyData = req.body;
    const name = bodyData.name;
    const email = bodyData.email;
    const password = bodyData.password;
    console.log(name, email, password);

    const output = await adminModel.create({
        name, email, password
    });
    const token = output.getJwtToken();
    output.token = token;
    await output.save();

    res.status(200).json({
        success: true,
        message: "Admin Register Successfully",
        "token": token
    })
})

//login routes
adminRoute.post('/adminlogin', async (req, res) => {
    const bodyData = req.body;
    const email = bodyData.email;
    const password = bodyData.password;
    const adminData = await adminModel.findOne({ email: email });
    console.log(adminData);
    let token = adminData.getJwtToken();
    if (!adminData) {
        return res.json({ status: 200, message: "Admin Not Exist Please Register First", "key": 0, "token": null })
    } else {
        const result2 = await bcrypt.compare(password, adminData.password);
        if (result2) {
            console.log("match");
            adminData.token = token;
            await adminData.save();
            return res.json({ status: 200, message: "Admin Successfully Login", "key": 1, "token": token })
        } else {
            return res.json({ status: 200, message: "Email Id Or Password Did Not Match", "key": 0, "token": null })
        }
    }
});

module.exports = adminRoute;