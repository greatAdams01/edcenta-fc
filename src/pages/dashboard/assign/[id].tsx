import { GetServerSideProps } from 'next';
import { classes } from '@/utils/nav';

interface ClassData {
  subjects: { _id: string, name: string }[]; 
}

interface RouteParams {
  _id: string;
}

const editAssign = ({ data }: { data: ClassData }) => {
  const { subjects } = data;

  const subjectNames = subjects.map(subject => subject.name);

  return (
    <div className='p-4'>
      <form>
        <ul>
          {subjectNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params || {};

  if (id) {
    for (const classItem of classes) {
      const subject = classItem.subjects.find(subject => subject._id === id);
      if (subject) {
        return {
          props: {
            data: { subjects: [subject] }, 
          },
        };
      }
    }
  }
  
  return {
    notFound: true,
  };
};

export default editAssign
