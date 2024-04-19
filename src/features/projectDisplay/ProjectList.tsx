import { useSelector } from 'react-redux';
import { type Project } from '../../types';
import { selectOrderedProjects } from '../project/projectSelector';
import Link from '../../components/Link';
import { Droppable, type DroppableProvided } from '@hello-pangea/dnd';

// The expected behavior of the project list
// 1. Renders the list of projects when the component is mounted
// 2. Renders when the project list changes
// 3. Renders when the project list order changes

export default function ProjectList() {
	const projects = useSelector( selectOrderedProjects );
	console.log(projects);

	return (
		<Droppable droppableId='sidebar'>
			{(provided: DroppableProvided) => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					{projects.map((project: Project, index: number) => (
						<Link
							key={project.projectId}
							title={project.title}
							projectId={project.projectId}
							index={index}
						/>
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
}
