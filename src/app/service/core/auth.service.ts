import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from '../../model/user';

@Injectable()
export class AuthService {
  user: Observable<User | null>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    console.log('called auth.service constructor');
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
   }

   getUser(): Observable<User | null> {
    return this.user;
   }

   googleLogin() {
     const provider = new firebase.auth.GoogleAuthProvider();
     return this.oAuthLogin(provider);
   }

   logOut() {
     this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/login']);
      });
   }

   private oAuthLogin(provider) {
     return this.afAuth.auth.signInWithPopup(provider)
      .then(credential => {
        console.log(credential.user);
        return this.updateUserData(credential.user);
      })
      .catch(err => console.log(err));
   }

   private updateUserData(user: User) {
     const docUser: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
     const data: User = {
       uid: user.uid,
       email: user.email,
       displayName: user.displayName || '',
       photoURL: user.photoURL || '',
       profile: user.profile || '',
     };
     return docUser.set(data);
   }
}
