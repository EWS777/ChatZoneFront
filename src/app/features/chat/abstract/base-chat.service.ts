import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from '@microsoft/signalr';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseChatService {
  protected router = inject(Router)
  private messageSubject = new Subject<{idSender: number, message: string, createdAt: Date}>();
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

    this.hubConnection.on('Receive', (idSender: number, message: string, createdAt: Date) =>{
      this.messageSubject.next({idSender: idSender, message: message, createdAt: createdAt})
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

  async sendMessage(idGroup: number, message: string, isSingleChat: boolean) {
    await this.hubConnection.invoke('SendMessage', idGroup, message, isSingleChat)
  }

  receiveMessage(): Observable<{ idSender: number, message: string, createdAt: Date}>{
    return this.messageSubject.asObservable();
  }

  async leaveChat(idGroup: number, isSingleChat: boolean){
    await this.hubConnection.invoke('LeaveChat', idGroup, isSingleChat)
  }
}
