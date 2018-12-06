import Project from '../models/Projects';
import * as mongoose from 'mongoose';
import * as UserController from './UserController';
import Projects from '../models/Projects';
import { Result } from 'range-parser';
import { resolve } from 'url';


export var addNewProject = (name, description) =>{
    var newProject = new Project({
        name,
        description
    });
    return new Promise((resolve) =>{
        newProject.save((err, project) =>{
            if(err){
                resolve({err: true, msg: err, data: {}});
            }else{
                resolve({err: false, msg: '', data: project});
            }
        });
    })
}

export var getAllProjects = () => {
    return new Promise((resolve) =>{
        Project.find((err, projects)=>{
            if(err){
                resolve({err: true, msg: 'err', data: {}});
            }else{
                resolve({err: false, msg: '', data: projects});
            }
        })
    })
}

var checkExistingUserInProject = (projectId, userId) => {
    return new Promise((resolve) => {
        Project.findOne({_id: projectId, members: {$in: [userId]}}, (err, result) =>{
            if(err){
                resolve(true);
            }else{
                if(result === undefined || result === null || JSON.stringify(result) === JSON.stringify({})){
                    resolve(false)
                }else{
                    resolve(true)
                }
            }
        })
    })
}

export var addMemberToProject = async (project_id, member_id) =>{
    if(!mongoose.Types.ObjectId.isValid(project_id)){
        return {err: true, msg: 'project id is invalid', data: {}};
    }
    if(!mongoose.Types.ObjectId.isValid(member_id)){
        return {err: true, msg: 'user id is invalid', data: {}};
    }
    let checkUser = await UserController.checkExistingUser(member_id);
    if(checkUser['err'] === true){
        return {err: true, msg: 'err', data: {}};
    }
    if(checkUser['data'] === false){
        return {err: true, msg: 'user do not exist', data: {}}
    }
    let check  = await checkExistingUserInProject(project_id, member_id);
    if(check){
        return {err: true, msg: 'user already exists', data: {}}
    }
    return new Promise((resolve) => {
        Project.findOneAndUpdate({_id: project_id}, {$push: {members: member_id}}, (err, result) =>{
            if(err){
                resolve({err: true, msg: '', data: {}});
            }else{
                resolve(UserController.getuserById(member_id));
            }
        })
    })
}

export var removeMemberFromProject = async (project_id, member_id) =>{
    if(!mongoose.Types.ObjectId.isValid(project_id)){
        return {err: true, msg: 'project id is invalid', data: {}};
    }
    if(!mongoose.Types.ObjectId.isValid(member_id)){
        return {err: true, msg: 'user id is invalid', data: {}};
    }
    let checkUser = await UserController.checkExistingUser(member_id);
    if(checkUser['err'] === true){
        return {err: true, msg: 'err', data: {}};
    }
    if(checkUser['data'] === false){
        return {err: true, msg: 'user do not exist', data: {}}
    }
    return new Promise((resolve) => {
        Project.findOneAndUpdate({_id: project_id}, {$pull: {members: member_id}}, async (err, result) =>{
            if(err){
                resolve({err: true, msg: 'err', data: {}})
            }else{
                var r1 = await UserController.getuserById(member_id);
                if(r1['err']) return r1;
                var r = {
                    err: false,
                    msg: '',
                    data: {
                        project: result,
                        user: r1['data']
                    }
                }
                resolve(r);
            }
        })
    })
}

export var getProjectById = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return {err: true, msg: 'project id is invalid', data: {}};
    }
    return new Promise((resolve) => {
        Project.findById({_id: id}, (err, result) =>{
            if(err){
                resolve({err: true, msg: 'err', data: {}})
            }else{
                resolve({err: false, msg: 'err', data: result});
            }
        })
    })
}

export var deleteProject  = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return {err: true, msg: 'project id is invalid', data: {}};
    }
    return new Promise((resolve) => {
        Project.findByIdAndRemove(id, (err, result) =>{
            if(err){
                resolve({err: true, msg: 'err', data: {}})
            }else{
                resolve({err: false, msg: 'err', data: result});
            }
        })
    })
}

export var getUsersInfo = async (projectId) => {
    if(!mongoose.Types.ObjectId.isValid(projectId)){
        return {err: true, msg: 'project id is invalid', data: {}};
    }
    var project = await getProjectById(projectId);
    if(project['err']){
        return project;
    }
    var ids = project['data'].members;
    if(ids.length === 0){
        return {err:false, msg: '', data: []};
    }
    var arr = [];
    for(let i =0 ;i < ids.length; i++){
        let temp = await UserController.getuserById(ids[i]);
        if(!temp['err'] && temp['data']._id !== undefined){
            arr.push(temp['data']);
        }
    }
    return {err: false, msg: '', data: arr};
}

export const getProjectsHavingUserBeIn = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)){
        return {err: true, msg: 'user id is invalid', data: {}};
    }
    return new Promise((resolve)=>{
        Project.find({members: {$in: [id]}}, (err, result)=>{
            if(err){
                resolve({err: true, msg: err, data: {}});
            }else{
                resolve({err: false, msg:'', data: result});
            }
        })
    })
}