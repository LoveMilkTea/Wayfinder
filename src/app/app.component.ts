import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AdminPage}  from '../pages/admin/admin';
import {MapPage}  from '../pages/map/map';
import {LoginPage} from '../pages/login/login';
import {ExplorePage} from "../pages/explore/explore";
import {SubmitDataLandingPage} from '../pages/submit-data-landing/submit-data-landing';
import {enableProdMode} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AuthProvider} from '../providers/auth/auth';
import {FirebaseProvider} from "../providers/firebase/firebase";

declare function require(name: string);
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

    constructor(public platform: Platform, public afAuth: AngularFireAuth, public statusBar: StatusBar, public splashScreen: SplashScreen, public authData: AuthProvider, public database: FirebaseProvider) {
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
        this.afAuth.authState.subscribe(auth => this.currentUser = auth);// user info is inside auth object

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

    logOut() {
        this.authData.loginState = false;
        this.afAuth.auth.signOut();
        this.nav.setRoot(MapPage);
    }

    logIn() {
        this.nav.setRoot(LoginPage);
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

}
