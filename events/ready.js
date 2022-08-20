//require fs
const fs = require("fs")
const package = require("../package.json")
const { log, fetchAll } = require("../library/utils")
const { ActivityType } = require("discord.js")

const argv = (key) => {
    if (process.argv.includes(`--${key}`)) return true;
    const value = process.argv.find(element => element.startsWith(`--${key}=`));
    if (!value) return null;
    return value.replace(`--${key}=`, "");
}

module.exports = async(client) => {
    console.log(`Logged in as ${client.user.tag}!`)

    //get source guild
    const guild = client.guilds.cache.get(argv("guild"))

    //save all
    //node . --guild=1001872401908371556 --save --messages
    if (argv("save")) {
        //save all roles --- templates already do that
        const roles = await guild.roles.cache.filter(r => r.name !== "@everyone" && !r.tags["botId"]).map(r => {
            return [r.id, {
                //comparators
                icon: r.icon,
                unicodeEmoji: r.unicodeEmoji,
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions,
                managed: r.managed,
                mentionable: r.mentionable,
                tags: r.tags,
            }]
        })
        fs.writeFileSync("./backup/roles.json", JSON.stringify(roles))
        log(`Saved ${roles.size} roles`)

        //save all channels --- templates already do that
        const channels = guild.channels.cache.filter(c => c.type !== 4) //needed for messages
            // fs.writeFileSync("./backup/channels.json", JSON.stringify(channels))
            // log(`Saved ${channels.size} channels`)

        //save all categories --- templates already do that
        // const categories = guild.channels.cache.filter(c => c.type === 4)
        // fs.writeFileSync("./backup/categories.json", JSON.stringify(categories))
        // log(`Saved ${categories.size} categories`)

        //save all users
        const users = await guild.members.fetch() //cache apparently doesnt have intent access (you only see yourself and people in vcs)
        fs.writeFileSync("./backup/users.json", JSON.stringify(users))
        log(`Saved ${users.size} users`)

        //save all permissions --- templates already do that
        // const permissions = guild.channels.cache.map(c => {
        //     return {
        //         channel: c.id,
        //         permissions: c.permissionOverwrites.cache
        //     }
        // })
        // fs.writeFileSync("./backup/permissions.json", JSON.stringify(permissions))
        // log(`Saved ${permissions.length} permissions`)

        //save all messages
        const messages = []
        if (argv("messages")) {
            new Promise((resolve, reject) => {
                let i = channels.filter(c => c.type === 0).size
                channels.filter(c => c.type === 0).forEach(async channel => {
                    const channelMessages = await fetchAll(channel)
                    messages.push(...channelMessages)
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
        // client.user.setActivity(`${roles.size}r ${channels.size}ch ${categories.size}ca ${users.size}u ${permissions.length}p ${messages.length}m`, { type: ActivityType.Watching })
    }

    //restore all
    //node . --guild=1010066750458564660 --restore --messages
    if (argv("restore")) {
        //restore all roles IN ORDER --- templates already do that
        // const bridge = []
        // const roles = JSON.parse(fs.readFileSync("./backup/roles.json", "utf8"))
        // roles.sort((a, b) => a.rawPosition - b.rawPosition)
        // let position = 1
        // new Promise((resolve, reject) => {
        //     let i = roles.filter(r => r.name !== "@everyone" && !r.tags["botId"]).length
        //     log(`Restoring ${i} roles`)
        //     roles.filter(r => r.name !== "@everyone" && !r.tags["botId"]).forEach(async r => {
        //         let id = r.id
        //         r["position"] = position
        //         r["reason"] = "soteira"
        //         delete r.guild
        //         delete r.id
        //         delete r.rawPosition
        //         delete r.managed
        //         delete r.tags
        //         delete r.createdTimestamp
        //         await guild.roles.create(r).then(nr => {
        //             log(`Created role: ${nr.name}`)
        //             bridge.push({ old: id, new: nr.id })
        //         })
        //         position++;
        //         i--
        //         if (i === 0) {
        //             resolve()
        //         }
        //     })
        // }).then(() => {
        //     //remap all users roles to new ids
        //     const users = JSON.parse(fs.readFileSync("./backup/users.json", "utf8"))
        //     users.forEach(u => {
        //             u.roles.forEach(r => {
        //                 log(bridge.find(b => b.old === r))
        //                 u.roles[u.roles.indexOf(r)] = bridge.find(b => b.old === r)
        //             })
        //         })
        //         // fs.writeFileSync("./backup/users.json", JSON.stringify(users))
        //     log("User roles remapped")
        // })

        //get all saved users
        const users = JSON.parse(fs.readFileSync("./backup/users.json", "utf8"))

        //map of our old roles
        const rolesMap = new Map()
        await JSON.parse(fs.readFileSync("./backup/roles.json", "utf8")).forEach(r => {
            rolesMap.set(r[0], r[1])
        })

        //array of your new roles
        const roles = await guild.roles.cache.map(r => {
            return [r.id, {
                //comparators
                icon: r.icon,
                unicodeEmoji: r.unicodeEmoji,
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions,
                managed: r.managed,
                mentionable: r.mentionable,
                tags: r.tags,
            }]
        })

        //for each user for each role
        users.forEach(u => u.roles.forEach(r => {
            //check if rolesMap has that role
            if (rolesMap.has(r)) {
                //find identical from roles
                if (roles.find(r2 => JSON.stringify(r2[1]) === JSON.stringify(rolesMap.get(r)))) {
                    //replace by the identical found role id
                    u.roles[u.roles.indexOf(r)] = roles.find(r2 => JSON.stringify(r2[1]) === JSON.stringify(rolesMap.get(r)))[0]
                }
            }
        }))

        //save all users with now remapped roles
        fs.writeFileSync("./new/users.json", JSON.stringify(users))
        log("User roles remapped")
    }

    //activity
    client.user.setActivity(`soteira v${package.version} | dxxxxy`, { type: ActivityType.Streaming })
}