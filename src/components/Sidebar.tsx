import styled from 'styled-components';
import ProjectList from '../features/projectDisplay/ProjectList';
import AddNewProject from '../features/project/AddNewProject';

const Container = styled.div``;

export default function Sidebar() {
	return (
		<Container className='container'>
			sidebar
			<ProjectList />
			<AddNewProject />
		</Container>
	);
}
