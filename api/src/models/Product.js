const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = sequelize => {
	// defino el modelo
	sequelize.define("product", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		img: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		stock: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			default: true,
		},
	});
};
