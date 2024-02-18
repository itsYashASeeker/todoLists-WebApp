require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const googleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");
const { courses } = require("./courseD/courses");
var cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
var smtpTransport = require("nodemailer-smtp-transport");

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public/"));
app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SECRETS,
    resave: false,
    saveUninitialized: false,
    // cookie: {secure:true}
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
// app.use("/getcourses", createProxyMiddleware({
//     // target: process.env.REACT_COURSE, //original url
//     // changeOrigin: true,
//     //secure: false,
//     onProxyRes: function (proxyRes, req, res) {
//         proxyRes.headers['Access-Control-Allow-Origin'] = '*';
//     }
// }))

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
// mongoose.connect("mongodb://localhost:27017/MainLs", {useNewUrlParser: true});

const likeSchema = new mongoose.Schema({
  likes: Number,
  fId: Number,
});

// likeSchema.plugin(passportLocalMongoose);
// likeSchema.plugin(findOrCreate);

const LikeLs = new mongoose.model("LikeLs", likeSchema);

const todoSchema = new mongoose.Schema({
  firstName: String,
  username: String,
  password: String,
  googleId: String,
  todata: [
    {
      hName: String,
      listItems: [],
    },
  ],
});

todoSchema.plugin(passportLocalMongoose);
todoSchema.plugin(findOrCreate);

const MainLs = new mongoose.model("MainLs", todoSchema);

passport.use(MainLs.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "https://todolists-pora.onrender.com/auth/google/home" ||
        "http://localhost:3000/auth/google/home",
    },
    function (accessToken, refresToken, profile, cb) {
      MainLs.findOrCreate({ googleId: profile.id }, function (err, user) {
        user.firstName = profile._json.given_name;
        user.username = profile._json.email;
        user.todata = { hName: "Today", listItems: ["Add some items.."] };
        user.save();
        return cb(err, user);
      });
    }
  )
);

