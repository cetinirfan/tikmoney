const express = require('express')
const router = express.Router();
const bcrypt =require('bcryptjs')
const jwt = require('jsonwebtoken');
const Users = require('../services/modals/Users');
const verifyToken = require('../services/middleware/verify-token');
const multer =require('multer');
const fs =require('fs');
const randomInt = require('random-int');
const gnp = require('generate-password');
const nodemailer =require('nodemailer');
require('dotenv').config();
const mailCodeSend = require('../services/modals/mailCodeSend');


router.post('/register',(req,res,next)=>{
  const {userName,password,mail} = req.body;
	Users.findOne({mail:mail},(err,data)=>{
		if(data){
			res.json({
				status: false,
				message: 'Zaten kayıtlı kullanıcı'});
		}else{
      var verification_code = randomInt(1000,9999);
			bcrypt.hash(password,10).then((hash)=>{
				const New = new Users({
          userName,
          mail,
          userMailCode:verification_code,
					password:hash
				});
				const promise = New.save();
				promise.then((data)=>{
          mailCodeSend(verification_code,req.body.mail);
					res.json({
            status: true,
            message: 'Kaydınız başarıyla gerçekleşti.'
          });
				}).catch((err)=>{
					res.json(err);
				})
			});
		}
	})
});

router.post('/code', (req, res) => {
  const { mail, userMailCode } = req.body;
  Users.findOne({mail})
  .then(data =>{
    if(data.userMailCode===userMailCode){
        Users.updateOne({mail},{$set:{userMailCode:0}})
        .then(data =>{
          res.json('Doğrulama kodu başarılı');
        })
        .catch(err=>{
          res.json(err);
        })
    }else{
      res.json('Bulunamadı');
    }
    })
  .catch(err=>{
    res.json(err);
  })
});

router.post('/login', (req, res) => {
	const { mail, password } = req.body;
	Users.findOne({mail}, (err, Users) => {
    if(!Users){
      res.json({
        status: false,
        message: 'Böyle bir kullanıcı bulunamadı.'
      });
    }else{
      if(Users.userMailCode==0){
      const user_id=Users._id;
          bcrypt.compare(password, Users.password).then((result) => {
            if (result){
              const token = jwt.sign({user_id:Users._id}, req.app.get('api_key'));
              res.json({status:true, token, user_id})
            }else{
              res.json({
                status: false,
                message: 'Doğrulama hatası, hatalı parola.'
              });
            }
          })
        }else{
          res.json('Doğrulanmamış kullanıcı')
        }
    }
  })
});

router.post('/forgetPassword/v1/', (req, res) => {
  const { mail } = req.body;
    const verification_code = randomInt(1000,9999);
    Users.updateOne({mail},{$set:{userSmsCode:verification_code}})
    .then(data=>{
      smsSend('E-mail adresi doğrulama kodunuz: '+verification_code,req.body.mail);
      res.json({
				status: true,
				message: 'Doğrulama kodu e-mailinize gönderildi'});
    })
    .catch((err)=>{
      res.json({
				status: false,
				message: 'Doğrulama kodu Telefonunuza gönderilemedi'});
  });
});

router.post('/forgetPassword/v2/', (req, res) => {
  const { mail,userSmsCode } = req.body;
  const password = gnp.generate({
    length: 10,
    uppercase: true});
  Users.findOne({mail:mail},(error,Users)=>{
    if(Users.userSmsCode==userSmsCode){
      bcrypt.hash(password,10).then((hash)=>{
        Users.updateOne({ $set: {
            password:hash,
            userSmsCode:0
          } },{new: true})
          .then((data)=>{
            smsSend('Şifrenizi kimse ile lütfen paylaşmayınız. Yeni şifreniz: '+password,req.body.mail);
            res.json({
              status: true,
              message: 'Şifreniz başarıyla değiştirildi.'});
          }).catch((err)=>{
          res.json({
            status: false,
            message: 'Şifrenizi değiştirirken bir hata oluştu.'});
        });
      });
    }else{
      res.json({
        status: false,
        message: 'Eşleşmeyen kod.'});
    }
  })
});

router.post('/removeCode', (req, res) => {
  const { mail } = req.body;
  Users.findOne({mail})
  .then(data =>{
    if(data){
        Users.deleteOne({mail})
        .then(data =>{
          res.json('Kod Başarıyla silindi');
        })
        .catch(err=>{
          res.json(err);
        })
    }else{
      res.json('Kullanıcı Bulunamadı');
    }
    })
  .catch(err=>{
    res.json(err);
  })
});

router.get('/getProfile',verifyToken,(req,res)=>{
    const promise = Users.findOne({_id:req.user_id});
        promise.then((data)=>{
            res.json(data);
        }).catch((err)=>{
            res.json(err);
        })
});


module.exports = router;