webpackJsonp([2],{

/***/ 818:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PointsPageModule", function() { return PointsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__points__ = __webpack_require__(823);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let PointsPageModule = class PointsPageModule {
};
PointsPageModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__points__["a" /* PointsPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__points__["a" /* PointsPage */]),
        ],
    })
], PointsPageModule);

//# sourceMappingURL=points.module.js.map

/***/ }),

/***/ 823:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PointsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_underscore_underscore__ = __webpack_require__(447);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_underscore_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_underscore_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_firebase_firebase__ = __webpack_require__(109);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








let PointsPage = class PointsPage {
    constructor(navCtrl, navParams, loading, toast, authData, database) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.toast = toast;
        this.authData = authData;
        this.database = database;
        this.name = this.navParams.get('name');
        this.address = this.navParams.get('address');
        this.number = this.navParams.get('number');
        this.description = this.navParams.get('description');
        this.key = String(this.navParams.get('key'));
        if (this.navParams.get('key') > 163) {
            this.image = "../../assets/images/uhLogo.jpg";
        }
        else {
            if (!isNaN(this.navParams.get('key'))) {
                this.image = "https://manoanow.org/app/map/images/" + this.key + ".png";
            }
            else {
                this.image = "../../assets/images/uhLogo.jpg";
            }
        }
        this.date = new Date();
        this.showAdd = false;
        this.user = __WEBPACK_IMPORTED_MODULE_2_firebase__["auth"]().currentUser;
    }
    ionViewDidLoad() {
        this.showComments();
    }
    showComments() {
        var item = [];
        this.database.masterData.child(this.key).child("comments").once("value")
            .then((dataPoints) => {
            item = dataPoints.val();
            this.comments = __WEBPACK_IMPORTED_MODULE_3_underscore_underscore__["toArray"](item);
        });
    }
    addComments(formData) {
        if (this.user) {
            this.date = new Date().toString();
            Object.assign(formData.value, { 'dateTime': this.date });
            Object.assign(formData.value, { 'userName': this.user.displayName });
            let comments = this.database.masterData.child(this.key);
            comments.child('/comments').push(formData.value);
            this.showComments();
            this.toggleAddButton();
            this.commentText.value = "";
        }
    }
    toggleAddButton() {
        this.showAdd = !this.showAdd;
    }
    getDate(comment) {
        return new Date(comment.dateTime).getMonth() + 1 + '/' + new Date(comment.dateTime).getDate() + '/' + new Date(comment.dateTime).getFullYear();
    }
    logIn() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('commentText'),
    __metadata("design:type", Object)
], PointsPage.prototype, "commentText", void 0);
PointsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'points-page',template:/*ion-inline-start:"/Users/chrisnguyenhi/Documents/git/Wayfinder/src/pages/points/points.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>{{name}}</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <div center style="width: 100%; height: 100%;">\n    <ion-img center *ngIf="image" class="pointImage" src={{image}}></ion-img>\n    <div>\n      <br>\n      <h2 *ngIf="name && name.toLowerCase() != \'n/a\'">\n        {{name}}\n      </h2>\n      <div *ngIf="addess && address.toLowerCase() != \'n/a\'">\n        {{address}}\n      </div>\n      <div *ngIf="number && number.toLowerCase() != \'n/a\'">\n        {{number}}\n      </div>\n      <hr *ngIf="description && description.toLowerCase() != \'n/a\'">\n      <div *ngIf="description && description.toLowerCase() != \'n/a\'">\n        {{description}}\n        <hr>\n      </div>\n      <br>\n    </div>\n  </div>\n\n  <div>\n    <div *ngIf="comments">\n      <ion-card *ngFor="let comment of comments">\n        <ion-card-header>\n          <ion-item>\n            <ion-icon name="person"> {{ comment.userName }} </ion-icon>\n          </ion-item>\n        </ion-card-header>\n\n        <ion-card-content>\n          <div class="font">\n            {{ this.getDate(comment) }}\n          </div>\n          {{ comment.messages }}\n        </ion-card-content>\n      </ion-card>\n    </div>\n  </div>\n\n  <br>\n  <br>\n  <br>\n  <div *ngIf="showAdd">\n    <form #formData=\'ngForm\' (ngSubmit)="addComments(formData)">\n      <ion-label color="primary">Add a new comment</ion-label>\n      <ion-item>\n        <ion-input #commentText type="text" placeholder="Enter a comment" [(ngModel)]="messages" name="messages"></ion-input>\n      </ion-item>\n      <button ion-button type="submit" block>Submit</button>\n    </form>\n  </div>\n\n  <div *ngIf="user" style="display: flex;">\n    <button style="margin: auto;" ion-button (click)="toggleAddButton()">\n      Comment\n    </button>\n  </div>\n  <div *ngIf="!user" style="display: flex;">\n    <button style="margin: auto;" ion-button (click)="logIn()">\n      Log in to comment\n    </button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"/Users/chrisnguyenhi/Documents/git/Wayfinder/src/pages/points/points.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__["a" /* AuthProvider */], __WEBPACK_IMPORTED_MODULE_6__providers_firebase_firebase__["a" /* FirebaseProvider */]])
], PointsPage);

//# sourceMappingURL=points.js.map

/***/ })

});
//# sourceMappingURL=2.js.map