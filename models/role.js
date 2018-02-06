const queryDB = require('../services/db')
const { MyChatError } = require('../services/MyChatUtils')

async function createRoleTable() {
    const sql = `
    CREATE TABLE roles(
        roleid varchar(255) NOT NULL PRIMARY KEY,
        name varchar(255) NOT NULL unique check(name != ''),
        description var char(65535) NOT NULL check(Attribute != ''),
        usercount varchar(255) NOT NULL check(usercount != '')
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function insertRole(role) {
    const sql = `
    INSERT INTO roles (roleid, name, description, usercount) VALUES (?, ?, ?, ?)
    `;
    const values = [role.roleid, role.name, role.description, role.usercount];
    return queryDB(sql, values);
}

async function findRoleById(obj) {
    const sql = `
    SELECT *
    FROM roles
    WHERE roles.roleid = (?)
    `;
    const values = [obj.roleid];
    return queryDB(sql, values)
}

//根据某些字段查询角色(AND)
async function findRoleByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `roles.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND roles.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM roles
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

exports = module.exports = {
    createRoleTable,
    insertRole,
    findRoleById,
    findRoleByObj
}
