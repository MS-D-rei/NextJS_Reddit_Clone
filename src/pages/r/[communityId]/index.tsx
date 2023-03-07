import { GetServerSidePropsContext } from 'next';
import { doc, getDocFromServer } from 'firebase/firestore';
import { firestore } from '@/firebase/clientApp';
import { ICommunity } from '@/store/communitySlice';
import CommunityNotFound from '@/components/Community/CommunityNotFound';
import Header from '@/components/Community/Header';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import CreatePostLink from '@/components/Community/CreatePostLink';

interface CommunityPageProps {
  communityData: ICommunity;
}

export default function CommunityPage({ communityData }: CommunityPageProps) {
  console.log(communityData);

  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <div>1st post</div>
        </>
        <>right side content</>
      </PageContentLayout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // console.log(context.query.communityId);

  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string
    );
    const communityDoc = await getDocFromServer(communityDocRef);
    // console.log(communityDoc);

    if (!communityDoc.exists()) {
      console.log('communityDoc does not exist')
      return {
        props: {
          communityData: '',
        },
      };
    }

    // extract data from community document snapshot
    const communityDocData = communityDoc.data() as ICommunity;
    // console.log(communityDocData);
    /* { id: 'FirstCommu',
    creatorId: 'sbm2HFxb5GVnIh501GI4H1zOhuo2',
    numberOfMembers: 1,
    privacyType: 'public',
    createdAt: { seconds: 1678166418, nanoseconds: 911000000 }} */
    const communityData: ICommunity = JSON.parse(JSON.stringify({
      id: communityDocData.id,
      creatorId: communityDocData.creatorId,
      numberOfMembers: communityDocData.numberOfMembers,
      privacyType: communityDocData.privacyType,
      createdAt: communityDocData.createdAt,
    }));

    // console.log(communityData);

    return {
      props: {
        communityData,
      },
    };
  } catch (err) {
    console.log(`getServerSideProps error: ${err}`);
  }
}
