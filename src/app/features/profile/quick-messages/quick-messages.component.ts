import {Component, inject, OnInit, signal} from '@angular/core';
import {QuickMessageService} from './quick-message.service';
import {QuickMessage} from './quick-message';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {map} from 'rxjs';
import {CommonValidator} from '../../../shared/validation/CommonValidator';

@Component({
  selector: 'app-quick-messages',
  imports: [
    FormsModule,
    ReactiveFormsModule
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
  isCreateFirstQuickMessage = signal<boolean>(false)
  commonError: string = ''

  messageForm = new FormGroup({
    message: new FormControl(null, [
      CommonValidator.required,
      CommonValidator.minLength(1),
      CommonValidator.maxLength(50),
      CommonValidator.noWhitespace, // just for required
    ])
  })

  changeStatus() {
    if (this.quickMessageList && this.quickMessageList.length >=3){
      this.isCreateFirstQuickMessage.set(true)
      this.commonError = 'You cannot create more than 3 messages!'
      return
    }
    this.isCreateOn.update(x => !x)
    this.isCreateFirstQuickMessage.set(true)
  }
  ngOnInit() {
    this.quickMessageService.getQuickMessages().subscribe({
      next: value => {
        this.quickMessageList = value
        if (this.quickMessageList && this.quickMessageList.length ==3){
          this.isCreateFirstQuickMessage.set(true)
        }
      },
      error: err => {
        console.error('Unable to get Quick Messages', err)
      }
    })
  }

  create(){
    this.commonError = ''
    if (this.quickMessageList && this.quickMessageList.length >=3){
      this.commonError = 'You cannot create more than 3 messages!'
      this.isCreateFirstQuickMessage.set(true)
      return
    }
    if (this.messageForm.invalid){
      this.messageForm.markAllAsTouched()
      return
    }

    this.quickMessage.message = this.messageForm.get('message')!.value || ''

    this.quickMessageService.createQuickMessage(this.quickMessage).subscribe({
      next: value => {
        this.quickMessageList = [...this.quickMessageList??[], value]
        this.isCreateOn.set(false)
        this.quickMessage.message = ''
        this.messageForm.reset()
        this.isCreateFirstQuickMessage.set(false)
        if (this.quickMessageList && this.quickMessageList.length ==3){
          this.isCreateFirstQuickMessage.set(true)
        }
      },
      error: (err) => {
        if(err.status === 400 && err.error && err.error.errors){
          const errors = err.error.errors;

          Object.keys(errors).forEach(key => {
            const control = this.messageForm.get(key.charAt(0).toLowerCase() + key.slice(1))
            if (control) {
              control.setErrors({ backend: errors[key] });
              control.markAsTouched()
            }
          });
        }
        else{
          this.commonError = err.error.title || 'Unhandled exception. To repair'
        }
      }
    })
  }

  update(message: QuickMessage) {
    message.message = message.message.trim()
    this.commonError = ''
    this.messageForm.get('message')?.setErrors(null)
    this.quickMessageService.updateQuickMessage(message).subscribe({
      next: value => {
        const index = this.quickMessageList?.
        findIndex(m => m.idQuickMessage === message.idQuickMessage);
        if (index !== undefined && index > -1 && this.quickMessageList) {
          this.quickMessageList[index] = value;
        }
        message.isEditing = false;
        delete message.originalMessage;
        this.messageForm.reset()
      },
      error: (err) => {
        if(err.status === 400 && err.error && err.error.errors){
          const errors = err.error.errors;

          Object.keys(errors).forEach(key => {
            const control = this.messageForm.get(key.charAt(0).toLowerCase() + key.slice(1))
            if (control) {
              control.setErrors({ backend: errors[key] });
              control.markAsTouched()
            }
          });
        }
        else{
          this.commonError = err.error.title || 'Unhandled exception. To repair'
        }
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
          if (this.quickMessageList && this.quickMessageList.length < 3){
            this.isCreateFirstQuickMessage.set(false)
          }
        },
        error: err => {
          console.error('Delete quick messages has not completed!', err)
        }
    })
  }
}
