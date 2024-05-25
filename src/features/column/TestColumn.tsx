import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase-config';
import { useState, useEffect } from 'react';

interface Column {
  id: string; // Document ID
  title: string; // Example field
  listId: string;
  userId: string;
}

export default function TestColumn({ listId }: { listId: string }) {
  const [columns, setColumns] = useState<Column[]>([]); // Initialize state with an empty array of Columns

  useEffect(() => {
    const listRef = doc(db, 'lists', listId);
    const columnsCollectionRef = collection(db, 'columns');
    const q = query(columnsCollectionRef, where('listId', '==', listRef));

    const getColumns = async () => {
      try {
        const querySnapshot = await getDocs(q);
        const fetchedColumns = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Column),
          id: doc.id,
        }));
        console.log(fetchedColumns);
        setColumns(fetchedColumns); // Set the state with the fetched data
      } catch (error) {
        console.error('Error fetching columns: ', error);
      }
    };

    getColumns();
  }, [listId]); // Dependency array to re-run the effect when listRef changes

  return <div>{columns.map((column) => column.title)}</div>;
}
