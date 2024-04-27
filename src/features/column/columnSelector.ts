import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { Column, ColumnId, List, ListId, ColumnRole } from '../../types';
import { selectCurrentListId } from '../list/listSelector';
import { selectAllLists } from '../list/listSelector';

export const selectAllColumns = (state: RootState) => state.column.allColumns;

export const selectColumnsInUpdatedOrder = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allLists: Record<ListId, List>, currentListId: ListId, allColumns: Record<ColumnId, Column>) => {
    const updatedColumnsOrder = allLists[currentListId].columnIdsOrder;
    return updatedColumnsOrder.map((columnId: ColumnId) => {
      return allColumns[columnId];
    });
  },
);

export const selectColumnsInOriginalOrder = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allLists: Record<ListId, List>, currentListId: ListId, allColumns: Record<ColumnId, Column>) => {
    const originalColumnsOrder = allLists[currentListId].columnIds;
    return originalColumnsOrder.map((columnId: ColumnId) => {
      return allColumns[columnId];
    });
  },
);

export const selectCurrentColumnRole = createSelector(
  [selectAllLists, selectCurrentListId, selectAllColumns],
  (allList: Record<ListId, List>, currentListId: ListId, allColumns: Record<ColumnId, Column>) => {
    const currentColumnIds = allList[currentListId].columnIds;
    return currentColumnIds.reduce((acc: Record<ColumnId, ColumnRole>, columnId: ColumnId) => {
      acc[columnId] = allColumns[columnId].role;
      return acc;
    }, {});
  },
);
