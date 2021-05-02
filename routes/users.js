const express = require('express')
const router = express.Router();
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken');
const Users = require('../services/modals/Users');
const Support = require('../services/modals/Support');
const verifyToken = require('../services/middleware/verify-token');
const multer =require('multer');
const fs =require('fs');
const randomInt = require('random-int');
const gnp = require('generate-password');
const nodemailer =require('nodemailer');
require('dotenv').config();
const mailCodeSend = require('../services/modals/mailCodeSend');
const mailCodeSendEN = require('../services/modals/mailCodeSendEN');
const mailPasswordSend = require('../services/modals/mailPasswordSend');

router.post('/saveToken/',verifyToken,(req,res)=>{
  const {FirebaseToken} =req.body;
  Users.updateOne({_id:req.user_id},{$set:{FirebaseToken:FirebaseToken}})
  .then(data=>{     
     res.json({status:true,message:'başarılı'});
  })
  .catch(err=>{
      res.json(err);
  })
}) 

router.post('/refreshToken/',verifyToken,(req,res)=>{
  const {clearToken} =req.body;
  Users.updateOne({_id:req.user_id},{$set:{FirebaseToken:clearToken}})
  .then(data=>{      
     res.json({status:true,message:'başarılı'});
  })
  .catch(err=>{
      res.json(err);
  })
})

router.post('/register',(req,res,next)=>{
  const {userName,password,mail,language} = req.body;
  if(!userName||!password||!mail){
    res.json({
      status: false,
      message: ['Tüm alanları doldurunuz','Fill in all fields']});
  }else if(password.length<6){
    res.json({
      status: false,
      message: ['Şifreniz minimum 6 karakterden oluşmalıdır','Your password must have a minimum of 6 characters']});
  }else{
    Users.findOne({mail:mail,loginStatus:1},(err,data)=>{
      if(data){
        res.json({
          status: false,
          message: ['Zaten bu mail adresine ait kayıtlı kullanıcı var','There is already a registered user of this mail address']});
      }else{
        var verification_code = randomInt(1000,9999);
        bcrypt.hash(password,10).then((hash)=>{
          const New = new Users({
            userName,
            language,
            mail,
            userMailCode:verification_code,
            password:hash,
            loginStatus:1,
            userPhoto:"/uploads/default/users.png"
          });
          const promise = New.save();
          promise.then((data)=>{
            if(language==='tr-TR'){
              mailCodeSend(verification_code,req.body.mail);
            }else{
              mailCodeSendEN(verification_code,req.body.mail);
            }
            res.json({
              status: true,
              message: ['Kaydınız başarıyla gerçekleşti','Your registration was successful']
            });
          }).catch((err)=>{
            res.json(err);
          })
        });
      }
    }) 
  }
	
});

router.post('/googleLogin',(req,res,next)=>{
  const {userName,mail,language,photo} = req.body;
  console.log(userName)
  Users.findOne({mail:mail,loginStatus:2})
  .then(data=>{
    if(data){
      if(data.userBanType===1){
        res.json({
          status: false,
          message: ['Hesabınız askıya alınmıştır.','Your account has been suspended']});
      }else{
      const user_Id = data._id
      const token = jwt.sign({user_id:user_Id}, req.app.get('api_key'));
      res.json({status:true, token, user_Id})
      }
    }else{
      const New = new Users({
        userName,
        language,
        mail,
        userPhoto:photo,
        loginStatus:2, 
      });
      const promise = New.save();
      promise.then((newUser)=>{
        const newUser_Id = newUser._id
        const token = jwt.sign({user_id:newUser_Id}, req.app.get('api_key'));
        res.json({status:true, token, newUser_Id})
      }).catch((err)=>{
        res.json(err);
      })
    }
  })
});

router.post('/code', (req, res) => {
  const { mail, userMailCode } = req.body;
  Users.findOne({mail,loginStatus:1})
  .then(data =>{
    if(data.userMailCode===userMailCode){
        Users.updateOne({mail,loginStatus:1},{$set:{userMailCode:0}})
        .then(data =>{
          res.json({
            status: true,
            message: ['Kaydınız başarıyla gerçekleşti','Your registration has been completed successfully']
          });
        })
        .catch(err=>{
          res.json({
            status: false,
            message: ['Bir hata oluştu lütfen tekrar deneyiniz','An error occurred, please try again']
          });
        })
    }else{
      res.json({
        status: false,
        message: ['Doğrulama Kodu Hatalı','Verification Code Incorrect']
      });
    }
    })
  .catch(err=>{
    res.json(err);
  })
});

