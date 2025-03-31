const Parse = require('parse/node');
require('dotenv').config();

// Configurações do Parse/Back4App
function initializeParse() {
    Parse.initialize(
        process.env.BACK4APP_APP_ID || 'Ky5Bq9nLE90cYTcPtie9wKYdZKWsfsWKRnqzmIQo',
        process.env.BACK4APP_JS_KEY || 'zcHQBkod7Oi5oPBHhJlk0A4cqwIjlDHe58IJxrri'
    );
    Parse.serverURL = 'https://parseapi.back4app.com';

    console.log('Parse inicializado com sucesso');
}

module.exports = { initializeParse };