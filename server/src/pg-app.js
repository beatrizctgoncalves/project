'use strict'


module.exports = async function() {
    const express = require('express'); //Import the express module
    const app = express(); //Create an Express application
    
    var cors = require('cors');
    app.use(cors());

    const bodyParser = require('body-parser'); //Import the body-parser module 
    app.use(bodyParser.json()); //Parse application/json
    app.use(bodyParser.urlencoded({ extended: true })); //Parse application/x-www-form-urlencoded

    const fetch = require('node-fetch');
    const pgResponses = require('./services/pg-responses');
    const aux = require('./model/pg-promises');
    const requests = require('./services/db-requests')(fetch, pgResponses);

    const databaseGroups = require('./database/pg-database-groups')(pgResponses, requests);
    const databaseUsers = require('./database/pg-database-users')(pgResponses, requests);

    const authizationConfig = require('./database/authization-dg-config/config')
    const servicesPlugins = require('./services/pg-services-plugins')(databaseGroups, pgResponses);

    try {
        let authization = await require('@authization/authization').setup({ app, db: authizationConfig.dbConfigs, rbac_opts: authizationConfig.rbac_opts, strategies:authizationConfig.strategies });
        const servicesGroups = require('./services/pg-services-groups')(databaseGroups, databaseUsers, pgResponses);
        const servicesUsers = require('./services/pg-services-users')(databaseUsers, databaseGroups, servicesGroups, pgResponses, authization);

        const webApi = require('./model/pg-web-api')(express, servicesGroups, servicesPlugins, aux); //Import the web-api
        const usersCreator = require('./model/pg-users')(express, servicesUsers, aux, authization);

        app.use(pgResponses.index.api, webApi);
        app.use(pgResponses.index.users, usersCreator);

    } catch (error) {
        console.log("ERRO DE SETUP")
        console.log(error);
    }

    return app
}