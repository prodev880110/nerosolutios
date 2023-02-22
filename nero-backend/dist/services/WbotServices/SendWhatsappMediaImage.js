"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../errors/AppError"));
const GetTicketWbot_1 = __importDefault(require("../../helpers/GetTicketWbot"));
// import mime from "mime-types";
const fs_1 = __importDefault(require("fs"));
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const SendWhatsAppMediaImage = async ({ ticket, url, caption }) => {
    const wbot = await (0, GetTicketWbot_1.default)(ticket);
    const number = `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`;
    try {
        const sentMessage = await wbot.sendMessage(`${number}`, {
            image: url ? { url } : fs_1.default.readFileSync(`public/temp/${caption}-${makeid(10)}.png`),
            caption: caption,
            mimetype: 'image/jpeg'
        });
        return sentMessage;
    }
    catch (err) {
        throw new AppError_1.default("ERR_SENDING_WAPP_MSG");
    }
};
exports.default = SendWhatsAppMediaImage;
