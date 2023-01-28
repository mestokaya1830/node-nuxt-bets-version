const serverauth =  (req, res, next) => {
  if (req.session.auth) {
    next()
  }
}
module.exports = serverauth