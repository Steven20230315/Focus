import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import type { Column, ColumnId, List } from "../../types";

export const selectCurrentList = (state: RootState) => state.list.currentList;

export const selectAllColumns = (state: RootState) => state.column.allColumns;

export const getCurrentListAndColumns = createSelector(
  [selectCurrentList, selectAllColumns],
  (currentList: List, allColumns: Record<ColumnId, Column>) => {
    const columnsInCurrentList = currentList.columnIds.map(
      (columnId: string) => allColumns[columnId] as Column,
    );
    return {
      currentList: currentList,
      columnsInCurrentList: columnsInCurrentList,
    };
  },
);
