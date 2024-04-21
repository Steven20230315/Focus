import styled from 'styled-components';
import ProjectList from '../features/list/List';
import AddNewProject from '../features/list/AddList';

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
