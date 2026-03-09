// API de gerenciamento de pedidos
// Node.js + Express + MongoDB

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// Conexão com MongoDB
mongoose.connect("mongodb://localhost:27017/orders")
.then(() => console.log("MongoDB conectado"))
.catch(err => console.log("Erro ao conectar no MongoDB:", err));


// Schema do pedido
const orderSchema = new mongoose.Schema({
  orderId: String,
  value: Number,
  creationDate: Date,
  items: [
    {
      productId: Number,
      quantity: Number,
      price: Number
    }
  ]
});

const Order = mongoose.model("Order", orderSchema);


// Criar pedido
app.post("/order", async (req, res) => {

  try {

    const body = req.body;

    // Validação básica
    if (!body.numeroPedido || !body.valorTotal || !body.dataCriacao || !body.items) {
      return res.status(400).json({
        message: "Dados do pedido inválidos"
      });
    }

    // Mapping dos campos
    const order = new Order({
      orderId: body.numeroPedido,
      value: body.valorTotal,
      creationDate: new Date(body.dataCriacao),
      items: body.items.map(item => ({
        productId: Number(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem
      }))
    });

    await order.save();

    res.status(201).json(order);

  } catch (error) {

    res.status(500).json({
      message: "Erro ao criar pedido",
      error: error.message
    });

  }

});


// Listar pedidos
app.get("/order/list", async (req, res) => {

  try {

    const orders = await Order.find();

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Erro ao listar pedidos",
      error: error.message
    });

  }

});


// Buscar pedido por número
app.get("/order/:id", async (req, res) => {

  try {

    const order = await Order.findOne({ orderId: req.params.id });

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      });
    }

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: "Erro ao buscar pedido",
      error: error.message
    });

  }

});


// Atualizar pedido
app.put("/order/:id", async (req, res) => {

  try {

    const body = req.body;

    // Mapping para atualização
    const updatedData = {
      value: body.valorTotal,
      creationDate: body.dataCriacao ? new Date(body.dataCriacao) : undefined,
      items: body.items ? body.items.map(item => ({
        productId: Number(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem
      })) : undefined
    };

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      updatedData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      });
    }

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: "Erro ao atualizar pedido",
      error: error.message
    });

  }

});


// Deletar pedido
app.delete("/order/:id", async (req, res) => {

  try {

    const result = await Order.deleteOne({ orderId: req.params.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Pedido não encontrado"
      });
    }

    res.json({
      message: "Pedido deletado com sucesso"
    });

  } catch (error) {

    res.status(500).json({
      message: "Erro ao deletar pedido",
      error: error.message
    });

  }

});


// Inicializar servidor
app.listen(3000, () => {

  console.log("API rodando em http://localhost:3000");

});