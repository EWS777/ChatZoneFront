import {inject, Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../../environments/environment';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseChatService {
  protected router = inject(Router)
  protected ngZone = inject(NgZone)
  private messageSubject = new Subject<{idSender: number, message: string, createdAt: Date}>();
  protected readonly hubConnection: HubConnection;
  private connectionPromise: Promise<void> | null = null
  connectionId: string = ''

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}chat`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()

    this.hubConnection.on("ChatCreated", ()=> {
      this.ngZone.run(() => {
        if (this.router.url === '/chat'){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>{
            this.router.navigate(['chat']);
          })
        }
        else this.router.navigate(['chat']);
      })
    });

    this.hubConnection.on('Receive', (idSender: number, message: string, createdAt: Date) =>{
      this.ngZone.run(() => {
        this.messageSubject.next({idSender: idSender, message: message, createdAt: createdAt});
      });
    })
  }

  async startConnect(){
    await this.ensureConnection()
  }

  async ensureConnection(): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }
    if (this.connectionPromise){
      return this.connectionPromise
    }

    this.connectionPromise = this.hubConnection.start()
      .then(async () => {
        this.connectionId = await this.hubConnection.invoke('GetConnectionId')
      })
      .catch(error => {
        this.connectionPromise = null
        throw error
      })

    return this.connectionPromise
  }

  async sendMessage(idGroup: number, message: string, isSingleChat: boolean) {
    await this.ensureConnection()
    await this.hubConnection.invoke('SendMessage', idGroup, message, isSingleChat)
  }

  receiveMessage(): Observable<{ idSender: number, message: string, createdAt: Date}>{
    return this.messageSubject.asObservable();
  }
}
