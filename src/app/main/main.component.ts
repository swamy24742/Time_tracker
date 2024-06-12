import { Component, Input } from '@angular/core';
import { TimeTrackerService } from '../time-tracker.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  @Input() tasks: any;
  totalTimeSpent: number = 0;
  timerIntervals: any[] = [];

  constructor(private taskService: TimeTrackerService) { }

  ngOnInit() {
    this.tasks = this.taskService.getTasks();
    this.totalTimeSpent = this.taskService.getTotalTime();
    this.resumeTasks();
  }

  startTime(index: number) {
    const task = this.tasks[index];
    if (!task.running) {
      this.taskService.startTask(task);
      this.updateTaskTime(index);
    }
  }

  stopTime(index: number) {
    const task = this.tasks[index];
    if (task.running) {
      clearInterval(this.timerIntervals[index]);
      this.taskService.stopTask(task);
      this.totalTimeSpent = this.taskService.getTotalTime();
    }
  }
  deleteTask(index: number) {
    this.taskService.deleteTask(index);
    this.tasks = this.taskService.getTasks();
    this.totalTimeSpent = this.taskService.getTotalTime();
  }

  updateTaskTime(index: number) {
    this.timerIntervals[index] = setInterval(() => {
      const task = this.tasks[index];
      if (task.running) {
        task.time = Date.now() - task.startTime;
      }
    }, 1000);
  }

  resumeTasks() {
    this.tasks.forEach((task: any, index: number) => {
      if (task.running) {
        this.updateTaskTime(index);
      }
    });
  }

  formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  getCurrentTime(): number {
    return Date.now();
  }
  
}
