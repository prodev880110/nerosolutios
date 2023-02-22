"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authStateLegacy = void 0;
const baileys_1 = require("@adiwajshing/baileys");
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const authStateLegacy = async (whatsapp) => {
    const updateWhatsappData = await Whatsapp_1.default.findOne({
        where: {
            id: whatsapp.id
        }
    });
    let state;
    if (updateWhatsappData?.session) {
        state = JSON.parse(updateWhatsappData?.session, baileys_1.BufferJSON.reviver);
        if (typeof state.encKey === "string") {
            state.encKey = Buffer.from(state.encKey, "base64");
        }
        if (typeof state.macKey === "string") {
            state.macKey = Buffer.from(state.macKey, "base64");
        }
    }
    else {
        state = (0, baileys_1.newLegacyAuthCreds)();
    }
    return {
        state,
        saveState: async () => {
            const str = JSON.stringify(state, baileys_1.BufferJSON.replacer, 2);
            await whatsapp.update({
                session: str
            });
        }
    };
};
exports.authStateLegacy = authStateLegacy;
exports.default = exports.authStateLegacy;
