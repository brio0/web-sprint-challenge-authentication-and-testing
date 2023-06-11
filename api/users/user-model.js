const db = require('../../data/dbConfig')

function find() {
    return db('users').select('id', 'username')
}
function findById(user_id) {
    return db('users').where('id', user_id).first()
}
async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    find,
    add,
    findById
}