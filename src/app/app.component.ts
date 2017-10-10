import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MapPage }  from '../pages/map/map';
import { LoginPage } from '../pages/login/login';
import { ExplorePage } from "../pages/explore/explore";
import { SubmitDataLandingPage } from '../pages/submit-data-landing/submit-data-landing';
import { enableProdMode } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

declare function require(name:string);
const ua = require('universal-analytics');

enableProdMode();

@Component({
    templateUrl: 'app.html'
})
export class App {

    @ViewChild(Nav) nav: Nav;

    rootPage: any;
    pages: Array<{title: string, icon: string, component: any}>;
    currentUser: any;

    constructor(public platform: Platform, public afAuth: AngularFireAuth, public statusBar: StatusBar, public splashScreen: SplashScreen) {
        this.initializeApp();

        this.pages = [
            {
                title: 'Map',
                icon: 'map',
                component: MapPage
            },
            {
                title: 'Explore',
                icon: 'glasses',
                component: ExplorePage
            },
            {
                title: 'Submit',
                icon: 'send',
                component: SubmitDataLandingPage
            },
        ];

        const authObserver = afAuth.authState.subscribe( user => {
            if (user) {
                this.currentUser = user;
                //authObserver.unsubscribe();
            } else {
                console.log("no user");
                authObserver.unsubscribe();
            }
        });
    }

    initializeApp() {
        const visitor = ua('UA-106620204-1');
        visitor.pageview("/").send();
        this.platform.ready().then(() => {
            this.splashScreen.show();
            this.rootPage = MapPage;
            this.statusBar.styleDefault();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page, we wouldn't want the back button to show up in this scenario
        this.nav.setRoot(page.component);
    }

    logOut(){
        this.afAuth.auth.signOut();
        this.nav.setRoot(MapPage);
    }

    logIn(){
        this.nav.setRoot(LoginPage);
    }

}
