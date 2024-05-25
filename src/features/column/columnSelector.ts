import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Column, ColumnId, List, ListId, ColumnRole } from '../../types';
import { selectCurrentListId } from '../list/listSelector';
import { selectAllLists } from '../list/listSelector';

export const selectAllColumns = (state: RootState) => state.column.allColumns;

export const selectColumnsInUpdatedOrder = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allLists: Record<ListId, List>, currentListId: ListId | null, allColumns: Record<ColumnId, Column>) => {
    if (currentListId === null || !allLists[currentListId]) {
      return [];
      // return empty array if no current list or currentListId is null
    }
    const updatedColumnsOrder = allLists[currentListId].columnIds;
    return updatedColumnsOrder.map((columnId: ColumnId) => allColumns[columnId]);
  },
);

export const selectCurrentColumnRole = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allList: Record<ListId, List>, currentListId: ListId | null, allColumns: Record<ColumnId, Column>) => {
    if (
      currentListId === null ||
      !allList[currentListId] ||
      !allList[currentListId].columnIds ||
      !allColumns ||
      allList[currentListId].columnIds.length === 0
    ) {
      return {};
      // return empty object if no current list or currentListId is null or currentList does not
    }
    const currentColumnIds = allList[currentListId].columnIds;
    return currentColumnIds.reduce((acc: Record<ColumnId, ColumnRole>, columnId: ColumnId) => {
      if (allColumns[columnId]) {
        // Ensure the column exists before accessing its 'role'
        acc[columnId] = allColumns[columnId].role;
      } else {
        // Optionally handle the case where the column ID does not exist in allColumns
        acc[columnId] = 'None'; // or set to undefined, or simply skip setting
      }
      return acc;
    }, {});
  },
);

export const selectColumnIdsInCurrentList = createSelector(
  [selectAllLists, selectCurrentListId],
  (allList: Record<ListId, List>, currentListId: ListId | null) => {
    if (currentListId === null || !allList[currentListId]) {
      return [];
      // return empty array if no current list or currentListId is null
    }
    return allList[currentListId].columnIds;
  },
);
