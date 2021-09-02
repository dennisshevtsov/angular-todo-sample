import { NgModule,             } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';

import { AddTodoListTaskComponent,
         SearchTodoListTasksComponent,
         UpdateTodoListTaskComponent,  } from './components';

const TODO_LIST_PARAMETER_NAME = 'todoListId';
const TODO_LIST_TASK_PARAMETER_NAME = 'todoListTaskId';
const TODO_LIST_TASK_ROUTE_BASE = `todo-list/:${TODO_LIST_PARAMETER_NAME}/task`;

const routes: Routes = [
  {
    path: TODO_LIST_TASK_ROUTE_BASE,
    component: SearchTodoListTasksComponent,
  },
  {
    path: `${TODO_LIST_TASK_ROUTE_BASE}/new`,
    component: AddTodoListTaskComponent,
  },
  {
    path: `${TODO_LIST_TASK_ROUTE_BASE}/:${TODO_LIST_TASK_PARAMETER_NAME}`,
    component: UpdateTodoListTaskComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class TodoListTaskRoutingModule {
}
