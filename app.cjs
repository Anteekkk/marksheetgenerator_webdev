const express = require("express");
const bodyparser= require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs= require("ejs");
//const ejsLint = require("ejs-lint");
mongoose.connect("mongodb://127.0.0.1:27017/marksheet_database" , {useNewUrlParser:true});

const app =express(); 
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
app.use(bodyparser.urlencoded({extended: true}));
//app.use(express.static("public"));
app.use(express.static("public"));



const subjectchema= new mongoose.Schema({
    subcode:Number,
    subject:String,
    maxmark:Number,
    passing:Number,
});

const marksipschema= new mongoose.Schema({
    term:Number,
    subject:String,
    marks:Number
})

const classchema= new mongoose.Schema({
    //id:Number,
    class:Number,
    section:String

});
const Termschema= new mongoose.Schema({
    no:Number
});

const studentschema = new mongoose.Schema({
    Rno:{
        type:Number,
        min:0
    },
    name:String,
    faname:String, 
    moname:String,
    address:String,
    gender:String,
    contact:Number,
    dob:Date,
    mail:String,
    marobt:[marksipschema],
    class:[classchema],
    term:[Number]

});



const Student= new mongoose.model("student" , studentschema);
const Class = new mongoose.model("class" , classchema);
const Subject = new mongoose.model("subject" , subjectchema);
const inpmarks=new mongoose.model("input_marks" , marksipschema);
app.get("/" , function(req,res){
    res.render("home");
    
    // console.log(std);
//    res.render("students");
    
});

app.get("/students" , function(req,res){
    res.render("students");
    
    // console.log(std);
//    res.render("students");
    
});
app.get("/classes" , function(req,res){
    res.render("classes");
    
    // console.log(std);
//    res.render("students");
    
});

app.get("/getreport" , function(req,res){
    res.render("getreport");
    
    // console.log(std);
//    res.render("students");
    
});

app.get("/subjects" , function(req,res){
    res.render("subjects");
    
    // console.log(std);
//    res.render("students");
    
});

app.post("/subjects" , function(req,res){
    //scode sname mm pm
    const s = new Subject({
        subcode:req.body.scode,
        subject:req.body.sname,
        maxmark:req.body.mm,
        passing:req.body.pm
    })
    s.save();
    res.redirect("/subjects");
});



app.post("/classes" , function(req,res){
    const c = new Class({
        class:req.body.ccode,
        section:req.body.sec,
    })
    c.save();
    res.redirect("/classes");
});


app.post("/students" , function(req,res){
    const std = new Student({
       Rno:req.body.rno,
   name:req.body.name,
   faname:req.body.father, 
   moname:req.body.mother,
   address:req.body.address,
   gender:req.body.gen,
   contact:req.body.contact,
   dob:req.body.dob,
   mail:req.body.mail,
   class:{
    class:req.body.class,
    section:req.body.sec,
   }
   })
 //  console.log(req.body.name);
    std.save();
    res.redirect("students");
})
app.post("/" , function(req,res){
    let rno=req.body.rno;
    let name=req.body.name;
    let clas=req.body.class;
    let sec=req.body.section;
    let scode=req.body.scode;
    
    let term=req.body.term;
    const mip = new inpmarks({
     subject:req.body.sname,
     marks:req.body.ip
    })

    Student.find({})
    .then((data)=>{
        data.forEach(function(da){
            let ca=da.class;
            console.log(ca);
            ca.forEach(function(d){
                let cl=d.class;
                let s=d.section;
                //console.log(da.Rno);
                //console.log(da.name);
                //console.log(rno);
                //console.log(name);
                //console.log(cl);
                //console.log(clas);
                //console.log(s);
                //console.log(sec);
                if(da.Rno==rno && da.name==name && cl==clas && s==sec){
                    da.marobt.push(mip);
                    da.term.push(term);
                    da.save();

                }
                else{
                    console.log("data not found");
                }
            })
        })
    })
    .catch((err)=>{
        console.log(err);
    })
    
    res.redirect("/");
    
})



app.post("/getre" , function(req,res){
    let rn=req.body.r;
    let na=req.body.n;
    let c=req.body.class;
    let s=req.body.section

    Student.find({})
    .then((data)=>{
        data.forEach(function(da){
            let ca=da.class;
            //console.log(ca);
            ca.forEach(function(d){
                let cl=d.class;
                let se=d.section;
                //console.log(da.Rno);
                //console.log(da.name);
                //console.log(rno);
                //console.log(name);
                //console.log(cl);
                //console.log(clas);    
                //console.log(s);
                //console.log(sec);
                if(da.Rno==rn && da.name==na && cl==c && se==s){
                   // console.log(c,s);
                   res.render("finalreport" , {na:da.name ,rno:da.Rno , fname:da.faname, cla:c, section:s , mark:da.marobt});

                }
                else{
                    console.log("data not found");
                }
            })
        })
    })
    .catch((err)=>{
        console.log(err);
    })
    




})






app.listen("3000" , function(req,res){
    console.log("server started");
});






//<%  class.forEach(function(d){  %>
//
//    <li class="list-group-item"><%= d.class %></li>
//    <li class="list-group-item"><%= d.section %></li>
//
//  <% })%>