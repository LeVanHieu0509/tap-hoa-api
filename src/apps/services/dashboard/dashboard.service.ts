import { responseClient } from "../../../utils";
import { MESSAGE_NOTFOUND, MESSAGE_SUCCESS } from "../../constants";
import { totalMoneyOverview } from "./repo.service";

export const getOverviewDashboard = async () => {
  const overview = await totalMoneyOverview();

  if (overview) {
    return responseClient({
      status: "1",
      data: overview,
      message: MESSAGE_SUCCESS,
    });
  } else {
    return responseClient({
      status: "-1",
      message: MESSAGE_NOTFOUND,
    });
  }
};
