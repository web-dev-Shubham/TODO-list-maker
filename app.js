//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");

const app = express();
let items = ["groserry","bills","recharge","laundary"];
let wItems =[];
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", function(req, res) {

  let day = date;
  res.render("list", {
    pageHeading: day,
    liItems: items,
    witem: wItems
  })
});

app.get("/work",function(req, res){
  res.render("list",{pageHeading: "work",liItems: wItems})
})
app.get("/about" ,function(req , res){
  res.render("about");
})

app.post("/", function(req, res) {
  let item = req.body.nextListItem;
  if(req.body.list === "work"){
    wItems.push(item);
    res.redirect("/work");
  }
  else{

    items.push(item);
    console.log(items);
    res.redirect("/");
  }

});









app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
