require("dotenv").config();

const express = require("express");
const app = express()
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const passportLocalMongoose = require("passport-local-mongoose");
const googleStrategy = require("passport-google-oauth20").Strategy;
const findOrCreate = require("mongoose-findorcreate");


const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public/"));
app.set("view engine", "ejs");
app.set("trust proxy",1);
app.use(session({
    secret: process.env.SECRETS,
    resave: false,
    saveUninitialized: false,
    // cookie: {secure:true}
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true});
// mongoose.connect("mongodb://localhost:27017/MainLs", {useNewUrlParser: true});

const todoSchema = new mongoose.Schema({
    firstName: String,
    username: String,
    password: String,
    googleId: String,
    todata: [
        {
            hName: String,
            listItems: [],
        }
    ],
});

todoSchema.plugin(passportLocalMongoose);
todoSchema.plugin(findOrCreate);

const MainLs = new mongoose.model("MainLs", todoSchema);

passport.use(MainLs.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home" || port+"/auth/google/home",
    },
    function(accessToken, refresToken, profile, cb){
        MainLs.findOrCreate({googleId: profile.id}, function(err, user){
            user.firstName=profile._json.given_name;
            user.username=profile._json.email;
            user.todata={hName:"Today", listItems: ["Add some items.."]}
            user.save();
            return cb(err,user);
        })
    }
))

app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/", (req,res)=>{
    if(req.isAuthenticated()){
        console.log("hello user");  
        res.redirect("/Today");   
        // res.send("<form method='post'><h1>Welcome</h1><button type='submit' formaction='logout'>Logout</button></form>")
    }
    else{
        res.redirect("/login")
    }
});

app.get("/login", (req,res)=>{
    res.render("login");
});

app.get("/register", (req,res)=>{
    res.render("login");
});

app.get("/auth/google", 
    passport.authenticate("google", {scope: ["profile", "email"]})
);

app.get("/auth/google/home", 
    passport.authenticate("google", {failureRedirect: "/login"}),
    function(req,res){
        res.redirect("/");
    }
);

app.get("/:headls", (req,res)=>{
    if(req.isAuthenticated()){
        var headrw = req.params.headls;
        var uname = req.user.username;
        MainLs.findOne({username: uname}, function(err, userFound){
            if(err){console.log(err);}
            else{
                var isThere = 0;
                var usrD = userFound;
                var fName = "User";
                if(userFound.firstName){
                    fName = userFound.firstName;
                }
                var tData = usrD.todata;
                var headersLists = [];
                var toLists = [];
                tData.forEach(d=>{
                    if(headrw===d.hName){
                        isThere=1;
                        toLists=d.listItems;
                    }
                    headersLists.push(d.hName);
                });
                if(isThere){
                    res.render("index", {header: headrw, listIte: toLists, hLists: headersLists, userFName: fName}); 
                }
                else{
                    res.redirect("/");
                }
            }
        });
    }
    else{
        res.redirect("/login");
    }
});    

app.post("/register", (req,res)=>{
    var fname = req.body.fname;
    var unew = req.body.username;
    var pnew = req.body.password;
    MainLs.register({username: unew}, pnew, function(err, newUser){ 
        if(err){console.log(err);}
        else{
            // passport.authenticate("local")(req,res,function(){
            newUser.firstName=fname;
            hh={hName: "Today", listItems: ["Add some items.."]}
            newUser.todata.push(hh);
            newUser.save();
            res.redirect("/login");
            // });
        }
    });
});

app.post("/login", (req,res)=>{
    var uname = req.body.username;
    var upwd = req.body.password;
    const user = new MainLs({
        username: uname,
        password: upwd,
    });
    req.login(user, (err)=>{
        if(err){console.log(err);}
        else{
            passport.authenticate("local")(req,res,function(){
                MainLs.findOrCreate({username: uname}, function(err, userFound){
                    if(err){console.log(err);}
                    else{
                        console.log("Login Successful");
                    }
                });
                res.redirect("/");
            });
        }
    });
});

app.post("/logout", (req,res)=>{
    var uname=req.user.username;
    req.logout((err)=>{
        if(err){console.log(err);}
        else{
            MainLs.findOne({username: uname}, function(err, userFound){
                if(err){console.log(err);}
                else{
                    console.log("Logout successful! We hope you liked our website!");
                }
            });
        }
        res.redirect("/login");
    });
});

app.post("/:headrw/addList", (req,res)=>{
    var uname = req.user.username;
    var ulistItem = req.body.list_item;
    var headrw = req.params.headrw;
    MainLs.findOne({username: uname, hName: headrw}, function(err, userFound){
        if(err){console.log(err);}
        else{
            var tData = userFound.todata;
            tData.every(d=>{
                if(headrw===d.hName){
                    if(d.listItems.length==1 && d.listItems[0]=="Add some items.."){
                        d.listItems=[];
                    }
                    d.listItems.push(ulistItem);
                    userFound.save();
                    return false;
                }
                else{
                    return true;
                }
            });
            res.redirect("/"+headrw);
        }
    });
});

app.post("/:headrw/addHeader", (req,res)=>{
    var uname = req.user.username;
    var newH = req.body.inHeader;
    var headrw = req.params.headrw;
    MainLs.findOne({username: uname}, function(err, userFound){
        const newToData = {
            hName: newH,
            listItems: ["Add some items.."],
        }
        userFound.todata.push(newToData);
        userFound.save();
        res.redirect("/"+headrw);
    });
});

app.listen(port, ()=>{
    console.log("Server started at "+port);
});