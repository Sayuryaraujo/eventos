const { Router } = require('express');
const router = Router();
const eventoController = require('../controllers/evento.controller');

router.get('/listar', eventoController.listar);
router.post('/cadastrar', eventoController.cadastrar);
router.get('/buscar/:id', eventoController.buscarPorId);
router.put('/atualizar/:id', eventoController.atualizar);
router.delete('/excluir/:id', eventoController.excluir);

module.exports = router;