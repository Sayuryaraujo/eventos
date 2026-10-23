const express = require('express');
const controller = require('../controllers/usuario.controller');
const router = express.Router();

router.post('/cadastrar', controller.cadastrar);
router.post('/login', controller.login);
router.get('/listar', controller.listar);
router.get('/buscar/:id', controller.buscarPorId);
router.put('/atualizar/:id', controller.atualizar);
router.delete('/excluir/:id', controller.excluir);

module.exports = router;
