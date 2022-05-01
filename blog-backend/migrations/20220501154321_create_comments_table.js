export const up = async (knex) => {
    await knex.schema.createTable("comments", (table) => {
        table.increments("id")
        table.text("content").notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.integer("user_id").notNullable()
        table.integer("post_id").notNullable()
    })
}

export const down = async (knex) => {
    await knex.schema.dropTable("comments")
}