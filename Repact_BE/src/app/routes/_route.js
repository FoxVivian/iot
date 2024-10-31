import api from './api.js';
import realTimeApi from './realTimeApi.js';

function route(app) {
    app.use('/api', api);
    app.use('/realtime/api', realTimeApi);

    app.get('*', (req, res) => {
        res.redirect('/');
    });
}

export default route;
