const { Account } = require("../../Schema");

const calculatePointsCost = (text) => {
  return Math.ceil(text.length / 10);
};

const deductPoints = async (userId, pointsToDeduct) => {
  const user = await Account.findById(userId);
  if (user.points < pointsToDeduct) {
    throw new Error("Insufficient points");
  }

  user.points -= pointsToDeduct;
  await user.save();
  return user.points;
};

const resetMonthlyPoints = async () => {
  await Account.updateMany({}, { points: 10000 });
};

module.exports = {
  calculatePointsCost,
  deductPoints,
  resetMonthlyPoints,
};
