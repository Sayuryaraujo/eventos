require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API Eventos Climáticos respondendo.',
    rotas: {
      usuarios: {
        cadastrar: 'POST /usuario/cadastrar',
        login: 'POST /usuario/login',
        listar: 'GET /usuario/listar',
        buscarPorId: 'GET /usuario/buscar/:id',
        atualizar: 'PUT /usuario/atualizar/:id',
        excluir: 'DELETE /usuario/excluir/:id'
      },
      eventos: {
        cadastrar: 'POST /evento/cadastrar',
        listar: 'GET /evento/listar',
        buscarPorId: 'GET /evento/buscar/:id',
        atualizar: 'PUT /evento/atualizar/:id',
        excluir: 'DELETE /evento/excluir/:id'
      }
    }
  });
});

app.use('/usuario', require('./src/routes/usuario.routes'));
app.use('/evento', require('./src/routes/evento.routes'));

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor http://localhost:${PORT}`);
});
