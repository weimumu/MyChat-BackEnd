const queryDB = require('../services/db')
const { MyChatError} = require('../services/MyChatUtils')

async function createFriendTable() {
    if (await showTable())
        return;
    const sql = `
    CREATE TABLE friends(
        friendid int NOT NULL PRIMARY KEY AUTO_INCREMENT,
        friendname varchar(255) NOT NULL,
        gender varchar(255) NOT NULL,
        birth varchar(255) NOT NULL,
        roleid varchar(255),
        attribute varchar(20000)
    );`;
    const values = [];
    return queryDB(sql, values);
}

async function showTable() {
    const sql = `
        show tables like 'friends'
    `;
    let flag = true;
    await queryDB(sql, []).then(function(res) {
        if (res.length === 0)
            flag = false;
    });
    return flag;
}

async function insertFriend(friend) {
    const sql = `
    INSERT INTO friends (friendid, friendname, gender, birth, roleid, attribute) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [friend.friendid, friend.friendname, friend.gender, friend.birth, friend.roleid, friend.attribute];
    return queryDB(sql, values);
}

async function findFriendById(obj) {
    const sql = `
    SELECT *
    FROM friends
    WHERE friends.friendid = (?)
    `;
    const values = [obj.friendid];
    return queryDB(sql, values);
}

//根据某些字段查询好友(AND)
async function findFriendByObj(obj) {
    let condition = '';
    let flag = true;
    let values = [];
    for (let key in obj) {
        if (flag) {
            condition += `friends.${key} = ?`;
            flag = false;
        } else {
            condition += ` AND friends.${key} = ?`
        }
        values.push(obj[key])
    }
    const sql = `
        SELECT *
        FROM friends
        WHERE ${condition}
    `;
    return queryDB(sql, values);
}

async function modifyRole(obj) {
    const sql = `
        UPDATE friends
        SET friends.roleid = (?)
        WHERE friends.friendid = (?)
    `;
    return queryDB(sql, [obj.roleid, obj.friendid]);
}

async function modifyAttribute(obj) {
    const sql = `
        UPDATE friends
        SET friends.attribute = (?)
        WHERE friends.friendid = (?)
    `;
    return queryDB(sql, [obj.attributeid, obj.friendid]);
}

async function deleteFriend(obj) {
    const sql = `
    DELETE FROM friends WHERE friends.friendid = (?)
    `;
    const values = [obj.friendid];
    return queryDB(sql, values);
}

async function findFriendByAttributename(userid, attributename) {
    const sql = `
    select *
    from friends as f, users_friends as uf, attributes as a
    where uf.userid = ? and a.name = ? and uf.friendid = f.friendid and f.attribute = a.attributeid;`;
    const values = [userid, attributename];
    return queryDB(sql, values);
}

exports = module.exports = {
    createFriendTable,
    insertFriend,
    findFriendById,
    findFriendByObj,
    modifyRole,
    modifyAttribute,
    deleteFriend,
    findFriendByAttributename,
};
