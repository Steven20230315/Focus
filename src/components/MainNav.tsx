import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 70px;
	width: 100%;
	background-color: black;
	color: white;
	padding: 0.5rem;
`;

export default function MainNav() {
	return <Container>main</Container>;
}
