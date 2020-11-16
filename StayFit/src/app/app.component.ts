import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { TrainingService } from './training/training.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private authService:AuthService, private trainingService:TrainingService){}

  ngOnInit(){
    this.authService.initAuthListener();
  }
  title = 'StayFit';


}
