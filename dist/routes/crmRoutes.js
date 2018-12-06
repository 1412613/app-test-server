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
const ProjectController = require("../controllers/ProjectController");
const UserController = require("../controllers/UserController");
class Routes {
    routes(app) {
        app.route('/')
            .get((req, res) => {
            res.status(200).send({ msg: 'hello world!' });
        });
        app.route('/project')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.getProjectById(req.query.id);
            res.status(200).send(result);
        }))
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.addNewProject(req.body.name, req.body.description);
            res.status(200).send(result);
        }))
            .delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.deleteProject(req.body.id);
            res.status(200).send(result);
        }));
        app.route('/project/member')
            .put((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.addMemberToProject(req.body.project_id, req.body.user_id);
            res.status(200).send(result);
        }))
            .delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.removeMemberFromProject(req.body.project_id, req.body.user_id);
            res.status(200).send(result);
        }))
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.getUsersInfo(req.query.id);
            res.status(200).send(result);
        }));
        app.route('/project/all')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield ProjectController.getAllProjects();
            res.status(200).send(result);
        }));
        app.route('/user')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let { users } = req.query;
            var result;
            if (users === 'true') {
                result = yield UserController.getUsersNotBein(req.query.projectId);
            }
            else {
                result = yield UserController.getAllInfosbyId(req.query.id);
            }
            res.status(200).send(result);
        }))
            .post((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserController.addNewUser(req.body.name, req.body.email);
            res.status(200).send(result);
        }))
            .delete((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserController.deleteUser(req.body.id);
            res.status(200).send(result);
        }));
        app.route('/user/mail')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserController.checkEmailAlreadyExists(req.query.email);
            res.status(200).send(result);
        }));
        app.route('/user/all')
            .get((req, res) => __awaiter(this, void 0, void 0, function* () {
            let result = yield UserController.getAllUsers();
            res.status(200).send(result);
        }));
    }
}
exports.Routes = Routes;
//# sourceMappingURL=crmRoutes.js.map