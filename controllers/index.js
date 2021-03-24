const router = require('express').Router();

const dashboardRoutes = require('./dashboard-routes.js');

router.use('/dashboard', dashboardRoutes);

const apiRoutes = require('./api');
router.use('/api', apiRoutes);

// const commentRoutes = require('./api/comment-routes');
// router.use('/comments', commentRoutes);

const homeRoutes = require('./home-routes');
router.use('/', homeRoutes);

// router.use((req, res) => {
//     res.status(404).end();
// });

module.exports = router;
