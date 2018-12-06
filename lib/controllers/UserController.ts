import User from '../models/Users';
import * as ProjectController from '../controllers/ProjectController';
import * as mongoose from 'mongoose';
import { resolve } from 'url';


var checkEmailExist = (email) => {
    return new Promise((resolve) => {
        User.findOne({email: email}, (err, user)=>{
            if(err){
                resolve(true);
            }else{
                if(user === null || JSON.stringify(user) === JSON.stringify({})){
                    resolve(false);
                }else{
                    resolve(true);
                }
            }
        })
    })

}


export var checkExistingUser = (id) => {
    return new Promise((resolve) => {
        User.findOne({_id: id}, (err, user)=>{
            if(err){
                resolve({err: true, msg: '', data: {}});
            }else{
                if(user === null || JSON.stringify(user) === JSON.stringify({})){
                    resolve({err: false, msg: '', data: false});
                }else{
                    resolve({err: false, msg: '', data: true});
                }
            }
        })
    })
} 


export var addNewUser = async (name, email) => {
    if(name === undefined || name === null || name === ''){
        return {err: true, msg: 'name is invalid', data: {}}
    }
    if(email === undefined || email === null || email === '' || !validateEmail(email)){
        return {err: true, msg: 'email is invalid', data: {}}
    }

    let emailExist = await checkEmailExist(email);
    if(emailExist){
        return {err: true, msg: 'email already exists', data: {}}
    }

    var newUser = new User({
        name,
        email
    });

    return new Promise((resolve) =>{
        newUser.save((err, project) =>{
            if(err){
                resolve({err: true, msg: '', data: {}});
            }else{
                resolve({err: false, msg: '', data: project});
            }
        });
    })
}

export var getAllUsers = () => {
    return new Promise((resolve) =>{
        User.find((err, projects)=>{
            if(err){
                resolve({err: true, msg: 'err', data: {}});
            }else{
                resolve({err: false, msg: '', data: projects});
            }
        })
    })
} 

export var deleteUser=(id) =>{
    if(!mongoose.Types.ObjectId.isValid(id)){
        return {err: true, msg: 'invalid id', data: {}};
    }
    return new Promise((resolve) =>{
        User.findByIdAndRemove({_id: id},(err, project) =>{
            if(err){
                resolve({err: true, msg: '', data: {}});
            }else{
                resolve({err: false, msg: '', data: project});
            }
        });
    })
}

export var getuserById = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return {err: true, msg: 'invalid id', data: {}};
    }
    return new Promise((resolve) =>{
        User.findById({_id: id},(err, project) =>{
            if(err){
                resolve({err: true, msg: '', data: {}});
            }else{
                resolve({err: false, msg: '', data: project});
            }
        });
    })
}

export var getAllInfosbyId = async (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return {err: true, msg: 'invalid id', data: {}};
    }
    var r1 = await getuserById(id);
    if(r1['err']){
        return r1;
    }
    var r2 = await ProjectController.getProjectsHavingUserBeIn(id);
    if(r2['err']){
        return r2;
    }
    r1['data'].projects = [];
    var result = {
        err: false,
        smg: '',
        data: {
            _id: r1['data']._id,
            name: r1['data'].name,
            email: r1['data'].email,
            projects: r2['data']
        }
    }
    return result;
}


var validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    }
    return false;
}

export const getUsersNotBein = async (projectId) =>{
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        return {err: true, msg: 'invalid id', data: {}};
    }
    var project = await ProjectController.getProjectById(projectId);
    if(project['err']) return project;
    var {members} = project['data'];
    return new Promise((resolve) => {
        User.find({_id: {$nin: members}}, (err, result) => {
            if(err){
                resolve({err: true, msg: err, data: {}});
            }else{
                resolve({err: false, msg: '', data: result});
            }
        })
    })
}

export const checkEmailAlreadyExists = (email) => {
    var check = validateEmail(email);
    if(!check) return {err: true, msg: 'mail is invalid', data: null};
    return new Promise((resolve) => {
        User.findOne({email: email}, (err, result) => {
            if(err){
                resolve({err: true, msg: err, data: {}});
            }else{
                if(result === null){
                    resolve({err: false, msg: '', data: false});
                }else{
                    resolve({err: false, msg: '', data: true});
                }
            }
        });
    })
}