const router = require('express').Router();
const sequelize = require('../config/connection')
const { Post, User, Comment } = require('../models')

router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
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
            res.render('homepage', { 
                posts, 
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        console.log('logging in')
        return;
    }
    
    res.render('login');
});

router.get('/signup', (req, res) => {
	// check session variable...if user is logged in redirect to homepage
	if (req.session.loggedIn) {
		res.redirect('/');
		return;
	}
	// otherwise render login page
	res.render('signup');
});



module.exports = router;