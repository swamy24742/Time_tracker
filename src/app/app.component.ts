import { Component, OnInit } from '@angular/core';
import { TimeTrackerService } from './time-tracker.service';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from './add-card/add-card.component';
import * as alasql from 'alasql';
import 'xlsx';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Time Tracker';
  task : any = [];
  constructor(public taskService: TimeTrackerService, public dialog: MatDialog) {}

  ngOnInit() {
   this.task = this.taskService.loadTasksFromLocalStorage();
  }

  openAddCard() {
    const dialogRef = this.dialog.open(AddCardComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.task = this.taskService.getTasks();
      this.taskService.getTotalTime();
    });
  }
  exportToExcel() {
    const columns = [
      { header: 'Task Name', key: 'name' },
      { header: 'History', key: 'history' }
    ];

    const excelData = this.task.map((task:any) => ({
      name: task.name,
      history: task.history.join('\n') // Convert history array to string
    }));

    const opts = {
      headers: true,
      column: columns.map(col => col.header),
    };

    alasql.promise('SELECT * INTO XLSX("tasks.xlsx", ?) FROM ?', [opts, excelData])
      .then(() => {
        console.log('Excel file exported successfully!');
      })
      .catch(err => {
        console.error('Error exporting Excel file:', err);
      });
  }
}