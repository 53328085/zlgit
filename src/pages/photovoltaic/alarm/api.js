import { Apimethod } from "@api/api.js"

export const { useQueryWarningStatistics } = new Apimethod( //告警概览
  "get",
  "Solar/RuntimeAlarm/QueryWarningStatistics"
);
export const { useQueryAlarmDetails } = new Apimethod( //告警信息报表
  "post",
  "Solar/RuntimeAlarm/QueryAlarmDetails"
);
