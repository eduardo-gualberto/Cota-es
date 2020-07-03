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
import mysql from "mysql";
var DB_Management = /** @class */ (function () {
    function DB_Management(db_config, cb) {
        this.db_connection = mysql.createConnection(db_config);
        this.db_connection.connect(function (err) { return cb(err); });
    }
    DB_Management.prototype.reset_table = function (table_name) {
        var _this = this;
        this.db_connection.beginTransaction(function (err) {
            if (err)
                throw err;
            else {
                var my_query = "DELETE FROM " + table_name + ";";
                _this.db_connection.query(my_query, function (err, result) {
                    if (err)
                        _this.db_connection.rollback();
                    else
                        _this.db_connection.commit(function (err) {
                            if (err)
                                _this.db_connection.rollback();
                            else
                                console.log("Deleted all data from " + table_name + ".");
                        });
                });
            }
        });
    };
    DB_Management.prototype.insertIntoTable = function (table_name, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.db_connection.beginTransaction(function (err) {
                    var e_1, _a;
                    if (err)
                        throw err;
                    else {
                        var my_query = void 0;
                        try {
                            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                                var record = data_1_1.value;
                                var row = Object.values(record);
                                my_query = "INSERT INTO " + table_name + " (code, open, high, low, close, date, volume) VALUES ?";
                                _this.db_connection.query(my_query, [[row]], function (err) {
                                    if (err) {
                                        _this.db_connection.rollback();
                                        throw err;
                                    }
                                });
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                        //console.log('Ended adding a chunk of rows to the transaction.');
                        _this.db_connection.commit(function (err) {
                            if (err) {
                                _this.db_connection.rollback();
                                throw err;
                            }
                            //else console.log(`Commited all data successfully to ${table_name}`);
                        });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    DB_Management.prototype.supportTableInsert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.reset_table('uol_support_table');
                this.db_connection.beginTransaction(function (err) {
                    var e_2, _a;
                    if (err)
                        throw err;
                    else {
                        var my_query = "INSERT INTO uol_support_table (idt, code) VALUES ?";
                        var values_arr = [];
                        try {
                            for (var data_2 = __values(data), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                                var obj = data_2_1.value;
                                values_arr.push(Object.values(obj).slice(0, 2));
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (data_2_1 && !data_2_1.done && (_a = data_2.return)) _a.call(data_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                        //console.log(values_arr.slice(0,5));
                        _this.db_connection.query(my_query, [values_arr], function (err) {
                            if (err) {
                                _this.db_connection.rollback();
                                throw err;
                            }
                        });
                        _this.db_connection.commit(function (err) {
                            if (err) {
                                _this.db_connection.rollback();
                                throw err;
                            }
                            //console.log('Update data support table.');
                        });
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    DB_Management.prototype.getDataFromTableSupport = function (table, columns) {
        return __awaiter(this, void 0, void 0, function () {
            var my_query;
            var _this = this;
            return __generator(this, function (_a) {
                my_query = "SELECT " + columns + " FROM " + table + ";";
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db_connection.query(my_query, function (err, data) {
                            resolve(data);
                        });
                    })];
            });
        });
    };
    DB_Management.prototype.getDataFromTableHist = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var my_query;
            var _this = this;
            return __generator(this, function (_a) {
                my_query = "SELECT * FROM hist_data_table WHERE code='" + code.toUpperCase() + "';";
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db_connection.query(my_query, function (err, data) {
                            var e_3, _a;
                            try {
                                for (var data_3 = __values(data), data_3_1 = data_3.next(); !data_3_1.done; data_3_1 = data_3.next()) {
                                    var el = data_3_1.value;
                                    delete el['hist_data_table_id'];
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (data_3_1 && !data_3_1.done && (_a = data_3.return)) _a.call(data_3);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            resolve(data);
                        });
                    })];
            });
        });
    };
    DB_Management.prototype.getDataFromTableIntraday = function (code) {
        return __awaiter(this, void 0, void 0, function () {
            var my_query;
            var _this = this;
            return __generator(this, function (_a) {
                my_query = "SELECT * FROM intraday_data_table WHERE code='" + (code.toUpperCase() + '.SA') + "';";
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.db_connection.query(my_query, function (err, data) {
                            var e_4, _a;
                            try {
                                for (var data_4 = __values(data), data_4_1 = data_4.next(); !data_4_1.done; data_4_1 = data_4.next()) {
                                    var el = data_4_1.value;
                                    delete el['intraday_data_table_id'];
                                    el['code'] = el['code'].slice(0, el['code'].length - 3);
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (data_4_1 && !data_4_1.done && (_a = data_4.return)) _a.call(data_4);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            resolve(data);
                        });
                    })];
            });
        });
    };
    return DB_Management;
}());
export default DB_Management;
