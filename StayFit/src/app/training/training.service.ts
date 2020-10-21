import {Exercise} from './exercise.model';
import {Subject} from 'rxjs/Subject';


export class TrainingService{
    exerciseChanged = new Subject<Exercise>();
    private exercises: Exercise[] = [];

    availableExercises:Exercise[] = [
        {id:'crunches', name:'Crunches', duration:180, calories:60},
        {id:'burpees', name:'Burpees', duration:60, calories:180},
        {id:'planks', name:'Planks', duration:60, calories:120},
        {id:'pushups', name:'Pushups', duration:10, calories:80},
    ];
    private runningExercise: Exercise;

     getAvailableExercises(){
         return this.availableExercises.slice();
     }
     startExercise(selectedId:string){
          this.runningExercise = this.availableExercises.find(ex=>ex.id === selectedId);
         this.exerciseChanged.next({...this.runningExercise});
     }
     getRunningExercise(){
         return {...this.runningExercise};
     }
     completeExercise(){
         this.exercises.push({...this.runningExercise, date:new Date(), state:'completed'});
         this.runningExercise=null;
         this.exerciseChanged.next(null);
     }
     cancelExercise(progress:number){
        this.exercises.push({...this.runningExercise, duration:this.runningExercise.duration * (progress/100), calories:this.runningExercise.calories * (progress/100), date:new Date(), state:'cancelled'});
        this.runningExercise=null;
        this.exerciseChanged.next(null);
     }
     getCompletedOrCancelledService(){
         return this.exercises.slice();
     }

}