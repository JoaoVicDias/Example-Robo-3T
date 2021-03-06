const express = require('express')
const router = express.Router()
require('../models/account')
const mongoose = require('mongoose')
const account = mongoose.model('account')
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const passport = require('passport')
const { UserInfo } = require('git')
require('../config/auth')(passport)
const fs = require('fs')
const file = '/user'
const path = require('path')




//Creating routes


router.get('/',(req,res)=>{
     account.findOne(req.user).lean().then((userData)=>{
        res.render('index',{userData:userData})
    })
    
})


 

 router.get("/Download",(req,res) => {
    account.findOne(req.user).lean().then((userData)=>{
        res.render('download',{userData:userData})
    })
 })
 
 
 router.get("/Aboutme",(req,res)=> {
    account.findOne(req.user).lean().then((userData)=>{
        res.render('aboutme',{userData:userData})
    })
 })
 

 router.get("/Account",(req,res) => {
    res.render('account')
})
 
 

 router.get("/CreatingAccount",(req,res) => {
     res.render('createAccount')
 })

 router.post("/CreatingAccount",(req,res)=>{
     let errors = []
 
     if(!req.body.firstName || typeof req.body.firstName == undefined || req.body.firstName == null ){
         errors.push({text:'Invalid  first name'})
     }
 
     if(!req.body.lastName || typeof req.body.lastName == undefined || req.body.lastName == null){
         errors.push({text:'Invalid last name'})
     }
 
     if(!req.body.email || typeof req.body.email == undefined || req.body.email == null ){
         errors.push({text:'Invalid email'})
     }
 
     if(!req.body.password || typeof req.body.password == undefined || req.body.password == null ){
         errors.push({text:'Invalid password'})
     }
 
     if(req.body.password.length < 6){
         errors.push({text:'Your password has to be bigger!'})
     }
 
     if(req.body.password != req.body.password2){
         errors.push({text:'Your password is not the same'}) 
     }
     if(errors.length>0){
         res.render('createAccount',{errors:errors})
     }
     else{
         account.findOne({email: req.body.email}).then((Account)=>{
             if (Account){
                req.flash('error_msg',"This email has been used")
                res.redirect('CreatingAccount')
             }else{
         
                 const newAccount = new account({
                     firstName: req.body.firstName,
                     lastName:req.body.lastName,
                     email:req.body.email,
                     password:req.body.password
                 })
                 bcrypt.genSalt(10,(erro,salt)=>{
                     bcrypt.hash(newAccount.password, salt, (erro,hash)=>{
                         newAccount.password = hash
                             newAccount.save().then(()=>{
                             req.flash('success_msg',"Your account has been created!")
                             res.redirect("/Account")
                         })
                     })  
                 })
         
             }
         })
     }
     
 })
 
 

 router.post("/Account",(req,res,next)=>{
     passport.authenticate('local',{
         successRedirect: '/',
         failureRedirect: '/Account',
         failureFlash: true
     })(req,res,next)
 })

 
 router.get('/Logout',(req,res)=>{
     req.logOut()
     req.flash('success_msg','your account has been successfully disconnected')
     res.redirect("/Account")
     
 })
 




module.exports = router