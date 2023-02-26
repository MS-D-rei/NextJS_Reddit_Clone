import { firestore } from '@/firebase/clientApp';
import { ICommunity } from '@/store/communitySlice';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);

    if (!communityDoc.exists()) {
      return {
        props: {
          communityData: ''
        }
      }
    }

    const communityDocData = communityDoc.data();
    // console.log(communityDocData);
    /* {
      numberOfMembers: 1,
      createAt: { seconds: 1677330119, nanoseconds: 136000000 },
      createId: 'sbm2HFxb5GVnIh501GI4H1zOhuo2',
      privacyType: 'public' } */
    const communityData = {
      ...communityDocData,
      id: communityDoc.id,
      createAt: communityDocData?.createAt?.toJSON(),
    };

    return {
      props: {
        communityData,
      },
    };
  } catch (err) {
    console.log(`getServerSideProps error: ${err}`);
  }
}

interface CommunityPageProps {
  communityData: ICommunity;
}

export default function CommunityPage({ communityData }: CommunityPageProps) {
  // console.log(communityData);

  if (!communityData) {
    return (
      <div>The community does not exist</div>
    )
  }

  return <div>{communityData.id}</div>;
}
