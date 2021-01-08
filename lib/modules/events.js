const broadcast = require("./app").event;
const guildSchema = require("./schemas/guildsSchema");

module.exports = (client) => {
    client.on("guildCreate", async (guild) => {
        const guildInSchema = await guildSchema.findById({
            _id: guild.id,
        });
        if (!guildInSchema) {
            await new guildSchema({
                _id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                iconURL: guild.iconURL() ? guild.iconURL({dynamic: true, size: 2048, format: "png" }) : client.user.displayAvatarURL({dynamic:true,format:'png',size:2048}),
                joinedTimeStamp: Number(new Date()),
            }).save();
        } else {
            guildInSchema.joinedTimeStamp = Number(new Date());
            guildInSchema.removedTimeStamp = "";
            guildInSchema.name = guild.name;
            guildInSchema.memberCount = guild.memberCount;
            guildInSchema.save();
        }
        broadcast("guild update", client.guilds.cache.size);
    });
    client.on("guildDelete", async (guild) => {
        const guildInSchema = await guildSchema.findById({
            _id: guild.id,
        });
        if (!guildInSchema) {
            await new guildSchema({
                _id: guild.id,
                name: guild.name,
                memberCount: guild.memberCount,
                iconURL: guild.iconURL() ? guild.iconURL({dynamic: true, size: 2048, format: "png" }) : client.user.displayAvatarURL({dynamic:true,format:'png',size:2048}),
                joinedTimeStamp: "Unknow",
                removedTimeStamp: Number(new Date()),
            }).save();
        } else {
            guildInSchema.memberCount = guildMember.guild.memberCount;
            guildInSchema.save();
        }
        broadcast("guild update", client.guilds.cache.size);
    });
    client.on("guildMemberAdd", async (guildMember) => {
        await updateGuild(guildMember, "guildMemberAdd");
    });
    client.on("guildMemberRemove", async (guildMember) => {
        await updateGuild(guildMember, "guildMemberRemove");
    });
    client.on("guildUpdate", async (og, ng) => {
        await updateGuild(ng, "guildUpdate");
    });
};

/**
 * Update a guild in "guildMemberAdd" and "guildMemberRemove" and "guildUpdate" events
 * @param {Guild} guildPrototype
 * @param {Event} event
 */
async function updateGuild(guildPrototype, event) {
    let guild;
    if (event === "guildUpdate") {
        guild = guildPrototype;
    }
    if (event === "guildMemberAdd" || event === "guildMemberRemove") {
        guild = guildPrototype.guild;
    }
    const guildInSchema = await guildSchema.findById({
        _id: guild.id,
    });
    if (!guildInSchema) {
        await new guildSchema({
            _id: guild.id,
            name: guild.name,
            memberCount: guild.memberCount,
            iconURL: guild.iconURL() ? guild.iconURL({dynamic: true, size: 2048, format: "png" }) : client.user.displayAvatarURL({dynamic:true,format:'png',size:2048}),
            joinedTimeStamp: "Unknow",
            removedTimeStamp: "Unknow",
        }).save();
    } else {
        guildInSchema.name = guild.name;
        guildInSchema.iconURL = guild.iconURL({
            dynamic: true,
            size: 2048,
            format: "png",
        });
        guildInSchema.memberCount = guild.memberCount;
        guildInSchema.save();
    }
}
