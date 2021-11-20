import { Component, OnInit,                  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router,   } from '@angular/router';

import { TodoListService,           } from '../../../api';
import { TODO_LIST_PARAMETER,
         TODO_LIST_ROUTE,           } from '../../../routing';
import { AddTodoListTaskRequestDto,
         TodoListTaskService,       } from '../../api';
import { TODO_LIST_TASK_ROUTE,      } from '../../routing';
import { AddTodoListTaskPresenter,  } from './add-todo-list-task.presenter';
import { AddTodoListTaskView,       } from './add-todo-list-task.view';

@Component({
  selector: 'app-add-todo-list-task',
  templateUrl: './add-todo-list-task.component.html',
  styleUrls: [
    './add-todo-list-task.component.scss',
  ],
})
export class AddTodoListTaskComponent implements OnInit, AddTodoListTaskView {
  private readonly presenter: AddTodoListTaskPresenter;

  private todoListIdValue: number | undefined;
  private formValue: FormGroup | undefined;

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,

    private readonly builder: FormBuilder,

    todoListService: TodoListService,
    todoListTaskService: TodoListTaskService,
  ) {
    this.presenter = new AddTodoListTaskPresenter(
      this, todoListService, todoListTaskService);
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const todoListId = paramMap.get(TODO_LIST_PARAMETER);

      if (todoListId) {
        this.todoListIdValue = +todoListId;
      }
    });
  }

  public get datasource(): AddTodoListTaskRequestDto {
    return new AddTodoListTaskRequestDto(
      this.todoListIdValue!,
      this.form.value.title,
      this.form.value.date,
      this.form.value.fullDay,
      this.form.value.startTime,
      this.form.value.endTime,
      this.form.value.description,
    );
  }

  public get form(): FormGroup {
    return this.formValue ?? (this.formValue = this.buildForm());
  }

  public get searchTodoListsLink(): Array<any> {
    return [ '/', TODO_LIST_ROUTE, ];
  }

  public onSubmit(): void {
    this.presenter.add();
    this.router.navigate([
      TODO_LIST_ROUTE,
      this.todoListIdValue!,
      TODO_LIST_TASK_ROUTE,
    ]);
  }

  private buildForm(): FormGroup {
    return this.builder.group({
      'title': this.builder.control('', Validators.required),
      'date': '',
      'fullDay': false,
      'startTime': '',
      'endTime': '',
      'description': '',
    });
  }
}
