import { Component } from '@angular/core';
import { TimeTrackerService } from '../time-tracker.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent {
  labelName: string = '';
  errorMessage: string = '';

  constructor(private taskService: TimeTrackerService, public dialogRef: MatDialogRef<AddCardComponent>) {}

  saveTask() {
    if (this.labelName.trim() === '') {
      this.errorMessage = 'Task name cannot be empty';
      return;
    }

    this.taskService.addTask(this.labelName);
    this.labelName = ''; // Clear input field
    this.errorMessage = ''; // Clear error message
    this.dialogRef.close();
  }

  closeModel() {
    this.dialogRef.close();
    this.errorMessage = ''; // Clear error message when closing modal
  }
}