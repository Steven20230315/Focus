import styled from "styled-components";
import { useSelector } from "react-redux";
import CreateTask from "../features/task/CreateTask";
import { getCurrentListIdAndTitle } from "../features/list/listSelector";
import ColumnList from "../features/column/ColumnList";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .display {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6rem;
    border: 1px solid black;
  }
`;

export default function View() {
  // The view component only receives the list id and list title of the current list.
  // Changes to the columnIds or columnIdsOrder of the current list will not cause a re-render
  const { listTitle } = useSelector(getCurrentListIdAndTitle);
  return (
    <Container className="container col-span-3 bg-stone-100">
      view
      <h2>{listTitle}</h2>
      <CreateTask />
      <ColumnList />
    </Container>
  );
}
