import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { TOPIC_QUERY } from '@/apollo/queries/dashboard'
import SubLayout from '@/layout/SubLayout'

const TopicPage = () => {
  const router = useRouter();
  const { id } = router.query;


  const { data } = useQuery(TOPIC_QUERY, {
    variables: { topicId: id },
  });

  const topic  = data?.TOPIC_QUERY || {}

  return (
    <SubLayout>
    <div>
      <h1>{topic.name}</h1>
      <p>{topic.description}</p>
    </div>
    </SubLayout>
  );
};

export default TopicPage;
