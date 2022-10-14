import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
        .createTable("users", (table) => {
            table.increments("userId").primary().unsigned();
            table.string("firstName", 255).notNullable();
            table.string("lastName", 255).notNullable();
            table.string("email", 255).unique().notNullable();
            table.string("password", 255).notNullable()
        })        
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users")
}

