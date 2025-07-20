import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseChatService {
  protected router = inject(Router)
  private messageSubject = new Subject<{user: string, message: string}>();
  protected readonly hubConnection: HubConnection;
  private readonly connectionPromise: Promise<void>
  connectionId: string = ''

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7212/chat', {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build()

    this.connectionPromise = this.hubConnection.start()
      .then(async () => {
        const id = await this.hubConnection.invoke('GetConnectionId');
        return this.connectionId = id;
      })
      .catch(error => console.error('Error', error))

    this.hubConnection.on("ChatCreated", ()=> {
      if (this.router.url === '/chat'){
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>{
          this.router.navigate(['chat']);
        })
      }
      else this.router.navigate(['chat']);
    });

    this.hubConnection.on('Receive', (username: string, message: string) =>{
      this.messageSubject.next({user: username, message: message})
    })
  }

  async startConnect(){
    await this.ensureConnection()
  }

  async ensureConnection(): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }
    return this.connectionPromise;
  }

  async sendMessage(groupName: string, message: string) {
    await this.hubConnection.invoke('SendMessage', groupName, message)
  }

  receiveMessage(): Observable<{ user: string, message: string}>{
    return this.messageSubject.asObservable();
  }

  async leaveChat(groupName: string, isSingleChat: boolean){
    await this.hubConnection.invoke('LeaveChat', groupName, isSingleChat)
  }

  async getPersonGroupAndUsername(): Promise<{username: string | null; groupName: string | null; isSingleChat: boolean}> {
    return await this.hubConnection.invoke('GetPersonGroupAndUsername');
  }
}
