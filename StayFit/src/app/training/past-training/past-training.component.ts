import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs/Subscription';

import {Exercise} from '../exercise.model';
import {TrainingService} from '../training.service';

@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})

export class PastTrainingComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date','name','duration','calories','state']
  dataSource = new MatTableDataSource<Exercise>();
  public check: number = 0;
  currentUser:any;
  private exChangedSubsription: Subscription;
  
  @ViewChild(MatSort) sort:MatSort;
   @ViewChild(MatPaginator) paginator:MatPaginator;
  constructor(private trainingService : TrainingService) {

   }

  ngOnInit(){
    
    
    

      this.exChangedSubsription = this.trainingService.finishedExercisesChanged.subscribe((exercises:Exercise[])=>{
        console.log(localStorage.getItem('user'));
        this.dataSource.data = exercises.filter(x=>x.userId == localStorage.getItem('user'));
        console.log(this.dataSource.data);
      });
      this.trainingService.fetchedCompletedOrCancelledService();

    
    
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue:string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(){
    this.exChangedSubsription.unsubscribe();
  }
}
