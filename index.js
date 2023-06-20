const express = require("express");
const app = express();
const port = 3000;

let data = [];
let id = 1;
app.use(express.json());

// Add Item APi
app.post("/addItem", (req, res) => {
  const {title,description} = req.body;
  const newData = {
    id: id,
    title: title,
    description: description,
  };
  data.push(newData);
  id++;
  res.json({ status: true, message: "Item added" });
});

// Get all Item
app.get("/get-data", (req, res) => {
  if (data.length == 0) {
    res.json({ status: false, message: "No data found!" });
  } else {
    res.json({ status: true, data: data });
  }
});

// Delete a particular item
app.post("/deleteItem", (req, res) => {
  // Here we can use app.delete() function also
  const itemId = parseInt(req.body.id);
  const itemIndex = data.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    data.splice(itemIndex, 1);
    res.json({ status: true, message: "Item deleted" });
  } else {
    res.json({ status: false, message: "Item not found" });
  }
});

// Edit or update a particular Item
app.post('/updateItem', (req, res) => {
    // Here we can use app.put() function also
    const itemId = parseInt(req.body.id);
    const { title, description } = req.body;
  
    const itemIndex = data.findIndex(item => item.id === itemId);
  
    if (itemIndex !== -1) {
      data[itemIndex].title = title;
      data[itemIndex].description = description;
      res.json({ status: true, message: "Item updated" });
    } else {
      res.json({ status: false, message: "Item not found" });
    }
  });
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
