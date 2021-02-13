import { SignalrService } from './../signalr.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public signalrService: SignalrService //Added in tutorial 2 
  ) { }

  ngOnInit(): void {
  }

}
