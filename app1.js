//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//added following for mongoose
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//added mongoose connection and new db
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});
console.log("Connected to MongoDB");

//create a schema for items
const itemsSchema = new mongoose.Schema({
   name: String
  //  rating: Number,
  //  review: String
});

//create a model for items, a collecting of items
const Item = mongoose.model("Item", itemsSchema);
//mongoos will add s to the item to become items
//Item I is cap. 


const item1 = new Item({
  name: "Welcome to your todolist."
});

const item2= new Item({
  name: "Hit the + button to add a new item."
});


const item3 = new Item({
  name: "<==Hit this to delete an item."
});

//create a default array using above random list
const defaultItems = [item1, item2, item3];


// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

app.get("/", function(req, res) {

// const day = date.getDate();
//use mongoose find()
Item.find({}, function(err, foundItems){

  console.log(foundItems);

  if(foundItems.length === 0){

    // //use Mongodb insertMany
Item.insertMany(defaultItems, function(err){
  if(err) {
    console.log(err);
  } else {
    console.log("Successully saved default items to the itemsDB");
  }
});
//render to list
res.redirect("/");
  }
  else {

  }
  res.render("list", {listTitle: "Today", newListItems: foundItems});
  // }


//   if (err){
//     console.log(err);
//   }
//   else {
//     console.log("Welcome found" , results);
//   }
// }
});


});

app.post("/", function(req, res){

  //use mongo db to save the new item
  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();

  res.redirect("/");

});

app.post("/delete", function(req, res){
    // console.log(req.body.checkbox);
    const checkedItemID = req.body.checkbox;
    //find and remove by ID in MongoDB
    Item.findByIdAndRemove(checkedItemID, function(err){
      if (!err){
        console.log("Successfully deleted checked item");
        res.redirect("/");
     }
   
     });
});




app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
