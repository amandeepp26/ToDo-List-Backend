const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const Data = require('./models/TodoModel');
const app = express();
const port = 3000;
const SECRET_KEY = 'mysecretkey';

let data = [];
let id = 1;
app.use(express.json());


// Validate token middleware function
const validateToken =(req,res,next)=>{
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  console.log("Token is--------->",token)
  if(!token || token == undefined){
    res.status(401).json({message:"Token is not provided!"})
  }
  jwt.verify(token,SECRET_KEY,(err,decode)=>{
    if(err){
      res.status(403).json({message:"Unauthorised access"})
    }
    req.user = decode
    next();
  })

}

// //  Add Item APi normal method
    // app.post("/addItem", (req, res) => {
    //   const { title, description } = req.body;
    //   const newData = {
    //     id: id,
    //     title: title,
    //     description: description,
    //   };
    //   data.push(newData);
    //   id++;
    //   res.json({ status: true, message: "Item added" });
    // });

// Add item API mongoose model
app.post('/addItem' , validateToken, async (req,res)=>{
  try{
    await Data.create(req.body);
    res.status(200).json({status:true,message:'Product added successfully'})
  }catch(err){
    res.status(500).json({message:err.message});
  }
})

// Get all Item
app.get("/get-data", validateToken, async(req, res) => {
  const data = await Data.find({});
  if (data.length == 0) {
    res.json({ status: false, message: "No data found!" });
  } else {
    res.json({ status: true, data: data });
  }
});

// Delete a particular item

app.post("/deleteItem/:id", validateToken, async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(401).json({ message: "Invalid id" });
    }
    const item = await Data.findByIdAndRemove(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Edit or update a particular Item
app.post("/updateItem/:id", validateToken, async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(401).json({ message: "Invalid id" });
    }

    const updatedData = req.body; // Assuming the updated data is sent in the request body

    const item = await Data.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Sign-up
app.post("/user/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res
      .status(200)
      .json({ status: true, message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post("/user/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    const token = jwt.sign(email, SECRET_KEY);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.password !== password) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid password" });
    }

    res
      .status(200)
      .json({
        status: true,
        message: "User logged in successfully!",
        token: token,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose
  .connect("mongodb+srv://amandeep:Aman8755@cluster0.tyh5o0w.mongodb.net")
  .then(() => {
    console.log("Connected");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
