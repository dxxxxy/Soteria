//require fs
const fs = require("fs")
const package = require("../package.json")
const { log, fetchAll } = require("../library/utils")
const { ActivityType } = require("discord.js")
const fetch = require("node-fetch")

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
        //save all roles
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
        log(`Saved ${roles.length} roles`)
            // guild.channels.cache.get("1019092490319581237").send(`Saved ${roles.length} roles`)

        //save all channels
        const channels = guild.channels.cache.filter(c => c.type !== 4) //needed for messages
        fs.writeFileSync("./backup/channels.json", JSON.stringify(channels))
        log(`Saved ${channels.size} channels`)

        //save all users
        const users = await guild.members.fetch() //cache apparently doesnt have intent access (you only see yourself and people in vcs)
        fs.writeFileSync("./backup/users.json", JSON.stringify(users))
        log(`Saved ${users.size} users`)
            // guild.channels.cache.get("1019092490319581237").send(`Saved ${users.size} users`)

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
                    // guild.channels.cache.get("1019092490319581237").send(`Saved ${messages.length} messages`)
            })
        }
    }

    //restore all
    //node . --guild=1011786850056294521 --restore --messages
    if (argv("restore")) {
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

        //restore all messages
        if (argv("messages")) {
            /*----------REMAPPING----------*/

            //get all saved messages
            const messages = JSON.parse(fs.readFileSync("./backup/messages.json", "utf8"))

            //map of our old channels
            const channelsMap = new Map()
            await JSON.parse(fs.readFileSync("./backup/channels.json", "utf8")).filter(c => c.type === 0).forEach(c => {
                channelsMap.set(c.id, {
                    nsfw: c.nsfw,
                    name: c.name,
                    topic: c.topic,
                    rateLimitPeruser: c.rateLimitPeruser,
                })
            })

            //array of your new channels
            const channels = await guild.channels.cache.filter(c => c.type === 0).map(c => {
                return [c.id, {
                    //comparators
                    nsfw: c.nsfw,
                    name: c.name,
                    topic: c.topic,
                    rateLimitPeruser: c.rateLimitPeruser,
                }]
            })

            //for each message for each channel
            messages.forEach(m => {
                //check if channelsMap has that channel
                m = m[1]
                if (channelsMap.has(m.channelId)) {
                    //find identical from channels
                    if (channels.find(c2 => JSON.stringify(c2[1]) === JSON.stringify(channelsMap.get(m.channelId)))) {
                        //replace by the identical found channel id
                        m.channelId = channels.find(c2 => JSON.stringify(c2[1]) === JSON.stringify(channelsMap.get(m.channelId)))[0]
                    }
                }
            })

            //save all messages with now remapped channels
            fs.writeFileSync("./new/messages.json", JSON.stringify(messages))
            log("Message channels remapped")

            /*----------RESTORING----------*/

            //sort messages by createdTimestamp
            messages.sort((a, b) => a[1].createdTimestamp - b[1].createdTimestamp)

            //restore all messages
            let i = 0
            channels.forEach(async c => {
                const channel = guild.channels.cache.find(c2 => c2.id === c[0])
                const webhooks = await channel.fetchWebhooks()
                let webhook

                //reuuse webhook if one exists
                if (webhooks.size > 0) {
                    webhook = webhooks.first()
                } else await channel.createWebhook({ name: "Soteria" }).then(wh => {
                    webhook = wh
                })

                messages.filter(m => m[1].channelId === c[0]).forEach(async m => {
                    m = m[1]

                    //safe checking
                    if (!m.content) m.content = "​"
                    let username, avatarURL
                    if (!users.find(u => m.authorId === u.userId)) {
                        username = "unknown"
                        avatarURL = "https://cdn.discordapp.com/embed/avatars/1.png"
                    } else {
                        username = users.find(u => m.authorId === u.userId).displayName
                        avatarURL = users.find(u => m.authorId === u.userId).displayAvatarURL
                    }

                    //send
                    await webhook.send({
                        content: m.content,
                        embeds: m.embeds,
                        username,
                        avatarURL
                    }).then(() => {
                        i++
                        log(`Message ${i}/${messages.length} restored`)
                    })
                })
            })
        }
    }

    //activity
    client.user.setActivity(`soteira v${package.version} | dxxxxy`, { type: ActivityType.Streaming })
}