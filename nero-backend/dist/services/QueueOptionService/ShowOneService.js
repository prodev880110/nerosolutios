"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueueOption_1 = __importDefault(require("../../models/QueueOption"));
const ShowOneService = async (queueOptionId) => {
    const queue = await QueueOption_1.default.findOne({
        where: {
            id: queueOptionId
        }
    });
    if (!queue) {
        throw new AppError_1.default("ERR_QUEUE_NOT_FOUND");
    }
    return queue;
};
exports.default = ShowOneService;
