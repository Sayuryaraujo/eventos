const prisma = require('../data/prisma');

function dadosValidos(body) {
  return body && body.cidade && body.tipoEvento && body.nivelImpacto;
}

async function listar(req, res) {
  try {
    const usuarioId = Number(req.query.usuarioId);
    const filtro = Number.isInteger(usuarioId) && usuarioId > 0 ? { usuarioId } : {};
    const eventos = await prisma.evento.findMany({
      where: filtro,
      include: { usuario: { select: { id: true, nome: true } } },
      orderBy: { data: 'desc' }
    });
    return res.json(eventos);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao listar eventos.' });
  }
}

async function buscarPorId(req, res) {
  try {
    const id = Number(req.params.id);
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nome: true } } }
    });
    if (!evento) return res.status(404).json({ mensagem: 'Evento não encontrado.' });
    return res.json(evento);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar evento.' });
  }
}

async function cadastrar(req, res) {
  try {
    if (!dadosValidos(req.body)) {
      return res.status(400).json({ mensagem: 'Preencha cidade, tipo de evento e nível de impacto.' });
    }
    const usuarioId = Number(req.body.usuarioId);
    if (!Number.isInteger(usuarioId) || usuarioId < 1) {
      return res.status(400).json({ mensagem: 'Usuário inválido.' });
    }
    const temperaturaMaxima = req.body.temperaturaMaxima === '' || req.body.temperaturaMaxima == null
      ? null : Number(req.body.temperaturaMaxima);
    if (temperaturaMaxima !== null && !Number.isFinite(temperaturaMaxima)) {
      return res.status(400).json({ mensagem: 'Temperatura máxima inválida.' });
    }

    const evento = await prisma.evento.create({
      data: {
        usuarioId,
        cidade: String(req.body.cidade).trim(),
        tipoEvento: String(req.body.tipoEvento).trim(),
        temperaturaMaxima,
        nivelImpacto: String(req.body.nivelImpacto).trim(),
        ...(req.body.data ? { data: new Date(req.body.data) } : {})
      }
    });
    return res.status(201).json(evento);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: 'Erro ao cadastrar evento. Confira se o usuário existe.' });
  }
}

async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    if (!dadosValidos(req.body)) {
      return res.status(400).json({ mensagem: 'Preencha cidade, tipo de evento e nível de impacto.' });
    }
    const temperaturaMaxima = req.body.temperaturaMaxima === '' || req.body.temperaturaMaxima == null
      ? null : Number(req.body.temperaturaMaxima);
    if (temperaturaMaxima !== null && !Number.isFinite(temperaturaMaxima)) {
      return res.status(400).json({ mensagem: 'Temperatura máxima inválida.' });
    }
    const evento = await prisma.evento.update({
      where: { id },
      data: {
        cidade: String(req.body.cidade).trim(),
        tipoEvento: String(req.body.tipoEvento).trim(),
        temperaturaMaxima,
        nivelImpacto: String(req.body.nivelImpacto).trim(),
        ...(req.body.data ? { data: new Date(req.body.data) } : {})
      }
    });
    return res.json(evento);
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ mensagem: 'Não foi possível atualizar. Verifique se o evento existe.' });
  }
}

async function excluir(req, res) {
  try {
    await prisma.evento.delete({ where: { id: Number(req.params.id) } });
    return res.json({ mensagem: 'Evento excluído com sucesso.' });
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ mensagem: 'Evento não encontrado.' });
  }
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, excluir };
