import Users from "../model/UserModel.js";
import argon2 from "argon2";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','fullname','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error)        
    }
}

export const getUserById = async(req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['username', 'email', 'fullname', 'role'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
}

export const Register = async(req, res) => {
    const {fullname,username , email, password, confpassword} = req.body;
    if(password !== confpassword) return res.status(400).json({msg:"Password dan Confirm password tidak sesuai"})
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            username: username,
            fullname: fullname,
            email: email,
            password: hashPassword,
        })
        res.status(201).json({msg:"Registrasi berhasil"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const updateUser = async(req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!user) return res.status(404).json({msg:"User tidak ditemukan"})
    const {fullname,username , email, password, confpassword} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password
    }else{
        hashPassword = await argon2.hash(password);
    }
    if(password !== confpassword) return res.status(400).json({msg:"Password dan Confirm password tidak sesuai"})
    try {
        await Users.update({
            username: username,
            fullname: fullname,
            email: email,
            password: hashPassword,
        }, {
            where: {
                id: user.id
            }
        })
        res.status(200).json({msg:"User Updated"})
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

