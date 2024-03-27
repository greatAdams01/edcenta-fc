import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import { TOPIC_QUERY } from '@/apollo/queries/dashboard'
import AppLayout from '@/layout/AppLayout'

const TopicPage = () => {
  const router = useRouter();
  const { id } = router.query;


  const { data } = useQuery(TOPIC_QUERY, {
    variables: { topicId: id },
  });

  const topic  = data?.TOPIC_QUERY || {}

  return (
    <AppLayout>
    <div>
      <h1>{topic.name}</h1>
      <p>{topic.description}</p>
    </div>
    </AppLayout>
  );
};

export default TopicPage;
