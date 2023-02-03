import { PropsWithChildren } from 'react';
import Navbar from '@/components/Navbar';

// interface LayoutProps {
//   children: ReactNode;
// }

// const Layout: FC<LayoutProps> = ({ children }) => {
//   return <main>{children}</main>;
// };

// export default Layout;

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
