export const up = async (knex) => {
    await knex.schema.createTable("posts", (table) => {
        table.increments("id")
        table.text("title").notNullable()
        table.text("content").notNullable()
        table.timestamp("publication_date").defaultTo(knex.fn.now())
        table.boolean("is_published").notNullable()
        table.integer("user_id").notNullable()
    })
}

export const down = async (knex) => {
    await knex.schema.dropTable("posts")
}