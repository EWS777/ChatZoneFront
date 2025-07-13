import {inject, Injectable} from '@angular/core';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  router = inject(Router)

  private readonly hubConnection: HubConnection;
  private messageSubject = new Subject<{user: string, message: string}>();
  private connectionPromise: Promise<void>
  public connectionId: string = '';

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
        this.router.navigate(['chat']);
    });
  }

  public async ensureConnection(): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return Promise.resolve();
    }
    return this.connectionPromise;
  }

  async getPersonGroupAndUsername(): Promise<{username: string | null; groupName: string | null}> {
    await this.ensureConnection();
    return await this.hubConnection.invoke('GetPersonGroupAndUsername');
  }

  receiveMessage(): Observable<{ user: string, message: string }>{
    this.hubConnection.on('Receive', (username: string, message: string) =>{
      this.messageSubject.next({user: username, message: message})
    })
    return this.messageSubject.asObservable();
  }

  async sendMessage(groupName: string, message: string) {
    await this.hubConnection.invoke('SendMessage', groupName, message)
  }
}
