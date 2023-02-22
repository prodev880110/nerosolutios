"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contact_1 = __importDefault(require("../../models/Contact"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const ShowContactService = async (id, companyId) => {
    const contact = await Contact_1.default.findByPk(id, { include: ["extraInfo"] });
    if (contact?.companyId !== companyId) {
        throw new AppError_1.default("Unable to delete another company record");
    }
    if (!contact) {
        throw new AppError_1.default("ERR_NO_CONTACT_FOUND", 404);
    }
    return contact;
};
exports.default = ShowContactService;
