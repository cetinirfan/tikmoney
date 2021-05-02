const express = require('express')
const router = express.Router();
const Task = require('../services/modals/Task');
const Users = require('../services/modals/Users');
const TaskRequest = require('../services/modals/TaskRequest');
const verifyToken = require('../services/middleware/verify-token');
const multer =require('multer');
const fs =require('fs');
require('dotenv').config();

router.get('/getTask',verifyToken,(req,res)=>{
    Users.findOne({_id:req.user_id})
        .then((data)=>{
            const promise = Task.find({language:data.language});
            promise.then((dataList)=>{
                res.json(dataList);
            }).catch((err)=>{
                res.json(err);
            })
        }).catch((err)=>{
            res.json(err);
        })
});

router.get('/getLastTask',verifyToken,(req,res)=>{
    function sortFunction(a,b){  
        return new Date(b.taskCreated) - new Date(a.taskCreated); 
    };
    taskList=[];
    Users.findOne({_id:req.user_id})
        .then((data)=>{
            const promise = Task.find({language:data.language});
            promise.then((dataList)=>{
                dataList.map(item=>{
                    item.content.map(task=>{
                        taskList.push(task)
                    })
                })
                res.json(taskList.sort(sortFunction).slice(0,5))
            }).catch((err)=>{
                res.json(err);
            })
        }).catch((err)=>{
            res.json(err);
        })
});

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/proved/');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
		cb(null, true);
	} else {
		cb(null, false);
	}
}; 

const upload = multer({
	storage: storage,
	fileFilter: fileFilter
});


router.post('/provedTask/:_taskId',upload.single('image'),verifyToken,(req,res)=>{
    const {tikmoney,provedDescription,userName,mail,taskDescription,taskImage,taskLink,language} = req.body;
    Users.findOne({_id:req.user_id})
    .then(data=>{
        const taskList = data.userTasks;
        const status = taskList.includes(req.params._taskId)
        if(status){
            res.json({
                status:false,
                message:['Görev için zaten bir talepte bulundunuz.','You have already made a request for the task']
            })
        }else{
            const NewProvedTask = new TaskRequest({
                tikmoney,
                userName,
                mail,
                userId:req.user_id,
                taskId:req.params._taskId,
                provedDescription,
                taskImage,
                taskDescription,
                taskLink,
                language,
                provedImage:'/uploads/proved/'+req.file.filename
            });
            NewProvedTask.save()
            .then(data=>{
                Users.findOneAndUpdate({_id:req.user_id},{$push:{userTasks:req.params._taskId}})
                .then(userData=>{
                    res.json({
                        status:true,
                        message:['Görevi başarıyla kanıtladınız çok kısa bir zaman içerisinde incelenmeye alınacaktır.','You have successfully proven the task and will be examined in a very short time.']
                    }) 
                })
            })
        }
    }).catch(err=>{
        res.json(err)
    })
});

router.get('/getRejectedTask',verifyToken,(req,res)=>{
    TaskRequest.find({userId:req.user_id,status:2})
    .then(data=>{
        res.json(data)
    })
});

router.get('/getRequest',verifyToken,(req,res)=>{
    TaskRequest.find({userId:req.user_id})
    .then(data=>{
        res.json(data)
    })
});


 

module.exports = router;