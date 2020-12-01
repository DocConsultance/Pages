const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));

// db connections
mongoose.connect("mongodb://localhost:27017/patientsDB", {useNewUrlParser: true});

// schemas
const userSchema = {
  name: String,
  email: String,
  password: String
};

const doctorSchema = new mongoose.Schema({
  doctorID: Number,
  name: String,
  experience: String,
  specialization : String,
  degree: String,
  address: String,
  phoneNo: Number,
  fees: Number,
  openDays: String,
  openTime: String

});

// models
const User = new mongoose.model("User", userSchema)
const Doctor = mongoose.model('Doctor', doctorSchema);

// default list of items
const doc1 = new Doctor({
  doctorID: 101,
  name: "Dr. Ankita Jindal",
  experience: "12 years ",
  specialization: "Periodontist,Dentist",
  degree: "MDS - Periodontics, BDS",
  address: "Plot No 16, Zone 1, MP Nagar, Bhopal",
  phoneNo: 1234567890,
  fees: 200,
  openDays: "Mon-Sat",
  openTime: "11:00am - 2:00pm and 6:00pm - 9:00pm"
});
const doc2 = new Doctor({
  doctorID: 102,
  name: "Dr. Ankit Jindal",
  experience: "12 year",
  specialization: "Periodontist,Dentist",
  degree: "MDS - Periodontics, BDS",
  address: "Plot No 16, Zone 1, MP Nagar, Bhopal",
  phoneNo: 1234567890,
  fees: 200,
  openDays: "Mon-Sat",
  openTime: "11:00am - 2:00pm and 6:00pm - 9:00pm"
})

 const defaultItems = [doc1, doc2];


app.get("/", function(req,res){
  // res.send("hello");
  // res.render("home");
  res.sendFile(__dirname + "/home.html")
});

app.get("/doctors", function(req,res){

  Doctor.find({}, function(err, foundDr){
    if(foundDr.length === 0){
      Doctor.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("added to db");
        }
      })
      res.redirect("/doctors")
    }else{
      res.render('doc.ejs',{newListItems: foundDr})
    }

  })

})

app.get("/appointment", function(req,res){
  res.sendFile(__dirname + "/app.html")
})

app.get("/register", function(req,res){
  res.render('register.ejs')
})
app.post("/register", function(req,res){
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.pass
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render('login.ejs')
    }
  })
})



app.get("/login", function(req,res){
  // res.sendFile(__dirname + "/signin.html")
  res.render('login.ejs')
})

app.post("/login", function(req,res){
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}, function(err, foundUser){
    if(err){
      console.log(err);

    } else{
      if(foundUser){
        if(foundUser.password === password){
          res.sendFile(__dirname + "/doctors.html")
        }
      }
    }
  })
})





app.post("/", function(req,res){
  res.redirect("/");
})

app.post("/login", function(req,res){
  res.redirect("/");
})

app.post("/register", function(req,res){
  res.redirect("/");
})

// app.get("/about", function(req,res){
//   res.send("<h1>thus is ajeyata verma</h1>")
// });
// app.get("/contact", function(req,res){
//   res.send("<h1>contact me</h1>")
// });

app.listen(3000, function(){
  console.log("server at 3000;")
});
