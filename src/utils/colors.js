import { COLORS } from "@/configs";

export const toColor = account => {
  switch (account) {
    case 'Здания':
      return COLORS.chart.blue;
    case 'Участки':
      return COLORS.chart.red;
    default:
      return COLORS.chart.purple;
  }
};