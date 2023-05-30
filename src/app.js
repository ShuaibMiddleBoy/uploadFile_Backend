const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const User = require("./model/User");
const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, "../public/images");

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/upload_file").then(()=>{
    console.log("Database Connected Successfully");
}).catch(()=>{
    console.log("Database Connection Failed");
})

app.use("/images", express.static(filePath))

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, filePath)
    },
    filename : (req, file, cb)=>{
        cb(null, uuidv4()+'-'+ Date.now() + path.extname(file.originalname))
    }
})


const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)){
        cb(null, true);
    } else{
        cb(null, false);
    }
}


let upload = multer({storage})


app.post("/user/add",upload.single("photo"), (req,res)=>{
const name = req.body.name;
const birthDate = req.body.birthDate;
const photo = req.file.filename;

const newUserData = {
    name,
    birthDate,
    photo
}

const newUser = new User(newUserData)
newUser.save()
.then(()=>{
    res.json("User Added")
})
.catch((err)=>{
    res.status(400).json({"ERROR": err})
})

})

app.get("/", async (req,res)=>{
 User.find()
 .then((data)=>{
    res.json(data)
 }).catch((err)=>{
    res.status(400).json({"ERROR": err})
 })

})

app.listen(8000, ()=>{
    console.log("Server start at port no 8000");
})
