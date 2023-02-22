"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable("Companies", {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            code: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            phone: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            email: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            connections_number: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            users_number: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            queues_number: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: (queryInterface) => {
        return queryInterface.dropTable("Companies");
    }
};
