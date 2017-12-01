webpackJsonp([4],{

/***/ 652:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminPageModule", function() { return AdminPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__admin__ = __webpack_require__(659);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let AdminPageModule = class AdminPageModule {
};
AdminPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__admin__["a" /* AdminPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__admin__["a" /* AdminPage */]),
        ],
    })
], AdminPageModule);

//# sourceMappingURL=admin.module.js.map

/***/ }),

/***/ 659:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AdminPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_firebase_firebase__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__submit_data_choose_coords_submit_data_choose_coords__ = __webpack_require__(292);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





let AdminPage = class AdminPage {
    constructor(afAuth, toast, navCtrl, navParams, database) {
        this.afAuth = afAuth;
        this.toast = toast;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.database = database;
        this.filterValue = 'showAll';
    }
    ionViewDidLoad() {
        const item = [];
        this.database.userInput.once('value').then(function (datakey) {
            datakey.forEach(function (data) {
                const temp = data.val();
                Object.assign(temp, {
                    'key': data.key
                });
                item.push(temp);
            });
        });
        this.items = item;
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    approve(value) {
        this.database.userInput.child(value.key).update({ 'status': 'approved' });
        this.database.masterData = this.database.masterData.push();
        this.database.masterData.set({
            'name': value.pointName,
            'address': value.address,
            'lat': value.latitude,
            'lng': value.longitude,
            'description': value.description,
            'number': value.phone,
            'website': value.website,
            'type': value.type
        });
        this.filterItems(this.filterValue);
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);
    }
    deny(value) {
        this.database.userInput.child(value.key).update({ 'status': 'denied' });
        this.filterItems(this.filterValue);
    }
    editData(value) {
        this.navCtrl.push('EditSubmitDataPage', value);
    }
    deleteItem(value) {
        this.database.userInput.child(value.key).remove();
        this.filterItems(this.filterValue); // refresh the page
    }
    filterItems(value) {
        this.filterValue = value;
        const item = [];
        this.database.userInput.once('value').then(function (datakey) {
            datakey.forEach(function (data) {
                const temp = data.val();
                Object.assign(temp, {
                    'key': data.key
                });
                if (value === 'showAll') {
                    item.push(temp);
                }
                else if (temp.status === value) {
                    item.push(temp);
                }
            });
        });
        this.items = item;
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.afAuth.auth.signOut();
            this.navCtrl.setRoot('HomePage');
        });
    }
    checkCoords(item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */], item);
        console.log(item);
    }
};
AdminPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-admin',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/admin/admin.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Admin Approval Page</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n\n  <ion-item>\n    <ion-label>Filter Items</ion-label>\n    <ion-select [(ngModel)]="filter" multiple="false" #item (ionChange)="filterItems(item.value)" cancelText="Cancel" okText="Filter!">\n      <ion-option value="approved">Approved</ion-option>\n      <ion-option value="pending">Pending</ion-option>\n      <ion-option value="denied">Denied</ion-option>\n      <ion-option value="showAll">Show All</ion-option>\n    </ion-select>\n  </ion-item>\n\n  <ion-card *ngFor="let item of items">\n    <ion-card-header>\n      <ion-item item-right>\n        <ion-icon name="aperture"></ion-icon>\n        {{capitalizeFirstLetter(item.status)}}\n      </ion-item>\n    </ion-card-header>\n    <ion-card-content>\n      <ion-item center>\n        <h2>Point Name</h2>\n        <p>{{item.pointName}}</p>\n      </ion-item>\n\n      <ion-item>\n        <h2>Submitter Information</h2>\n        <p>Name: {{item.firstName}} {{item.lastName}}</p>\n        <p>Email: {{item.email}}</p>\n        <br/>\n        <h2>Point of Interest Information</h2>\n        <p>Timestamp: {{item.dateTime}}</p>\n        <p>Point Name: {{item.pointName}}</p>\n        <p>Latitude: {{item.latitude}}</p>\n        <p>Longitude: {{item.longitude}}</p>\n        <p>Type: {{item.type}}</p>\n        <p>Point Website: {{item.website}}</p>\n        <p>Point Phone: {{item.phone}}</p>\n        <p>Point Address: {{item.address}}</p>\n        <p>Description: {{item.description}}</p>\n        <br/>\n        <h2>Note to Admin</h2>\n        <p>{{item.note}}</p>\n      </ion-item>\n    </ion-card-content>\n    <ion-grid>\n      <ion-row>\n        <ion-col *ngIf="item.status != \'approved\'" class="column" col-6>\n          <button ion-button small (click)="approve(item)">\n            <ion-icon name=\'checkmark\'></ion-icon>\n             Approve\n          </button>\n        </ion-col>\n        <ion-col class="column" col-6>\n          <button ion-button small color="danger"(click)="deny(item)">\n            <ion-icon name=\'backspace\'></ion-icon>\n             Deny\n          </button>\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col class="column" col-6>\n          <button ion-button small color="blue"(click)="editData(item)">\n            <ion-icon name=\'cut\'></ion-icon>\n             Edit\n          </button>\n        </ion-col>\n        <ion-col class="column" col-6>\n          <button ion-button small color="danger" icon-start (click)="deleteItem(item)">\n            <ion-icon name=\'close\'></ion-icon>\n            Remove\n          </button>\n        </ion-col>\n        <ion-col class="column" col-6>\n          <button ion-button small color="blue" icon-start (click)="checkCoords(item)">\n            <ion-icon name=\'md-eye\'></ion-icon>\n            Check Coordinate Location\n          </button>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/admin/admin.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_firebase_firebase__["a" /* FirebaseProvider */]])
], AdminPage);

//# sourceMappingURL=admin.js.map

/***/ })

});
//# sourceMappingURL=4.js.map