exports.getNotFound = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',
    });
};
exports.get500Error = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error occured',
        path: '/500',
    });
};