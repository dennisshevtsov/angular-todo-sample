export class SearchTodoListsRecordResponseDto {
  public constructor(
    public todoListId: number,
    public title: string,
    public description: string,
  ) {}
}
