const jwt = require("jsonwebtoken");

const AppError = require("./appError");

// const User = require("./../models/UserModel");
require("dotenv").config();

exports.signAccesstoken = (id) => {
  const token = jwt.sign({ id }, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "15m"
  });
  return token;
};
exports.signRefreshToken = async (id) => {
  const token = jwt.sign({ id }, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "10d"
  });

  return token;
};

exports.verifyToken = (token) => (req, res, next) => {
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, result) => {
    if (error) {
      return next(
        new AppError("Cannot verify with refresh token. Login again", 400)
      );
    }
    return result;
  });
};
// exports.verifyRefreshToken = (req, res, next, refreshToken) => {
//   if (!refreshToken) {
//     return next(new AppError("Cannot find refreshToken", 404));
//   }
//   jwt.verify(
//     refreshToken,
//     process.env.JWT_SECRET_KEY,
//     async (error, result) => {
//       if (error) {
//         return next(
//           new AppError("Cannot verify with refresh token. Login again", 400)
//         );
//       }
//       if ((await client.get(result.id)) !== refreshToken) {
//         return next(new AppError("Invalid refreshToken", 400));
//       }
//       this.sendCookie(res, result.id);
//       const currentUser = await User.findById(result.id);
//       req.user = currentUser;
//       return next();
//     }
//   );
// };
