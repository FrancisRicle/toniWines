const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	// defino el modelo
	sequelize.define("user", {
		first_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		email: {
			type: DataTypes.TEXT,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		salt: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		admin: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		provider:{
			type: DataTypes.STRING,
		},
		providerId:{
			type: DataTypes.STRING,
		},
		imgProfile:{
			type: DataTypes.STRING
		},
		alias:{
			type: DataTypes.VIRTUAL,
			get(){
				return this.getDataValue("first_name")[0] + this.getDataValue("last_name")[0];
			}
		}
	});
};
