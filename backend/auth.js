module.exports = function(req, res, next) {

  const token =
    req.headers['authorization'];

  if (!token || token !== process.env.ADMIN_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  next();
};