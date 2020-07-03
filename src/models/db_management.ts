import mysql from "mysql";

import stock_record from './stockRecord.js';



export default class DB_Management{
    constructor(db_config: object, cb: CallableFunction){
        this.db_connection = mysql.createConnection(db_config);
        this.db_connection.connect(err => cb(err));
    }

    public reset_table(table_name: string){
        this.db_connection.beginTransaction((err) => {
            if(err) throw err;
            else{
                const my_query = `DELETE FROM ${table_name};`;
                this.db_connection.query(my_query, (err, result) => {
                    if(err) this.db_connection.rollback();
                    else this.db_connection.commit((err) => {
                        if(err) this.db_connection.rollback();
                        else console.log(`Deleted all data from ${table_name}.`);
                    });
                });
            }
        });
    }

    public async insertIntoTable(table_name: string, data: Array<stock_record>){
        this.db_connection.beginTransaction((err) => {
            if(err) throw err;
            else{
                let my_query: string;
                for(let record of data){
                    let row = Object.values(record);
                    my_query  = `INSERT INTO ${table_name} (code, open, high, low, close, date, volume) VALUES ?`;
                    this.db_connection.query(my_query, [[row]], (err) => {
                        if(err){
                            this.db_connection.rollback();
                            throw err;
                        }
                    });
                }
                //console.log('Ended adding a chunk of rows to the transaction.');

                this.db_connection.commit((err) => {
                    if(err) {
                        this.db_connection.rollback();
                        throw err;
                    }
                    //else console.log(`Commited all data successfully to ${table_name}`);
                })
            }
        });
    }

    public async supportTableInsert(data: Array<Object>){
        this.reset_table('uol_support_table');
        this.db_connection.beginTransaction(err => {
            if(err) throw err;
            else{
                const my_query = `INSERT INTO uol_support_table (idt, code) VALUES ?`;
                const values_arr = [];
                for(let obj of data)
                    values_arr.push(Object.values(obj).slice(0,2));
                //console.log(values_arr.slice(0,5));
                this.db_connection.query(my_query, [values_arr], (err) => {
                    if(err) {
                        this.db_connection.rollback();
                        throw err;
                    }
                });
                this.db_connection.commit((err) => {
                    if(err) {
                        this.db_connection.rollback();
                        throw err;
                    }
                    //console.log('Update data support table.');
                });
            }
        });
    }

    public async getDataFromTableSupport(table: string, columns: string) : Promise<Object>{
        const my_query = `SELECT ${columns} FROM ${table};`;
        return new Promise((resolve, reject) => {
            this.db_connection.query(my_query, (err, data) => {
                resolve(data);
            });
        });
    }

    public async getDataFromTableHist(code: string){
        const my_query = `SELECT * FROM hist_data_table WHERE code='${code.toUpperCase()}';`;
        return new Promise((resolve, reject) => {
            this.db_connection.query(my_query, (err, data) => {
                for(let el of data)
                    delete el['hist_data_table_id'];
                resolve(data);
            });
        });
    }

    public async getDataFromTableIntraday(code: string){
        const my_query = `SELECT * FROM intraday_data_table WHERE code='${code.toUpperCase() + '.SA'}';`;
        return new Promise((resolve, reject) => {
            this.db_connection.query(my_query, (err, data) => {
                for(let el of data){
                    delete el['intraday_data_table_id'];
                    el['code'] = (<string>el['code']).slice(0, (<string>el['code']).length - 3);
                }
                resolve(data);
            });
        });
    }

    private db_connection: mysql.Connection;
}