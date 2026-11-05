import { inject, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseChatService {
  private static sharedConnection: HubConnection | null = null
  private static sharedConnectionPromise: Promise<void> | null = null
  private static sharedConnectionId = ''
  private static handlersRegistered = false
  private static readonly messageSubject = new Subject<{ idSender: number, message: string, createdAt: Date }>();

  protected router = inject(Router)
  protected ngZone = inject(NgZone)
  protected readonly hubConnection: HubConnection;

  get connectionId(): string {
    return BaseChatService.sharedConnectionId
  }

  set connectionId(value: string) {
    BaseChatService.sharedConnectionId = value
  }

  protected constructor() {
    BaseChatService.sharedConnection ??= new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}chat`, {
        withCredentials: true
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build()
    this.hubConnection = BaseChatService.sharedConnection

    if (BaseChatService.handlersRegistered) return
    BaseChatService.handlersRegistered = true

    this.hubConnection.onclose(() => {
      BaseChatService.sharedConnectionPromise = null
    })

    this.hubConnection.on("ChatCreated", () => {
      this.ngZone.run(() => {
        if (this.router.url === '/chat') {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['chat']).then();
          })
        } else this.router.navigate(['chat']).then();
      })
    });

    this.hubConnection.on('Receive', (idSender: number, message: string, createdAt: Date) => {
      this.ngZone.run(() => {
        BaseChatService.messageSubject.next({ idSender: idSender, message: message, createdAt: createdAt });
      });
    })
  }

  async startConnect() {
    await this.ensureConnection()
  }

  async ensureConnection(): Promise<void> {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }
    if (BaseChatService.sharedConnectionPromise) {
      return BaseChatService.sharedConnectionPromise
    }

    BaseChatService.sharedConnectionPromise = this.hubConnection.start()
      .then(async () => {
        this.connectionId = await this.hubConnection.invoke('GetConnectionId')
      })
      .catch(error => {
        BaseChatService.sharedConnectionPromise = null
        throw error
      })

    return BaseChatService.sharedConnectionPromise
  }

  async sendMessage(idGroup: number, message: string, isSingleChat: boolean) {
    await this.ensureConnection()
    await this.hubConnection.invoke('SendMessage', idGroup, message, isSingleChat)
  }

  receiveMessage(): Observable<{ idSender: number, message: string, createdAt: Date }> {
    return BaseChatService.messageSubject.asObservable();
  }
}
