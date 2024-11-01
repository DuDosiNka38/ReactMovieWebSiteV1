const DBManager = require("./../lib/DBManager");

const Auth = {
    openAuth: async (hostId, data) => {
        const db = DBManager(hostId);
        return await db("user_auth")
            .insert(data)
            .then((r) => {
                return {
                    result: true,
                    data: {
                        auth_hash: data.user_auth_hash,
                    },
                };
            });
    },

    getAuthHistory: async (hostId, user_id) => {
        const db = DBManager(hostId);
        return await db.select("*").from("user_auth").where("user_id", "=", user_id);
    },
};

module.exports = Auth;