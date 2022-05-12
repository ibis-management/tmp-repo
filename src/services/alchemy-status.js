import events from "../config/events.js";

const mapping = {
  [events.PAYMENT_REQUEST_ACCEPTED]: "TH_INI_YOK",
  [events.QUOTATION_RECEIVED]: "TH_QOT_YOK",
  [events.EXECUTION_RECEIVED]: "TH_RCV_YOK", // If Execution is OK
};

export const getStatus = (ynohubId, event, data) => {
  const YNH_RESPONSE = {
    YNHIDN: ynohubId,
    STATUS: mapping[event],
    ...data,
  };

  return { YNH_RESPONSE };
};
