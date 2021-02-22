import { SignalrService } from 'src/app/signalr.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public signalrService: SignalrService //2Tutorial
  ) { }

  ngOnInit(): void {
  }

}
