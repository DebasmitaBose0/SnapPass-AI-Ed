export async function getActivityLog(req, res) {
  return res
    .status(200)
    .json([{ id: 1, action: 'User Logged In', time: new Date() }]);
}
