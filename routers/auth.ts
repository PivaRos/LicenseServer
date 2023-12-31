import { Router } from "express";
import {
  param,
  validationResult,
  OneOfErrorType,
  body,
} from "express-validator";
import { MacToFileName } from "./utility";
import path from "path";

const AuthRouter = Router();

var localStorage: any = null;
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

const configPath = path.join(__dirname, "../DefaultAppConfig.json");
const appConfig = require(configPath);

AuthRouter.get(
  "/state/:SoftwareID",
  param("SoftwareID").isMACAddress(),
  (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) result.throw();
      if (appConfig.allowAll) return res.sendStatus(200);
      const licenseString = localStorage.getItem(
        MacToFileName(req.params?.SoftwareID)
      );
      if (licenseString) {
        const License = JSON.parse(licenseString) as {
          license: boolean;
          name: string;
        };
        if (License.license === true) return res.sendStatus(200);
        else
          return [
            res.status(402),
            res.json({ message: `${License.name} is not Licensed !` }),
          ];
      }
      return [
        res.status(409),
        res.json({ message: "no record found for license" }),
      ];
    } catch (e: any) {
      console.log(e);
      if (e.errors && e.errors.length > 0)
        switch (e.errors[0].msg) {
          case "Invalid value":
            return [res.status(400), res.json({ message: e.errors[0].msg })];
        }
      return [res.sendStatus(500)];
    }
  }
);

AuthRouter.post(
  "/register",
  body("SoftwareID").isMACAddress(),
  body("name").isString(),
  async (req, res) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) result.throw();
      const check = await localStorage.getItem(req.body.SoftwareID);
      if (check)
        return [
          res.status(409),
          res.json({ message: "this id is already registered" }),
        ];
      localStorage.setItem(
        MacToFileName(req.body.SoftwareID),
        JSON.stringify({
          license: false,
          name: req.body.name,
        })
      );
      return res.sendStatus(200);
    } catch (e: any) {
      if (e.errors && e.errors.length > 0)
        switch (e.errors[0].msg) {
          case "Invalid value":
            return [res.status(400), res.json({ message: e.errors[0].msg })];
        }
      return [res.status(501), res.json({ ErrorObject1: e })];
    }
  }
);

export default AuthRouter;
