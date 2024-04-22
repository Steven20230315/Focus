import React, { forwardRef, type ForwardedRef } from "react";
import type { ColumnId, TaskId } from "../../types";
import TaskItem from "./TaskItem";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

type TaskListProps = React.HTMLAttributes<HTMLDivElement> & {
  columnId: ColumnId;
  children?: React.ReactNode;
};

const TaskList = forwardRef<HTMLDivElement, TaskListProps>(
  (
    { columnId, children, ...props }: TaskListProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    const tasksInColumn = useSelector(
      (state: RootState) => state.column.allColumns[columnId].taskIds,
    );

    return (
      <div ref={ref} {...props}>
        {tasksInColumn &&
          tasksInColumn.map((taskId: TaskId, index: number) => (
            <TaskItem key={taskId} taskId={taskId} index={index} />
          ))}
        {children}
      </div>
    );
  },
);

export default TaskList;
