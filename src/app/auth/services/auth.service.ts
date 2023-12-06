import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

userId: string;  
userLoggedIn: boolean;      // other components can check on this variable for the login status of the user

  constructor(private router: Router, private afAuth: AngularFireAuth) {
      this.userLoggedIn = false;
      this.userId = ''; // Initialize with an empty string or fetch the userId from source

      this.afAuth.onAuthStateChanged((user) => {              // set up a subscription to always know the login status of the user
          if (user) {
              this.userLoggedIn = true;
          } else {
              this.userLoggedIn = false;
          }
      });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
            if (result.user) {
                this.userId = result.user.uid; // Set userId here
            }
            console.log('Auth Service: loginUser: success');
            this.router.navigate(['/home']);
            return null; // return null when login is successful
        })
        .catch(error => {
            console.log('Auth Service: login error', error);
            return { isValid: false, message: error.message }; // return error object when there's an error
        });
}

signupUser(user: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then((result) => {
            if (result.user) {
                this.userId = result.user.uid; // Set userId here
            }
            return result.user?.updateProfile({
                displayName: user.name
            });
        })
        .then(() => {
            console.log('Auth Service: signupUser: success');
        });
}

    // fetch users other credentials
    async getUserId(): Promise<string | null> {
        const user = await this.afAuth.currentUser;
        return user ? user.uid : null;
    }


    async getUserEmail(): Promise<string | null> {
        const user = await this.afAuth.currentUser;
        return user ? user.email : null;
    }
  
}