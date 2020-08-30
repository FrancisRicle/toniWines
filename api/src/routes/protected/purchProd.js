const server = require("express").Router();
const { Purchased_product, Product, Purchase } = require("../../db.js");
server.post("/add_product", (req, res, next) => {
	!!req.body.cartId && req.body.cart_items.forEach((cart_item)=>{
		Purchased_product.findOrCreate({
			where: {
				purchaseId: req.body.cartId,
				productId: cart_item.id,
			},
			defaults: {
				purchaseId: req.body.cartId,
				quantity: cart_item.quantity,
				priceProduct: cart_item.price,
				productId: cart_item.id
			},
		}).then(([purchased_product, created]) => {
			if(!created){
				purchased_product.quantity += cart_item.quantity;
				purchased_product.save();
			}
			//res.json(purchased_product);
		});
	})
	
});
server.get("/cart_items/:cartId",(req, res, next)=>{
	Purchase.findOne({
		where: {
			id: req.params.cartId,
			statusId: 1
		},
		include:{
			model: Product,
			attributes: ["id","name","stock","img"],
			through:{
				attributes: ["priceProduct","quantity"]
			}
		}
	}).then(({products}) => {
		const cart_items = [];
		products.forEach(product =>{
			cart_items.push({
				id: product.id,
				name: product.name,
				stock: product.stock,
				img: product.img,
				price: product.purchased_product.priceProduct,
				quantity: product.purchased_product.quantity
			})
		})
		res.json(cart_items);
	});

})
// S38 : Crear Ruta para agregar Item al Carrito
// ATENCIÓN, el trello pedía POST /users/:idUser/cart
/* server.post("/", (req, res, next) => {
	Purchased_product.create(req.body)
		.then(() => res.sendStatus(200))
		.catch(err => next(err));
}); */

// S41 : Crear Ruta para editar las cantidades del carrito
// ATENCIÓN, el trello pedía PUT /users/:idUser/cart
// VER ABAJO QUE DICE POST Y DEBIERA DECIR PUT
server.put("/:id", (req, res, next) => {
	Purchased_product.update(req.body, { where: { id: parseInt(req.params.id) } })
		.then(() => res.sendStatus(200))
		.catch(err => next(err));
});
module.exports = server;
