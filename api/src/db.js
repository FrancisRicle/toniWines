require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { userInfo } = require("os");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/development`, {
	logging: false, // set to console.log to see the raw SQL queries
	//native: false, // lets Sequelize know we can use pg-native for ~30% more speed
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
	.filter(file => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
	.forEach(file => {
		modelDefiners.push(require(path.join(__dirname, "/models", file)));
	});

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(entry => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
	Product,
	Category,
	Cellar,
	Strain,
	User,
	Pay_method,
	Purchase,
	Review,
	Purchased_product,
	Status,
} = sequelize.models;
Cellar.hasMany(Product, {
	onDelete: "NO ACTION",
});
Product.belongsTo(Cellar);
Strain.hasMany(Product, {
	onDelete: "NO ACTION",
});
Product.belongsTo(Strain);
Category.hasMany(Product, {
	onDelete: "NO ACTION",
});
Product.belongsTo(Category);
Category.hasMany(Strain, {
	onDelete: "NO ACTION",
});
Strain.belongsTo(Category);
User.hasMany(Purchase);
Purchase.belongsTo(User);
Purchase.belongsToMany(Product, { through: Purchased_product });
Product.belongsToMany(Purchase, { through: Purchased_product });
Pay_method.hasMany(Purchase, {
	onDelete: "NO ACTION",
});
Purchase.belongsTo(Pay_method);
User.belongsToMany(Product, { through: Review, onDelete: "NO ACTION" });
Product.belongsToMany(User, { through: Review });
Status.hasMany(Purchase, {
	onDelete: "NO ACTION",
});
Purchase.belongsTo(Status);
Purchase.prototype.getTotal = function () {
	let total = 0;
	for (let product of this.products) {
		total += parseInt(product.purchased_product.priceProduct) * product.purchased_product.quantity;
	}
	return total;
};
module.exports = {
	...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
	conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
