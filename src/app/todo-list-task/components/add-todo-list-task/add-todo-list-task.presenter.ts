import { TodoListTaskService,
         AddTodoListTaskResponseDto, } from '../../../todo-list-task-api';
import { AddTodoListTaskView,        } from './add-todo-list-task.view';

export class AddTodoListTaskPresenter {
  public constructor(
    public readonly view: AddTodoListTaskView,
    public readonly service: TodoListTaskService,
  ) { }

  public add(): void {
    const responseDto: AddTodoListTaskResponseDto =
      this.service.addTodoListTask(this.view.todoListTask);

    this.view.todoListTaskId = responseDto.todoListTaskId;
  }
}
