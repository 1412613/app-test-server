import { Response, Request, Application } from "express";
import * as ProjectController from "../controllers/ProjectController";
import * as UserController from '../controllers/UserController';


export class Routes {
    public routes(app:Application):void {
        app.route('/')
        .get((req: Request, res:Response) => {
            res.status(200).send({msg: 'hello world!'});
        });

        app.route('/project')
        .get(async (req: Request, res:Response) => {
            let result = await ProjectController.getProjectById(req.query.id);
            res.status(200).send(result);
        })
        .post(async (req: Request, res:Response)=>{
            let result = await ProjectController.addNewProject(req.body.name, req.body.description);
            res.status(200).send(result);
        })
        .delete(async (req: Request, res:Response)=>{
            let result = await ProjectController.deleteProject(req.body.id);
            res.status(200).send(result);
        })

        app.route('/project/member')
        .put(async (req: Request, res:Response)=>{
            let result = await ProjectController.addMemberToProject(req.body.project_id, req.body.user_id);
            res.status(200).send(result);
        })
        .delete(async (req: Request, res:Response)=>{
            let result = await ProjectController.removeMemberFromProject(req.body.project_id, req.body.user_id);
            res.status(200).send(result);
        })
        .get(async (req: Request, res:Response)=>{
            let result = await ProjectController.getUsersInfo(req.query.id);
            res.status(200).send(result);
        })

        app.route('/project/all')
        .get(async (req: Request, res:Response) => {
            let result = await ProjectController.getAllProjects();
            res.status(200).send(result);
        })


        app.route('/user')
        .get(async (req: Request, res:Response) => {
            let {users} = req.query;
            var result;
            if(users === 'true'){
                result = await UserController.getUsersNotBein(req.query.projectId);

            }else{
                result = await UserController.getAllInfosbyId(req.query.id);

            }
            res.status(200).send(result);
        })
        .post(async (req: Request, res:Response) => {
            let result = await UserController.addNewUser(req.body.name, req.body.email);
            res.status(200).send(result);
        })
        .delete(async (req: Request, res:Response) => {
            let result = await UserController.deleteUser(req.body.id);
            res.status(200).send(result);
        });

        app.route('/user/mail')
        .get(async (req: Request, res:Response) => {
            let result = await UserController.checkEmailAlreadyExists(req.query.email);
            res.status(200).send(result);
        })

        app.route('/user/all')
        .get(async (req: Request, res:Response) => {
            let result = await UserController.getAllUsers();
            res.status(200).send(result);
        })
    }
}