router.post('/changeCode', (req, res) => {
  const { mail } = req.body;
  const verification_code = randomInt(1000,9999);
  Users.findOneAndUpdate({mail,loginStatus:1},{$set:{userMailCode:verification_code}})
    .then(data =>{
      mailCodeSend(verification_code,req.body.mail);
      res.json({
        status: true,
        message: ['Yeni doğrulama kodunuz başarıyla gönderildi','Your new verification code has been sent successfully']
      });
    })
    .catch(err=>{
      res.json(err);
    })
});

router.post('/setLanguage',verifyToken, (req, res) => {
  const { language } = req.body;
  Users.findOneAndUpdate({_id:req.user_id},{$set:{language:language}})
    .then(data =>{
      res.json({
        status: true,
        message: ['Dil başarıyla değiştirildi','The language has been successfully changed']
      });
    })
    .catch(err=>{
      res.json(err);
    })
});

router.post('/login', (req, res) => {
  const { mail, password,language } = req.body;
  if(!password||!mail){
    res.json({
      status: false,
      message: ['Tüm alanları doldurunuz','Fill in all fields']});
  }
	Users.findOne({mail,loginStatus:1}, (err, Users) => {
    if(!Users){
      res.json({
        status: false,
        message: ['Böyle bir kullanıcı bulunamadı','No such user found']
      });
    }else if(Users.userBanType===1){
      res.json({
        status: false,
        message: ['Hesabınız askıya alınmıştır.','Your account has been suspended']});
    }else{
      if(Users.userMailCode==0){
      const user_id=Users._id;
          bcrypt.compare(password, Users.password).then((result) => {
            if (result){
              const token = jwt.sign({user_id:Users._id}, req.app.get('api_key'));
              if(language){
                Users.updateOne({_id:user_id},{$set:{language:language}})
              .then(lastData=>{
                res.json({status:true, token, user_id})
              })
              }else{
                res.json({status:true, token, user_id})
              }
              
            }else{
              res.json({
                status: false,
                message: ['Doğrulama hatası, hatalı parola','Authentication failure, bad password']
              });
            }
          })
        }else{
          res.json({
            status: false,
            message: ['Doğrulanmamış kullanıcı','Unverified user']
          });
        }
    }
  })
});

router.post('/forgetPassword', (req, res) => {
  const { mail } = req.body;
  const password = gnp.generate({
    length: 5,
    uppercase: true});
      bcrypt.hash(password,10).then((hash)=>{
        Users.findOneAndUpdate({mail:mail},{ $set: {
            password:hash,
          } },{new: true})
          .then((data)=>{
            if(data.language==='tr-TR'){
              mailPasswordSend(password,req.body.mail);
            }else{
              mailPasswordSendEN(password,req.body.mail);
            }
            res.json({
              status: true,
              message: ['Şifreniz başarıyla değiştirildi','Your password has been changed successfully']});
          }).catch((err)=>{
          res.json({
            status: false,
            message: ['Şifrenizi değiştirirken bir hata oluştu','There was an error changing your password']});
        });
      });
});

router.get('/getProfile',verifyToken,(req,res)=>{
    const promise = Users.findOne({_id:req.user_id});
        promise.then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        })
});

