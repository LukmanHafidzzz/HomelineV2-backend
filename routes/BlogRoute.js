const express = require('express')

//controllers
const BlogController = require('../controllers/BlogController')

const route = express.Router()

route.post('/post-blog', BlogController.postBlog)
route.get('/blog', BlogController.getBlog)
route.get('/blog/detail/:blog_id', BlogController.editBlog);
route.get('/blog/detail-foto/:blog_id', BlogController.fotoBlog);
route.delete('/blog/delete/:blog_id', BlogController.deleteBlog);
route.patch('/blog/update/:blog_id', BlogController.updateBlog);

module.exports = route;