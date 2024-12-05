const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const userModal = require("./modals/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req,res) => {
    res.render("index");
})

app.post("/create",  (req, res) => {
  let { name, email, age, password } = req.body;
  // ============================================== Encruption ========================
  bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);
    bcrypt.hash(password, salt, async (err, hash) => {
      // ============================================== Encruption ========================
      let createdUser = await userModal.create({
        name: name,
        email: email,
        password: hash,
        age: age,
      });

      let token = jwt.sign({ email: email }, "shhhshhhshhhshh");
      res.cookie("token", token);

      res.send(createdUser);
    });
  });
})


app.get("/login", (req,res) => {
    res.render("login");
})
app.post("/login", async (req,res) => {
    let user = await userModal.findOne({ email: req.body.email });
    console.log(user);
    if (!user) return res.send("Something went wrong");
    console.log(user.password, req.body.password);
    bcrypt.compare(req.body.password, user.password, function (err, result) {
        console.log(result);
        if (result) { 
            let token = jwt.sign({email:user.email}, "shhhshhhshhhshh");
            res.cookie("token", token);
            res.send("Yes you can login"); 
        } 
        else res.send("Something went wrong"); 
    })
})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Your server is running on the port : ${port}`);
})