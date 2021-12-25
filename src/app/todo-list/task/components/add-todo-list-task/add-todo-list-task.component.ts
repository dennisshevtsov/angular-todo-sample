import { formatDate,                         } from '@angular/common';
import { Component, OnInit,                  } from '@angular/core';
import { AbstractControlOptions,
         FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router,   } from '@angular/router';

import { FormComponentBase,         } from '../../../../core';
import { TodoListService,           } from '../../../api';
import { TodoListLinks,
         TODO_LIST_ID_PARAMETER,
         TODO_LIST_ROUTE,           } from '../../../routing';
import { AddTodoListTaskRequestDto,
         TodoListTaskService,
         TodoListTaskTimeDto,       } from '../../api';
import { TodoListTaskLinks, TODO_LIST_TASK_ROUTE,      } from '../../routing';
import { timePeriodValidator,       } from '../../validators';
import { AddTodoListTaskPresenter,  } from './add-todo-list-task.presenter';
import { AddTodoListTaskView,       } from './add-todo-list-task.view';

@Component({
  selector: 'app-add-todo-list-task',
  templateUrl: './add-todo-list-task.component.html',
  styleUrls: [
    './add-todo-list-task.component.scss',
  ],
})
export class AddTodoListTaskComponent
  extends FormComponentBase
  implements OnInit, AddTodoListTaskView {
  private readonly presenter: AddTodoListTaskPresenter;

  private todoListIdValue: number | undefined;

  public constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly builder: FormBuilder,

    private readonly todoListLinks: TodoListLinks,
    private readonly todoListTaskLinks: TodoListTaskLinks,

    todoListService: TodoListService,
    todoListTaskService: TodoListTaskService,
  ) {
    super();

    this.presenter = new AddTodoListTaskPresenter(
      this, todoListService, todoListTaskService);
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      const todoListId = paramMap.get(TODO_LIST_ID_PARAMETER);

      if (todoListId) {
        this.todoListIdValue = +todoListId;
      }
    });
  }

  public get datasource(): AddTodoListTaskRequestDto {
    return new AddTodoListTaskRequestDto(
      this.todoListIdValue!,
      this.form.value.title,
      this.form.value.description,
      this.form.value.date,
      new TodoListTaskTimeDto(
        this.form.value.time.fullDay,
        this.form.value.time.start,
        this.form.value.time.end,
      ),
    );
  }

  public get homeLink(): Array<any> {
    return this.todoListLinks.searchTodoListsLink();
  }

  public get backLink(): Array<any> {
    return this.todoListTaskLinks.searchTodoListTasksLink(this.todoListIdValue!);
  }

  public onSubmit(): void {
    this.validateForm();

    if (this.form.valid) {
      this.presenter.add();
      this.router.navigate([
        TODO_LIST_ROUTE,
        this.todoListIdValue!,
        TODO_LIST_TASK_ROUTE,
      ]);
    }
  }

  private buildTimePeriodGroup(now: number): FormGroup {
    const oneHourInMilliseconds = 1 * 60 * 60 * 1000;
    const fullHours = now / oneHourInMilliseconds >> 0;
    const withoutFullHours = now % oneHourInMilliseconds;

    const oneMenuteInMilliseconds = 1 * 60 * 1000;
    const fullMenutes = withoutFullHours / oneMenuteInMilliseconds >> 0;

    const stepInMenutes = 15;
    const fullSteps = fullMenutes / stepInMenutes >> 0;

    let steps = fullSteps;

    if (fullMenutes % stepInMenutes > 0) {
      ++steps;
    }

    const start = fullHours * oneHourInMilliseconds +
      steps * stepInMenutes * oneMenuteInMilliseconds;
    const end = start + oneHourInMilliseconds;

    const controlConfig = {
      'fullDay': false,
      'start': formatDate(start, 'hh:mm', 'en-US'),
      'end': formatDate(end, 'hh:mm', 'en-US'),
    };
    const options: AbstractControlOptions = {
      validators: [
        timePeriodValidator,
      ],
    };

    return this.builder.group(controlConfig, options);
  }

  protected buildForm(): FormGroup {
    const now = Date.now();

    return this.builder.group({
      'title': this.builder.control('', Validators.required),
      'date': this.builder.control(formatDate(now, 'yyyy-MM-dd', 'en-US'), Validators.required),
      'time': this.buildTimePeriodGroup(now),
      'description': '',
    });
  }
}
