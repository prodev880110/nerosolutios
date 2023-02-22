"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    up: (queryInterface) => {
        return queryInterface.sequelize.transaction(t => {
            return Promise.all([
                queryInterface.bulkInsert("Companies", [
                    {
                        name: "Companies 1",
                        connections_number: 1,
                        users_number: 1,
                        queues_number: 1,
                        code: "8AG3cd2D",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                ], { transaction: t })
            ]);
        });
    },
    down: async (queryInterface) => {
        return Promise.all([
            queryInterface.bulkDelete("Companies", {})
        ]);
    }
};
