import {AppLocals} from "../../server/locals/appLocals";
import {Request as BaseRequest} from "express-serve-static-core";

declare module "express" {
  export interface Application {
    locals: AppLocals;
  }

  interface Request extends BaseRequest {
    app: Application;
  }
}
