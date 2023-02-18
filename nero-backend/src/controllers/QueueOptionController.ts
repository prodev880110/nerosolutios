import { Request, Response } from "express";

import CreateService from "../services/QueueOptionService/CreateService";
import ListService from "../services/QueueOptionService/ListService";
import UpdateService from "../services/QueueOptionService/UpdateService";
import ShowService from "../services/QueueOptionService/ShowService";
import ShowOneService from "../services/QueueOptionService/ShowOneService";
import DeleteService from "../services/QueueOptionService/DeleteService";

import path from "path";
import fs from "fs";

type FilterList = {
  queueId: string | number;
  queueOptionId: string | number;
  parentId: string | number | boolean;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { queueId, queueOptionId, parentId } = req.query as FilterList;

  const queueOptions = await ListService({ queueId, queueOptionId, parentId });

  return res.json(queueOptions);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const queueOptionData = req.body;

  const queueOption = await CreateService(queueOptionData);

  return res.status(200).json(queueOption);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { queueOptionId } = req.params;

  const queueOption = await ShowService(queueOptionId);

  return res.status(200).json(queueOption);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueOptionId } = req.params
  const queueOptionData = req.body;

  const queueOption = await UpdateService(queueOptionId, queueOptionData);

  return res.status(200).json(queueOption);
};
export const update_media = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const { queueOptionId } = req.params
  
  const file = req.files['file'];
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const allowedType = ['.png', '.jpg', '.jpeg'];

  if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid images" });
  if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 mb" });
  
  file.mv(`${process.env.rootPath}/public/chatbot/${fileName}`, async (err) => {
    if (err) {
      console.error("upload error: "+err);
      return res.status(500).send(err);
    }

  });
  const option = await ShowOneService(queueOptionId);
  if (fs.existsSync(`${process.env.rootPath}${option.mediaUrl}`)) fs.unlinkSync(`${process.env.rootPath}${option.mediaUrl}`);
  await option.update({
    mediaUrl: `/public/chatbot/${fileName}`
  });

  return res.status(200).json(`/public/chatbot/${fileName}`);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { queueOptionId } = req.params

  await DeleteService(queueOptionId);

  return res.status(200).json({ message: "Option Delected" });
};
