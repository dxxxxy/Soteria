//require fs
const fs = require("fs")
const spinner = require("cli-spinners")
const ora = require("commonjs-ora")
const { log, fetchAll } = require("../library/utils")
const { ActivityType } = require("discord.js")

const argv = (key) => {
    if (process.argv.includes(`--${key}`)) return true;
    const value = process.argv.find(element => element.startsWith(`--${key}=`));
    if (!value) return null;
    return value.replace(`--${key}=`, "");
}

module.exports = (client) => { //required in every file
    console.log(`Logged in as ${client.user.tag}!`)

    ora({ spinner: spinner.aesthetic, text: "Loading..." }).start()

    //save all
    if (argv("save")) {
        //get source guild
        const source = argv("source")
        const guild = client.guilds.cache.get(source)

        //save all roles
        log("SAVING ROLES")
        const roles = guild.roles.cache
        fs.writeFileSync("./backup/roles.json", JSON.stringify(roles))
        log(`Saved ${roles.size} roles`)

        //save all channels
        log("SAVING CHANNELS")
        const channels = guild.channels.cache.filter(c => c.type !== 4)
        fs.writeFileSync("./backup/channels.json", JSON.stringify(channels))
        log(`Saved ${channels.size} channels`)

        //save all categories
        log("SAVING CATEGORIES")
        const categories = guild.channels.cache.filter(c => c.type === 4)
        fs.writeFileSync("./backup/categories.json", JSON.stringify(categories))
        log(`Saved ${categories.size} categories`)

        //save all users
        log("SAVING USERS")
        const users = guild.members.cache
        fs.writeFileSync("./backup/users.json", JSON.stringify(users))
        log(`Saved ${users.size} users`)

        //save all permissions
        log("SAVING PERMISSIONS")
        const permissions = guild.channels.cache.map(c => {
            return {
                channel: c.id,
                permissions: c.permissionOverwrites.cache
            }
        })
        fs.writeFileSync("./backup/permissions.json", JSON.stringify(permissions))
        log(`Saved ${permissions.length} permissions`)

        //save all messages
        log("SAVING MESSAGES")
        const messages = []
        if (argv("messages")) {
            new Promise((resolve, reject) => {
                let i = channels.filter(c => c.type === 0).size
                channels.filter(c => c.type === 0).forEach(async channel => {
                    const channelMessages = await fetchAll(channel)
                    messages.push(channelMessages)
                    i--
                    if (i === 0) {
                        resolve()
                    }
                })
            }).then(() => {
                fs.writeFileSync("./backup/messages.json", JSON.stringify(messages))
                log(`Saved ${messages.length} messages`)
            })
        }

        //activity
        client.user.setActivity(`${roles.size}r ${channels.size}ch ${categories.size}ca ${users.size}u ${permissions.length}p ${messages.length}m`, { type: ActivityType.Watching })
    }

    // const target = argv("target")

    // //save all messages in all text channels
    // new Promise((resolve, reject) => {
    //     let index = channelIds.length
    //     console.log(index)
    //     channelIds.forEach(async c => {
    //         const m = await fetchAll(client.guilds.cache.get("1001872401908371556").channels.cache.get(c))
    //         messages.push(...m)
    //         index--
    //         if (index === 0) {
    //             resolve()
    //         }
    //     })
    // }).then(() => {
    //     //save all messages
    //     console.log("Done")
    //     fs.writeFileSync("./backup/messages.json", JSON.stringify(messages))
    //     log("Saved messages to backup/messages.json")
    // })

    // const permissions = []
    // channels.forEach(c => {
    //     permissions.push({ channel: c.id, permissions: c.permissionOverwrites.cache })
    // })

    // //save all permissions
    // fs.writeFileSync("./backup/permissions.json", JSON.stringify(permissions))
    // log("Saved permissions to backup/permissions.json")

    // //save all channels
    // fs.writeFileSync("./backup/channels.json", JSON.stringify(channels))

    // //save all categories
    // fs.writeFileSync("./backup/categories.json", JSON.stringify(categories))

    // //save all users
    // fs.writeFileSync("./backup/users.json", JSON.stringify(users))

    // //save all permissions
    // fs.writeFileSync("./backup/permissions.json", JSON.stringify(permissions))


    //delete all roles
    // client.guilds.cache.get("1010019827953455224").roles.cache.forEach(r => {
    //     if (r.name === "@everyone" || r.tags["botId"]) return
    //     r.delete().then(log(`Deleted role: ${r.name}`))
    // })

    //create all roles
    // const backupRoles = client.guilds.cache.get("1010019827953455224").roles.cache
    // const newRoles = JSON.parse(fs.readFileSync("./backup/roles.json", "utf8"));
    // newRoles.sort((a, b) => a.rawPosition - b.rawPosition)
    // let position = 1
    // newRoles.forEach(r => {
    //     if (r.name === "@everyone" || r.tags["botId"] || backupRoles.find(br => br.name === r.name)) return
    //     delete r.guild
    //     delete r.id
    //     r["position"] = position
    //     delete r.rawPosition
    //     delete r.managed
    //     delete r.tags
    //     delete r.createdTimestamp
    //     r["reason"] = "backup"
    //     client.guilds.cache.get("1010019827953455224").roles.create(r).then(log(`Created role: ${r.name}`))
    //     position++;
    // })
    // log("Roles created")

    //delete all channels
    // client.guilds.cache.get("1010019827953455224").channels.cache.forEach(c => {
    //     c.delete().then(log(`Deleted channel: ${c.name}`))
    // })

    /*   {
        "type": 0,
        "guild": "1001872401908371556",
        "guildId": "1001872401908371556",
        "parentId": "1001875354656460830",
        "permissionOverwrites": [
          "1002557596798038056",
          "1001878486459363459",
          "1001878248990457916",
          "1001877746336665631",
          "1001878074746474577",
          "1001877617860939859",
          "1001872401908371556"
        ],
        "messages": [],
        "threads": [],
        "nsfw": false,
        "id": "1003409224379936868",
        "name": "📩｜suggestions",
        "rawPosition": 18,
        "topic": null,
        "lastMessageId": "1009833658623983747",
        "rateLimitPerUser": 0,
        "createdTimestamp": 1659301801534
      },*/

    //create all channels
    // const backupChannels = client.guilds.cache.get("1010019827953455224").channels.cache
    // const newChannels = JSON.parse(fs.readFileSync("./backup/channels.json", "utf8"))
    // newChannels.sort((a, b) => a.rawPosition - b.rawPosition)
    // newChannels.forEach(c => {
    //     if (backupChannels.find(bc => bc.name === c.name)) return
    //     delete c.guild
    //     delete c.guildId
    //     delete parentId
    //     delete c.permissionOverwrites //change later
    //     delete c.id
    //     delete lastMessageId
    //     delete c.messages
    //     delete c.threads
    //     c["position"] = c.rawPosition
    //     delete c.rawPosition
    //     delete c.createdTimestamp
    //     c["reason"] = "backup"
    //     client.guilds.cache.get("1010019827953455224").channels.create(c).then(log(`Created channel: ${c.name}`))
    // })
    // log("Channels created")


}