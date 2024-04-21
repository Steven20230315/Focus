import styled from 'styled-components';

interface ContainerProps {
	$active: boolean;
}

const Container = styled.div<ContainerProps>`
	border: 1px solid lightgray;
	padding: 0.5rem;
	margin: 0.5rem;
	text-align: center;
	&:hover {
		background-color: lightgray;
		cursor: pointer;
	}
	background-color: ${({ $active }) => {
		return $active ? '#413030' : 'transparent';
	}};
`;

export default Container;
