var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import fetch from 'node-fetch';
import fs from 'fs';
import request from 'request';
import extract_zip from 'extract-zip';
import { hist_data_interpreter } from './file_interpreter.js';
import env from '../env.js';
var fetch_data = /** @class */ (function () {
    function fetch_data() {
    }
    fetch_data.startRoutines = function (db_management) {
        //executes every 15min
        var intraday_interval = setInterval(function () { return fetch_data.IntradayData(db_management); }, 1000 * 60 * 15);
        //executes every 24h
        var historical_interval = setInterval(function () { return fetch_data.HistData(db_management); }, 1000 * 60 * 60 * 24);
        //executes every week
        var uol_support_interval = setInterval(function () { return fetch_data.fetchUolSupportData(db_management); }, 1000 * 60 * 60 * 24 * 7);
    };
    fetch_data.IntradayData = function (db_management) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                db_management.reset_table('intraday_data_table');
                db_management.getDataFromTableSupport('uol_support_table', '*')
                    .then(function (codes) {
                    var e_1, _a;
                    var counter = 0;
                    var _loop_1 = function (code) {
                        setTimeout(function () {
                            _this.fetchTickerData(code['idt'])
                                .then(function (raw_data) {
                                var e_2, _a;
                                var parsed_data = [];
                                try {
                                    for (var _b = (e_2 = void 0, __values(raw_data['data'])), _c = _b.next(); !_c.done; _c = _b.next()) {
                                        var raw = _c.value;
                                        parsed_data.push({
                                            code: code['code'],
                                            open: raw['open'],
                                            high: raw['high'],
                                            low: raw['low'],
                                            close: raw['price'],
                                            last_update: new Date(raw['date']),
                                            volume: raw['vol']
                                        });
                                    }
                                }
                                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                                finally {
                                    try {
                                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                                    }
                                    finally { if (e_2) throw e_2.error; }
                                }
                                db_management.insertIntoTable('intraday_data_table', parsed_data);
                                //console.log('Intraday data successfuly added to table.');
                            });
                        }, ++counter * 50);
                    };
                    try {
                        for (var _b = __values(codes), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var code = _c.value;
                            _loop_1(code);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    fetch_data.fetchTickerData = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(env.uol_intraday_data_url.prefix + code + env.uol_intraday_data_url.sufix);
                return [2 /*return*/, fetch(env.uol_intraday_data_url.prefix + code + env.uol_intraday_data_url.sufix)
                        .then(function (data) { return data.json(); })];
            });
        });
    };
    fetch_data.fetchTickerCode = function (ticker) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, fetch(env.uol_ticker_code_url)
                        .then(function (data) { return data.json(); })
                        .then(function (data) {
                        var data_cont = data['data'];
                        for (var i = 0; i < data_cont.length; i++)
                            if (data_cont[i].code === (ticker + '.SA'))
                                return data_cont[i].idt;
                    }).catch(function (e) { return e; })];
            });
        });
    };
    fetch_data.fetchUolSupportData = function (db_management) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                db_management.reset_table('uol_support_table');
                fetch(env.uol_ticker_code_url)
                    .then(function (data) { return data.json(); })
                    .then(function (parsed_data) {
                    db_management.supportTableInsert(parsed_data['data']);
                });
                return [2 /*return*/];
            });
        });
    };
    //CODE FOR DOWNLOADING AND UNZIPPING HISTORICAL DATA
    fetch_data.HistData = function (db_manegement) {
        var _this = this;
        fs.readdirSync(env.hist_data_path)
            .map(function (el) { return fs.unlinkSync(env.hist_data_path + el); });
        request(env.curr_year_url)
            .pipe(fs.createWriteStream(env.hist_data_path + 'data.zip'))
            .on('close', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, chunk, e_3_1;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("Downloaded zip file");
                        return [4 /*yield*/, extract_zip(env.hist_data_path + 'data.zip', { dir: env.hist_data_path }, function (e) { return console.error(e); })];
                    case 1:
                        _d.sent();
                        console.log("Unziped the downloaded file!");
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 8, 9, 14]);
                        _a = __asyncValues(hist_data_interpreter(env.curr_year_data_file_path));
                        _d.label = 3;
                    case 3: return [4 /*yield*/, _a.next()];
                    case 4:
                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 7];
                        chunk = _b.value;
                        return [4 /*yield*/, db_manegement.insertIntoTable('hist_data_table', chunk)];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [3 /*break*/, 3];
                    case 7: return [3 /*break*/, 14];
                    case 8:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 14];
                    case 9:
                        _d.trys.push([9, , 12, 13]);
                        if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 11];
                        return [4 /*yield*/, _c.call(_a)];
                    case 10:
                        _d.sent();
                        _d.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        if (e_3) throw e_3.error;
                        return [7 /*endfinally*/];
                    case 13: return [7 /*endfinally*/];
                    case 14:
                        console.log("Historical data update was done successfuly.");
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return fetch_data;
}());
export default fetch_data;
