webpackJsonp([7],{

/***/ 166:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmitDataPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__map_map__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_firebase_firebase__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








let SubmitDataPage = class SubmitDataPage {
    constructor(navCtrl, navParams, loading, toast, http, authData, database) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.toast = toast;
        this.http = http;
        this.authData = authData;
        this.database = database;
        this.token = this.navParams.get('token');
        if (!this.token) {
            this.latitude = this.navParams.get('lat');
            this.longitude = this.navParams.get('long');
            this.address = this.navParams.get('address');
        }
        this.user = __WEBPACK_IMPORTED_MODULE_2_firebase__["auth"]().currentUser;
        if (this.user) {
            this.email = this.user.email;
            let uid = this.user.uid;
            this.database.users.once("value", (snapshot) => {
                if (snapshot.val()[uid]) {
                    this.firstName = snapshot.val()[uid].firstName;
                    this.lastName = snapshot.val()[uid].lastName;
                }
            });
        }
    }
    ionViewDidLoad() {
        if (this.token) {
            this.getCurrLocation();
        }
    }
    onSubmit(formData) {
        for (var element in formData.value) {
            if (formData.value[element] === undefined) {
                formData.value[element] = "n/a";
            }
        }
        Object.assign(formData.value, { 'status': 'pending' });
        this.childRef = this.database.userInput.push();
        this.childRef.set(formData.value);
        this.toast.create({
            message: `Your point has been submitted! Wait for admin approval.`,
            duration: 3000
        }).present();
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__map_map__["a" /* MapPage */]);
    }
    // Uses HTML5 navigator to get lat/long
    getCurrLocation() {
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        });
        if (navigator.geolocation) {
            this.loader.present().then(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    this.latitude = position.coords.latitude;
                    this.longitude = position.coords.longitude;
                    this.getAddress();
                    this.loader.dismiss();
                });
            });
        }
    }
    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;
        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
    }
};
SubmitDataPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'submit-page',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/submit-data/submit-data.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Submit Data</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n<ion-list inset>\n  <form #formData=\'ngForm\'(ngSubmit)="onSubmit(formData)">\n    <ion-label>Point of Interest</ion-label>\n    <ion-item>\n      <ion-label color="primary">Name</ion-label>\n      <ion-input type="text" placeholder="Name" [(ngModel)]="pointName" name="pointName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Latitude</ion-label>\n      <ion-input type="text" placeholder="Latitude" [(ngModel)]="latitude" name="latitude"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Longitude</ion-label>\n      <ion-input type="text" placeholder="Longitude"[(ngModel)]="longitude" name="longitude"></ion-input>\n    </ion-item>\n    <ion-item>\n    <ion-label color="primary">Address</ion-label>\n    <ion-input type="text" placeholder="Address"[(ngModel)]="address" name="address"></ion-input>\n  </ion-item>\n    <ion-item>\n      <ion-label color="primary">Phone</ion-label>\n      <ion-input type="tel" placeholder="Phone"[(ngModel)]="phone" name="phone"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Website</ion-label>\n      <ion-input type="url" placeholder="Website"[(ngModel)]="website" name="website"></ion-input>\n    </ion-item>\n\n      <ion-list>\n        <ion-label color="primary">Location Type</ion-label>\n        <ion-item>\n          <ion-select placeholder="Choose One"[(ngModel)]="type" name="type" cancelText="Nah" okText="Okay!">\n            <ion-option value="classroom">Classroom</ion-option>\n            <ion-option value="drink">Drink</ion-option>\n            <ion-option value="food">Food</ion-option>\n            <ion-option value="entertainment">Entertainment</ion-option>\n            <ion-option value="housing">Housing</ion-option>\n            <ion-option value="library">Library</ion-option>\n            <ion-option value="parking">Parking</ion-option>\n            <ion-option value="recreational">Recreational</ion-option>\n            <ion-option value="service">Service</ion-option>\n          </ion-select>\n        </ion-item>\n      </ion-list>\n\n    <ion-label>Contact Information</ion-label>\n    <ion-item>\n      <ion-label color="primary">First Name</ion-label>\n      <ion-input type="text" placeholder="First name" [(ngModel)]="firstName" name="firstName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Last Name</ion-label>\n      <ion-input type="text" placeholder="Last name" [(ngModel)]="lastName" name="lastName"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary">Contact Email</ion-label>\n      <ion-input type="email" placeholder="Email" [(ngModel)]="email" name="email"></ion-input>\n    </ion-item>\n    <br/>\n\n    <ion-item>\n      <ion-label color="primary" stacked >Description</ion-label>\n      <ion-input type="text" placeholder="Description" [(ngModel)]="description" name="description"></ion-input>\n    </ion-item>\n    <ion-item>\n      <ion-label color="primary" stacked >Note to admin</ion-label>\n      <ion-input type="text" placeholder="Note to admin" [(ngModel)]="note" name="note"></ion-input>\n    </ion-item>\n    <button ion-button type="submit" block>Submit</button>\n  </form>\n</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/submit-data/submit-data.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__["a" /* AuthProvider */], __WEBPACK_IMPORTED_MODULE_6__providers_firebase_firebase__["a" /* FirebaseProvider */]])
], SubmitDataPage);

//# sourceMappingURL=submit-data.js.map

/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__validators_email__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__map_map__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase_app__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_firebase_firebase__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








