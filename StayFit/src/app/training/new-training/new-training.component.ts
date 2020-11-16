import { Component, OnDestroy, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises:Exercise[];
  exerciseSubscription: Subscription;

  constructor(private trainingService:TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(res=>{
      this.exercises = res;
    })
      this.trainingService.fetchAvailableExercises();
  }
  onStartTraining(form:NgForm) {
    console.log('here',form.value.exercise);
    this.trainingService.startExercise(form.value.exercise);
  } 
  ngOnDestroy(){
    this.exerciseSubscription.unsubscribe();
  }
}
