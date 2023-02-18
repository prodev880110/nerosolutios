import AppError from "../../errors/AppError";
import Queue from "../../models/Queue";

const ShowQueueService = async (
  queueId: number | string,
  companyId: number
): Promise<Queue> => {
  const queue = await Queue.findByPk(queueId);

  if (queue?.companyId !== companyId) {
    throw new AppError("Unable to query records from another company");
  }

  if (!queue) {
    throw new AppError("ERR_QUEUE_NOT_FOUND");
  }

  return queue;
};

export default ShowQueueService;
