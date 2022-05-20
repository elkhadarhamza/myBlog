export const up = async (knex) => {
    await knex.schema.createTable("users", (table) => {
        table.increments("id")
        table.text("displayName").notNullable()
        table.text("email").notNullable().unique()
        table.text("passwordHash").notNullable()
        table.text("userType").notNullable()
        table.boolean("is_active").defaultTo(true)
    })

    //password = 123456
    await knex("users").insert({displayName: "Supper-Admin", email: "admin@blog.com", passwordHash: "e10adc3949ba59abbe56e057f20f883e", userType: "supper-admin", is_active: true})
}

export const down = async (knex) => {
    await knex.schema.dropTable("users")
 }
