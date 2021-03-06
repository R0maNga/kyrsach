const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const {User, Basket} = require('../models/models')
const express = require('express');
const session = require('express-session')

const generateJWT = (id, email, role)=>{
    return jwt.sign({id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}



class UserController{
   async registration(req,res){
       const {email, password, role}=req.body
       if (!email || !password){
           return next(ApiError.badRequest('Некоректный email или password'))
       }
       const candidate = await User.findOne({where:{email}})
       if (candidate){
           return next(ApiError.badRequest('Пользователь с таким email существует'))
       }

       const hashPassword = await bcrypt.hash(password, 4)
       const user = await User.create({email, role, password: hashPassword})
       const basket = await Basket.create({userId: user.id})
       const jwt = generateJWT(user.id, user.email, user.role)
       const token = generateJWT(user.id, user.email, user.role)
        return res.json({token})

   }
   async login(req,res, next){
       const {email, password}= req.body
       const user = await User.findOne({where:{email}})
       if (!user){
           return next(ApiError.internal('Пользователь не найден'))
       }
       let comparePassword =bcrypt.compareSync(password, user.password)
       if (!comparePassword){
           return next(ApiError.internal('Неверный пароль'))

       }
       const token=generateJWT(user.id, user.email, user.role)
       return res.json({token})
     }
   async check(req,res, next){
       const token = generateJWT(req.user.id, req.user.email, req.user.role)
       return res.json({token})
   }



    async getOne(req, res)
    { const {id} = req.params
        const user = await User.findOne(
            {where:{id}}
        )
        return res.json(user)
    }
}

module.exports= new UserController()