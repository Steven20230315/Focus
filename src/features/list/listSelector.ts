import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { List, ListId } from '../../types';

export const selectCurrentListId = (state: RootState): ListId | null => state.list.currentListId;

export const selectAllLists = (state: RootState) => state.list.allLists;

export const selectAllListIDsInOrder = (state: RootState) => state.list.listsOrder;

export const currentListDetails = (state: RootState): List | null => {
  // Check if currentListId is not null and is a valid key in allLists
  const currentListId = state.list.currentListId;
  if (currentListId && state.list.allLists[currentListId]) {
    return state.list.allLists[currentListId];
  }
  // Return null or an appropriate default value if currentListId is null or not found
  return null;
};

export const getCurrentListDetails = createSelector(
  [selectAllLists, selectCurrentListId],
  (allList: Record<ListId, List>, currentListId: ListId | null) => {
    if (!currentListId || !allList[currentListId]) {
      return null; // or return {} or any other default object as per your UI handling
    }
    return {
      listTitle: allList[currentListId].title,
      listId: allList[currentListId].listId,
    };
  },
);

export const getCurrentListTitle = createSelector(
  [selectAllLists, selectCurrentListId],
  (allList: Record<ListId, List>, currentListId: ListId | null) => {
    if (!currentListId || !allList[currentListId]) {
      return 'No List Selected'; // Provide default values
    }
    return allList[currentListId].title;
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

export const selectAllListTitles = createSelector(selectAllLists, (allList: Record<ListId, List>) => {
  return Object.values(allList).map((list: List) => list.title);
});
