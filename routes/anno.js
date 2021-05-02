const express = require('express')
const router = express.Router();
const Anno = require('../services/modals/Anno');
const Users = require('../services/modals/Users');
const verifyToken = require('../services/middleware/verify-token');
require('dotenv').config();

router.get('/getAnno',verifyToken,(req,res)=>{
    function sortFunction(a,b){  
        return new Date(b.AnnoCreated) - new Date(a.AnnoCreated); 
    };
    Users.findOne({_id:req.user_id})
        .then((data)=>{
            const promise = Anno.find({language:data.language});
            promise.then((dataList)=>{
                res.json(dataList.sort(sortFunction));
            }).catch((err)=>{
                res.json(err);
            })
        }).catch((err)=>{
            res.json(err);
        })
    
});

module.exports = router;