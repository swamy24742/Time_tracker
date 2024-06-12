import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackerService {
  tasks: Task[] = [];
  totalTime = 0;
  constructor() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
      this.calculateTotalTime();
    }
  }
  addTask(label: string) {
    const taskData = {name : label, time: 0, task: 0, running: false, history: [] };
    this.tasks.push(taskData);
    this.saveTasksToLocalStorage();
    this.calculateTotalTime();
    return this.tasks;
  }
  getTasks() {
    return this.tasks;
  }
  startTask(task: Task) {
    task.running = true;
    const startTime = Date.now();
    task.startTime = startTime - (task.time || 0);
    task.history.push(`Started the timer at ${this.formatDate(new Date(startTime))} (Active)`);
    this.saveTasksToLocalStorage();
    this.calculateTotalTime();
  }

  stopTask(task: any) {
    task.running = false;
    const stopTime = Date.now();
    const elapsed = stopTime - task.startTime;
    task.time += elapsed;
    task.history[task.history.length - 1] = `Started the timer at ${this.formatDate(new Date(task.startTime))} & Stopped at ${this.formatDate(new Date(stopTime))}`;
    this.totalTime += elapsed;
    this.saveTasksToLocalStorage();
    this.calculateTotalTime();
  }
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
    this.saveTasksToLocalStorage();
    this.calculateTotalTime();
  }
  private formatDate(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
   loadTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
    return this.tasks
  }
   saveTasksToLocalStorage() {
   return localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
  private calculateTotalTime() {
    this.totalTime = this.tasks.reduce((total, task) => total + task.time, 0);
  }

  getTotalTime() {
    return this.totalTime;
  }
  
}
interface Task {
  name: string;
  task: number;
  time: number;
  running: boolean;
  startTime?: number;
  history: any[]; // You can specify a more specific type for history if needed
}