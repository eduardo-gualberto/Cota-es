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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import fs from 'fs';
import readline from 'readline';
function clearZeros(str) {
    var index = 0;
    for (var i = 0; i < str.length - 4; i++)
        if (str[i] != '0')
            return str.substr(i);
    return str.substr(str.length - 4);
}
export function hist_data_interpreter(file_path) {
    return __asyncGenerator(this, arguments, function hist_data_interpreter_1() {
        var file, lineReader, line_count, a, lineReader_1, lineReader_1_1, line, code, last_updateRaw, volume, openRaw, highRaw, lowRaw, closeRaw, aux, open, high, low, close, last_update, e_1_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = fs.createReadStream(file_path);
                    lineReader = readline.createInterface({
                        input: file,
                        crlfDelay: Infinity
                    });
                    line_count = 0;
                    a = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 14]);
                    lineReader_1 = __asyncValues(lineReader);
                    _b.label = 2;
                case 2: return [4 /*yield*/, __await(lineReader_1.next())];
                case 3:
                    if (!(lineReader_1_1 = _b.sent(), !lineReader_1_1.done)) return [3 /*break*/, 7];
                    line = lineReader_1_1.value;
                    if (line.substr(0, 2) == '01') {
                        line_count++;
                        code = line.substr(12, 12).trim();
                        last_updateRaw = line.substr(2, 8);
                        volume = parseInt(clearZeros(line.substr(171, 16)));
                        openRaw = clearZeros(line.substr(57, 12)).split('');
                        highRaw = clearZeros(line.substr(70, 12)).split('');
                        lowRaw = clearZeros(line.substr(83, 12)).split('');
                        closeRaw = clearZeros(line.substr(109, 12)).split('');
                        aux = void 0;
                        openRaw.push('.');
                        aux = openRaw[openRaw.length - 1];
                        openRaw[openRaw.length - 1] = openRaw[openRaw.length - 3];
                        openRaw[openRaw.length - 3] = aux;
                        open = parseFloat(openRaw.join(''));
                        highRaw.push('.');
                        aux = highRaw[highRaw.length - 1];
                        highRaw[highRaw.length - 1] = highRaw[highRaw.length - 3];
                        highRaw[highRaw.length - 3] = aux;
                        high = parseFloat(highRaw.join(''));
                        lowRaw.push('.');
                        aux = lowRaw[lowRaw.length - 1];
                        lowRaw[lowRaw.length - 1] = lowRaw[lowRaw.length - 3];
                        lowRaw[lowRaw.length - 3] = aux;
                        low = parseFloat(lowRaw.join(''));
                        closeRaw.push('.');
                        aux = closeRaw[closeRaw.length - 1];
                        closeRaw[closeRaw.length - 1] = closeRaw[closeRaw.length - 3];
                        closeRaw[closeRaw.length - 3] = aux;
                        close = parseFloat(closeRaw.join(''));
                        last_update = new Date(last_updateRaw.substr(0, 4) + "-\n                                        " + last_updateRaw.substr(4, 2) + "-\n                                        " + last_updateRaw.substr(6, 2));
                        a.push({
                            code: code, open: open, high: high, low: low, close: close, last_update: last_update, volume: volume
                        });
                    }
                    if (!(line_count === 256)) return [3 /*break*/, 6];
                    return [4 /*yield*/, __await(a)];
                case 4: return [4 /*yield*/, _b.sent()];
                case 5:
                    _b.sent();
                    a.length = line_count = 0;
                    _b.label = 6;
                case 6: return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _b.trys.push([9, , 12, 13]);
                    if (!(lineReader_1_1 && !lineReader_1_1.done && (_a = lineReader_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, __await(_a.call(lineReader_1))];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [4 /*yield*/, __await(void 0)];
                case 15: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
