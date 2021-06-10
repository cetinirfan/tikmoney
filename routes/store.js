const express = require('express')
const router = express.Router();
const Store = require('../services/modals/Store');
const StoreRequest = require('../services/modals/StoreRequest');
const Users = require('../services/modals/Users');
const verifyToken = require('../services/middleware/verify-token');
require('dotenv').config();
const fs = require("fs");
/*
const admin = require("firebase-admin");
let NotToken = "fouFlfmbQp-I4OOSLT3tYy:APA91bEoBz45fsuD2ee0vCQhk4GqqgtQollbsoXXrLfZ9N25J_J4vxwWQdKRyyw79ed4CJZnDDLK8Q_KEmehH52FBX8DGi0cla-N76iFWOmtLh7PFoq9kBZNI3EtKlsqO7108TCXMGFG"

var serviceAccount = require("./tikmoney-a6261-firebase-adminsdk-2dmpm-8455a8abb9.json");

router.get('/send',(req,res)=>{
    
      if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
    }
    let payload = {
        notification:{
            title: 'Message from Node.js header',
            body: 'My first Node.js message body'
        }
    };
    admin.messaging().sendToDevice(NotToken,payload).then(function(ressponse){
        res.json('başarılı'+JSON.stringify(ressponse))
    }).catch(function(err){
        res.json('err')
    })
    
});*/

router.get('/getStore',verifyToken,(req,res)=>{
    Users.findOne({_id:req.user_id})
        .then((data)=>{
            const promise = Store.find({language:data.language});
            promise.then((dataList)=>{
                res.json(dataList);
            }).catch((err)=>{
                res.json(err);
            })
        }).catch((err)=>{
            res.json(err);
        })
    
});

router.post('/buyProduct',verifyToken,(req,res)=>{
    const {tikmoney,product,userDescription,productDescription,contentImage} = req.body;
    Users.findOne({_id:req.user_id})
        .then((data)=>{
            const language = data.language;
            const newTikmoney = data.tikmoney-tikmoney;
            if(newTikmoney<0){
                res.json({
                    status: false,
                    message: ['Yetersiz Tikmoney','Insufficient Tikmoney',data.tikmoney]
                  });
            }else{
                let date1= new Date();
                let date2= new Date();
                date1.setFullYear(date2.getFullYear());
                date1.setMonth(date2.getMonth());
                date1.setDate(date2.getDate());
                date1.setHours(date2.getHours()+3);
                date1.setMinutes(date2.getMinutes());
                let date3 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), 0, 0);
                const newRequest = new StoreRequest({
                    tikmoney,
                    language,
                    userDescription,
                    productDescription,
                    userName:data.userName,
                    userMail:data.mail,
                    product,
                    userId:req.user_id,
                    contentImage,
                    requestCreated:date3,
                  });
                  newRequest.save((err, find_urun) => {
                    if (err) {
                        res.json({
                            status: false,
                            message: ['Satın alım sırasında bir sorun oluştu.','There was a problem with the purchase',data.tikmoney]
                          });
                    }else{
                        Users.findOneAndUpdate({_id:req.user_id},{$set:{tikmoney:newTikmoney}},{new:true})
                        .then(data =>{
                            res.json({
                            status: true,
                            message: ['Satın alma başarılı.','Purchase is successful',data.tikmoney]
                            });
                        })
                        .catch(err=>{
                        res.json(err);
                        })
                    }

                  });
            }
        }).catch((err)=>{
            res.json(err);
        })
    
});

router.get('/getStoreHistory',verifyToken,(req,res)=>{
    StoreRequest.find({userId:req.user_id})
        .then((data)=>{
            res.json(data)
        }).catch((err)=>{
            res.json(err);
        })
    
});

module.exports = router;