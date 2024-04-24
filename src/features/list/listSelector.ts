import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { List, ListId } from '../../types';

export const selectCurrentListId = (state: RootState) =>
  state.list.currentListId;

export const selectAllLists = (state: RootState) =>
  state.list.allLists;

export const selectAllListIDsInOrder = (state: RootState) =>
  state.list.listsOrder;

export const currentListDetails = (state: RootState) =>
  state.list.allLists[state.list.currentListId];

export const getCurrentListDetails = createSelector(
  [selectAllLists, selectCurrentListId],
  (
    allList: Record<ListId, List>,
    currentListId: ListId,
  ) => {
    return {
      listTitle: allList[currentListId].title,
      listId: allList[currentListId].listId,
    };
  },
);

export const getCurrentListIdAndTitle = createSelector(
  [selectAllLists, selectCurrentListId],
  (
    allList: Record<ListId, List>,
    currentListId: ListId,
  ) => {
    // This will be reevaluated when allList or currentListId changes

    return {
      listId: allList[currentListId].listId,
      listTitle: allList[currentListId].title,
    };
  },
);

export const getAllListTitlesAndIdsInOrder = createSelector(
  [selectAllLists, selectAllListIDsInOrder],
  (allList: Record<ListId, List>, allListIds: ListId[]) => {
    return allListIds.map((listId: ListId) => {
      return {
        listId: allList[listId].listId,
        listTitle: allList[listId].title,
      };
    });
  },
);
