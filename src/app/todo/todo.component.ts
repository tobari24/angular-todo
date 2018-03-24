import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { Observable } from 'rxjs/Observable';
import { FireStoreService } from '../service/fire-store.service';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { MatSnackBar, MatDialog, } from '@angular/material';
import { AddTodoComponent } from './add-todo.component';
import { AuthService } from '../service/core/auth.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

//  private tasksCollection: AngularFirestoreCollection<Task>;
  tasks$: Observable<Task[]>;
  task: Task = {
    title: '',
    memo: '',
    isDelete: false,
    checkbox: false,
  };

  constructor(
    private fs: FireStoreService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    console.log('todo.component->ngOnInit call');
    this.tasks$ = this.fs.getTasks();
  }

  openSnackBar(task: Task) {
    task.isDelete = true;
    this.fs.updateTask(task);
    const snackBarRef = this.snackBar.open(`${task.title}を削除しました.`, 'undo', {
      duration: 3000,
    });
    snackBarRef.afterDismissed().subscribe(() => {
      console.log(`the snackbar was dismissed:${task.isDelete}`);
      if (task.isDelete) {
        this.fs.deleteTask(task);
      }
    });
    snackBarRef.onAction().subscribe(() => {
      task.isDelete = false;
      this.fs.updateTask(task);
      console.log(`tha snackbar action was triggered:${task.isDelete}`);
    });
  }

  showTaskDialog(): void {
    const dialogRef = this.dialog.open(
      AddTodoComponent, {
        data: {title: this.task.title, memo: this.task.memo }
      });

    dialogRef.afterClosed().subscribe(data => {
      console.log(data);
      if (data && data.title !== '') {
        this.task.title = data.title;
        if ( data.memo !== '' ) {
          this.task.memo = data.memo;
        }
        this.fs.addTask(this.task);
        this.task.title = '';
        this.task.memo = '';
      }
    });
  }
}