app.get("/favicon.ico", (req, res) => res.status(204));

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    console.log("hello user");
    MainLs.findOne({ username: req.user.username }, (err, userFound) => {
      if (err) {
        console.log(err);
        res.redirect("/login");
      } else {
        var redH = userFound.todata[0].hName;
        res.redirect("/" + redH);
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("login");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/home",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

app.get("/:headls", (req, res) => {
  if (req.isAuthenticated()) {
    var headrw = req.params.headls;
    var uname = req.user.username;
    MainLs.findOne({ username: uname }, function (err, userFound) {
      if (err) {
        console.log(err);
      } else {
        var isThere = 0;
        var usrD = userFound;
        var fName = "User";
        if (userFound.firstName) {
          fName = userFound.firstName;
        }
        var tData = usrD.todata;
        var headersLists = [];
        var toLists = [];
        tData.forEach((d) => {
          if (headrw === d.hName) {
            isThere = 1;
            toLists = d.listItems;
          }
          headersLists.push(d.hName);
        });
        if (isThere) {
          res.render("index", {
            header: headrw,
            listIte: toLists,
            hLists: headersLists,
            userFName: fName,
          });
        } else {
          res.redirect("/");
        }
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.post("/register", (req, res) => {
  var fname = req.body.fname;
  var unew = req.body.username;
  var pnew = req.body.password;
  MainLs.register({ username: unew }, pnew, function (err, newUser) {
    if (err) {
      console.log(err);
    } else {
      // passport.authenticate("local")(req,res,function(){
      newUser.firstName = fname;
      hh = { hName: "Today", listItems: ["Add some items.."] };
      newUser.todata.push(hh);
      newUser.save();
      res.redirect("/login");
    }
  });
});

app.post("/login", (req, res) => {
  var uname = req.body.username;
  var upwd = req.body.password;
  const user = new MainLs({
    username: uname,
    password: upwd,
  });
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        MainLs.findOrCreate({ username: uname }, function (err, userFound) {
          if (err) {
            console.log(err);
          } else {
            console.log("Login Successful");
          }
        });
        res.redirect("/");
      });
    }
  });
});

app.post("/logout", (req, res) => {
  var uname = req.user.username;
  req.logout((err) => {
    if (err) {
      console.log(err);
    } else {
      MainLs.findOne({ username: uname }, function (err, userFound) {
        if (err) {
          console.log(err);
        } else {
          console.log("Logout successful! We hope you liked our website!");
        }
      });
    }
    res.redirect("/login");
  });
});

app.post("/:headrw/addList", (req, res) => {
  var uname = req.user.username;
  var ulistItem = req.body.list_item;
  var headrw = req.params.headrw;
  MainLs.findOne({ username: uname, hName: headrw }, function (err, userFound) {
    if (err) {
      console.log(err);
    } else {
      var tData = userFound.todata;
      tData.every((d) => {
        if (headrw === d.hName) {
          if (d.listItems.length == 1 && d.listItems[0] == "Add some items..") {
            d.listItems = [];
          }
          d.listItems.push(ulistItem);
          userFound.save();
          return false;
        } else {
          return true;
        }
      });
      res.redirect("/" + headrw);
    }
  });
});

app.post("/:headrw/addHeader", (req, res) => {
  var uname = req.user.username;
  var newH = req.body.inHeader;
  var headrw = req.params.headrw;
  MainLs.findOne({ username: uname }, function (err, userFound) {
    var tData = userFound.todata;
    var changeHeader = true;
    tData.every((el) => {
      if (newH === el.hName) {
        changeHeader = false;
        return false;
      } else {
        return true;
      }
    });
    if (changeHeader === true) {
      const newToData = {
        hName: newH,
        listItems: ["Add some items.."],
      };
      userFound.todata.push(newToData);
      userFound.save();
    }
    res.redirect("/" + headrw);
  });
});

app.post("/:headrw/:lItem/del", (req, res) => {
  if (req.isAuthenticated()) {
    var headrw = req.params.headrw;
    var lItem = req.params.lItem;

    MainLs.findOne({ username: req.user.username }, (err, userFound) => {
      var tData = userFound.todata;
      tData.every((el) => {
        if (headrw === el.hName) {
          el.listItems.remove(lItem);
          if (el.listItems.length == 0) {
            el.listItems.push("Add some items..");
          }
          userFound.save();
          res.redirect("/" + headrw);
          return false;
        } else {
          return true;
        }
      });
    });
  }
});

app.post("/:headrw/del", (req, res) => {
  var headrw = req.params.headrw;
  MainLs.findOne({ username: req.user.username }, (err, userFound) => {
    var tData = userFound.todata;
    if (tData.length == 1 && tData[0].hName === headrw) {
      tData[0].hName = "Today";
      tData[0].listItems = ["Add some items.."];
      userFound.save();
      res.redirect("/Today");
    } else {
      var indext = 0;
      tData.every((el) => {
        if (el.hName == headrw) {
          tData.remove(el);
          userFound.save();
          if (tData[indext]) {
            var redH = tData[indext].hName;
          } else {
            var redH = tData[0].hName;
          }
          res.redirect("/" + redH);
          return false;
        } else {
          indext += 1;
          return true;
        }
      });
    }
  });
});

app.post("/:headrw/upd", (req, res) => {
  if (req.isAuthenticated()) {
    var headrw = req.params.headrw;
    var updH = req.body.updHeader;
    MainLs.findOne({ username: req.user.username }, (err, userFound) => {
      if (err) {
        console.log(err);
        res.redirect("/" + headrw);
      } else {
        var tData = userFound.todata;
        tData.every((el) => {
          if (el.hName == headrw) {
            el.hName = updH;
            userFound.save();
            res.redirect("/" + updH);
            return false;
          } else {
            return true;
          }
        });
      }
    });
  }
});

app.post("/:headrw/:lItem/upd", (req, res) => {
  if (req.isAuthenticated()) {
    var headrw = req.params.headrw;
    var lItem = req.params.lItem;
    var strItem = lItem.toString();
    var updItem = req.body[strItem];
    console.log(updItem);
    MainLs.findOne({ username: req.user.username }, (err, userFound) => {
      if (err) {
        console.log(err);
        res.redirect("/" + headrw);
      } else {
        var tData = userFound.todata;
        tData.every((el) => {
          if (headrw == el.hName) {
            var goItem = true;
            var i = 0;
            while (goItem === true) {
              if (el.listItems[i] === lItem) {
                el.listItems[i] = updItem;
                userFound.save();
                res.redirect("/" + headrw);
                goItem = false;
              } else {
                i += 1;
              }
            }
            return false;
          } else {
            return true;
          }
        });
      }
    });
  }
});

app.get("/getcourses/foryash", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return res.json(courses);
});

app.get("/getcourses/likes", async (req, res) => {
  const data = await LikeLs.find();
  res.send(data);
});

app.post("/getcourses/addLike/:id/:likes", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  const fId = req.params.id;
  const likes = req.params.likes;
  await LikeLs.findOneAndUpdate({ fId: fId }, { likes: likes });
  const data = await LikeLs.find();
  res.send(data);
});

app.use(bodyParser.json());

const nodemailer = require("nodemailer");

const transporterV = nodemailer.createTransport({
  service: "yahoo",
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

app.post("/y/u/send", async (req, res) => {
  const { subjectE, bodyE, sendEmail } = req.body;
  //   console.log(subject);
  const mailConfigs = {
    from: `Yash Chauhan <${process.env.APP_USER}>`,
    to: `yashchauhan.coder@gmail.com`,
    subject: subjectE,
    text: bodyE,
  };
  transporterV.sendMail(mailConfigs, async function (err, result) {
    if (err) {
      console.log(err);
      return res
        .status(402)
        .json({ error: ["Error occured, Please try again"] });
    } else {
      transporterV.sendMail({
        from: `Yash Chauhan <aindianboy2697@yahoo.com>`,
        to: sendEmail,
        subject:
          "Yash Chauhan - Thank you for reaching out for the amazing opportunity",
        text: `Hey, This is an auto generated email!\nThis is to confirm that the mail has been received by me\n\nThe mail that you sent:\n-------------------------\nSubject: ${subjectE}\nBody: ${bodyE}\n-------------------------\nI will soon read and respond to your mail!!\nBest Regards,\nYash Kamlesh Chauhan`,
      });
      return res.status(200).send("Mail sent successfully!");
    }
  });
});

app.listen(port, () => {
  console.log("Server started at " + port);
});
