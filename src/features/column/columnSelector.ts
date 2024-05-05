import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Column, ColumnId, List, ListId, ColumnRole } from '../../types';
import { selectCurrentListId } from '../list/listSelector';
import { selectAllLists } from '../list/listSelector';

export const selectAllColumns = (state: RootState) => state.column.allColumns;

export const selectColumnsInUpdatedOrder = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allLists: Record<ListId, List>, currentListId: ListId, allColumns: Record<ColumnId, Column>) => {
    const updatedColumnsOrder = allLists[currentListId].columnIds;
    return updatedColumnsOrder.map((columnId: ColumnId) => {
      return allColumns[columnId];
    });
  },
);

export const selectCurrentColumnRole = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allList: Record<ListId, List>, currentListId: ListId, allColumns: Record<ColumnId, Column>) => {
    const currentList = allList[currentListId];
    if (!currentList) return {};
    const currentColumnIds = allList[currentListId].columnIds;
    return currentColumnIds.reduce((acc: Record<ColumnId, ColumnRole>, columnId: ColumnId) => {
      acc[columnId] = allColumns[columnId].role;
      return acc;
    }, {});
  },
);

export const selectColumnIdsInCurrentList = createSelector(
  [selectAllLists, selectCurrentListId],
  (allList: Record<ListId, List>, currentListId: ListId) => {
    const currentList = allList[currentListId];
    if (!currentList) return [];
    return currentList.columnIds;
  },
);
