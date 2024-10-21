const { constants } = require("../utils/constant");

const errorHandle = (err, req, res, next) => {
  const status = res.statusCode ? res.statusCode : 500;
  switch (status) {
    case constants.BAD_REQUEST: // 400
      res.status(400).json({
        title: "BAD_REQUEST",
        message: err.message,
        status,
      });
      break;
    case constants.UNAUTHORIZED: // 401
      res.status(401).json({
        title: "UNAUTHORIZED",
        message: err.message,
        status,
      });
      break;
    case constants.FORBIDDEN: // 403
      res.status(403).json({
        title: "FORBIDDEN",
        message: err.message,
        status,
      });
      break;
    case constants.FORBIDDEN: // 403
      res.status(403).json({
        title: "FORBIDDEN",
        message: err.message,
        status,
      });
      break;
    default: // 500
      res.status(500).json({
        title: "INTERNAL_SERVER_ERROR",
        message: err.message,
        status,
      });
      break;
  }
};

module.exports = errorHandle;
