"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var axios_1 = __importDefault(require("axios"));
var moment_1 = __importDefault(require("moment"));
var headers = {};
var getHeaders = function () { return __awaiter(_this, void 0, void 0, function () {
    var data, headers_1, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1.default.get('https://mobile.southwest.com/js/config.js')];
            case 1:
                data = (_a.sent()).data;
                headers_1 = {
                    Host: 'mobile.southwest.com',
                    'Content-Type': 'application/json',
                    'X-API-Key': data.split('API_KEY:"')[1].split('"')[0],
                    'X-User-Experience-Id': crypto_1.randomBytes(16)
                        .toString('hex')
                        .toUpperCase(),
                    Accept: '*/*'
                };
                return [2 /*return*/, Promise.resolve(headers_1)];
            case 2:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var lookupReservation = function (conf, first, last) { return __awaiter(_this, void 0, void 0, function () {
    var data, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getHeaders()];
            case 1:
                headers = _a.sent();
                return [4 /*yield*/, axios_1.default.get("https://mobile.southwest.com/api/mobile-air-booking/v1/mobile-air-booking/page/view-reservation/" + conf + "?first-name=" + first + "&last-name=" + last, { headers: headers })];
            case 2:
                data = (_a.sent()).data;
                return [2 /*return*/, Promise.resolve(data)];
            case 3:
                err_2 = _a.sent();
                console.error(err_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getCheckinTime = function (conf, first, last) { return __awaiter(_this, void 0, void 0, function () {
    var reservation, bounds, _a, departureDate, departureTime, checkinTime;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, lookupReservation(conf, first, last)];
            case 1:
                reservation = (_b.sent()).viewReservationViewPage;
                bounds = reservation.bounds;
                _a = bounds[0], departureDate = _a.departureDate, departureTime = _a.departureTime;
                checkinTime = moment_1.default(departureDate + " " + departureTime).subtract(24, 'h');
                return [2 /*return*/, Promise.resolve(checkinTime)];
        }
    });
}); };
var checkin = function (conf, first, last, email) { return __awaiter(_this, void 0, void 0, function () {
    var response, info, checkinUrl, confirmation, _a, boardingPassUrl, boardingPassBody, boardingPassesResponse, _b, sendBoardingPassUrl, sendBoardingPassBody, sendBoardingPassesResponse, err_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 7, , 8]);
                return [4 /*yield*/, getHeaders()];
            case 1:
                headers = _c.sent();
                return [4 /*yield*/, axios_1.default.get("https://mobile.southwest.com/api/mobile-air-operations/v1/mobile-air-operations/page/check-in/" + conf + "?first-name=" + first + "&last-name=" + last, { headers: headers })];
            case 2:
                response = _c.sent();
                info = response.data.checkInViewReservationPage._links.checkIn;
                checkinUrl = "https://mobile.southwest.com/api/mobile-air-operations" + info.href;
                console.log("\uD83C\uDFAB  Checking in " + conf + " for " + first + " " + last);
                return [4 /*yield*/, axios_1.default.post(checkinUrl, info.body, { headers: headers })];
            case 3:
                confirmation = _c.sent();
                console.log("\uD83D\uDEE9  Confirmation info for " + conf + " " + first + " " + last);
                _a = confirmation.data.checkInConfirmationPage._links.boardingPasses, boardingPassUrl = _a.href, boardingPassBody = _a.body;
                return [4 /*yield*/, axios_1.default.post("https://mobile.southwest.com/api/mobile-air-operations" + boardingPassUrl, boardingPassBody, { headers: headers })];
            case 4:
                boardingPassesResponse = (_c.sent()).data;
                if (!!!email) return [3 /*break*/, 6];
                _b = boardingPassesResponse.checkInViewBoardingPassPage._links, sendBoardingPassUrl = _b.href, sendBoardingPassBody = _b.body;
                console.log("\uD83D\uDCE8  Attempting to email boarding pass to " + email);
                return [4 /*yield*/, axios_1.default.post("https://mobile.southwest.com/api/mobile-air-operations" + sendBoardingPassUrl, __assign({}, sendBoardingPassBody, { mediaType: 'EMAIL', emailAddress: email }), { headers: headers })];
            case 5:
                sendBoardingPassesResponse = _c.sent();
                _c.label = 6;
            case 6:
                console.log('🏁  Done!');
                return [3 /*break*/, 8];
            case 7:
                err_3 = _c.sent();
                console.error(err_3.response);
                console.log('😑  Failed...');
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
var run = function (args) { return __awaiter(_this, void 0, void 0, function () {
    var conf, first, last, email, checkinTime;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                conf = args[2];
                first = args[3];
                last = args[4];
                email = args[5];
                return [4 /*yield*/, getCheckinTime(conf, first, last)];
            case 1:
                checkinTime = _a.sent();
                console.log("\uD83D\uDEEB  Will checkin " + conf + " for " + first + " " + last + " " + checkinTime.fromNow());
                setTimeout(function () { return checkin(conf, first, last, email); }, checkinTime.diff(moment_1.default()));
                return [2 /*return*/];
        }
    });
}); };
run(process.argv);
