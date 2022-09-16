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

        // //delete all channels
        // guild.channels.cache.forEach(c => {
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

        // //create all channels
        // const backupChannels = guild.channels.cache
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
        //     guild.channels.create(c).then(log(`Created channel: ${c.name}`))
        // })
        // log("Channels created")


        //activity
        // client.user.setActivity(`${roles.size}r ${channels.size}ch ${categories.size}ca ${users.size}u ${permissions.length}p ${messages.length}m`, { type: ActivityType.Watching })

        //save all permissions --- templates already do that
        // const permissions = guild.channels.cache.map(c => {
        //     return {
        //         channel: c.id,
        //         permissions: c.permissionOverwrites.cache
        //     }
        // })
        // fs.writeFileSync("./backup/permissions.json", JSON.stringify(permissions))
        // log(`Saved ${permissions.length} permissions`)

        //save all categories --- templates already do that
        // const categories = guild.channels.cache.filter(c => c.type === 4)
        // fs.writeFileSync("./backup/categories.json", JSON.stringify(categories))
        // log(`Saved ${categories.size} categories`)