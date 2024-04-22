import styled from "styled-components";
import ProjectList from "../features/list/List";
import CreateList from "../features/list/CreateList";

const Container = styled.div``;

export default function Sidebar() {
  return (
    <Container className="flex flex-col gap-2 bg-slate-100 p-2">
      <ProjectList />
      <CreateList />
    </Container>
  );
}
