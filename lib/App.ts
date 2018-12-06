import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Routes } from "./routes/crmRoutes";
import * as cors from 'cors';
import * as mongoose from 'mongoose';

class  App {
    public app: express.Application;
    public routePrv: Routes = new Routes();
    public mongoUrl:string = 'mongodb://vqtuan:tuan123@ds159459.mlab.com:59459/qlda'
    constructor(){
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
        this.mongoSetup();
    }
    private config():void{
        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({extended: false}));

        this.app.use(cors())
    }
    private mongoSetup(): void{
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(this.mongoUrl, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log('connect to mongodb successful');
            }
        });
    }
}

export default new App().app;