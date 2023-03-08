import { useEffect} from 'react';
import { ICommunity } from '@/store/communitySlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllPosts } from '@/store/postSlice';

interface PostListProps {
  communityData: ICommunity;
}

export default function PostList({ communityData }: PostListProps) {
  const dispatch = useAppDispatch();

  const postState = useAppSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts({ communityId: communityData.id }));
  }, []);

  return (
    <>
      {postState.posts.map((post) => (
        <div key={post.id}>{post.id}</div>
      ))}
    </>
  );
}
