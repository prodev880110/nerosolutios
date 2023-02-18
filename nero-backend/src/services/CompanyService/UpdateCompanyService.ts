import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import Setting from "../../models/Setting";

interface CompanyData {
  name: string;
  id?: number | string;
  phone?: string;
  email?: string;
  code?: string;
  status?: boolean;
  connections_number?: number;
  users_number?: number;
  queues_number?: number;
  call?: boolean;
  CheckMsgIsGroup?: boolean;
  campaignsEnabled?: boolean;
  dueDate?: string;
  recurrence?: string;
}

const UpdateCompanyService = async (
  companyData: CompanyData
): Promise<Company> => {
  const company = await Company.findByPk(companyData.id);
  const {
    name,
    phone,
    email,
    status,
    connections_number,
    users_number,
    queues_number,
    call,
    CheckMsgIsGroup,
    campaignsEnabled,
    dueDate,
    recurrence
  } = companyData;

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  await company.update({
    name,
    phone,
    email,
    status,
    connections_number,
    users_number,
    queues_number,
    dueDate,
    recurrence
  });

  if (companyData.campaignsEnabled !== undefined) {
    const [setting, created] = await Setting.findOrCreate({
      where: {
        companyId: company.id,
        key: "campaignsEnabled"
      },
      defaults: {
        companyId: company.id,
        key: "campaignsEnabled",
        value: `${campaignsEnabled}`
      }
    });
    if (companyData.CheckMsgIsGroup !== undefined) {
      const [setting, created] = await Setting.findOrCreate({
        where: {
          companyId: company.id,
          key: "CheckMsgIsGroup"
        },
        defaults: {
          companyId: company.id,
          key: "CheckMsgIsGroup",
          value: `${CheckMsgIsGroup}`
        }
      });
      if (!created) {
        await setting.update({ value: `${CheckMsgIsGroup}` });
      }
    }
    if (companyData.call !== undefined) {
      const [setting, created] = await Setting.findOrCreate({
        where: {
          companyId: company.id,
          key: "call"
        },
        defaults: {
          companyId: company.id,
          key: "call",
          value: `${call}`
        }
      });
    }
    if (!created) {
      await setting.update({ value: `${campaignsEnabled}` });
    }
  }

  return company;
};

export default UpdateCompanyService;
