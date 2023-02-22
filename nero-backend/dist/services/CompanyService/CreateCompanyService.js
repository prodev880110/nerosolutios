"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Company_1 = __importDefault(require("../../models/Company"));
const User_1 = __importDefault(require("../../models/User"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const CreateCompanyService = async (companyData) => {
    const { name, phone, code, email, status, connections_number, users_number, queues_number, call, CheckMsgIsGroup, campaignsEnabled, dueDate, recurrence } = companyData;
    const companySchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "ERR_COMPANY_INVALID_NAME")
            .required("ERR_COMPANY_INVALID_NAME")
            .test("Check-unique-name", "ERR_COMPANY_NAME_ALREADY_EXISTS", async (value) => {
            if (value) {
                const companyWithSameName = await Company_1.default.findOne({
                    where: { name: value }
                });
                return !companyWithSameName;
            }
            return false;
        })
    });
    try {
        await companySchema.validate({ name });
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const company = await Company_1.default.create({
        name,
        phone,
        code,
        email,
        status,
        connections_number,
        users_number,
        queues_number,
        dueDate,
        recurrence
    });
    await User_1.default.create({
        name: company.name,
        email: company.email,
        password: "123456",
        profile: "admin",
        companyId: company.id
    });
    if (companyData.campaignsEnabled !== undefined) {
        const [setting, created] = await Setting_1.default.findOrCreate({
            where: {
                companyId: company.id,
                key: "campaignsEnabled"
            },
            defaults: {
                companyId: company.id,
                key: "campaignsEnabled",
                value: `${campaignsEnabled}`
            }
        });
        if (!created) {
            await setting.update({ value: `${campaignsEnabled}` });
        }
    }
    if (companyData.CheckMsgIsGroup !== undefined) {
        const [setting, created] = await Setting_1.default.findOrCreate({
            where: {
                companyId: company.id,
                key: "CheckMsgIsGroup"
            },
            defaults: {
                companyId: company.id,
                key: "CheckMsgIsGroup",
                value: `${CheckMsgIsGroup}`
            }
        });
        if (!created) {
            await setting.update({ value: `${CheckMsgIsGroup}` });
        }
    }
    if (companyData.call !== undefined) {
        const [setting, created] = await Setting_1.default.findOrCreate({
            where: {
                companyId: company.id,
                key: "call"
            },
            defaults: {
                companyId: company.id,
                key: "call",
                value: `${call}`
            }
        });
        if (!created) {
            await setting.update({ value: `${call}` });
        }
    }
    return company;
};
exports.default = CreateCompanyService;
