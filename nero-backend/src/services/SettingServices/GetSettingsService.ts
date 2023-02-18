import Setting from "../../models/Setting";

interface Request {
  companyId: number;
  key: string;
}

const GetSettingsService = async ({
  companyId, key
}: Request): Promise<Setting | undefined> => {
  const setting = await Setting.findOne({
    where: {
      companyId: companyId,
      key: key
    }
  });

  return setting;
};

export default GetSettingsService;
