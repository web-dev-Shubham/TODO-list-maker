
const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true,useUnifiedTopology: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema); // model name is Capital always
// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];
const item1 = new Item({
  name: "Welcome to your to-doList "
});
const item2 = new Item({
  name: "Hit + to add item"
});
const item3 = new Item({
  name: "<--- click this to del"
});
const defaultItem = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
  // const day = date.getDate();
  Item.find(function(err, items) {
    if (items.length === 0) {
      Item.insertMany(defaultItem, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("SucessFully Entered");
        }
        res.redirect("/")
      });
    } else {
      // mongoose.connection.close();
      // console.log(items);
      res.render("list", {
        listTitle: "Today",
        newListItems: items
      });
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listname = req.body.list;
  // console.log(listname);
  const item = new Item({
    name: itemName
  });
  // console.log(item)
  if (listname === "Today") {
    item.save();
    res.redirect("/")
  } else {
    List.findOne({name: listname}, function(err, foundlist) {
      var x = foundlist.items;
      x.push(item);
      foundlist.save();
      res.redirect("/" + listname)
    });
  }
});

app.get("/:customListName", function(req, res) {

  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, async function(err, foundlist) {
    if (!err) {
      if (!foundlist) {
        const list = new List({name: customListName,  items: defaultItem});
        await list.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundlist.name,
          newListItems: foundlist.items
        });

      }
    }

  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.post("/delete", function(req, res) {
  var itemId = req.body.checkbox;
  const listName = req.body.listname;

if(listName ==="Today"){
  Item.findByIdAndDelete(itemId, function(err) {
    if (!err) {
      console.log("SucessFully Deleted");
    }
  });
  res.redirect("/")
} else{
  List.findOneAndUpdate({name: listName} ,{$pull: {items: {_id: itemId}}} ,function(err, foundlist){
    if(!err){
      res.redirect("/"+listName);
    }
  });
}


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
