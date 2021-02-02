const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

mongoose.connect("mongodb+srv://<yourUserName>:<yourPassword>@cluster0.zkxxg.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your Todo List!",
});

const item2 = new Item({
  name: "Click + to add new task.",
});

const item3 = new Item({
  name: "<--Hit to delete a task.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema],
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        // console.log("deleted");
        res.redirect("/");
      } else {
        console.log(err);
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

app.get("/:listName", function (req, res) {
  const customListName = _.capitalize(req.params.listName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        //show existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

let port = process.env.PORT;
if(port== null || port== ""){
  port = 3000;
}

app.listen(port, function () {
  console.log("server has started");
});

// Item.deleteMany({_id :["600a59684820123f887252d2", "600a59684820123f887252d3", "600a59684820123f887252d4"]}, function(err){
//     if(err){
//       console.log(err);
//     }
//     else{
//       console.log("deleted");
//     }
//   });

// app.get("/work", function(req, res){
//     res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// List.deleteOne({name:"work"}, function(err){
// });

// List.deleteMany({}, function(err){
//   if(err){
//     console.log(err);
//   }
//   else{
//     console.log("all deleted");
//   }
// });