let LoginPage = class LoginPage {
    constructor(authData, alertCtrl, navCtrl, loadingCtrl, formBuilder, database) {
        this.authData = authData;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.formBuilder = formBuilder;
        this.database = database;
        this.user = {};
        this.loginForm = formBuilder.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_4__validators_email__["a" /* EmailValidator */].isValid])],
            password: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].minLength(6), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])]
        });
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }
    loginUser() {
        if (!this.loginForm.valid) {
            console.log(this.loginForm.value);
        }
        else {
            this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
                .then(() => {
                let user = __WEBPACK_IMPORTED_MODULE_6_firebase_app__["auth"]().currentUser;
                if (user.emailVerified === false) {
                    this.loading.dismiss().then(() => {
                        let alert = this.alertCtrl.create({
                            message: `Email Not verfied. Please check email and verify before logging in`,
                            buttons: [
                                {
                                    text: "Ok",
                                    role: 'cancel'
                                }
                            ]
                        });
                        alert.present();
                    });
                    this.authData.logoutUser();
                }
                else {
                    this.authData.loginState = true;
                    let uid = user.uid;
                    this.database.users.once("value", (snapshot) => {
                        if (snapshot.val()[uid].roles) {
                            let temp = snapshot.val()[uid].roles;
                            if (temp.admin === true) {
                                this.navCtrl.setRoot('AdminPage');
                            }
                            else {
                                this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__map_map__["a" /* MapPage */]);
                            }
                        }
                    });
                }
            }, error => {
                this.loading.dismiss().then(() => {
                    let alert = this.alertCtrl.create({
                        message: `${error.message} Please try again`,
                        buttons: [
                            {
                                text: "Ok",
                                role: 'cancel'
                            }
                        ]
                    });
                    alert.present();
                });
            });
            this.loading = this.loadingCtrl.create({
                dismissOnPageChange: true,
            });
            this.loading.present();
        }
    }
    createAccount() {
        this.navCtrl.push('SignupPage');
    }
    goToResetPassword() {
        this.navCtrl.push('ResetPasswordPage');
    }
};
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-login',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/login/login.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Login</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content padding>\n  <form [formGroup]="loginForm" (submit)="loginUser()" novalidate>\n\n    <ion-item>\n      <ion-label stacked>Email</ion-label>\n      <ion-input #email formControlName="email" type="email" placeholder="Your email address"\n                 [class.invalid]="!loginForm.controls.email.valid &&\n          loginForm.controls.email.dirty"></ion-input>\n    </ion-item>\n    <ion-item class="error-message" *ngIf="!loginForm.controls.email.valid  &&\n      loginForm.controls.email.dirty">\n      <p>Please enter a valid email.</p>\n    </ion-item>\n\n    <ion-item>\n      <ion-label stacked>Password</ion-label>\n      <ion-input #password formControlName="password" type="password" placeholder="Your password"\n                 [class.invalid]="!loginForm.controls.password.valid &&\n          loginForm.controls.password.dirty"></ion-input>\n    </ion-item>\n    <ion-item class="error-message" *ngIf="!loginForm.controls.password.valid  &&\n      loginForm.controls.password.dirty">\n      <p>Your password needs more than 6 characters.</p>\n    </ion-item>\n\n    <button ion-button block type="submit">\n      Login\n    </button>\n  </form>\n\n\n  <button ion-button block clear (click)="goToResetPassword()">\n    I forgot my password 🙁\n  </button>\n\n  <button ion-button block clear (click)="createAccount()">\n    Create a new account\n  </button>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/login/login.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_7__providers_firebase_firebase__["a" /* FirebaseProvider */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ExplorePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__map_map__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let ExplorePage = class ExplorePage {
    constructor(navCtrl, navParams, http, loading) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.http = http;
        this.loading = loading;
        this.dist = [];
        this.dur = [];
        this.service = new google.maps.DistanceMatrixService();
        this.wrc = new google.maps.LatLng(21.2989380, -157.8185730);
        this.cc = new google.maps.LatLng(21.2984350, -157.8188780);
        this.hamilton = new google.maps.LatLng(21.3004500, -157.8161520);
        this.stanSheriff = new google.maps.LatLng(21.2943550, -157.8186020);
        this.kennedy = new google.maps.LatLng(21.2993160, -157.8150410);
        this.paradisePalms = new google.maps.LatLng(21.3008300, -157.8156720);
        this.qlc = new google.maps.LatLng(21.3001970, -157.8183760);
        this.sinclair = new google.maps.LatLng(21.2984860, -157.8201670);
        this.uhs = new google.maps.LatLng(21.2983360, -157.8152250);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.currentLat = position.coords.latitude;
                this.currentLng = position.coords.longitude;
                this.current = new google.maps.LatLng(this.currentLat, this.currentLng);
            });
            this.showLoading();
        }
        else {
            alert('Location blocked, please try again.');
        }
    }
    //DOES MAPTO FIRST
    /*
     *
     */
    mapTo(value) {
        console.log(value + ' mapto');
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__map_map__["a" /* MapPage */], {
            locationIndex: value.toString(),
            currentLat: this.currentLat,
            currentLng: this.currentLng
        });
    }
    showLocation(value) {
        console.log(value + ' showloc');
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__map_map__["a" /* MapPage */], {
            locationIndex2: value,
            currentLat: this.currentLat,
            currentLng: this.currentLng
        });
    }
    /*
     * Checks if the application has access to the users current location to calculate the distance
     *  from the point of interest
     * @param none
     * @return true - If users current location is accessible
     * @return false - If users current location is inaccessible
     */
    hasCurrLocation() {
        if (this.current) {
            return true;
        }
        else {
            return false;
        }
    }
    /**************** DISTANCE / DURATION FUNCTIONS ****************/
    /*
     * Gets the users distance and duration to the locations on the explore page
     * @param none
     * @return none
     */
    findDistanceAndDuration() {
        setTimeout(() => {
            this.service.getDistanceMatrix({
                origins: [this.current],
                destinations: [this.wrc, this.cc, this.hamilton, this.stanSheriff, this.kennedy, this.paradisePalms, this.qlc, this.sinclair, this.uhs],
                travelMode: google.maps.TravelMode.WALKING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                durationInTraffic: false,
                avoidHighways: false,
                avoidTolls: false
            }, (response, status) => {
                if (status !== google.maps.DistanceMatrixStatus.OK) {
                    console.log('Error:', status);
                }
                else {
                    this.loadDistanceAndDuration(response);
                }
            });
            this.hideLoading();
        }, 5000);
    }
    /*
     * Uses user's current location to load distance to destination
     *  and estimated time to get there
     *  @param {object} data - Distance and location being returned
     *  @return none
     */
    loadDistanceAndDuration(data) {
        console.log(data + ' loadDnD');
        var length = data.rows[0].elements.length;
        for (var i = 0; i < length; i++) {
            this.dist.push("(" + data.rows[0].elements[i].distance.text + ")");
            this.dur.push(data.rows[0].elements[i].duration.text);
        }
    }
    /**************** LOADING ANIMATION FUNCTIONS ****************/
    /*
     * Loads the loader animation and gets the distance and duraition to locations
     * @param none
     * @return none
     */
    showLoading() {
        this.loader = this.loading.create({
            content: "Calculating..."
        });
        this.loader.present();
        this.findDistanceAndDuration();
    }
    /*
     * Dismisses the loader animation
     * @param none
     * @return none
     */
    hideLoading() {
        this.loader.dismiss().catch(() => { });
    }
};
ExplorePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPage */])(),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-explore',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/explore/explore.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Explore</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(147)">\n      <div id="wrc">\n        <div class="card-title">Warrior Rec Center</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="basketball"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Warrior Rec Center is approximately 66,000 sq ft and is considered to be one of the\n        best recreational facilities in the state.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[0]}}</span>\n        <span item-left>{{dist[0]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(147)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(2)">\n      <div id="cc">\n        <div class="card-title">Campus Center</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="pizza"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The campus center offers the university community and the public a wide variety of meeting,\n        dining and entertainment options to enrich campus life and the educational experience.\n        It is the primary venue for programs and events to create an environment where individuals can come and relax,\n        study and be entertained or challenged.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[1]}}</span>\n        <span item-left>{{dist[1]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(2)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(3)">\n      <div id="hamilton">\n        <div class="card-title">Hamilton Library</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="book"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Hamilton Library at the University of Hawaiʻi at Mānoa is the largest research library\n        in the state of Hawaii. The Library serves as a key resource for the flagship Manoa campus as well as the other\n        University of Hawaii system campuses.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[2]}}</span>\n        <span item-left>{{dist[2]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(3)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(130)">\n      <div id="stan-sheriff">\n        <div class="card-title">Stan Sheriff</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="beer"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Stan Sheriff Center opened in 1994 and is the jewel of the Athletics Department. The\n        center has served as the home of the University of Hawai‘i men’s and women’s basketball and volleyball teams and\n        has played host to a number of memorable events.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[3]}}</span>\n        <span item-left>{{dist[3]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(130)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(15)">\n      <div id="kennedy-theatre">\n        <div class="card-title">Kennedy Theatre</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="people"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Kennedy Theatre at the University of Hawai‘i at Manoa is the home base for the\n        productions of the Department of Theatre + Dance.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[4]}}</span>\n        <span item-left>{{dist[4]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(15)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(20)">\n      <div id="paradise-palms">\n        <div class="card-title">Paradise Palms Café</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="pizza"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Paradise Palms Café features six food vendors, an air-conditioned dining room, and an\n        outdoor eating area.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[5]}}</span>\n        <span item-left>{{dist[5]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(20)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(151)">\n      <div id="qlc">\n        <div class="card-title-2">Queen Lili\'uokalani Center</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="person"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The Queen Lili\'uokalani Center, often called QLC, is a center for various student services, including the Office of Admissions, Office of the Registrar, Commuter Services, Financial Aid Services, Mānoa Advising Center, and much more.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[6]}}</span>\n        <span item-left>{{dist[6]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(151)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(4)">\n      <div id="sinclair">\n        <div class="card-title">Sinclair Library</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="book"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">Sinclair Library, a popular place for late-night studying, is the only library open 24 hours on weekdays.</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[7]}}</span>\n        <span item-left>{{dist[7]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(4)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n  <ion-card>\n    <div class="imgContainer" (click)="showLocation(7)">\n      <div id="uhs">\n        <div class="card-title-2">University Health Services</div>\n      </div>\n\n      <ion-fab right top>\n        <button ion-fab>\n          <ion-icon name="medkit"></ion-icon>\n        </button>\n      </ion-fab>\n    </div>\n\n    <ion-card-content>\n      <p class="description">The University Health Services Mānoa offers a wide range of medical services and programs. These include general medical care by appointment or on a walk-in basis; women\'s health, sports medicine, psychiatry, dermatology, and nutrition clinics by appointment</p>\n    </ion-card-content>\n\n    <ion-item>\n      <div class="dd" *ngIf="hasCurrLocation()">\n        <span item-left>{{dur[8]}}</span>\n        <span item-left>{{dist[8]}}</span>\n      </div>\n      <button ion-button icon-left clear item-end (click)="mapTo(7)" *ngIf="hasCurrLocation()">\n        <ion-icon name="navigate"></ion-icon>\n        Start\n      </button>\n    </ion-item>\n  </ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/explore/explore.html"*/,
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]) === "function" && _d || Object])
], ExplorePage);

