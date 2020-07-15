//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
let items = ["groserry","bills","recharge","laundary"];
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/", function(req, res) {

  let today = new Date();
  let day = today.getDay();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day1 = today.toLocaleDateString("en-US", options)
  res.render("list", {
    kindOfDay: day1,
    liItems: items
  })
});

app.post("/", function(req, res) {
  let item = req.body.nextListItem;
  items.push(item);
  console.log(items);
  res.redirect("/");
});









app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
