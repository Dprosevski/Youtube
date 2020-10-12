using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SignalrDemo.HubConfig
{
    public class MyHub : Hub
    {
        public async Task askServer(string someTextFromClient)
        {
            string tempString;

            if (someTextFromClient == "hey")
            {
                tempString = "message was 'hey'";
            }
            else
            {
                tempString = "message was something else";
            }

            await Clients.Client(this.Context.ConnectionId).SendAsync("askServerResponse", tempString);
        }
    }
}