router.post('/setProfile',verifyToken,(req,res)=>{
  const {userName,oldPassword,newPassword,newPassword2} =req.body;
  if(!userName){
    res.json({
      status: false,
      message: ['Kullanıcı adı alanı boş bırakılamaz','Username field cannot be left blank']});
  }else if(oldPassword.length<1 && newPassword.length<1 && newPassword2.length<1){
      Users.findByIdAndUpdate({_id:req.user_id}, { $set: {
        userName
      } },{new: true})
        .exec()
        .then(data=>{
          res.json({
            status: true,
            message: ['Kullanıcı adınız başarıyla güncellendi','Your username has been successfully updated.']});
        }).catch(err =>{
        res.json(err);
      })
  }else{
    Users.findOne({_id:req.user_id}, (err, Users) => {
      bcrypt.compare(oldPassword, Users.password).then((result) => {
        if (result){
          if(newPassword.length<6||newPassword2.length<6){
            res.json({
              status: false,
              message: ['Şifreniz minimum 6 karakterden oluşmalıdır','Your password must have a minimum of 6 characters.']});
          }
          else if(newPassword!==newPassword2){
            res.json({
              status: false,
              message: ['Yeni şifreniz uyuşmadı','Your new password did not match']});
          }else{
              const promiseHash = bcrypt.hash(newPassword,10)
              promiseHash.then((hash)=>{
                const promise = Users.updateOne({_id:req.user_id},{ $set: {password:hash,userName}},{new: true})
                      promise.then((data)=>{
                        res.json({
                          status: true,
                          message: ['Profil bilgileriniz başarıyla güncellendi','Your profile information has been successfully updated.']});
                      }).catch((err3)=>{
                        res.json({
                          status: false,
                          message: ['Profil bilgileriniz düzenlenirken bir hata oluştu','An error occurred while editing your profile information']});
                      });
              })
          }
        }else{
          res.json({
            status: false,
            message: ['Doğrulama hatası, hatalı eski şifre','Authentication failure, bad old password']
          });
        }
      })
    })
  }
});


router.post('/addSupport',verifyToken,(req,res,next)=>{
  const {mine,message} =req.body;
  const NewMessage = {mine:mine===1 ? true : false,message:message}
  if(!message){
    res.json({
      status: false,
      message: ['Tüm alanları doldurunuz','Fill in all fields']});
  }else{
    Users.findOne({_id:req.user_id},(err,data)=>{  
      if(err){
        res.json(err)
      }else{
        let date1= new Date();
        let date2= new Date();
        date1.setFullYear(date2.getFullYear());
        date1.setMonth(date2.getMonth());
        date1.setDate(date2.getDate());
        date1.setHours(date2.getHours()+3);
        date1.setMinutes(date2.getMinutes());
        let date3 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), 0, 0);
        const NewSupport = new Support({
          supportCreated:date3,
          userId:data._id,
          userName:data.userName,
          userMail:data.mail,
          messages:NewMessage,
        });
        const promise = NewSupport.save();
        promise.then((data)=>{
          res.json({
            status: true,
            message: ['Destek talebi başarıyla oluşturuldu','Support ticket created successfully']});
        }).catch((err)=>{
          res.json({
            status: false,
            message: ['Bir sorun oluştu lütfen tekrar deneyiniz','Something went wrong, please try again']});
        })
      }
    })
  }
  
});

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads/users/');
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

router.post('/upload',verifyToken,upload.single('image'),verifyToken,(req,res)=>{
	Users.findOne({_id:req.user_id})
		.exec()
		.then(data=>{
      if(data.userPhoto !== "/uploads/default/users.png")
			fs.unlink(data.userPhoto, (err)=> {
				if(err){ 
					console.log(err)
				}
			})
			const promise = Users.findByIdAndUpdate({_id:req.user_id}, { $set: {userPhoto:'/uploads/users/'+req.file.filename} },{new: true});
			promise.then((data)=>{
				res.json({
          status: true,
          message: ['Resim başarıyla değiştirildi','The picture has been changed successfully']
        });
			}).catch((err)=>{
				res.json(err);
			})
		})
});

router.post('/chooseNot',verifyToken, (req, res) => {
  const { notStatus } = req.body;
  Users.findOneAndUpdate({_id:req.user_id},{$set:{notStatus:notStatus}})
    .then(data =>{
      if(data.notStatus===0){
        res.json({
          status: true,
          message: ['Bildirimleriniz kapatılmıştır.','Your notifications have been turned off']
        });
      }else{ 
        res.json({
          status: true,
          message: ['Bildirimleriniz açılmıştır.','Your notifications have been opened']
        });
      }
    })
    .catch(err=>{
      res.json(err);
    })
});

module.exports = router;