const {environments} = require("./config.js");

module.exports = {
    apps : [{
        name   : "commonvoice-monitor",
        script : "./src/app.js",
        env_production: {
            NODE_ENV: "production",
            MONGO_URI: environments.production.mongoUri
        },
        env_integration: {
            NODE_ENV: "integration",
            MONGO_URI: environments.integration.mongoUri
        },
        env_development: {
            NODE_ENV: "development",
            MONGO_URI: environments.development.mongoUri
        }
    }]
}
