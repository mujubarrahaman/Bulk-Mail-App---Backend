const express = require ("express")
const cors = require ("cors")
const mongoose = require("mongoose")

const app = express()
//Install NodeMailer
const nodemailer = require("nodemailer");
app.use(express.json())
app.use(cors())

mongoose.connect(BULK_MAIL_APP="mongodb+srv://rahaman:12345@cluster0.ajbrlub.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function(){
    console.log("Connected to DB")
}).catch(function(){
    console.log("Failed to connect");
})

const credential = mongoose.model("credential",{},"bulkmail")

app.post("/sendemail",function(req,res){
    var msg =req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function(data){
        // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        service: "gmail",
      
        auth: {
          user: data[0].toJSON().user,
          pass: data[0].toJSON().pass,
        },
        tls: {
          rejectUnauthorized: false, // ⛔ Not safe for production
        },
      });
    
      new Promise(async function(resolve,reject){
        try{
    
    
            for(var i=0;i<emailList.length;i++)
            {
                await transporter.sendMail(
                    {
                        from:"rahamanmuju@gmail.com",
                        to: emailList[i],
                        subject:"A message from Bulk Mail App",
                        text:msg
                    }
               
                )
                console.log("Email sent to:"+emailList[i])
            }
            resolve("Success")
        }
        catch(error)
        {
            reject("Failed")
        }
    
        
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })
    
    }).catch(function(error){
        console.log(error)
    })


})

app.listen(5000,function(){
    console.log("Server started...")
})