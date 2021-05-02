const express = require('express')
const router = express.Router();
const Support = require('../services/modals/Support');
const Users = require('../services/modals/Users');
const verifyToken = require('../services/middleware/verify-token');
require('dotenv').config();

router.get('/getSupport',verifyToken,(req,res)=>{
    function sortFunction(a,b){  
        return new Date(b.supportCreated) - new Date(a.supportCreated); 
    };
    Support.find({userId:req.user_id})
        .then((data)=>{
            res.json(data.sort(sortFunction))
        }).catch((err)=>{
            res.json(err);
        })
});

router.post('/sendMessage/:_id',verifyToken,(req,res)=>{
    const {mine,message} = req.body;
    const NewMessage = {mine:mine===1 ? true : false,message:message}
    Support.updateOne({_id:req.params._id},{$push:{messages:NewMessage}})
        .then((data)=>{
            res.json('başarılı')
        }).catch((err)=>{
            res.json(err);
        })
});

module.exports = router;