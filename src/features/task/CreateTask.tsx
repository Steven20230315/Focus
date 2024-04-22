import {
  type Task,
  type TaskId,
  type Column,
  type ColumnId,
} from "../../types";
import { type FormEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { addTask } from "./taskSlice";
import { selectColumnsInOriginalOrder } from "../column/columnSelector";

import { useSelector } from "react-redux";

export default function CreateTask() {
  const dispatch = useDispatch();
  const currentColumns = useSelector(selectColumnsInOriginalOrder);
  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const columnId = formData.get("columnId") as ColumnId;
    const taskId = uuidv4() as TaskId;
    const selectedColumn = currentColumns.find(
      (column: Column) => column.columnId === columnId,
    );
    if (!selectedColumn) {
      throw new Error("Column not found");
    }
    const newTask: Task = {
      taskId: taskId,
      title: title,
      listId: currentColumns[0].listId,
      columnId: selectedColumn.columnId,
      status: selectedColumn.role,
    };
    dispatch(addTask(newTask));
    e.currentTarget.reset();
  };
  return (
    <form onSubmit={handleAddTask} autoComplete="off">
      <h3>Add new task component go here</h3>
      <input type="text" name="title" />
      <select name="columnId" id="">
        {currentColumns.map((column: Column) => (
          <option key={column.columnId} value={column.columnId}>
            {column.role}
          </option>
        ))}
      </select>
      <button type="submit">Add</button>
    </form>
  );
}
