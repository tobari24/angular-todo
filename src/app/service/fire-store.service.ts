import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Task } from '../model/task';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './core/auth.service';
import { User } from '../model/user';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';
import { of } from 'rxjs/observable/of';

@Injectable()
export class FireStoreService {

  tasksCollection: AngularFirestoreCollection<Task>;
  tasks$: Observable<Task[]>;
  taskDoc: AngularFirestoreDocument<Task>;
  user: Observable<User>;

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService
  ) {
    console.log('called fire-store.service constructor');
    // console.log(authService);
    this.tasks$ = authService.getUser()
      .switchMap(user => {
        console.log(user);
        return Promise.resolve(user);
      })
      .mergeMap(user => {
        this.tasksCollection = this.afs.doc<User>(`users/${user.uid}`).collection<Task>('tasks');
        return this.tasksCollection.snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as Task;
            data.id = a.payload.doc.id;
            return data;
          });
        });
      });
  }

  getTasks(): Observable<Task[]> {
    console.log(this.tasks$);
    return this.tasks$;
  }

  addTask(task: Task): void {
    this.tasksCollection.add(task);
  }

  deleteTask(task: Task): void {
    const taskDoc = this.tasksCollection.doc(`${task.id}`);
    taskDoc.delete();
  }

  updateTask(task: Task): void {
    const taskDoc = this.tasksCollection.doc(`${task.id}`);
    taskDoc.update(task);
  }
}
