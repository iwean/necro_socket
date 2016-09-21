/// <reference path="../_all.d.ts" />
/// <reference path="models/IAppSettings.ts" />

//http://brianflove.com/2016/03/29/typescript-express-node-js/

"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as indexRoute from "./routes/index";
import * as socketio from "socket.io"

/**
 * The server.
 *
 * @class Server
 */
class Server {
  private appConfigs : any;
  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(settings:IAppConfigs): Server {
    return new Server(settings);
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor(settings: IAppConfigs) {
    //create expressjs application
    this.app = express();

    //configure application
    this.config();
    //configure routes
    this.routes();

    this.appConfigs = settings;
  }
  private config() {
    //add static paths
    //configure jade
    //this.app.set("views", path.join(__dirname, "views"));
    //this.app.set("view engine", "jade");

    //mount logger
    //this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({ extended: true }));

    //add static paths
    this.app.use(express.static(path.join(__dirname, "www")));
    this.app.use(express.static(path.join(__dirname, "../bower_components")));

    // catch 404 and forward to error handler
    this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      var error = new Error("Not Found");
      err.status = 404;
      next(err);
    });

    //this.app.use(express.static(path.join(__dirname, "app/www")));
    //this.app.use(express.static(path.join(__dirname, "bower_components")));

  }

  /**
 * Configure routes
 *
 * @class Server
 * @method routes
 * @return void
 */
  private routes() {
    //get router
    let router: express.Router;
    router = express.Router();

    //create routes
    var index: indexRoute.Index = new indexRoute.Index();

    //home page
    router.get("/", index.index.bind(index.index));

    //use router middleware
    this.app.use(router);
  }

}
//var server = Server.bootstrap();
//export = server.app;
export = module.exports = function (settings: IAppConfigs) {
    return new Server(settings).app
}
