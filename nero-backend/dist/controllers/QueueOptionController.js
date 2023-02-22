"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update_media = exports.update = exports.show = exports.store = exports.index = void 0;
const CreateService_1 = __importDefault(require("../services/QueueOptionService/CreateService"));
const ListService_1 = __importDefault(require("../services/QueueOptionService/ListService"));
const UpdateService_1 = __importDefault(require("../services/QueueOptionService/UpdateService"));
const ShowService_1 = __importDefault(require("../services/QueueOptionService/ShowService"));
const ShowOneService_1 = __importDefault(require("../services/QueueOptionService/ShowOneService"));
const DeleteService_1 = __importDefault(require("../services/QueueOptionService/DeleteService"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const index = async (req, res) => {
    const { queueId, queueOptionId, parentId } = req.query;
    const queueOptions = await (0, ListService_1.default)({ queueId, queueOptionId, parentId });
    return res.json(queueOptions);
};
exports.index = index;
const store = async (req, res) => {
    const queueOptionData = req.body;
    const queueOption = await (0, CreateService_1.default)(queueOptionData);
    return res.status(200).json(queueOption);
};
exports.store = store;
const show = async (req, res) => {
    const { queueOptionId } = req.params;
    const queueOption = await (0, ShowService_1.default)(queueOptionId);
    return res.status(200).json(queueOption);
};
exports.show = show;
const update = async (req, res) => {
    const { queueOptionId } = req.params;
    const queueOptionData = req.body;
    const queueOption = await (0, UpdateService_1.default)(queueOptionId, queueOptionData);
    return res.status(200).json(queueOption);
};
exports.update = update;
const update_media = async (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }
    const { queueOptionId } = req.params;
    const file = req.files['file'];
    const fileSize = file.data.length;
    const ext = path_1.default.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];
    if (!allowedType.includes(ext.toLowerCase()))
        return res.status(422).json({ msg: "Invalid images" });
    if (fileSize > 5000000)
        return res.status(422).json({ msg: "Image must be less than 5 mb" });
    file.mv(`${process.env.rootPath}/public/chatbot/${fileName}`, async (err) => {
        if (err) {
            console.error("upload error: " + err);
            return res.status(500).send(err);
        }
    });
    const option = await (0, ShowOneService_1.default)(queueOptionId);
    if (fs_1.default.existsSync(`${process.env.rootPath}${option.mediaUrl}`))
        fs_1.default.unlinkSync(`${process.env.rootPath}${option.mediaUrl}`);
    await option.update({
        mediaUrl: `/public/chatbot/${fileName}`
    });
    return res.status(200).json(`/public/chatbot/${fileName}`);
};
exports.update_media = update_media;
const remove = async (req, res) => {
    const { queueOptionId } = req.params;
    await (0, DeleteService_1.default)(queueOptionId);
    return res.status(200).json({ message: "Option Delected" });
};
exports.remove = remove;
