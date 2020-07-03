import fs from 'fs';
import readline from 'readline';

import stock_record from './stockRecord.js';




function clearZeros(str: string) : string{
    let index = 0;
    for(let i = 0; i < str.length - 4; i++)
        if(str[i] != '0')
            return str.substr(i);
    return str.substr(str.length - 4);
}

export async function* hist_data_interpreter(file_path: string) : AsyncGenerator{
    let file = fs.createReadStream(file_path);
    let lineReader = readline.createInterface({
        input: file,
        crlfDelay: Infinity
    });
    
    let line_count = 0;
    let a: Array<stock_record> = [];

    //setTimeout(() => lineReader.close(), 100);
    
    for await(let line of lineReader){
        if(line.substr(0,2) == '01') {
            line_count++;
            let code = line.substr(12, 12).trim();
            let last_updateRaw = line.substr(2, 8);
            let volume = parseInt(clearZeros(line.substr(171, 16)));

            let openRaw = clearZeros(line.substr(57, 12)).split('');
            let highRaw = clearZeros(line.substr(70 , 12)).split('');
            let lowRaw = clearZeros(line.substr(83 , 12)).split('');
            let closeRaw = clearZeros(line.substr(109 , 12)).split('');

            let aux;
            openRaw.push('.');
            aux = openRaw[openRaw.length - 1];
            openRaw[openRaw.length - 1] = openRaw[openRaw.length - 3];
            openRaw[openRaw.length - 3] = aux;
            let open = parseFloat(openRaw.join(''));

            highRaw.push('.');
            aux = highRaw[highRaw.length - 1];
            highRaw[highRaw.length - 1] = highRaw[highRaw.length - 3];
            highRaw[highRaw.length - 3] = aux;
            let high = parseFloat(highRaw.join(''));

            lowRaw.push('.');
            aux = lowRaw[lowRaw.length - 1];
            lowRaw[lowRaw.length - 1] = lowRaw[lowRaw.length - 3];
            lowRaw[lowRaw.length - 3] = aux;
            let low = parseFloat(lowRaw.join(''));
            
            closeRaw.push('.');
            aux = closeRaw[closeRaw.length - 1];
            closeRaw[closeRaw.length - 1] = closeRaw[closeRaw.length - 3];
            closeRaw[closeRaw.length - 3] = aux;
            let close = parseFloat(closeRaw.join(''));
            
            let last_update = new Date(`${last_updateRaw.substr(0,4)}-
                                        ${last_updateRaw.substr(4,2)}-
                                        ${last_updateRaw.substr(6,2)}`);


            a.push({
                code, open, high, low, close, last_update, volume
            });
        }
        if(line_count === 256){
            yield a;
            a.length = line_count = 0;
        }
    }
    return;
}