import Company from "../../models/Company";

interface Params {
  value: string | number;
}


const CheckCompanyCodeService = async ({ value }: Params): Promise<Boolean> => {
    const companies = await Company.findAll({
      where: {
        code: value
      }
    });
    if (companies.length == 0) {
        return true;
    }
    else
      return false;
  };

export default CheckCompanyCodeService;