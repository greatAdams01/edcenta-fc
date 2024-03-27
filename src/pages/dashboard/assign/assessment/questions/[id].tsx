import { useQuery } from '@apollo/client'; 
import { useRouter } from 'next/router';

import { QUESTION_QUERY } from '@/apollo/queries/dashboard'; 
import AppLayout from '@/layout/AppLayout';

const QuestionPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useQuery(QUESTION_QUERY, {
    variables: { questionId: id }, 
  });

  const question = data?.question || {}; 

  return (
    <AppLayout>
      <div>
        <h1>{question.title}</h1> 
        <div>
            <p>{question.body?.text}</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuestionPage;
