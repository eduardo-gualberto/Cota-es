import Express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import fetch_data from './models/fetch_data.js';
import db_mng from './models/db_management.js';
import env from './env.js';

const app = Express();

app.use(cors());
app.use(bodyParser());

const db_config = {
    host: env.db_host,
    user: env.db_user,
    password: env.db_password,
    database: env.db_name
};

const db_manegement = new db_mng(db_config, err => {
        if (err) throw err;
        else console.log(`Connected to MySQL database ${db_config.database} as ${db_config.user}.`);
    });




fetch_data.startRoutines(db_manegement);

app.route('/intraday/:ticker')
    .get(async (req, res) => {
        db_manegement.getDataFromTableIntraday(req.params.ticker)
            .then(data => res.json(data));
    });

app.route('/historical/:ticker')
    .get(async (req, res) => {
        db_manegement.getDataFromTableHist(req.params.ticker)
            .then(data => res.json(data));
    });




    
app.listen(env.server_port);