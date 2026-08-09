/**
 * Studio Profit Analytics Aggregation Service
 * Combines revenue, paper expense, and software fee data into a single financial telemetry payload.
 */

export function computeStudioProfitTelemetry({
  activityLogs = [],
  customerPricePerSheet = 12.0,
  paperCostPerSheet = 0.35,
  inkCostPerSheet = 0.15,
}) {
  const totalPhotosPrepared = activityLogs.reduce((acc, item) => acc + (item.photosCount || 0), 0);
  const totalSheetsPrinted = activityLogs.reduce((acc, item) => acc + (item.sheetQuantity || 0), 0);

  const grossRevenue = totalSheetsPrinted * customerPricePerSheet;
  const totalConsumableExpense = totalSheetsPrinted * (paperCostPerSheet + inkCostPerSheet);
  const netProfit = grossRevenue - totalConsumableExpense;
  const profitMarginPercentage = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

  return {
    totalPhotosPrepared,
    totalSheetsPrinted,
    grossRevenue: Number(grossRevenue.toFixed(2)),
    totalConsumableExpense: Number(totalConsumableExpense.toFixed(2)),
    netProfit: Number(netProfit.toFixed(2)),
    profitMarginPercentage: Number(profitMarginPercentage.toFixed(1)),
  };
}
