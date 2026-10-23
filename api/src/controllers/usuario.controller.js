const bcrypt = require('bcryptjs');
const prisma = require('../data/prisma');

function idValido(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function cadastrar(req, res) {
  try {
    const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: 'Informe nome, e-mail e senha.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ mensagem: 'Informe um e-mail válido.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
      select: { id: true, nome: true, email: true }
    });
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario });
  } catch (erro) {
    console.error('Erro ao cadastrar usuário:', erro);
    if (erro.code === 'P2002') {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' });
    }
    return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.' });
  }
}

async function login(req, res) {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const senha = typeof req.body.senha === 'string' ? req.body.senha : '';
    if (!email || !senha) {
      return res.status(400).json({ mensagem: 'Informe e-mail e senha.' });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
    }

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  } catch (erro) {
    console.error('Erro ao realizar login:', erro);
    return res.status(500).json({ mensagem: 'Erro ao realizar login.' });
  }
}

async function listar(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: { id: true, nome: true, email: true },
      orderBy: { id: 'asc' }
    });
    return res.json(usuarios);
  } catch (erro) {
    console.error('Erro ao listar usuários:', erro);
    return res.status(500).json({ mensagem: 'Erro ao listar usuários.' });
  }
}

async function buscarPorId(req, res) {
  try {
    const id = idValido(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID de usuário inválido.' });

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nome: true, email: true }
    });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    return res.json(usuario);
  } catch (erro) {
    console.error('Erro ao buscar usuário:', erro);
    return res.status(500).json({ mensagem: 'Erro ao buscar usuário.' });
  }
}

async function atualizar(req, res) {
  try {
    const id = idValido(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID de usuário inválido.' });

    const dados = {};
    if (req.body.nome !== undefined) {
      if (typeof req.body.nome !== 'string' || !req.body.nome.trim()) {
        return res.status(400).json({ mensagem: 'O nome não pode ficar vazio.' });
      }
      dados.nome = req.body.nome.trim();
    }
    if (req.body.email !== undefined) {
      if (typeof req.body.email !== 'string' || !/^\S+@\S+\.\S+$/.test(req.body.email.trim())) {
        return res.status(400).json({ mensagem: 'Informe um e-mail válido.' });
      }
      dados.email = req.body.email.trim().toLowerCase();
    }
    if (req.body.senha !== undefined) {
      if (typeof req.body.senha !== 'string' || req.body.senha.length < 6) {
        return res.status(400).json({ mensagem: 'A senha deve ter pelo menos 6 caracteres.' });
      }
      dados.senha = await bcrypt.hash(req.body.senha, 10);
    }
    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ mensagem: 'Informe ao menos nome, e-mail ou senha para atualizar.' });
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: dados,
      select: { id: true, nome: true, email: true }
    });
    return res.json({ mensagem: 'Usuário atualizado com sucesso.', usuario });
  } catch (erro) {
    console.error('Erro ao atualizar usuário:', erro);
    if (erro.code === 'P2002') {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado por outro usuário.' });
    }
    if (erro.code === 'P2025') {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ mensagem: 'Erro ao atualizar usuário.' });
  }
}

async function excluir(req, res) {
  try {
    const id = idValido(req.params.id);
    if (!id) return res.status(400).json({ mensagem: 'ID de usuário inválido.' });

    await prisma.usuario.delete({ where: { id } });
    return res.json({ mensagem: 'Usuário excluído com sucesso.' });
  } catch (erro) {
    console.error('Erro ao excluir usuário:', erro);
    if (erro.code === 'P2025') {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }
    return res.status(500).json({ mensagem: 'Erro ao excluir usuário.' });
  }
}

module.exports = { cadastrar, login, listar, buscarPorId, atualizar, excluir };
