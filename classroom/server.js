const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
// const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// to remove the warningg we will set resave to false,

const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.successmsg=req.flash("success");
  res.locals.errormsg=req.flash("error");
  next();
});

app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;

    req.session.name=name;
    // in this way we will gonna save inside cookie and can use it in other paths also

     if(name === "anonymous"){
          req.flash("error","user not registered!!");
     }
     else{
          req.flash("success","user registered successfully!!");
     }
     
    // console.log(req.session);
    
    // res.send(name);
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
//   res.send(`hello,${req.session.name}`);
// console.log(req.flash("success"));       
// res.render("page.ejs",{name:req.session.name, msg:req.flash("success")});

 res.render("page.ejs",{name:req.session.name});

});

// app.get("/test",(req,res)=>{
//     res.send("test successfull!!");
// });

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }
    res.send(`you sent a request ${req.session.count} times`);
});

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);
//     console.log(req.signedCookies);
//     res.send("verified");
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.cookie("greeta","namaste");
//     res.cookie("madein","india");
//     res.send("hi, i have sent you some cookies!!");
// });

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi, ${name}`);
// });

app.get("/",(req,res)=>{
    console.log(req.cookies);
    res.send("Root directory working!!")
});

// app.use("/users",users);
// app.use("/posts",posts);

app.listen("3000",()=>{
   console.log("Listening on Port 3000");
});