import { User } from './../signalr.service';
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

  //vars
  //4Tutorial
  users: Array<User> = new Array<User>();

  ngOnInit(): void {
    this.userOnLis();
    this.userOffLis();
    this.logOutLis();
    this.getOnlineUsersLis();

    //hubConnection.state is 1 when hub connection is connected.
    if (this.signalrService.hubConnection.state == 1) this.getOnlineUsersInv();
    else {
      this.signalrService.ssSubj.subscribe((obj: any) => {
        if (obj.type == "HubConnStarted") {
          this.getOnlineUsersInv();
        }
      });
    }
  }


  //4Tutorial
  logOut(): void {
    this.signalrService.hubConnection.invoke("logOut", this.signalrService.userData.id)
    .catch(err => console.error(err));
  }
  logOutLis(): void {
    this.signalrService.hubConnection.on("logoutResponse", () => {
      localStorage.removeItem("personId");
      location.reload();
      // this.signalrService.hubConnection.stop();
    });
  }



  //4Tutorial
  userOnLis(): void {
    this.signalrService.hubConnection.on("userOn", (newUser: User) => {
      console.log(newUser);
      this.users.push(newUser);
    });
  }
  userOffLis(): void {
    this.signalrService.hubConnection.on("userOff", (personId: string) => {
      this.users = this.users.filter(u => u.id != personId);
    });
  }



  //4Tutorial
  getOnlineUsersInv(): void {
    this.signalrService.hubConnection.invoke("getOnlineUsers")
    .catch(err => console.error(err));
  }
  getOnlineUsersLis(): void {
    this.signalrService.hubConnection.on("getOnlineUsersResponse", (onlineUsers: Array<User>) => {
      this.users = [...onlineUsers];
    });
  }

}
