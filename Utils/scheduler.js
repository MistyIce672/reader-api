const cron = require("node-cron");
const { resetMonthlyPoints } = require("../Services/points/dal");

// Schedule points reset for first day of every month at midnight
cron.schedule("0 0 1 * *", async () => {
  try {
    await resetMonthlyPoints();
    console.log("Monthly points reset completed");
  } catch (error) {
    console.error("Error resetting monthly points:", error);
  }
});
