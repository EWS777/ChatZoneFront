import {Component, inject, OnInit, signal} from '@angular/core';
import {QuickMessageService} from './quick-message.service';
import {QuickMessage} from './quick-message';
import {FormsModule} from '@angular/forms';
import {map} from 'rxjs';

@Component({
  selector: 'app-quick-messages',
  imports: [
    FormsModule
  ],
  templateUrl: './quick-messages.component.html',
  standalone: true,
  styleUrl: './quick-messages.component.css'
})
export class QuickMessagesComponent implements OnInit{
  quickMessageService = inject(QuickMessageService)

  quickMessageList: QuickMessage[] | null = null
  quickMessage: QuickMessage = { idQuickMessage: 0, message: '' };
  isCreateOn = signal<boolean>(false)

  changeStatus = () => this.isCreateOn.update(x=> !x)

  ngOnInit() {
    this.quickMessageService.getQuickMessages().subscribe({
      next: value => {
        this.quickMessageList = value
      },
      error: err => {
        console.error('Unable to get Quick Messages', err)
      }
    })
  }

  create(){
    this.quickMessageService.createQuickMessage(this.quickMessage).subscribe({
      next: value => {
        this.quickMessageList = [...this.quickMessageList??[], value]
        this.isCreateOn.set(false)
        this.quickMessage.message = ''
      },
      error: err => {
        console.error('Create quick message has not completed!', err)
      }
    })
  }

  update(message: QuickMessage) {
    this.quickMessageService.updateQuickMessage(message).subscribe({
      next: value => {
        const index = this.quickMessageList?.
        findIndex(m => m.idQuickMessage === message.idQuickMessage);
        if (index !== undefined && index > -1 && this.quickMessageList) {
          this.quickMessageList[index] = value;
        }
        message.isEditing = false;
        delete message.originalMessage;
      }
    })
  }

  cancel(message: QuickMessage) {
    if (message.originalMessage !== undefined) message.message = message.originalMessage;
    message.isEditing = false;
    delete message.originalMessage;
  }

  onChange(message: QuickMessage){
    message.isEditing = message.message !== message.originalMessage;
  }

  onStart(message: QuickMessage){
    if (message.originalMessage === undefined) message.originalMessage = message.message
  }

  delete(id: number){
    this.quickMessageService.deleteQuickMessage(id).pipe(
      map(() => this.quickMessageList?.filter(x=>x.idQuickMessage !==id)??[])
    ).subscribe({
        next: newList => {
          this.quickMessageList = newList
        },
        error: err => {
          console.error('Delete quick messages has not completed!', err)
        }
    })
  }
}
