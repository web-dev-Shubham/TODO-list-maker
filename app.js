const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")
// const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-shubham:database@cluster0.vuxic.mongodb.net/listDB?retryWrites=true&w=majority",{
    useNewUrlParser: true ,
    useUnifiedTopology: true});

const listSchema = new mongoose.Schema({
  name: String
})

const Item = mongoose.model("Item",listSchema);

const item1 = new Item ({
  name: "Welcome"
});
const item2 = new Item ({
  name: "<-- Press to delete"
})
const item3 = new Item ({
  name: "+ to add new task"
})



const workItems = [item1,item2,item3];

const lSchema = new mongoose.Schema({
  name: String,
  items: [listSchema]
});

const Clist = mongoose.model("CList",lSchema);

app.get("/", function(req, res) {

Item.find({} , function(err , foundItem){
  if(foundItem.length === 0){
    Item.insertMany(workItems,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Sucessfully Entered");

      }
    });
res.redirect("/")
  }
  else {
    res.render("list", {listTitle: "Today", newListItems: foundItem});
  }
  console.log(foundItem);
})
// const day = date.getDate();
});


app.get("/:customListName",function(req, res){
  const customList = _.capitalize(req.params.customListName);


Clist.findOne({name: customList}, function(err , foundList){
  if(!err){
    if(!foundList){
      //create a new list
      const clist = new Clist ({
        name: customList,
        items: workItems
      });
    clist.save();
    res.redirect("/"+ customList)
  } else {
    //Show existing listTitle
    res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
  }
  }
})

})
app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const l = req.body.list;


  const item = new Item({
    name: itemName
  });
  if(l === "Today"){
    item.save();
    res.redirect("/");
  }else{
    Clist.findOne({name: l}, function(err , foundList){
      if(err){
        console.log(err)
      }
      else{
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+ l);
      }
    })
  }

});

app.post("/deleting", function(req,res){

  const checkboxID = req.body.checkbox;
  const hiddenInput = req.body.hide;

  if(hiddenInput === "Today"){
    Item.deleteOne({_id: checkboxID},function(err){
     if(err){
       console.log(err)
     }
     else{
       console.log("Sucessfully deleted");
     }
     res.redirect("/")
    })
  }else{
    Clist.findOneAndUpdate({name: hiddenInput},{$pull:{items:{_id: checkboxID}}},function(err,foundItem){
      if(!err){
        res.redirect("/"+ hiddenInput)
      }
    })
  }
})



app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}


app.listen(port, function() {
  console.log("Server started on port 3000");
});
