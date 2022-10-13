import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("wallet", (table) => {
            table.increments("walletId");
            table.integer("walletBalance").defaultTo(0).notNullable()
            table.timestamps(true, true);

            //FOREIGNK KEY TO USERS TABLE
            table.integer("userId")
                .unsigned()
                .references("userId")
                .inTable("users")
                .onDelete("CASCADE")
                .onUpdate("CASCADE")
        })

}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("wallet")
}

