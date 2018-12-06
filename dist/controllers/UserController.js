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
const Users_1 = require("../models/Users");
const ProjectController = require("../controllers/ProjectController");
const mongoose = require("mongoose");
var checkEmailExist = (email) => {
    return new Promise((resolve) => {
        Users_1.default.findOne({ email: email }, (err, user) => {
            if (err) {
                resolve(true);
            }
            else {
                if (user === null || JSON.stringify(user) === JSON.stringify({})) {
                    resolve(false);
                }
                else {
                    resolve(true);
                }
            }
        });
    });
};
exports.checkExistingUser = (id) => {
    return new Promise((resolve) => {
        Users_1.default.findOne({ _id: id }, (err, user) => {
            if (err) {
                resolve({ err: true, msg: '', data: {} });
            }
            else {
                if (user === null || JSON.stringify(user) === JSON.stringify({})) {
                    resolve({ err: false, msg: '', data: false });
                }
                else {
                    resolve({ err: false, msg: '', data: true });
                }
            }
        });
    });
};
exports.addNewUser = (name, email) => __awaiter(this, void 0, void 0, function* () {
    if (name === undefined || name === null || name === '') {
        return { err: true, msg: 'name is invalid', data: {} };
    }
    if (email === undefined || email === null || email === '' || !validateEmail(email)) {
        return { err: true, msg: 'email is invalid', data: {} };
    }
    let emailExist = yield checkEmailExist(email);
    if (emailExist) {
        return { err: true, msg: 'email already exists', data: {} };
    }
    var newUser = new Users_1.default({
        name,
        email
    });
    return new Promise((resolve) => {
        newUser.save((err, project) => {
            if (err) {
                resolve({ err: true, msg: '', data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: project });
            }
        });
    });
});
exports.getAllUsers = () => {
    return new Promise((resolve) => {
        Users_1.default.find((err, projects) => {
            if (err) {
                resolve({ err: true, msg: 'err', data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: projects });
            }
        });
    });
};
exports.deleteUser = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { err: true, msg: 'invalid id', data: {} };
    }
    return new Promise((resolve) => {
        Users_1.default.findByIdAndRemove({ _id: id }, (err, project) => {
            if (err) {
                resolve({ err: true, msg: '', data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: project });
            }
        });
    });
};
exports.getuserById = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { err: true, msg: 'invalid id', data: {} };
    }
    return new Promise((resolve) => {
        Users_1.default.findById({ _id: id }, (err, project) => {
            if (err) {
                resolve({ err: true, msg: '', data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: project });
            }
        });
    });
};
exports.getAllInfosbyId = (id) => __awaiter(this, void 0, void 0, function* () {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { err: true, msg: 'invalid id', data: {} };
    }
    var r1 = yield exports.getuserById(id);
    if (r1['err']) {
        return r1;
    }
    var r2 = yield ProjectController.getProjectsHavingUserBeIn(id);
    if (r2['err']) {
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
    };
    return result;
});
var validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
    }
    return false;
};
exports.getUsersNotBein = (projectId) => __awaiter(this, void 0, void 0, function* () {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return { err: true, msg: 'invalid id', data: {} };
    }
    var project = yield ProjectController.getProjectById(projectId);
    if (project['err'])
        return project;
    var { members } = project['data'];
    return new Promise((resolve) => {
        Users_1.default.find({ _id: { $nin: members } }, (err, result) => {
            if (err) {
                resolve({ err: true, msg: err, data: {} });
            }
            else {
                resolve({ err: false, msg: '', data: result });
            }
        });
    });
});
exports.checkEmailAlreadyExists = (email) => {
    var check = validateEmail(email);
    if (!check)
        return { err: true, msg: 'mail is invalid', data: null };
    return new Promise((resolve) => {
        Users_1.default.findOne({ email: email }, (err, result) => {
            if (err) {
                resolve({ err: true, msg: err, data: {} });
            }
            else {
                if (result === null) {
                    resolve({ err: false, msg: '', data: false });
                }
                else {
                    resolve({ err: false, msg: '', data: true });
                }
            }
        });
    });
};
//# sourceMappingURL=UserController.js.map