const api = require('./api');
const realTimeApi = require('./realTimeApi');

function route(app) {
    app.use('/api', api);
    app.use('/realtime/api', realTimeApi);

    app.get('*', (req, res) => {
        res.redirect('/');
    });
}

module.exports = route;