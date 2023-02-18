//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
//added following for mongoose
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//added mongoose connection and new db
// mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser: true});
//connect to mongo online atlas cloud
mongoose.connect("mongodb+srv://mongos:test123@cluster0.cwhbhti.mongodb.net/todolistDB", {useNewUrlParser: true});
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

//create a new schema
const listSchema = {
  name: String,
  items: [itemsSchema]

};

//create mongoose model
const List = mongoose.model("List", listSchema);

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
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
});
});


// app.get("/work", function(req,res){
//   res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

//use dynamic route instead:

app.get('/:cust6omerListName', function (req, res) {
  // res.send(`Page: ${req.params.customerListName}`)
  // console.log(req.params.cust6omerListName);

  //add lodash to it:
  const customerListName = _.capitalize(req.params.cust6omerListName);


  List.findOne({ name: customerListName}, function(err, foundList) {
     if(!err){
       if(!foundList){
        //  console.log("Doesnot exist");
        //Create a new list
        const list = new List ({
          name: customerListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customerListName);

       } else {
        //  console.log("Exist");
        //Show an existing list
        res.render("List",  {listTitle: foundList.name, newListItems: foundList.items})

       }
      }
 
    });
     
    //  }

  });
  

app.get("/about", function(req, res){
  res.render("about");
});

app.post("/", function(req, res){

  //use mongo db to save the new item
  const itemName = req.body.newItem;
     //added value to the button in list.ejs, now add this line:
  const listName = req.body.list;
  //continue with mongo db to save the new item
  const item = new Item({
    name: itemName
  });

  if(listName ==="Today")
{
  item.save();
  res.redirect("/");
}  else {
  List.findOne({name: listName}, function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/"+ listName);
  });
}
}); 

app.post("/delete", function(req, res){
    // console.log(req.body.checkbox);
    const checkedItemID = req.body.checkbox;
    const listName =req.body.listName;

    if(listName === "Today"){
      
    //find and remove by ID in MongoDB
    Item.findByIdAndRemove(checkedItemID, function(err){
      if (!err){
        console.log("Successfully deleted checked item");
        res.redirect("/");
     }
        });
    } else {
      //use mongoose to delete array items which match condition
      List.findOneAndUpdate({name: listName}, {$pull: {items:{_id:checkedItemID}}}, function(err, foundList){
        if (!err){
          res.redirect("/" + listName);
        }

});
    }
});

// let port = process.env.PORT;
// IF (port == null || port == "") 
// {
//   port = 3000;
// }

// app.listen(port);


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// app.listen(port, function() {
//   console.log("Server started successfully");
// });

