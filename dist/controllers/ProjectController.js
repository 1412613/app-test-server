"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Projects_1 = require("../models/Projects");
const mongoose = require("mongoose");
const UserController = require("./UserController");
exports.addNewProject = (name, description) => {
    var newProject = new Projects_1.default({
        name,
        description
    });
    return new Promise((resolve) => {
        newProject.save((err, project) => {
            if (err) {
                resolve({ err: true, msg: err, data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: project });
            }
        });
    });
};
exports.getAllProjects = () => {
    return new Promise((resolve) => {
        Projects_1.default.find((err, projects) => {
            if (err) {
                resolve({ err: true, msg: 'err', data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: projects });
            }
        });
    });
};
var checkExistingUserInProject = (projectId, userId) => {
    return new Promise((resolve) => {
        Projects_1.default.findOne({ _id: projectId, members: { $in: [userId] } }, (err, result) => {
            if (err) {
                resolve(true);
            }
            else {
                if (result === undefined || result === null || JSON.stringify(result) === JSON.stringify({})) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            }
        });
    });
};
exports.addMemberToProject = (project_id, member_id) => __awaiter(this, void 0, void 0, function* () {
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
        return { err: true, msg: 'project id is invalid', data: {} };
    }
    if (!mongoose.Types.ObjectId.isValid(member_id)) {
        return { err: true, msg: 'user id is invalid', data: {} };
    }
    let checkUser = yield UserController.checkExistingUser(member_id);
    if (checkUser['err'] === true) {
        return { err: true, msg: 'err', data: {} };
    }
    if (checkUser['data'] === false) {
        return { err: true, msg: 'user do not exist', data: {} };
    }
    let check = yield checkExistingUserInProject(project_id, member_id);
    if (check) {
        return { err: true, msg: 'user already exists', data: {} };
    }
    return new Promise((resolve) => {
        Projects_1.default.findOneAndUpdate({ _id: project_id }, { $push: { members: member_id } }, (err, result) => {
            if (err) {
                resolve({ err: true, msg: '', data: {} });
            }
            else {
                resolve(UserController.getuserById(member_id));
            }
        });
    });
});
exports.removeMemberFromProject = (project_id, member_id) => __awaiter(this, void 0, void 0, function* () {
    if (!mongoose.Types.ObjectId.isValid(project_id)) {
        return { err: true, msg: 'project id is invalid', data: {} };
    }
    if (!mongoose.Types.ObjectId.isValid(member_id)) {
        return { err: true, msg: 'user id is invalid', data: {} };
    }
    let checkUser = yield UserController.checkExistingUser(member_id);
    if (checkUser['err'] === true) {
        return { err: true, msg: 'err', data: {} };
    }
    if (checkUser['data'] === false) {
        return { err: true, msg: 'user do not exist', data: {} };
    }
    return new Promise((resolve) => {
        Projects_1.default.findOneAndUpdate({ _id: project_id }, { $pull: { members: member_id } }, (err, result) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                resolve({ err: true, msg: 'err', data: {} });
            }
            else {
                var r1 = yield UserController.getuserById(member_id);
                if (r1['err'])
                    return r1;
                var r = {
                    err: false,
                    msg: '',
                    data: {
                        project: result,
                        user: r1['data']
                    }
                };
                resolve(r);
            }
        }));
    });
});
exports.getProjectById = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { err: true, msg: 'project id is invalid', data: {} };
    }
    return new Promise((resolve) => {
        Projects_1.default.findById({ _id: id }, (err, result) => {
            if (err) {
                resolve({ err: true, msg: 'err', data: {} });
            }
            else {
                resolve({ err: false, msg: 'err', data: result });
            }
        });
    });
};
exports.deleteProject = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { err: true, msg: 'project id is invalid', data: {} };
    }
    return new Promise((resolve) => {
        Projects_1.default.findByIdAndRemove(id, (err, result) => {
            if (err) {
                resolve({ err: true, msg: 'err', data: {} });
            }
            else {
                resolve({ err: false, msg: 'err', data: result });
            }
        });
    });
};
exports.getUsersInfo = (projectId) => __awaiter(this, void 0, void 0, function* () {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return { err: true, msg: 'project id is invalid', data: {} };
    }
    var project = yield exports.getProjectById(projectId);
    if (project['err']) {
        return project;
    }
    var ids = project['data'].members;
    if (ids.length === 0) {
        return { err: false, msg: '', data: [] };
    }
    var arr = [];
    for (let i = 0; i < ids.length; i++) {
        let temp = yield UserController.getuserById(ids[i]);
        if (!temp['err'] && temp['data']._id !== undefined) {
            arr.push(temp['data']);
        }
    }
    return { err: false, msg: '', data: arr };
});
exports.getProjectsHavingUserBeIn = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { err: true, msg: 'user id is invalid', data: {} };
    }
    return new Promise((resolve) => {
        Projects_1.default.find({ members: { $in: [id] } }, (err, result) => {
            if (err) {
                resolve({ err: true, msg: err, data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: result });
            }
        });
    });
};
//# sourceMappingURL=ProjectController.js.map