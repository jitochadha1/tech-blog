const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');
const withAuth = require('../utils/auth');

// get all posts for dashboard
router.get('/', withAuth, (req, res) => {
    console.log(req.session);
    console.log('======================');
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'text',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, loggedIn: true, title: 'Your Dashboard' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/create', (req, res) => {
    res.render('post-form', {
        // title: 'Your Dashboard',
        isEdit: false,
        loggedIn: true
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: [
            'id',
            'text',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (dbPostData) {
                const post = dbPostData.get({ plain: true });
                console.log('post', post)
                console.log(post.user.username, req.session.username)
                
                const loggedIn = post.user.username === req.session.username;

                res.render('post-form', {
                    ...post,
                    loggedIn,
                    isEdit: true
                });
            } else {
                res.status(404).end();
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

module.exports = router;
