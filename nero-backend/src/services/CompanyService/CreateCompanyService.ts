import * as Yup from "yup";
import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import User from "../../models/User";
import Setting from "../../models/Setting";

interface CompanyData {
  name: string;
  phone?: string;
  code?: string;
  email?: string;
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

const CreateCompanyService = async (
  companyData: CompanyData
): Promise<Company> => {
  const {
    name,
    phone,
    code,
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

  const companySchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "ERR_COMPANY_INVALID_NAME")
      .required("ERR_COMPANY_INVALID_NAME")
      .test(
        "Check-unique-name",
        "ERR_COMPANY_NAME_ALREADY_EXISTS",
        async value => {
          if (value) {
            const companyWithSameName = await Company.findOne({
              where: { name: value }
            });

            return !companyWithSameName;
          }
          return false;
        }
      )
  });

  try {
    await companySchema.validate({ name });
  } catch (err: any) {
    throw new AppError(err.message);
  }

  const company = await Company.create({
    name,
    phone,
    code,
    email,
    status,
    connections_number,
    users_number,
    queues_number,
    dueDate,
    recurrence
  });

  await User.create({
    name: company.name,
    email: company.email,
    password: "123456",
    profile: "admin",
    companyId: company.id
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
    if (!created) {
      await setting.update({ value: `${campaignsEnabled}` });
    }
  }
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
    if (!created) {
      await setting.update({ value: `${call}` });
    }
  }

  return company;
};

export default CreateCompanyService;
