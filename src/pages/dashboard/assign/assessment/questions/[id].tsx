import { useQuery } from '@apollo/client'; 
import { useRouter } from 'next/router';

import { QUESTION_QUERY } from '@/apollo/queries/dashboard'; 
import SubLayout from '@/layout/SubLayout';

const QuestionPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useQuery(QUESTION_QUERY, {
    variables: { questionId: id }, 
  });

  const question = data?.question || {}; 

  return (
    <SubLayout>
      <div>
        <h1>{question.title}</h1> 
        <div>
            <p>{question.body?.text}</p>
        </div>
      </div>
    </SubLayout>
  );
};

export default QuestionPage;
