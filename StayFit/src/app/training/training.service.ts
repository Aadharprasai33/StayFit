import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';
import { Injectable, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

import {map} from 'rxjs/operators';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    currentUser:any;
    check:number;
    private exercises: Exercise[]=[];
    exercisesChanged = new Subject<Exercise[]>();
    availableExercises:Exercise[]=[];
    filteredArray:Exercise[]=[];
    finishedExercisesChanged = new Subject<Exercise[]>();
    private fbSubs:Subscription[]=[];
    
    private runningExercise: Exercise;

    constructor(private db:AngularFirestore, private auth:AngularFireAuth)  {
        
    }


     fetchAvailableExercises(){
        this.fbSubs.push(this.db.collection('availableExercises')
        .snapshotChanges()
        .pipe(map(docArray=>{
          return docArray.map(doc=>{
            const data = doc.payload.doc.data() as Exercise;
            const id = doc.payload.doc.id;
            return {id,...data}
          })
        })).subscribe((exercises:Exercise[])=>{
           
            this.availableExercises=exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        }));
        
     }
     startExercise(selectedId:string){
        //  this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()})
        this.runningExercise = this.availableExercises.find(ex=>ex.id === selectedId);
         this.exerciseChanged.next({...this.runningExercise});
     }
     getRunningExercise(){
         return {...this.runningExercise};
     }
     completeExercise(){
         this.addDataToDatabase({...this.runningExercise, date:new Date(), state:'completed', userId:localStorage.getItem('user')});
         this.runningExercise=null;
         this.exerciseChanged.next(null);
     }
     cancelExercise(progress:number){
        this.addDataToDatabase({...this.runningExercise, userId:localStorage.getItem('user'),duration:this.runningExercise.duration * (progress/100), calories:this.runningExercise.calories * (progress/100), date:new Date(), state:'cancelled'});
        this.runningExercise=null;
        this.exerciseChanged.next(null);
     }
     fetchedCompletedOrCancelledService(){
        this.fbSubs.push(this.db.collection('finishedExercises').valueChanges()
        .subscribe((exercises:Exercise[])=>{
            console.log(exercises);
            this.finishedExercisesChanged.next(exercises);
         }));
     }
     private addDataToDatabase(exercise:Exercise){
        this.db.collection('finishedExercises').add(exercise);
     }
     cancelSubscriptions(){
         this.fbSubs.forEach(sub => sub.unsubscribe());
     }
}