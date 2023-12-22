const express = require('express')

//controllers
const NotarisController = require('../controllers/NotarisController')

const route = express.Router()

route.get('/jasa-notaris', NotarisController.jasaNotaris)
route.get('/jasa-notaris/detail/:notaris_id', NotarisController.detailNotaris);
route.post('/post-notaris', NotarisController.postNotaris);


route.post('/admin-post-notaris', NotarisController.postNotaris)

module.exports = route;

