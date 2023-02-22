"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Company_1 = __importDefault(require("../../models/Company"));
const CheckCompanyCodeService = async ({ value }) => {
    const companies = await Company_1.default.findAll({
        where: {
            code: value
        }
    });
    if (companies.length == 0) {
        return true;
    }
    else
        return false;
};
exports.default = CheckCompanyCodeService;
