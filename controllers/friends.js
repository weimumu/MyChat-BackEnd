const { friendModel, roleModel, user_friendModel } = require('../models')
const { MyChatError, pick, sendRes } = require('../services/MyChatUtils/')

// 增加好友的请求 请求体包含 添加者id 被添加者的角色、属性以及
async function addFriend(ctx, next) {
    let friend = pick(ctx.param, ['userid', 'friendname', 'gender', 'birth']);
    friend.roleid = ctx.param['roleid'];
    let [role] = await roleModel.findRoleById({roleid: friend.roleid});
    if (friend.roleid && !role) {
        throw new MyChatError(2, "该角色id指向的角色不存在")
    }
    friend.attribute = (role === undefined ? undefined : role.attribute);
    friend.friendid = undefined;
    await friendModel.insertFriend(friend).then(function(res) {
      friend.friendid = res.insertId;
    });
    console.log(friend);
    await user_friendModel.insertUserFriend({ userid: friend.userid, friendid: friend.friendid });
    sendRes(ctx, friend)
    return next()
}

async function deleteFriend(ctx, next) {
    let obj = pick(ctx.param, ['friendid']);
    let affectedRows = -1;
    let [friend] = await friendModel.findFriendById({ friendid: obj.friendid });
    if (!friend) {
        throw new MyChatError(2, "该朋友不存在")
    }
    await friendModel.deleteFriend({ friendid: friend.friendid });
    let [user_friend] = await user_friendModel.findUserFriendByObj( { friendid: friend.friendid });
    friend.userid = user_friend.userid;
    await user_friendModel.deleteFriend({ friendid: friend.friendid });
    let result = { mes: "DELETE SUCCESSFULLY", userid: friend.userid, friendid: friend.friendid };
    sendRes(ctx, result)
    return next()
}

exports = module.exports = {
    addFriend,
    deleteFriend
}