var _a, _b, _c, _d;
//# sourceMappingURL=explore.js.map

/***/ }),

/***/ 202:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 202;

/***/ }),

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/admin/admin.module": [
		652,
		4
	],
	"../pages/edit-submit-data/edit-submit-data.module": [
		657,
		3
	],
	"../pages/explore/explore.module": [
		656,
		6
	],
	"../pages/login/login.module": [
		655,
		5
	],
	"../pages/points/points.module": [
		658,
		0
	],
	"../pages/reset-password/reset-password.module": [
		654,
		2
	],
	"../pages/signup/signup.module": [
		653,
		1
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 244;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DistanceMatrixService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let DistanceMatrixService = class DistanceMatrixService {
    constructor() {
        this.service = new google.maps.DistanceMatrixService();
    }
    getDistance(start, destination) {
        this.service.getDistanceMatrix({
            origins: [start],
            destinations: [destination],
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            durationInTraffic: false,
            avoidHighways: false,
            avoidTolls: false
        }, (response, status) => {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                console.log('Error:', status);
            }
            else {
                console.log(response);
            }
        });
    }
};
DistanceMatrixService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [])
], DistanceMatrixService);

//# sourceMappingURL=distanceMatrixService.js.map

/***/ }),

/***/ 291:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmitDataLandingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__submit_data_submit_data__ = __webpack_require__(166);
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






let SubmitDataLandingPage = class SubmitDataLandingPage {
    constructor(navCtrl, loading, toast, http) {
        this.navCtrl = navCtrl;
        this.loading = loading;
        this.toast = toast;
        this.http = http;
    }
    ionViewDidLoad() {
    }
    goMainPage() {
        this.token = ({ 'token': true });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__submit_data_submit_data__["a" /* SubmitDataPage */], this.token);
    }
    goMap() {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */]);
    }
};
SubmitDataLandingPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'submit-data-landing-page',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/submit-data-landing/submit-data-landing.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Submit Data</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n    <div style="display: flex; justify-content: center;">\n      <img src="../assets/images/icon.png">\n    </div>\n    <button class="btn" ion-button full (click)="goMainPage()">\n      Use Current Location\n    </button>\n    <button class="btn" ion-button full (click)="goMap()">\n      Browse Map\n    </button>\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/submit-data-landing/submit-data-landing.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
], SubmitDataLandingPage);

//# sourceMappingURL=submit-data-landing.js.map

/***/ }),

