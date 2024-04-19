import MainNav from './components/MainNav';
import Sidebar from './components/Sidebar';
import View from './components/View';
import styled from 'styled-components';

const Container = styled.div`
	display: grid;
	grid-template-columns: 300px 1fr;
`;

function App() {
	return (
		<>
			<MainNav />
			<Container>
				<Sidebar />
				<View />
			</Container>
		</>
	);
}

export default App;
