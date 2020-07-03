import fetch from 'node-fetch';
import fs from 'fs';
import request from 'request';
import extract_zip from 'extract-zip';
import stock_record from './stockRecord';
import {hist_data_interpreter} from './file_interpreter.js';
import env from '../env.js';
import db_m from './db_management.js';

export default class fetch_data {

    static startRoutines(db_management: db_m){
        //executes every 15min
        const intraday_interval = setInterval(() => fetch_data.IntradayData(db_management), 1000*60*15);
        
        //executes every 24h
        const historical_interval = setInterval(() => fetch_data.HistData(db_management), 1000*60*60*24);
        
        //executes every week
        const uol_support_interval = setInterval(() => fetch_data.fetchUolSupportData(db_management), 1000*60*60*24*7);
    }

    static async IntradayData(db_management: db_m){
        db_management.reset_table('intraday_data_table');
        db_management.getDataFromTableSupport('uol_support_table', '*')
            .then(codes => {
                let counter = 0;
                for(let code of <Object[]>codes){
                    setTimeout(() => {
                        this.fetchTickerData(code['idt'])
                        .then(raw_data => {
                            let parsed_data: Array<stock_record> = []; 
                            for(let raw of raw_data['data']){
                                parsed_data.push(<stock_record>{
                                    code: code['code'],
                                    open: raw['open'],
                                    high: raw['high'],
                                    low: raw['low'],
                                    close: raw['price'],
                                    last_update: new Date(raw['date']),
                                    volume: raw['vol']
                                });
                            }
                            db_management.insertIntoTable('intraday_data_table', parsed_data);
                            //console.log('Intraday data successfuly added to table.');
                    });
                    }, ++counter * 50);
                }
            });
    }

    static async fetchTickerData(code: number) : Promise<JSON>{
        console.log(env.uol_intraday_data_url.prefix + code + env.uol_intraday_data_url.sufix);
        return fetch(env.uol_intraday_data_url.prefix + code + env.uol_intraday_data_url.sufix)
            .then(data => data.json());
    }

    static async fetchTickerCode(ticker: string) : Promise<string>{
        return fetch(env.uol_ticker_code_url)
            .then(data => data.json())
            .then(data => {
                let data_cont = data['data'];
                for (let i = 0; i < data_cont.length; i++)
                    if(data_cont[i].code === (ticker + '.SA'))
                        return data_cont[i].idt;
            }).catch(e => e);
    }

    static async fetchUolSupportData(db_management: db_m){
        db_management.reset_table('uol_support_table');
        fetch(env.uol_ticker_code_url)
            .then(data => data.json())
            .then(parsed_data => {
                db_management.supportTableInsert(parsed_data['data']);
            });
    }

    //CODE FOR DOWNLOADING AND UNZIPPING HISTORICAL DATA
    static HistData(db_manegement: db_m) : void {        
        fs.readdirSync(env.hist_data_path)
            .map(el => fs.unlinkSync(env.hist_data_path + el));
        request(env.curr_year_url)
            .pipe(fs.createWriteStream(env.hist_data_path + 'data.zip'))
            .on('close', async () => {
                console.log("Downloaded zip file");
                await extract_zip(env.hist_data_path + 'data.zip', {dir: env.hist_data_path}, e => console.error(e));
                console.log("Unziped the downloaded file!");
                for await(let chunk of hist_data_interpreter(env.curr_year_data_file_path)){
                    await db_manegement.insertIntoTable('hist_data_table', <Array<stock_record>>chunk);                      
                }
                console.log("Historical data update was done successfuly.");
            });
    }

}