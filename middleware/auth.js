
function auth(req, res, next) {
    if (req.session && req.session.usuario) {
        return next();
    }

    return res.status(401).json({
        message: 'Debe iniciar sesión para acceder a este recurso.'
    });
}

module.exports = auth;