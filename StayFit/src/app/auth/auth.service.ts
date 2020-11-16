import {Subject} from 'rxjs/Subject';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class AuthService {
    private isAuthenticated:boolean;
    authChange = new Subject<boolean>();

    constructor(private router:Router, 
        private auth:AngularFireAuth, 
        private trainingService:TrainingService,
        private _snackBar:MatSnackBar

        ){}

    initAuthListener(){
        this.auth.authState.subscribe(user=>{
            if(user){
                this.isAuthenticated=true;
                this.authChange.next(true);
                this.router.navigate(['./training']);
            }
            else{   
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated=false;
                this.authChange.next(false);
                this.router.navigate(['./login']);
            }
        });
    }
    registerUser(authData: AuthData) {
      
        this.auth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result=>{
            console.log(result);
        }).catch(err=>{
            this._snackBar.open(err.message, null,
                {duration:3000});
        })
    }
    userDetails(user){
         localStorage.setItem('user',user.uid);
    }
    login(authData: AuthData) {
  
       this.auth.signInWithEmailAndPassword(authData.email,authData.password)
       .then(result=>{
        this.auth.authState.subscribe(user=>{
            console.log('here',user);
            this.userDetails(user);
        });

    }).catch(err=>{
        this._snackBar.open(err.message, null,
            {duration:3000});
    })
    }

    logout() {
        localStorage.clear();
        this.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

  
}