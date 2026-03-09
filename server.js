const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

mongoose.connect("mongodb://localhost:27017/orders");

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

    // validação básica
    if (!body.numeroPedido || !body.valorTotal || !body.dataCriacao || !body.items) {
      return res.status(400).json({
        message: "Dados do pedido inválidos"
      });
    }

    const order = new Order({
      orderId: body.numeroPedido,
      value: body.valorTotal,
      creationDate: body.dataCriacao,
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

// LISTAR PEDIDOS (tem que vir antes)
app.get("/order/list", async (req, res) => {

  const orders = await Order.find();

  res.json(orders);

});


// BUSCAR PEDIDO
app.get("/order/:id", async (req, res) => {

  const order = await Order.findOne({ orderId: req.params.id });

  if (!order) {
    return res.status(404).json({ message: "Pedido não encontrado" });
  }

  res.json(order);

});


// Atualizar pedido
app.put("/order/:id", async (req, res) => {

  const order = await Order.findOneAndUpdate(
    { orderId: req.params.id },
    req.body,
    { new: true }
  );

  res.json(order);

});


// Deletar pedido
app.delete("/order/:id", async (req, res) => {

  await Order.deleteOne({ orderId: req.params.id });

  res.json({ message: "Pedido deletado com sucesso" });

});


app.listen(3000, () => {

  console.log("API rodando em http://localhost:3000");

});