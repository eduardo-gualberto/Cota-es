import fs from 'fs';
import readline from 'readline';

import stock_record from './stockRecord.js';
import { rawListeners } from 'process';



function clearZeros(str: string) : string{
    let index = 0;
    for(let i = 0; i < str.length - 4; i++)
        if(str[i] != '0')
            return str.substr(i);
    return str.substr(str.length - 4);
}




(async function main(){
    const path = '/home/eduardo/cotacoes_project/hist_data/COTAHIST_A2019.TXT';
    
    /*for await(let b of hist_data_interpreter(path)){
        console.log((<Array<stock_record>>b).slice(0,2));
    }*/

})();   