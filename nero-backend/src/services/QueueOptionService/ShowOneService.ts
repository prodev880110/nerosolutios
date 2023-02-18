import AppError from "../../errors/AppError";
import QueueOption from "../../models/QueueOption";

const ShowOneService = async (queueOptionId: number | string): Promise<QueueOption> => {
  const queue = await QueueOption.findOne({
    where: {
      id: queueOptionId
    }
  });

  if (!queue) {
    throw new AppError("ERR_QUEUE_NOT_FOUND");
  }

  return queue;
};

export default ShowOneService;
