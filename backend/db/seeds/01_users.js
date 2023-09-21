const bcrypt = require('bcrypt');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([{
    id:1,
    username: 'adamo',
    email: 'adam@niga.com',
    password: bcrypt.hashSync('12315', 8)
  }]);
};
