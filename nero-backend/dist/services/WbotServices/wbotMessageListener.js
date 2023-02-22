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
exports.handleMessage = exports.wbotMessageListener = exports.verifyMessage = exports.getQuotedMessageId = exports.getQuotedMessage = exports.getBodyMessage = void 0;
const path_1 = require("path");
const util_1 = require("util");
const fs_1 = require("fs");
const Sentry = __importStar(require("@sentry/node"));
const lodash_1 = require("lodash");
const baileys_1 = require("@adiwajshing/baileys");
const Contact_1 = __importDefault(require("../../models/Contact"));
const Ticket_1 = __importDefault(require("../../models/Ticket"));
const Message_1 = __importDefault(require("../../models/Message"));
const socket_1 = require("../../libs/socket");
const CreateMessageService_1 = __importDefault(require("../MessageServices/CreateMessageService"));
const logger_1 = require("../../utils/logger");
const CreateOrUpdateContactService_1 = __importDefault(require("../ContactServices/CreateOrUpdateContactService"));
const FindOrCreateTicketService_1 = __importDefault(require("../TicketServices/FindOrCreateTicketService"));
const ShowWhatsAppService_1 = __importDefault(require("../WhatsappService/ShowWhatsAppService"));
const Debounce_1 = require("../../helpers/Debounce");
const UpdateTicketService_1 = __importDefault(require("../TicketServices/UpdateTicketService"));
const Mustache_1 = __importDefault(require("../../helpers/Mustache"));
const UserRating_1 = __importDefault(require("../../models/UserRating"));
const SendWhatsAppMessage_1 = __importDefault(require("./SendWhatsAppMessage"));
const moment_1 = __importDefault(require("moment"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const QueueOption_1 = __importDefault(require("../../models/QueueOption"));
const FindOrCreateATicketTrakingService_1 = __importDefault(require("../TicketServices/FindOrCreateATicketTrakingService"));
const VerifyCurrentSchedule_1 = __importDefault(require("../CompanyService/VerifyCurrentSchedule"));
const Campaign_1 = __importDefault(require("../../models/Campaign"));
const CampaignShipping_1 = __importDefault(require("../../models/CampaignShipping"));
const sequelize_1 = require("sequelize");
const queues_1 = require("../../queues");
const User_1 = __importDefault(require("../../models/User"));
const Setting_1 = __importDefault(require("../../models/Setting"));
const writeFileAsync = (0, util_1.promisify)(fs_1.writeFile);
const getTypeMessage = (msg) => {
    return (0, baileys_1.getContentType)(msg.message);
};
const getBodyMessage = (msg) => {
    return (msg.message?.conversation ||
        msg.message?.imageMessage?.caption ||
        msg.message?.videoMessage?.caption ||
        msg.message?.extendedTextMessage?.text ||
        msg.message?.buttonsResponseMessage?.selectedButtonId ||
        msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msg.message?.templateButtonReplyMessage?.selectedId ||
        msg.message?.buttonsResponseMessage?.selectedButtonId ||
        msg.message?.listResponseMessage?.title);
};
exports.getBodyMessage = getBodyMessage;
const getQuotedMessage = (msg) => {
    const body = msg.message.imageMessage.contextInfo ||
        msg.message.videoMessage.contextInfo ||
        msg.message.extendedTextMessage.contextInfo ||
        msg.message.buttonsResponseMessage.contextInfo ||
        msg.message.listResponseMessage.contextInfo ||
        msg.message.templateButtonReplyMessage.contextInfo ||
        msg.message.buttonsResponseMessage?.contextInfo ||
        msg.message.listResponseMessage?.contextInfo;
    // testar isso
    return (0, baileys_1.extractMessageContent)(body[Object.keys(body).values().next().value]);
};
exports.getQuotedMessage = getQuotedMessage;
const getQuotedMessageId = (msg) => {
    const body = (0, baileys_1.extractMessageContent)(msg.message)[Object.keys(msg?.message).values().next().value];
    return body?.contextInfo?.stanzaId;
};
exports.getQuotedMessageId = getQuotedMessageId;
const getMeSocket = (wbot) => {
    return wbot.type === "legacy"
        ? {
            id: (0, baileys_1.jidNormalizedUser)(wbot.state.legacy.user.id),
            name: wbot.state.legacy.user.name
        }
        : {
            id: (0, baileys_1.jidNormalizedUser)(wbot.user.id),
            name: wbot.user.name
        };
};
const getSenderMessage = (msg, wbot) => {
    const me = getMeSocket(wbot);
    if (msg.key.fromMe)
        return me.id;
    const senderId = msg.participant || msg.key.participant || msg.key.remoteJid || undefined;
    return senderId && (0, baileys_1.jidNormalizedUser)(senderId);
};
const getContactMessage = async (msg, wbot) => {
    if (wbot.type === "legacy") {
        return wbot.store.contacts[msg.key.participant || msg.key.remoteJid];
    }
    const isGroup = msg.key.remoteJid.includes("g.us");
    const rawNumber = msg.key.remoteJid.replace(/\D/g, "");
    return isGroup
        ? {
            id: getSenderMessage(msg, wbot),
            name: msg.pushName
        }
        : {
            id: msg.key.remoteJid,
            name: msg.key.fromMe ? rawNumber : msg.pushName
        };
};
const downloadMedia = async (msg) => {
    const mineType = msg.message?.imageMessage ||
        msg.message?.audioMessage ||
        msg.message?.videoMessage ||
        msg.message?.stickerMessage ||
        msg.message?.documentMessage;
    const messageType = mineType.mimetype
        .split("/")[0]
        .replace("application", "document")
        ? mineType.mimetype
            .split("/")[0]
            .replace("application", "document")
        : mineType.mimetype.split("/")[0];
    const stream = await (0, baileys_1.downloadContentFromMessage)(msg.message.audioMessage ||
        msg.message.videoMessage ||
        msg.message.documentMessage ||
        msg.message.imageMessage ||
        msg.message.stickerMessage ||
        msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, messageType);
    let buffer = Buffer.from([]);
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    if (!buffer) {
        throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }
    let filename = msg.message?.documentMessage?.fileName || "";
    if (!filename) {
        const ext = mineType.mimetype.split("/")[1].split(";")[0];
        filename = `${new Date().getTime()}.${ext}`;
    }
    const media = {
        data: buffer,
        mimetype: mineType.mimetype,
        filename
    };
    return media;
};
const verifyContact = async (msgContact, wbot, companyId) => {
    let profilePicUrl;
    try {
        profilePicUrl = await wbot.profilePictureUrl(msgContact.id);
    }
    catch (e) {
        Sentry.captureException(e);
        profilePicUrl = `${process.env.FRONTEND_URL}/nopicture.png`;
    }
    const contactData = {
        name: msgContact.name || msgContact.id.replace(/\D/g, ""),
        number: msgContact.id,
        profilePicUrl,
        isGroup: msgContact.id.includes("g.us"),
        companyId
    };
    const contact = (0, CreateOrUpdateContactService_1.default)(contactData);
    return contact;
};
const verifyQuotedMessage = async (msg) => {
    if (!msg)
        return null;
    const quoted = (0, exports.getQuotedMessageId)(msg);
    if (!quoted)
        return null;
    const quotedMsg = await Message_1.default.findOne({
        where: { id: quoted }
    });
    if (!quotedMsg)
        return null;
    return quotedMsg;
};
const verifyMediaMessage = async (msg, ticket, contact) => {
    const io = (0, socket_1.getIO)();
    const quotedMsg = await verifyQuotedMessage(msg);
    const media = await downloadMedia(msg);
    if (!media) {
        throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }
    if (!media.filename) {
        const ext = media.mimetype.split("/")[1].split(";")[0];
        media.filename = `${new Date().getTime()}.${ext}`;
    }
    try {
        await writeFileAsync((0, path_1.join)(__dirname, "..", "..", "..", "public", media.filename), media.data, "base64");
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(err);
    }
    const body = (0, exports.getBodyMessage)(msg);
    const messageData = {
        id: msg.key.id,
        ticketId: ticket.id,
        contactId: msg.key.fromMe ? undefined : contact.id,
        body: body ? body : media.filename,
        fromMe: msg.key.fromMe,
        read: msg.key.fromMe,
        mediaUrl: media.filename,
        mediaType: media.mimetype.split("/")[0],
        quotedMsgId: quotedMsg?.id,
        ack: msg.status,
        remoteJid: msg.key.remoteJid,
        participant: msg.key.participant,
        dataJson: JSON.stringify(msg)
    };
    await ticket.update({
        lastMessage: body || media.filename
    });
    const newMessage = await (0, CreateMessageService_1.default)({
        messageData,
        companyId: ticket.companyId
    });
    if (!msg.key.fromMe && ticket.status === "closed") {
        await ticket.update({ status: "pending" });
        await ticket.reload({
            include: [
                { model: Queue_1.default, as: "queue" },
                { model: User_1.default, as: "user" },
                { model: Contact_1.default, as: "contact" }
            ]
        });
        io.to("closed").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
    return newMessage;
};
const verifyMessage = async (msg, ticket) => {
    const io = (0, socket_1.getIO)();
    const quotedMsg = await verifyQuotedMessage(msg);
    const body = (0, exports.getBodyMessage)(msg);
    const messageData = {
        id: msg.key.id,
        ticketId: ticket.id,
        contactId: msg.key.fromMe ? undefined : ticket.contact.id,
        body,
        fromMe: msg.key.fromMe,
        mediaType: getTypeMessage(msg),
        read: msg.key.fromMe,
        quotedMsgId: quotedMsg?.id,
        ack: msg.status,
        remoteJid: msg.key.remoteJid,
        participant: msg.key.participant,
        dataJson: JSON.stringify(msg)
    };
    await ticket.update({
        lastMessage: body
    });
    await (0, CreateMessageService_1.default)({ messageData, companyId: ticket.companyId });
    if (!msg.key.fromMe && ticket.status === "closed") {
        await ticket.update({ status: "pending" });
        await ticket.reload({
            include: [
                { model: Queue_1.default, as: "queue" },
                { model: User_1.default, as: "user" },
                { model: Contact_1.default, as: "contact" }
            ]
        });
        io.to("closed").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
};
exports.verifyMessage = verifyMessage;
const isValidMsg = (msg) => {
    if (msg.key.remoteJid === "status@broadcast")
        return false;
    const msgType = getTypeMessage(msg);
    const ifType = msgType === "conversation" ||
        msgType === "extendedTextMessage" ||
        msgType === "audioMessage" ||
        msgType === "videoMessage" ||
        msgType === "imageMessage" ||
        msgType === "documentMessage" ||
        msgType === "stickerMessage";
    return !!ifType;
};
const verifyQueue = async (wbot, msg, ticket, contact) => {
    const { queues, greetingMessage } = await (0, ShowWhatsAppService_1.default)(wbot.id, ticket.companyId);
    if (queues.length === 1) {
        const firstQueue = (0, lodash_1.head)(queues);
        let chatbot = false;
        if (firstQueue?.options) {
            chatbot = firstQueue.options.length > 0;
        }
        console.log("verifyQueue:" + firstQueue);
        console.log("verifyQueue:" + chatbot);
        await (0, UpdateTicketService_1.default)({
            ticketData: { queueId: firstQueue?.id, chatbot },
            ticketId: ticket.id,
            companyId: ticket.companyId
        });
        return;
    }
    const selectedOption = msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text;
    const choosenQueue = queues[+selectedOption - 1];
    console.log("verifyQueue:" + choosenQueue);
    if (choosenQueue) {
        let chatbot = false;
        if (choosenQueue?.options) {
            chatbot = choosenQueue.options.length > 0;
        }
        await (0, UpdateTicketService_1.default)({
            ticketData: { queueId: choosenQueue.id, chatbot },
            ticketId: ticket.id,
            companyId: ticket.companyId
        });
        if (choosenQueue.options.length == 0) {
            const body = `\u200e${choosenQueue.greetingMessage}`;
            const sentMessage = await wbot.sendMessage(`${contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            await (0, exports.verifyMessage)(sentMessage, ticket);
        }
    }
    else {
        let options = "";
        queues.forEach((queue, index) => {
            options += `*${index + 1}* - ${queue.name}\n`;
        });
        const body = (0, Mustache_1.default)(`\u200e${greetingMessage}\n${options}`, ticket.contact);
        const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            (0, exports.verifyMessage)(sentMessage, ticket);
        }, 3000, ticket.id);
        debouncedSentMessage();
    }
};
const verifyRating = (ticketTraking) => {
    if (ticketTraking &&
        ticketTraking.finishedAt === null &&
        ticketTraking.userId !== null &&
        ticketTraking.ratingAt !== null) {
        return true;
    }
    return false;
};
const handleRating = async (msg, ticket, ticketTraking) => {
    const io = (0, socket_1.getIO)();
    let rate = null;
    if (msg.message?.conversation) {
        rate = +msg.message?.conversation;
    }
    if (!Number.isNaN(rate) && Number.isInteger(rate) && !(0, lodash_1.isNull)(rate)) {
        const { complationMessage } = await (0, ShowWhatsAppService_1.default)(ticket.whatsappId, ticket.companyId);
        let finalRate = rate;
        if (rate < 1) {
            finalRate = 1;
        }
        if (rate > 3) {
            finalRate = 3;
        }
        await UserRating_1.default.create({
            ticketId: ticketTraking.ticketId,
            companyId: ticketTraking.companyId,
            userId: ticketTraking.userId,
            rate: finalRate
        });
        const body = `\u200e${complationMessage}`;
        await (0, SendWhatsAppMessage_1.default)({ body, ticket });
        await ticketTraking.update({
            finishedAt: (0, moment_1.default)().toDate(),
            rated: true
        });
        await ticket.update({
            queueId: null,
            userId: null,
            status: "closed"
        });
        io.to("open").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
};
const handleChartbot = async (ticket, msg, wbot, dontReadTheFirstQuestion = false) => {
    const queue = await Queue_1.default.findByPk(ticket.queueId, {
        include: [
            {
                model: QueueOption_1.default,
                as: "options",
                where: { parentId: null },
                order: [
                    ["option", "ASC"],
                    ["createdAt", "ASC"]
                ]
            }
        ]
    });
    const messageBody = (0, exports.getBodyMessage)(msg);
    if (messageBody == "00") {
        // voltar para o menu inicial
        await ticket.update({ queueOptionId: null, chatbot: false, queueId: null });
        await verifyQueue(wbot, msg, ticket, ticket.contact);
        return;
    }
    if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId) && messageBody == "#") {
        // falar com atendente
        await ticket.update({ queueOptionId: null, chatbot: false });
        const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
            text: "\u200eAguarde, você será atendido em instantes."
        });
        (0, exports.verifyMessage)(sentMessage, ticket);
        return;
    }
    else if (!(0, lodash_1.isNil)(queue) &&
        !(0, lodash_1.isNil)(ticket.queueOptionId) &&
        messageBody == "0") {
        // voltar para o menu anterior
        const option = await QueueOption_1.default.findByPk(ticket.queueOptionId);
        await ticket.update({ queueOptionId: option?.parentId });
    }
    else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
        // escolheu uma opção
        const count = await QueueOption_1.default.count({
            where: { parentId: ticket.queueOptionId }
        });
        let option = {};
        if (count == 1) {
            option = await QueueOption_1.default.findOne({
                where: { parentId: ticket.queueOptionId }
            });
        }
        else {
            option = await QueueOption_1.default.findOne({
                where: {
                    option: messageBody || "",
                    parentId: ticket.queueOptionId
                }
            });
        }
        if (option) {
            await ticket.update({ queueOptionId: option?.id });
        }
    }
    else if (!(0, lodash_1.isNil)(queue) &&
        (0, lodash_1.isNil)(ticket.queueOptionId) &&
        !dontReadTheFirstQuestion) {
        // não linha a primeira pergunta
        const option = queue?.options.find(o => o.option == messageBody);
        if (option) {
            await ticket.update({ queueOptionId: option?.id });
        }
    }
    await ticket.reload();
    if (!(0, lodash_1.isNil)(queue) && (0, lodash_1.isNil)(ticket.queueOptionId)) {
        let body = "";
        let options = "";
        const queueOptions = await QueueOption_1.default.findAll({
            where: { queueId: ticket.queueId, parentId: null },
            order: [
                ["option", "ASC"],
                ["createdAt", "ASC"]
            ]
        });
        if (queue.greetingMessage) {
            body = `${queue.greetingMessage}\n\n`;
        }
        queueOptions.forEach((option, i) => {
            if (queueOptions.length - 1 > i) {
                options += `*${option.option}* - ${option.title}\n`;
            }
            else {
                options += `*${option.option}* - ${option.title}`;
            }
        });
        if (options !== "") {
            body += options;
        }
        body += "\n\n*00* - *Menu inicial*";
        const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            (0, exports.verifyMessage)(sentMessage, ticket);
        }, 3000, ticket.id);
        debouncedSentMessage();
    }
    else if (!(0, lodash_1.isNil)(queue) && !(0, lodash_1.isNil)(ticket.queueOptionId)) {
        const currentOption = await QueueOption_1.default.findByPk(ticket.queueOptionId);
        const queueOptions = await QueueOption_1.default.findAll({
            where: { parentId: ticket.queueOptionId },
            order: [
                ["option", "ASC"],
                ["createdAt", "ASC"]
            ]
        });
        let body = "";
        let options = "";
        let initialMessage = "";
        let aditionalOptions = "\n";
        if (queueOptions.length > 1) {
            if (!(0, lodash_1.isNil)(currentOption?.message) && currentOption?.message !== "") {
                initialMessage = `${currentOption?.message}\n\n`;
                body += initialMessage;
            }
            if (queueOptions.length == 0) {
                aditionalOptions = `*#* - *Falar com o atendente*\n`;
            }
            queueOptions.forEach(option => {
                options += `*${option.option}* - ${option.title}\n`;
            });
            if (options !== "") {
                body += options;
            }
            aditionalOptions += "*0* - *Voltar*\n";
            aditionalOptions += "*00* - *Menu inicial*";
            body += aditionalOptions;
        }
        else {
            const firstOption = (0, lodash_1.head)(queueOptions);
            if (firstOption) {
                body = `${firstOption?.title}`;
                if (firstOption?.message) {
                    body += `\n\n${firstOption.message}`;
                }
            }
            else {
                body = `*#* - *Falar com o atendente*\n\n`;
                body += `*0* - *Voltar*\n`;
                body += `*00* - *Menu inicial*`;
            }
        }
        const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
            const sentMessage = await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                text: body
            });
            (0, exports.verifyMessage)(sentMessage, ticket);
        }, 3000, ticket.id);
        debouncedSentMessage();
    }
};
const handleMessage = async (msg, wbot, companyId) => {
    if (!isValidMsg(msg)) {
        return;
    }
    try {
        let msgContact;
        let groupContact;
        const bodyMessage = (0, exports.getBodyMessage)(msg);
        const msgType = getTypeMessage(msg);
        const hasMedia = msg.message?.audioMessage ||
            msg.message?.imageMessage ||
            msg.message?.videoMessage ||
            msg.message?.documentMessage ||
            msg.message.stickerMessage;
        if (msg.key.fromMe) {
            if (/\u200e/.test(bodyMessage))
                return;
            if (!hasMedia &&
                msgType !== "conversation" &&
                msgType !== "extendedTextMessage" &&
                msgType !== "vcard")
                return;
            msgContact = await getContactMessage(msg, wbot);
        }
        else {
            msgContact = await getContactMessage(msg, wbot);
        }
        const isGroup = msg.key.remoteJid?.endsWith("@g.us");
        if (isGroup) {
            const grupoMeta = await wbot.groupMetadata(msg.key.remoteJid, false);
            const msgGroupContact = {
                id: grupoMeta.id,
                name: grupoMeta.subject
            };
            groupContact = await verifyContact(msgGroupContact, wbot, companyId);
        }
        const whatsapp = await (0, ShowWhatsAppService_1.default)(wbot.id, companyId);
        const count = wbot.store.chats.get(msg.key.remoteJid || msg.key.participant);
        const unreadMessages = msg.key.fromMe ? 0 : count?.unreadCount || 1;
        const contact = await verifyContact(msgContact, wbot, companyId);
        if (unreadMessages === 0 &&
            whatsapp.farewellMessage &&
            (0, Mustache_1.default)(whatsapp.farewellMessage, contact) === bodyMessage) {
            return;
        }
        const ticket = await (0, FindOrCreateTicketService_1.default)(contact, wbot.id, unreadMessages, companyId, msg.key.fromMe, groupContact);
        const ticketTraking = await (0, FindOrCreateATicketTrakingService_1.default)({
            ticketId: ticket.id,
            companyId,
            whatsappId: whatsapp?.id
        });
        try {
            if (!msg.key.fromMe) {
                /**
                 * Tratamento para avaliação do atendente
                 */
                if (ticketTraking !== null && verifyRating(ticketTraking)) {
                    handleRating(msg, ticket, ticketTraking);
                    return;
                }
            }
        }
        catch (e) {
            Sentry.captureException(e);
            console.log(e);
        }
        if (hasMedia) {
            await verifyMediaMessage(msg, ticket, contact);
        }
        else {
            await (0, exports.verifyMessage)(msg, ticket);
        }
        const currentSchedule = await (0, VerifyCurrentSchedule_1.default)(companyId);
        const scheduleType = await Setting_1.default.findOne({
            where: {
                companyId,
                key: "scheduleType"
            }
        });
        try {
            if (!msg.key.fromMe && scheduleType) {
                /**
                 * Tratamento para envio de mensagem quando a empresa está fora do expediente
                 */
                if (scheduleType.value === "company" &&
                    !(0, lodash_1.isNil)(currentSchedule) &&
                    (!currentSchedule || currentSchedule.inActivity === false)) {
                    const body = `${whatsapp.outOfHoursMessage}`;
                    const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
                        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                            text: body
                        });
                    }, 3000, ticket.id);
                    debouncedSentMessage();
                    return;
                }
            }
        }
        catch (e) {
            Sentry.captureException(e);
            console.log(e);
        }
        const dontReadTheFirstQuestion = ticket.queue === null;
        if (!ticket.queue &&
            !isGroup &&
            !msg.key.fromMe &&
            !ticket.userId &&
            whatsapp.queues.length >= 1) {
            await verifyQueue(wbot, msg, ticket, ticket.contact);
        }
        await ticket.reload();
        try {
            if (!msg.key.fromMe && scheduleType && ticket.queueId !== null) {
                /**
                 * Tratamento para envio de mensagem quando a fila está fora do expediente
                 */
                const queue = await Queue_1.default.findByPk(ticket.queueId);
                const { schedules } = queue;
                const now = (0, moment_1.default)();
                const weekday = now.format("dddd").toLowerCase();
                let schedule = null;
                if (Array.isArray(schedules) && schedules.length > 0) {
                    schedule = schedules.find(s => s.weekdayEn === weekday &&
                        s.startTime !== "" &&
                        s.startTime !== null &&
                        s.endTime !== "" &&
                        s.endTime !== null);
                }
                if (scheduleType.value === "queue" &&
                    queue.outOfHoursMessage !== null &&
                    queue.outOfHoursMessage !== "" &&
                    !(0, lodash_1.isNil)(schedule)) {
                    const startTime = (0, moment_1.default)(schedule.startTime, "HH:mm");
                    const endTime = (0, moment_1.default)(schedule.endTime, "HH:mm");
                    if (now.isBefore(startTime) || now.isAfter(endTime)) {
                        const body = `${queue.outOfHoursMessage}`;
                        const debouncedSentMessage = (0, Debounce_1.debounce)(async () => {
                            await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                                text: body
                            });
                        }, 3000, ticket.id);
                        debouncedSentMessage();
                        return;
                    }
                }
            }
        }
        catch (e) {
            Sentry.captureException(e);
            console.log(e);
        }
        if (whatsapp.queues.length == 1 && ticket.queue) {
            if (ticket.chatbot && !msg.key.fromMe) {
                await handleChartbot(ticket, msg, wbot);
            }
        }
        if (whatsapp.queues.length > 1 && ticket.queue) {
            if (ticket.chatbot && !msg.key.fromMe) {
                await handleChartbot(ticket, msg, wbot, dontReadTheFirstQuestion);
            }
        }
        if ((0, lodash_1.isNull)(ticket.queueId) && ticket.status !== "open" && !msg.key.fromMe) {
            const greetingMessage = whatsapp.greetingMessage || "";
            if (greetingMessage !== "") {
                await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, {
                    text: greetingMessage
                });
            }
        }
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error handling whatsapp message: Err: ${err}`);
    }
};
exports.handleMessage = handleMessage;
const handleMsgAck = async (msg, chat) => {
    await new Promise(r => setTimeout(r, 500));
    const io = (0, socket_1.getIO)();
    try {
        const messageToUpdate = await Message_1.default.findByPk(msg.key.id, {
            include: [
                "contact",
                {
                    model: Message_1.default,
                    as: "quotedMsg",
                    include: ["contact"]
                }
            ]
        });
        if (!messageToUpdate)
            return;
        await messageToUpdate.update({ ack: chat });
        io.to(messageToUpdate.ticketId.toString()).emit(`company-${messageToUpdate.companyId}-appMessage`, {
            action: "update",
            message: messageToUpdate
        });
    }
    catch (err) {
        Sentry.captureException(err);
        logger_1.logger.error(`Error handling message ack. Err: ${err}`);
    }
};
const verifyRecentCampaign = async (message, companyId) => {
    if (!message.key.fromMe) {
        const number = message.key.remoteJid.replace(/\D/g, "");
        const campaigns = await Campaign_1.default.findAll({
            where: { companyId, status: "EM_ANDAMENTO", confirmation: true }
        });
        if (campaigns) {
            const ids = campaigns.map(c => c.id);
            const campaignShipping = await CampaignShipping_1.default.findOne({
                where: { campaignId: { [sequelize_1.Op.in]: ids }, number, confirmation: null }
            });
            if (campaignShipping) {
                await campaignShipping.update({
                    confirmedAt: (0, moment_1.default)(),
                    confirmation: true
                });
                await queues_1.campaignQueue.add("DispatchCampaign", {
                    campaignShippingId: campaignShipping.id,
                    campaignId: campaignShipping.campaignId
                }, {
                    delay: (0, queues_1.parseToMilliseconds)((0, queues_1.randomValue)(0, 10))
                });
            }
        }
    }
};
const verifyCampaignMessageAndCloseTicket = async (message, companyId) => {
    const io = (0, socket_1.getIO)();
    const body = (0, exports.getBodyMessage)(message);
    const isCampaign = /\u200c/.test(body);
    if (message.key.fromMe && isCampaign) {
        const messageRecord = await Message_1.default.findOne({
            where: { id: message.key.id, companyId }
        });
        const ticket = await Ticket_1.default.findByPk(messageRecord.ticketId);
        await ticket.update({ status: "closed" });
        io.to("open").emit(`company-${ticket.companyId}-ticket`, {
            action: "delete",
            ticket,
            ticketId: ticket.id
        });
        io.to(ticket.status)
            .to(ticket.id.toString())
            .emit(`company-${ticket.companyId}-ticket`, {
            action: "update",
            ticket,
            ticketId: ticket.id
        });
    }
};
const wbotMessageListener = (wbot, companyId) => {
    wbot.ev.on("messages.upsert", async (messageUpsert) => {
        if (!messageUpsert.messages)
            return;
        messageUpsert.messages.forEach(async (message) => {
            const messageExists = await Message_1.default.count({
                where: { id: message.key.id, companyId }
            });
            if (!messageExists) {
                await handleMessage(message, wbot, companyId);
                await verifyRecentCampaign(message, companyId);
                await verifyCampaignMessageAndCloseTicket(message, companyId);
            }
        });
    });
    wbot.ev.on("messages.update", (messageUpdate) => {
        if (messageUpdate.length === 0)
            return;
        messageUpdate.forEach(async (message) => {
            await handleMsgAck(message, message.update.status);
        });
    });
};
exports.wbotMessageListener = wbotMessageListener;
