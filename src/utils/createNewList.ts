import { v4 as uuidv4 } from "uuid";
import { type ListId, type ColumnId, type List } from "../types";

export const createNewListWithDefaultColumns = (title: string) => {
  const newListId = uuidv4() as ListId;
  const toDoColumnId = uuidv4() as ColumnId;
  const inProgressColumnId = uuidv4() as ColumnId;
  const doneColumnId = uuidv4() as ColumnId;
  const pendingColumnId = uuidv4() as ColumnId;

  const newList: List = {
    listId: newListId,
    title: title,
    columnIds: [
      toDoColumnId,
      inProgressColumnId,
      doneColumnId,
      pendingColumnId,
    ],
    columnIdsOrder: [
      toDoColumnId,
      inProgressColumnId,
      doneColumnId,
      pendingColumnId,
    ],
  };
  return newList;
};
