const express = require('express')
const router = express.Router();
const admin = require("firebase-admin");
const fs = require("fs");
let serviceAccount;
let NotToken = "fouFlfmbQp-I4OOSLT3tYy:APA91bEoBz45fsuD2ee0vCQhk4G…DGi0cla-N76iFWOmtLh7PFoq9kBZNI3EtKlsqO7108TCXMGFG"


function init(){
    fs.readFile('tikmoney-a6261-firebase-adminsdk-2dmpm-8455a8abb9.json',(err,data)=>{
        if(err) throw err;
        serviceAccount = JSON.parse(data);
        admin.initializeApp({
            credential : admin.credential.cert(serviceAccount),
        })
    })
} 

router.get('/send',(req,res)=>{
    init();
    let payload = {
        notification:{
            title: 'Message from Node.js header',
            body: 'My first Node.js message body'
        }
    };
    admin.messaging().sendToDevice(NotToken,payload).then(function(ressponse){
        res.json('başarılı')
    }).catch(function(err){
        res.json('err')
    })
    
});  