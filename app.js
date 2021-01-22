const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+ "/date.js");  //local module  

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const items = ["Shopping", "Studying", "Eating"];
const workItems = [];
app.get("/", function (req, res) {


 const day = date.getDate();

  // let today = new Date();
  
  // let options = {
  //     weekday: "long",
  //     day: "numeric",
  //     month: "long"
  // };
  
  // let day = today.toLocaleDateString("en-US", options);
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function(req, res){
    
   // console.log(req.body.list);
    let item = req.body.newItem;

    if(req.body.list === "Work List"){
      workItems.push(item);
      res.redirect("/work");
    }
    else
    {
        items.push(item);
        res.redirect("/");
    }
   
   // items.push(item);
    
   // console.log(item);
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

// app.post("/work", function(req, res){
//     let item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// });

app.listen(3000, function () {
  console.log("server is active at port 3000");
});
