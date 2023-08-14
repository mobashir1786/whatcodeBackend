const express = require('express');
const cors=require('cors')

const bodyParser=require('body-parser');
const userRoute=require('./routes/userRoute');
const productRoute=require('./routes/productRoute');
const adminRoute=require('./routes/adminRoute')
const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    console.log("Hello World");
    res.send({"status":200,"messge":"success"})
})
app.use(userRoute);
app.use(productRoute);
app.use(adminRoute);

app.listen(process.env.PORT || 4000, () => {
    console.log("server is running: http://localhost:4000");
})