/***/ 292:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SubmitDataChooseCoordsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__submit_data_submit_data__ = __webpack_require__(166);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let SubmitDataChooseCoordsPage = class SubmitDataChooseCoordsPage {
    constructor(navCtrl, alertCtrl, loading, http) {
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loading = loading;
        this.http = http;
    }
    ionViewDidLoad() {
        this.loadMap();
    }
    getCoords() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;
        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
        this.loader = this.loading.create({
            content: "Getting Coordinates..."
        });
        this.loader.present().then(() => {
            setTimeout(() => {
                let alert = this.alertCtrl.create({
                    title: 'Submit This Point',
                    subTitle: 'Would you to use the following information to submit your point?',
                    message: `Latitude: ${this.lat}  \n Longitude: ${this.long} \n\n Address: ${this.address}`,
                    buttons: [
                        {
                            text: 'ok',
                            role: 'approve',
                            handler: () => {
                                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__submit_data_submit_data__["a" /* SubmitDataPage */], {
                                    'token': false,
                                    'lat': this.lat,
                                    'long': this.long,
                                    'address': this.address
                                });
                            }
                        },
                        {
                            text: 'cancel',
                            role: 'cancel',
                            handler: () => {
                            }
                        }
                    ],
                });
                alert.present();
                this.loader.dismiss();
            }, 3000);
        });
    }
    getAddress() {
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.long}&key=AIzaSyCeP_xxvneWjyU_0EIg5slVUl3I6TtH4oA`;
        this.http.request(this.url)
            .map(res => res.json()).subscribe(data => {
            this.address = data.results[0].formatted_address;
        });
        return this.address;
    }
    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 18,
            center: { lat: 21.2969, lng: -157.8171 },
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
            },
            styles: [
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "20"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "10"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "25"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ffbb00"
                        },
                        {
                            "saturation": 43.400000000000006
                        },
                        {
                            "lightness": 37.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00FF6A"
                        },
                        {
                            "saturation": -1.0989010989011234
                        },
                        {
                            "lightness": 11.200000000000017
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FFC200"
                        },
                        {
                            "saturation": -61.8
                        },
                        {
                            "lightness": 45.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#24a95a"
                        },
                        {
                            "lightness": "29"
                        },
                        {
                            "saturation": "-58"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 51.19999999999999
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 52
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "hue": "#00b1ff"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00ffda"
                        },
                        {
                            "saturation": "-50"
                        },
                        {
                            "lightness": "25"
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                }
            ]
        });
        google.maps.event.addListener(this.map, 'click', (event) => {
            this.lat = event.latLng.lat();
            this.long = event.latLng.lng();
            this.getCoords();
        });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('map'),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */])
], SubmitDataChooseCoordsPage.prototype, "mapElement", void 0);
SubmitDataChooseCoordsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'submit-data-coords-page',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/submit-data-choose-coords/submit-data-choose-cords.html"*/'<ion-header>\n  <ion-navbar color="primary">\n    <button ion-button menuToggle>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>Submit Data</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <h1>Find Coordinates</h1>\n  <div #map id="map"></div>\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/submit-data-choose-coords/submit-data-choose-cords.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__angular_http__["a" /* Http */]])
], SubmitDataChooseCoordsPage);

//# sourceMappingURL=submit-data-choose-coords.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class EmailValidator {
    static isValid(control) {
        const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(control.value);
        if (re) {
            return null;
        }
        return {
            "invalidEmail": true
        };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EmailValidator;

//# sourceMappingURL=email.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(374);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 374:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(445);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_map_map__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_login_login__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_submit_data__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_choose_coords_submit_data_choose_coords__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_explore_explore__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_angularfire2_auth__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_firebase_config__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__angular_forms__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_submit_data_landing_submit_data_landing__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__ionic_native_geolocation__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__providers_auth_auth__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__services_distanceMatrixService_distanceMatrixService__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__providers_firebase_firebase__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* App */],
            __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_explore_explore__["a" /* ExplorePage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_submit_data_landing_submit_data_landing__["a" /* SubmitDataLandingPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_submit_data__["a" /* SubmitDataPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */],
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* App */], {}, {
                links: [
                    { loadChildren: '../pages/admin/admin.module#AdminPageModule', name: 'AdminPage', segment: 'admin', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/signup/signup.module#SignupPageModule', name: 'SignupPage', segment: 'signup', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/reset-password/reset-password.module#ResetPasswordPageModule', name: 'ResetPasswordPage', segment: 'reset-password', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/explore/explore.module#ExplorePageModule', name: 'ExplorePage', segment: 'explore', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/edit-submit-data/edit-submit-data.module#AdminPageModule', name: 'EditSubmitDataPage', segment: 'edit-submit-data', priority: 'low', defaultHistory: [] },
                    { loadChildren: '../pages/points/points.module#PointsPageModule', name: 'PointsPage', segment: 'points', priority: 'low', defaultHistory: [] }
                ]
            }),
            __WEBPACK_IMPORTED_MODULE_12_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_14__app_firebase_config__["a" /* FIREBASE_CONFIG */]),
            __WEBPACK_IMPORTED_MODULE_13_angularfire2_auth__["b" /* AngularFireAuthModule */],
            __WEBPACK_IMPORTED_MODULE_15__angular_forms__["b" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_15__angular_forms__["e" /* ReactiveFormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* HttpModule */]
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* App */],
            __WEBPACK_IMPORTED_MODULE_5__pages_map_map__["a" /* MapPage */],
            __WEBPACK_IMPORTED_MODULE_6__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_9__pages_explore_explore__["a" /* ExplorePage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_submit_data_landing_submit_data_landing__["a" /* SubmitDataLandingPage */],
            __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_submit_data__["a" /* SubmitDataPage */],
            __WEBPACK_IMPORTED_MODULE_8__pages_submit_data_choose_coords_submit_data_choose_coords__["a" /* SubmitDataChooseCoordsPage */]
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_17__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_splash_screen__["a" /* SplashScreen */],
            {
                provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["v" /* ErrorHandler */],
                useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicErrorHandler */]
            },
            __WEBPACK_IMPORTED_MODULE_18__providers_auth_auth__["a" /* AuthProvider */],
            __WEBPACK_IMPORTED_MODULE_19__services_distanceMatrixService_distanceMatrixService__["a" /* DistanceMatrixService */],
            __WEBPACK_IMPORTED_MODULE_20__providers_firebase_firebase__["a" /* FirebaseProvider */]
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class User {
    constructor(authData, firstName, lastName) {
        this.email = authData.email;
        this.photoURL = authData.photoURL;
        this.displayName = authData.displayName;
        this.roles = { reader: true, author: true };
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = User;

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 445:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return App; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(290);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_map_map__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_login_login__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_explore_explore__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_landing_submit_data_landing__ = __webpack_require__(291);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_angularfire2_auth__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_firebase_firebase__ = __webpack_require__(86);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












const ua = __webpack_require__(446);
Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_20" /* enableProdMode */])();
let App = class App {
    constructor(platform, afAuth, statusBar, splashScreen, authData, database) {
        this.platform = platform;
        this.afAuth = afAuth;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.authData = authData;
        this.database = database;
        this.initializeApp();
        this.pages = [
            {
                title: 'Map',
                icon: 'map',
                component: __WEBPACK_IMPORTED_MODULE_4__pages_map_map__["a" /* MapPage */]
            },
            {
                title: 'Explore',
                icon: 'glasses',
                component: __WEBPACK_IMPORTED_MODULE_6__pages_explore_explore__["a" /* ExplorePage */]
            },
            {
                title: 'Submit',
                icon: 'send',
                component: __WEBPACK_IMPORTED_MODULE_7__pages_submit_data_landing_submit_data_landing__["a" /* SubmitDataLandingPage */]
            },
        ];
        this.afAuth.authState.subscribe(auth => this.currentUser = auth); // user info is inside auth object
    }
    initializeApp() {
        const visitor = ua('UA-106620204-1');
        visitor.pageview("/").send();
        this.platform.ready().then(() => {
            this.splashScreen.show();
            this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_map_map__["a" /* MapPage */];
            this.statusBar.styleDefault();
        });
    }
    openPage(page) {
        // Reset the content nav to have just this page, we wouldn't want the back button to show up in this scenario
        this.nav.setRoot(page.component);
    }
    logOut() {
        this.authData.loginState = false;
        this.afAuth.auth.signOut();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_map_map__["a" /* MapPage */]);
    }
    logIn() {
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_5__pages_login_login__["a" /* LoginPage */]);
    }
    adminPage() {
        let uid = this.currentUser.uid;
        this.database.users.once("value", (snapshot) => {
            if (snapshot.val()[uid].roles) {
                let temp = snapshot.val()[uid].roles;
                if (temp.admin === true) {
                    this.nav.setRoot('AdminPage');
                }
            }
        });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* Nav */])
], App.prototype, "nav", void 0);
App = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/app/app.html"*/'<ion-menu [content]="content">\n\n  <ion-content>\n    <img src="../assets/images/logo.jpg">\n    <hr>\n    <ion-list class="item">\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        <ion-icon class="menu-icon" name="{{ p.icon }}"></ion-icon>\n        {{p.title}}\n      </button>\n      <button menuClose ion-item  *ngIf="authData.loginState" (click)="logOut()">\n        <ion-icon class="menu-icon" name="person"></ion-icon>\n        Log Out\n      </button>\n      <button menuClose ion-item  *ngIf="!authData.loginState" (click)="logIn()">\n        <ion-icon class="menu-icon" name="person"></ion-icon>\n        Log In\n      </button>\n    </ion-list>\n    <button center menuClose ion-item class="user" *ngIf="authData.loginState" (click)="adminPage()">\n      You are logged in as {{currentUser.displayName}}\n    </button>\n  </ion-content>\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/app/app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_8_angularfire2_auth__["a" /* AngularFireAuth */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__["a" /* AuthProvider */], __WEBPACK_IMPORTED_MODULE_10__providers_firebase_firebase__["a" /* FirebaseProvider */]])
], App);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 490:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 491:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 560:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_firebase_config__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_fuse_js__ = __webpack_require__(419);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_fuse_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_fuse_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_distanceMatrixService_distanceMatrixService__ = __webpack_require__(249);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let stash = []; // Array to contain Markers on the map
let timedStash = [];
let MapPage = class MapPage {
    constructor(navCtrl, navParams, loading, http, geolocation, distanceMatrixService) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loading = loading;
        this.http = http;
        this.geolocation = geolocation;
        this.distanceMatrixService = distanceMatrixService;
        this.locationsList = []; //array to populate menu with\
        this.typeList = ["Classroom", "Food", "Entertainment", "Housing", "Library", "Parking", "Recreational", "Service", "Bathroom"];
        this.changeIcon = false;
        this.isSearching = false;
        this.isInfoWindowOpen = false;
        this.searchingStart = false;
        this.inRoute = false;
        /*
         * Sets up the search parameters for fuzzy search
         */
        this.fuseOptions = {
            caseSensitive: false,
            keys: ['address', 'description', 'name', 'type'],
            threshold: 0.5,
            shouldSort: true,
        };
        /*
         * Holds icon SVG data and styling
         */
        this.icons = {
            food: {
                // Spoon and fork icon
                path: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z',
                fillColor: '#fea3aa',
                strokeColor: '#CA3157',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            drink: {
                // Drink glass icon
                path: 'M6 4l4.03 36.47C10.26 42.46 11.95 44 14 44h20c2.05 0 3.74-1.54 3.97-3.53L42 4H6zm18 34c-3.31 0-6-2.69-6-6 0-4 6-10.8 6-10.8S30 28 30 32c0 3.31-2.69 6-6 6zm12.65-22h-25.3l-.88-8h27.07l-.89 8z',
                fillColor: '#fea3aa',
                strokeColor: '#CA3157',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            classroom: {
                // School icon
                path: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
                fillColor: '#518A61',
                strokeColor: '#007c34',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            entertainment: {
                // Event seat icon
                path: 'M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3H7V5c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2v8z',
                fillColor: '#b19cd9',
                strokeColor: '#4E2683',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            housing: {
                // Home icon
                path: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
                fillColor: '#fdfd96',
                strokeColor: '#FFB804',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            library: {
                // Library icon
                path: 'M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z',
                fillColor: '#8BDBCD',
                strokeColor: '#229298',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            parking: {
                // Local parking icon
                path: 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z',
                fillColor: '#ff6961',
                strokeColor: '#8B0000',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            recreational: {
                // Local event icon
                path: 'M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-4.42 4.8L12 14.5l-3.58 2.3 1.08-4.12-3.29-2.69 4.24-.25L12 5.8l1.54 3.95 4.24.25-3.29 2.69 1.09 4.11z',
                fillColor: '#b2cefe',
                strokeColor: '#006ECE',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            service: {
                // Business center icon
                path: 'M10 16v-1H3.01L3 19c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-4h-7v1h-4zm10-9h-4.01V5l-2-2h-4l-2 2v2H4c-1.1 0-2 .9-2 2v3c0 1.11.89 2 2 2h6v-2h4v2h6c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-6 0h-4V5h4v2z',
                fillColor: '#f8b88b',
                strokeColor: '#CA4729',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
            bathroom: {
                // wc icon
                path: 'M5.5 22v-7.5H4V9c0-1.1.9-2 2-2h3c1.1 0 2 .9 2 2v5.5H9.5V22h-4zM18 22v-6h3l-2.54-7.63C18.18 7.55 17.42 7 16.56 7h-.12c-.86 0-1.63.55-1.9 1.37L12 16h3v6h3zM7.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm9 0c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2z',
                fillColor: '#B8BDB9',
                strokeColor: '#000000',
                strokeWeight: 0.5,
                fillOpacity: 0.8,
            },
        };
        this.exploreIndex = navParams.get('locationIndex');
        this.exploreIndex2 = navParams.get('locationIndex2');
        this.currentLat = navParams.get('currentLat');
        this.currentLng = navParams.get('currentLng');
        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
        this.geolocation.getCurrentPosition().then((resp) => {
            this.currentLat = resp.coords.latitude;
            this.currentLng = resp.coords.longitude;
        }).catch((error) => {
            console.log('Error getting location', error);
        });
        if (!__WEBPACK_IMPORTED_MODULE_2_firebase__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_2_firebase__["initializeApp"](__WEBPACK_IMPORTED_MODULE_1__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            this.App = __WEBPACK_IMPORTED_MODULE_2_firebase__["app"]();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("testPoints");
    }
    /**************** PAGE LOADING FUNCTION ****************/
    /*
     * Prepares the map page for use (onload)
     *  Loads all the data from firebase, loads the map, gets user geolocation, and places the
     *  user marker
     *  @param none
     *  @return none
     */
    ionViewDidLoad() {
        this.loadTagData(); // Load all the data from firebase once
        this.loadMap();
        this.getLatLng();
        this.placeTimedMarker();
    }
    /**************** IONIC SEARCH MENU FUNCTIONS ****************/
    /*
     * Searches for a point in the ionic search menu
     * @param {string} input - Value given by the user through the ionic search menu
     * @return none
     */
    searchPoints(input) {
        this.isSearching = true;
        let fuse = new __WEBPACK_IMPORTED_MODULE_6_fuse_js__(this.searchList, this.fuseOptions);
        if (input === '') {
            this.searchList = this.geoMarkers;
        }
        else {
            this.searchList = fuse.search(input);
        }
    }
    /*
     * Stops the search menu
     * @param none
     * @return none
     */
    stopSearch() {
        this.isSearching = false;
    }
    /*
     * Turns isSeacrching to true and shows all the matching searches in the ionic menu
     * @param none
     * @return none
     */
    showSearch() {
        this.isSearching = true;
    }
    /**************** RETRIEVING DATA FROM FIREBASE FUNCTIONS ****************/
    /*
     * Lodas locationList for populating selector menus Called in loadTags();
     * @param - none
     * @return - none
     */
    loadLocationsList() {
        for (let i = 0; i <= this.geoMarkers.length - 1; i++) {
            this.locationsList.push({
                value: i,
                text: this.geoMarkers[i].name
            });
        }
    }
    /*
     * Retrieves the tags from Firebase and populates them on the map
     * @param - none
     * @return - none
     */
    loadTagData() {
        // Load the tag data into the geoMarkers variable
        this.geoMarkers = [];
        this.ref.once("value")
            .then((dataPoints) => {
            dataPoints.forEach((dataPoint) => {
                this.geoMarkers.push({
                    key: dataPoint.key,
                    address: dataPoint.val().address,
                    description: dataPoint.val().description,
                    lat: dataPoint.val().lat,
                    lng: dataPoint.val().lng,
                    name: dataPoint.val().name,
                    number: dataPoint.val().number,
                    website: dataPoint.val().website,
                    type: dataPoint.val().type.toLowerCase(),
                });
            });
        })
            .then(() => {
            //
            // DOES THIS FOR THE EXPLORE
            //
            if (this.exploreIndex && this.currentLat && this.currentLng) {
                this.createExpRoute();
            }
            else if (!this.exploreIndex && this.exploreIndex2) {
                this.addExpMarker(this.exploreIndex2);
            }
            this.searchList = this.geoMarkers.slice();
            this.loadLocationsList();
        });
    }
    /**************** MARKER PLACING FUNCTIONS ****************/
    /*
     * Adds a marker / point to the map containing the info in the form of a info window
     * @param {object} location - Location object containing necessary location data
     * @param {int} location.key - Key index that the location is at (used to retrieve indexed images)
     * @param {int} location.lat - Latitude value of the given location
     * @param {int} location.lng - Longitude value of the given location
     * @param {string} location.type - Holds info for the icon type of the marker
     * @param {string} location.name - Name of the given location
     * @return none
     */
    addMarker(location) {
        this.stopSearch();
        const geoData = this.geoMarkers.slice();
        const imgIndex = location.key;
        this.endValue = {
            lat: location.lat, lng: location.lng
        };
        this.marker = new google.maps.Marker({
            position: this.endValue,
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.icons[location.type],
        });
        let info = this.getInfoWindowData(location);
        this.infoWindow = new google.maps.InfoWindow({
            content: info,
            maxWidth: 350
        });
        google.maps.event.addListener(this.infoWindow, 'domready', (() => {
            document.getElementById("infoIcon").addEventListener("click", () => {
                this.navCtrl.push("PointsPage", location);
            });
        }));
        this.infoWindow.open(this.map, this.marker);
        this.isInfoWindowOpen = true;
        this.streetTag = new google.maps.InfoWindow({
            content: '<div style="color: #259975" class="street-tag">' + location.name + '</div>',
        });
        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
        }));
    }
    /*
     * Adds a marker / point to the map from the explore page
     * @param {object} location - Location object containing necessary location data
     * @param {int} location.key - Key index that the location is at (used to retrieve indexed images)
     * @param {int} location.lat - Latitude value of the given location
     * @param {int} location.lng - Longitude value of the given location
     * @param {string} location.type - Holds info for the icon type of the marker
     * @param {string} location.name - Name of the given location
     * @return none
     */
    addExpMarker(index) {
        const geoData = this.geoMarkers.slice();
        const location = geoData[index];
        this.endValue = { lat: location.lat, lng: location.lng };
        this.marker = new google.maps.Marker({
            position: this.endValue,
            title: 'University of Hawaii at Manoa',
            map: this.map,
            icon: this.icons[location.type],
        });
        let info = this.getInfoWindowData(location);
        this.infoWindow = new google.maps.InfoWindow({
            content: info,
            maxWidth: 350
        });
        this.infoWindow.open(this.map, this.marker);
        this.isInfoWindowOpen = true;
        this.streetTag = new google.maps.InfoWindow({
            content: '<div style="color: #259975" class="street-tag">' + location.name + '</div>',
        });
        google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
            this.isInfoWindowOpen = false;
        }));
    }
    /*
     * Creates info window when a marker is selected or added
     * @param {Object} location - Location that is selected
     * @param {string} location.name - Name of the selected location
     * @param {int} location.key - Key given to indexed location
     * @param {string} location.description - Description of the selected location
     * @param {string} location.address - Address of the selected location
     * @param {string} location.number - Phone number of the selected location
     *
     * @return {Object} infoContent - HTML info window object to display
     */
    getInfoWindowData(location) {
        console.log(location);
        let imgSrc;
        let infoContent = '<div class="ui grid windowContainer">';
        if (location.name) {
            if (location.name.toLowerCase() == 'n/a') {
                location.name = '';
            }
            infoContent += '<div id="windowHead">' + location.name + '</div>';
        }
        if (location.key) {
            if (location.key > 163) {
                imgSrc = "../../assets/images/uhLogo.jpg";
            }
            else {
                if (!isNaN(location.key)) {
                    imgSrc = "https://manoanow.org/app/map/images/" + location.key + ".png";
                }
                else {
                    imgSrc = "../../assets/images/uhLogo.jpg";
                }
            }
            infoContent += '<img class="ui fluid image info" src="' + imgSrc + '">';
        }
        if (location.description) {
            if (location.description.toLowerCase() == 'n/a') {
                location.description = '';
            }
            else {
                infoContent += '<div id="windowDesc">' + location.description + '</div>';
            }
        }
        if (location.address) {
            if (location.address.toLowerCase() == 'n/a') {
                location.address = '';
            }
            else {
                infoContent += '<div id="windowAddress"><span style="font-weight: bold; color: #259975;">Address: </span>' + location.address + '</div>';
            }
        }
        if (location.number) {
            if (location.number.toString().toLowerCase() == 'n/a') {
                location.number = '';
            }
            else {
                infoContent += '<div id="windowPhone"><span style="font-weight: bold; color: #259975;">Phone: </span>' + location.number + '</div>';
            }
        }
        infoContent += '<i id="infoIcon">' + '&#9432;' + '</i>';
        infoContent += '</div>';
        return infoContent;
    }
    /*
     * Places the current location marker of the user
     * @param none
     * @return none
     */
    placeTimedMarker() {
        var uh = { lat: 21.3159, lng: 157.8033 };
        this.marker = new google.maps.Marker({
            position: uh,
            map: this.map,
            animation: google.maps.Animation.BOUNCE
        });
        timedStash.push(this.marker);
        setTimeout(function () {
            if (timedStash) {
                for (let i = 0; i < timedStash.length; i++) {
                    timedStash[i].setMap(null);
                }
                timedStash.length = 0;
                this.changeIcon = false;
            }
            else {
                console.log('Stash array does not exist!');
            }
        }, 2000);
    }
    /**************** DIRECTION ROUTING FUNCTIONS ****************/
    /*
     * Creates direction display from users current location to the end location
     * @param none
     * @return none
     */
    directFromCurrentLocation() {
        this.searchingStart = false;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);
        let origin = this.latLng;
        let destination = this.endValue;
        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    /*
     * Creates direction display from a given location to the end location
     * @param {Object} location - Location being directed from
     * @param {int} location.lat - Latitude of starting location
     * @param {int} location.lng - Longitude of starting location
     */
    directFromLocation(location) {
        this.searchingStart = false;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);
        let origin = { lat: location.lat, lng: location.lng };
        let destination = this.endValue;
        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, (response, status) => {
            if (status === 'OK') {
                this.directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    /*
     * Initializes the Google maps directions routing from the expxlore page
     * @param none
     * @return none
     */
    createExpRoute() {
        this.clearRoute();
        this.inRoute = true;
        this.isInfoWindowOpen = true;
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);
        this.calculateAndDisplayExpRoute(this.directionsService, this.directionsDisplay);
    }
    /*
     * Calculates the shortest distance to the destination using Google Directions Matrix API
     * and displays the route on the map from the explore page
     * @param {object] directionsService - directionsService provided by the Google directions API
     * @param {object} directionsDisplay - directionsDisplay provided by the Google directions API
     * @return none
     */
    calculateAndDisplayExpRoute(directionsService, directionsDisplay) {
        const geoData = this.geoMarkers;
        let origin = { lat: this.currentLat, lng: this.currentLng };
        let destination = { lat: geoData[this.exploreIndex].lat, lng: geoData[this.exploreIndex].lng };
        this.addMarker(geoData[this.exploreIndex]);
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: 'WALKING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsDisplay.setDirections(response);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
    /*
     * Clears direction display route by setting it to null
     * @param none
     * @return none
     */
    clearRoute() {
        if (this.directionsDisplay != null) {
            this.directionsDisplay.setMap(null);
            this.directionsDisplay = null;
        }
    }
    /**************** SEARCH STARTING / STOPPING FUNCTIONS ****************/
    /*
     * Starts search for the directional routing to a point on the map
     * Clears all routes, markers, and infoWindows on the map
     * @param none
     * @return none
     */
    searchStart() {
        if (!this.inRoute) {
            if (this.marker) {
                this.marker.setMap(null);
            }
            this.clearAllMarkers();
            this.inRoute = true;
            this.searchingStart = true;
        }
        else {
            this.clearRoute();
            if (this.infoWindow) {
                this.infoWindow.close();
                this.marker.setMap(null);
            }
            this.isInfoWindowOpen = false;
            this.inRoute = false;
            this.searchingStart = false;
            this.stopTrack();
            this.showCurrLocation();
        }
    }
    /*
     * Stops the direction routing to a point on the map
     * Sets infoWindow, routes, and searching to false to clear the map
     * @param none
     * @return none
     */
    searchStop() {
        this.isInfoWindowOpen = false;
        this.inRoute = false;
        this.searchingStart = false;
        this.showCurrLocation();
    }
    /**************** STREETVIEW FUNCTIONS ****************/
    /*
     * Toggles streetview on and off
     * @param none
     * @return none
     */
    toggleStreetView() {
        this.panorama.setPosition(this.endValue);
        if (!this.inStreetView()) {
            if (this.infoWindow && this.marker && this.streetTag) {
                this.infoWindow.close();
                this.marker.setMap(this.panorama);
                this.streetTag.open(this.panorama, this.marker);
            }
            this.panorama.setVisible(true);
        }
        else {
            if (this.infoWindow && this.marker && this.streetTag) {
                this.streetTag.close();
                this.marker.setMap(this.map);
                this.infoWindow.open(this.map, this.marker);
            }
            this.panorama.setVisible(false);
        }
    }
    /*
     * Checks if streetview is currently in use
     * @param none
     * @return true - If streetview is in use
     *         false - If streetview is not in use
     */
    inStreetView() {
        if (this.panorama) {
            if (this.panorama.getVisible()) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    /**************** FILTERING FUNCTIONS ****************/
    /*
     * Opens the filtering menu
     * @param none
     * @return none
     */
    doFilter() {
        this.filterSelect.open();
    }
    /*
     * Filters the markers by the category selected and adds them to the map
     * @param {string} category - Category to filter by
     * @return none
     */
    filterMarker(category) {
        let criteria = category.charAt(0).toLowerCase() + category.slice(1);
        // For "dual-layered" filtering clean out the "changeAllMarkers call"
        this.clearAllMarkers();
        this.changeIcon = true;
        this.infoWindow = new google.maps.InfoWindow({
            maxWidth: 350
        });
        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i], latLng = new google.maps.LatLng(data.lat, data.lng);
            if (data.type === criteria) {
                // Creating a marker and putting it on the map
                this.marker = new google.maps.Marker({
                    position: latLng,
                    map: this.map,
                    icon: this.icons[data.type],
                });
                // Push into a Markers array
                stash.push(this.marker);
                let info = this.getInfoWindowData(data);
                google.maps.event.addListener(this.marker, 'click', (() => {
                    this.infoWindow.setContent(info);
                    this.isInfoWindowOpen = true;
                    this.marker.setPosition({ lat: data.lat, lng: data.lng });
                    this.infoWindow.open(this.map, this.marker);
                    document.getElementById("infoIcon").addEventListener("click", () => {
                        this.navCtrl.push("PointsPage", data);
                    });
                    this.endValue = latLng;
                    this.streetTag = new google.maps.InfoWindow({
                        content: '<div style="color: #259975" class="street-tag">' + data.name + '</div>',
                    });
                }));
                google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
                    this.isInfoWindowOpen = false;
                }));
            }
            else {
                console.log("Category: " + criteria + " does not exist!");
            }
        }
        this.map.setCenter({ lat: 21.2969, lng: -157.8171 });
        this.map.setZoom(15);
    }
    /**************** MARKER CLEARING AND PLACING FUNCTIONS ****************/
    /*
     *  Called by HTML file that changes the state of the add / remove marker button
     *      calls clearAllMarkers or placeAllMarkers based on state of the button
     *  @param - None
     */
    changeAllMarkers() {
        if (this.changeIcon === true) {
            this.clearAllMarkers();
        }
        else {
            this.changeIcon = true;
            this.placeAllMarkers();
        }
    }
    /*
     * Clears all data points on the map
     * @param - None
     */
    clearAllMarkers() {
        if (stash) {
            for (let i = 0; i < stash.length; i++) {
                stash[i].setMap(null);
            }
            stash.length = 0;
            this.changeIcon = false;
        }
        else {
            console.log('Stash array does not exist!');
        }
    }
    /*
     * Places all data points on the map
     * @param - None
     */
    placeAllMarkers() {
        this.clearAllMarkers();
        this.infoWindow = new google.maps.InfoWindow({
            maxWidth: 350
        });
        this.placeTimedMarker();
        for (let i = 0, length = this.geoMarkers.length; i < length; i++) {
            let data = this.geoMarkers[i], latLng = new google.maps.LatLng(data.lat, data.lng);
            // Creating a marker and putting it on the map
            this.marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                icon: this.icons[data.type],
            });
            stash.push(this.marker);
            let info = this.getInfoWindowData(data);
            google.maps.event.addListener(this.marker, 'click', (() => {
                this.infoWindow.setContent(info);
                this.isInfoWindowOpen = true;
                this.marker.setPosition({ lat: data.lat, lng: data.lng });
                this.marker.setIcon(this.icons[data.type]);
                this.infoWindow.open(this.map, this.marker);
                document.getElementById("infoIcon").addEventListener("click", () => {
                    this.navCtrl.push("PointsPage", data);
                });
                this.endValue = latLng;
                this.streetTag = new google.maps.InfoWindow({
                    content: '<div style="color: #259975" class="street-tag">' + data.name + '</div>',
                });
            }));
            google.maps.event.addListener(this.infoWindow, 'closeclick', (() => {
                this.isInfoWindowOpen = false;
            }));
            this.changeIcon = true;
            this.map.setCenter({ lat: 21.2969, lng: -157.8171 });
            this.map.setZoom(15);
        }
        setTimeout(function () {
            if (stash) {
                for (let i = 0; i < stash.length; i++) {
                    stash[i].setMap(null);
                }
                stash.length = 0;
                this.changeIcon = false;
            }
            else {
                console.log('Stash array does not exist!');
            }
            // Markers disappear after 200000 seconds (proof of concept for timed events
        }, 200000);
    }
    /*
     * Gets latitude and longitude of the users current location
     * @param - None
     */
    /**************** USER LOCATION FUNCTIONS ****************/
    getLatLng() {
        if (this.currentLat && this.currentLng && !this.latLng) {
            this.latLng = {
                lat: this.currentLat,
                lng: this.currentLng
            };
        }
        else if (!this.latLng) {
            this.loader = this.loading.create({
                content: "Getting Coordinates..."
            });
            if (navigator.geolocation) {
                this.loader.present().then(() => {
                    navigator.geolocation.getCurrentPosition((position) => {
                        this.currentLat = position.coords.latitude;
                        this.currentLng = position.coords.longitude;
                        this.latLng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        this.loader.dismiss();
                    }, (err) => {
                        console.log(err);
                        this.getLatLng();
                    }, { enableHighAccuracy: true, timeout: 12 * 1000, maximumAge: 0 });
                });
            }
        }
    }
    /*
     * Places marker at users current latitude / longitude location using HTML5 geolocation
     * @param - None
     */
    showCurrLocation() {
        if (this.latLng) {
            this.userMarker.setMap(this.map);
            this.map.setCenter(this.latLng);
            this.userMarker.setPosition(this.latLng);
            this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
            this.map.setZoom(17);
        }
    }
    /*
     * Uses HTML5 Geolocation to track latitude and longitude of the user
     * @param none
     * @return none
     */
    trackLocation() {
        this.navId = navigator.geolocation.watchPosition((position) => {
            var newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            if (this.userMarker) {
                this.userMarker.setPosition(newPoint);
                this.userMarker.setMap(this.map);
                this.map.setZoom(17);
                this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
            }
            this.map.setZoom(17);
            this.map.setCenter(newPoint);
        }, (error) => {
            console.log(error);
        }, {
            timeout: 5000
        });
    }
    /*
     * Stops the HTML5 Geolocation tracking of the user
     * @param none
     * @return none
     */
    stopTrack() {
        navigator.geolocation.clearWatch(this.navId);
        this.userMarker.setMap(null);
    }
    /**************** MAP LOADING FUNCTIONS ****************/
    /*
     * Loads Google Maps API with custom features and styling
     * @param none
     * @return none
     */
    loadMap() {
        this.map = new google.maps.Map(this.mapElement.nativeElement, {
            zoom: 15,
            zoomControl: false,
            fullscreenControl: false,
            center: {
                lat: 21.2969, lng: -157.8171
            },
            mapTypeControlOptions: {
                mapTypeIds: ['styled_map']
            },
            styles: [
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "20"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "10"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative.locality",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        },
                        {
                            "lightness": "25"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ffbb00"
                        },
                        {
                            "saturation": 43.400000000000006
                        },
                        {
                            "lightness": 37.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00FF6A"
                        },
                        {
                            "saturation": -1.0989010989011234
                        },
                        {
                            "lightness": 11.200000000000017
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                // Remove the next five if we want labels back
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.text.stroke",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FFC200"
                        },
                        {
                            "saturation": -61.8
                        },
                        {
                            "lightness": 45.599999999999994
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#24a95a"
                        },
                        {
                            "lightness": "29"
                        },
                        {
                            "saturation": "-58"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 51.19999999999999
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#FF0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 52
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "transit.station",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "hue": "#00b1ff"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00ffda"
                        },
                        {
                            "saturation": "-50"
                        },
                        {
                            "lightness": "25"
                        },
                        {
                            "gamma": 1
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        },
                        {
                            "lightness": "30"
                        }
                    ]
                }
            ]
        });
        this.panorama = new google.maps.StreetViewPanorama(document.getElementById('map'), {
            addressControl: false,
            panControl: false,
            enableCloseButton: false,
            zoomControl: false
        });
        this.panorama.setVisible(false);
        this.map.setStreetView(this.panorama);
        // Set up a default marker.
        this.userMarker = new google.maps.Marker({
            position: {
                lat: 21.2969, lng: -157.8171
            },
            title: 'University of Hawaii at Manoa',
            icon: {
                // Walking Directions
                path: 'M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7',
                fillColor: '#1B9A74',
                strokeColor: 'darkgreen',
                fillOpacity: 0.8,
                scale: 1.75
            }
        });
        this.userMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('map'),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ElementRef */]) === "function" && _a || Object)
], MapPage.prototype, "mapElement", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_13" /* ViewChild */])('filterSelect'),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["l" /* Select */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["l" /* Select */]) === "function" && _b || Object)
], MapPage.prototype, "filterSelect", void 0);
MapPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'page-map',template:/*ion-inline-start:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/map/map.html"*/'<ion-header>\n</ion-header>\n\n<ion-content>\n\n  <div *ngIf="!isSearching && !inStreetView()" id="float-button-left-top">\n    <button ion-button clear menuToggle>\n      <ion-icon id="menu-icon" large name="menu"></ion-icon>\n    </button>\n  </div>\n\n  <div id="float-button-right-top" *ngIf="!isSearching && !inStreetView()">\n    <button ion-button clear id="search-button" (click)="showSearch()">\n      <ion-icon name="search"></ion-icon>\n    </button>\n  </div>\n\n\n  <div *ngIf="isSearching" class="search">\n    <ion-searchbar showCancelButton\n                   [(ngModel)]="input"\n                   (ionInput)="searchPoints(input)"\n                   (ionCancel)="stopSearch($event)"\n                   placeholder="Search for a location"></ion-searchbar>\n\n    <ion-scroll class="scrollable" scrollY="true">\n      <ion-list>\n        <ion-item class="search-item" *ngFor="let location of searchList" (click)="addMarker(location)">\n          {{location.name}}\n        </ion-item>\n      </ion-list>\n    </ion-scroll>\n  </div>\n\n  <div *ngIf="searchingStart" class="search">\n    <ion-searchbar showCancelButton\n                   [(ngModel)]="input"\n                   (ionInput)="searchPoints(input)"\n                   (ionCancel)="searchStop($event)"\n                   placeholder="Select starting location"></ion-searchbar>\n\n    <ion-scroll class="scrollable" scrollY="true">\n      <ion-list>\n        <ion-item class="current-location" *ngIf="latLng" (click)="directFromCurrentLocation()">\n          <ion-icon name="locate"></ion-icon>\n          Current Location\n        </ion-item>\n        <ion-item class="search-item" *ngFor="let location of searchList" (click)="directFromLocation(location)">\n          {{location.name}}\n        </ion-item>\n      </ion-list>\n    </ion-scroll>\n  </div>\n\n  <div id="float-button-left-bottom">\n    <button *ngIf="isInfoWindowOpen && !inStreetView()" ion-fab mini (click)="searchStart()">\n      <ion-icon [name]="inRoute ? \'hand\' :\'navigate\'"></ion-icon>\n    </button>\n    <button *ngIf="!isSearching && !isInfoWindowOpen && !inStreetView()" ion-fab mini (click)="changeAllMarkers()">\n      <ion-icon [name]="changeIcon ? \'remove\' :\'add\'"></ion-icon>\n    </button>\n    <button *ngIf="!isSearching && !isInfoWindowOpen && !inStreetView()" ion-fab mini (click)="showCurrLocation()">\n      <ion-icon name="locate"></ion-icon>\n    </button>\n    <button *ngIf="(!isSearching && isInfoWindowOpen) || inStreetView()" ion-fab mini (click)="toggleStreetView()">\n      <ion-icon name="eye"></ion-icon>\n    </button>\n    <button *ngIf="!isSearching && !isInfoWindowOpen && !inStreetView()" ion-fab mini (click)="doFilter()">\n      <ion-icon name="funnel"></ion-icon>\n    </button>\n  </div>\n\n  <div #map id="map"></div>\n\n  <ion-select #filterSelect [(ngModel)]="filter" multiple="false" #C (ionChange)="filterMarker(C.value)" cancelText="Cancel"\n              okText="Filter">\n    <ion-option *ngFor="let item of typeList" value="{{item}}">{{item}}</ion-option>\n  </ion-select>\n\n</ion-content>\n'/*ion-inline-end:"/Users/brendtmcfeeley/Documents/GitHub/Wayfinder/src/pages/map/map.html"*/,
    }),
    __metadata("design:paramtypes", [typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["i" /* NavController */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavParams */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["j" /* NavParams */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* LoadingController */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["g" /* LoadingController */]) === "function" && _e || Object, typeof (_f = typeof __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */]) === "function" && _f || Object, typeof (_g = typeof __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__["a" /* Geolocation */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_7__ionic_native_geolocation__["a" /* Geolocation */]) === "function" && _g || Object, typeof (_h = typeof __WEBPACK_IMPORTED_MODULE_8__services_distanceMatrixService_distanceMatrixService__["a" /* DistanceMatrixService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__services_distanceMatrixService_distanceMatrixService__["a" /* DistanceMatrixService */]) === "function" && _h || Object])
], MapPage);

var _a, _b, _c, _d, _e, _f, _g, _h;
//# sourceMappingURL=map.js.map

/***/ }),

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_firebase_config__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let FirebaseProvider = class FirebaseProvider {
    constructor(http) {
        this.http = http;
        if (!__WEBPACK_IMPORTED_MODULE_4_firebase__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_4_firebase__["initializeApp"](__WEBPACK_IMPORTED_MODULE_3__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            this.App = __WEBPACK_IMPORTED_MODULE_4_firebase__["app"]();
        }
        this.db = this.App.database();
        this.userInput = this.db.ref('/dataPoints/');
        this.masterData = this.db.ref('/testPoints');
        this.users = this.db.ref('/users');
        console.log(this.masterData);
    }
};
FirebaseProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], FirebaseProvider);

//# sourceMappingURL=firebase.js.map

/***/ }),

/***/ 87:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_user__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_firebase_config__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of__ = __webpack_require__(415);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap__ = __webpack_require__(417);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs_add_operator_switchMap__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









let AuthProvider = class AuthProvider {
    constructor(afAuth) {
        this.afAuth = afAuth;
        //used as a global variable to display different views for logged in users
        //maybe change to behaviorsubject...
        this.loginState = false;
        this.user = new __WEBPACK_IMPORTED_MODULE_5_rxjs_BehaviorSubject__["BehaviorSubject"](null);
        if (!__WEBPACK_IMPORTED_MODULE_3_firebase_app__["apps"].length) {
            this.App = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["initializeApp"](__WEBPACK_IMPORTED_MODULE_6__app_firebase_config__["a" /* FIREBASE_CONFIG */]);
        }
        else {
            this.App = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["app"]();
        }
        this.db = this.App.database();
        this.ref = this.db.ref("users");
        afAuth.authState.subscribe((user) => {
            this.currentUser = user;
        });
    }
    loginUser(newEmail, newPassword) {
        return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
    }
    resetPassword(email) {
        return this.afAuth.auth.sendPasswordResetEmail(email);
    }
    logoutUser() {
        return this.afAuth.auth.signOut();
    }
    signupUser(newEmail, newPassword) {
        return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
    }
    createUser(newFirstName, newLastName) {
        let user = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"]().currentUser;
        //updating the firebase default user accounts
        if (user) {
            user.updateProfile({
                displayName: `${newFirstName} ${newLastName}`,
                photoURL: "",
            }).then(() => {
                //creates an entry in the user db with the same uid as the authenticated account
                const userData = new __WEBPACK_IMPORTED_MODULE_4__models_user__["a" /* User */](user, newFirstName, newLastName);
                this.db.ref("users").child(user.uid).set(userData);
            }).catch(function (error) {
                console.log(error);
            });
        }
        user.sendEmailVerification().then(function () {
            console.log("work?");
        }).catch(function (error) {
            console.log(error);
            console.log("fail");
        });
    }
    //currently not working because of async, need to fix
    getUserRoles() {
        let user = __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"]().currentUser;
        let uid = user.uid;
        let roles = {};
        this.ref.once("value", (snapshot) => {
            if (snapshot.val()[uid].roles) {
                let temp = snapshot.val()[uid].roles;
                // let roles = {admin: temp.admin ? true: false};
                roles = temp;
            }
        });
        return roles;
    }
};
AuthProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */]])
], AuthProvider);

//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBwEarQZ-Z5DBO7UyZoxSUxYsdOVWJAh_I",
    authDomain: "hacc2017-4c641.firebaseapp.com",
    databaseURL: "https://hacc2017-4c641.firebaseio.com",
    projectId: "hacc2017-4c641",
    storageBucket: "",
    messagingSenderId: "79619520095"
};
/* harmony export (immutable) */ __webpack_exports__["a"] = FIREBASE_CONFIG;

//# sourceMappingURL=app.firebase.config.js.map

/***/ })

},[357]);
//# sourceMappingURL=main.js.map