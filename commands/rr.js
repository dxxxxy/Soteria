const fs = require("fs")
const { log } = require("../library/utils")

exports.run = async(client, message, args) => {
    //get users
    const users = JSON.parse(fs.readFileSync("./new/users.json"))

    //get roles
    const roles = message.member.guild.roles.cache

    //for each user for each role
    let i = 0
    const user = users.find(u => u.userId === message.member.id)
    if (!user) return message.channel.send(`You don't exist in \`./new/users.json\``)
    await Promise.all(user.roles.map(async r => {
        //give role to user
        const role = roles.find(role => role.id === r)
        if (role) {
            await message.member.roles.add(role).then(r => {
                i++
            }).catch(err => log(err))
        }
    }))

    //send result
    message.channel.send(log(`Added ${i} roles to ${message.author.toString()}`))
}