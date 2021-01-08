function logger(client, io) {
    client.on(
        "ready",
        () =>
            saveLogDB(
                "info",
                `${new Date().toLocaleString()}`,
                `The bot is online!`
            ),
        "None"
    );
    client.on("debug", (m) =>
        saveLogDB(
            "info",
            `${new Date().toLocaleString()}`,
            `Discord >> Client debug`,
            m
        )
    );
    client.on("warn", (m) =>
        saveLogDB(
            "info",
            `${new Date().toLocaleString()}`,
            `Discord >> Client warn`,
            m
        )
    );
    client.on("error", (m) =>
        saveLogDB(
            "info",
            `${new Date().toLocaleString()}`,
            `Discord >> Client error`,
            m
        )
    );
    io.on("connection", (m) => {
        saveLogDB(
            "info",
            `${new Date().toLocaleString()}`,
            `Socket >> A user has connected`,
            m.handshake
        );
    });

    async function saveLogDB(level, time, message, data) {
        const logSchema = require("./schemas/logSchema");
        const clientLogger = await logSchema.findById({
            _id: client.user.id,
        });
        if (!clientLogger) {
            await new logSchema({
                _id: client.user.id,
            }).save();
        }
        let transformJson = {
            level: level,
            time: time,
            message: message,
            info: data,
        };
        clientLogger.logs.push(transformJson);
        clientLogger.save();
    }
}
module.exports = logger;
