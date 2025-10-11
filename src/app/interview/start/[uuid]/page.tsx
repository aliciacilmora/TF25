import InterviewStartPage from '../page';

export default function DynamicInterviewPage({ params }: { params: { uuid: string } }) {
  return <InterviewStartPage params={params} />;
}
