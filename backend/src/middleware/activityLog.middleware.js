export default function activityLogMiddleware(req, res, next) {
  const log = {
    ip: req.ip,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date(),
  };
  console.log('Activity logged:', log);
  next();
}
