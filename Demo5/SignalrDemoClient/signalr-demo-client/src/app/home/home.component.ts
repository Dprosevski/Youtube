import { Message, User } from './../signalr.service';
import { SignalrService } from 'src/app/signalr.service';
import { Component, OnInit } from '@angular/core';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public signalrService: SignalrService //2Tutorial
  ) { }

  //vars
  //4Tutorial
  users: Array<User> = new Array<User>();
  selectedUser: User;

  //5Tutorial
  msg: string;




  ngOnInit(): void {
    this.userOnLis();
    this.userOffLis();
    this.logOutLis();
    this.getOnlineUsersLis();
    this.sendMsgLis();

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
  private getOnlineUsersLis(): void {
    this.signalrService.hubConnection.on("getOnlineUsersResponse", (onlineUsers: Array<User>) => {
      this.users = [...onlineUsers];
      console.log(this.users);
    });
  }



  //5Tutorial
  sendMsgInv(): void {
    if (this.msg?.trim() === "" || this.msg == null) return;

    this.signalrService.hubConnection.invoke("sendMsg", this.selectedUser.connId, this.msg)
    .catch(err => console.error(err));

    if (this.selectedUser.msgs == null) this.selectedUser.msgs = [];
    this.selectedUser.msgs.push(new Message(this.msg, true));
    this.msg = "";
  }

  private sendMsgLis(): void {
    this.signalrService.hubConnection.on("sendMsgResponse", (connId: string, msg: string) => {
      let receiver = this.users.find(u => u.connId === connId);
      if (receiver.msgs == null) receiver.msgs = [];
      receiver.msgs.push(new Message(msg, false));
    });
  }
}
