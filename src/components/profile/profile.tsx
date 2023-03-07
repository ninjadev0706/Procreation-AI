import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useWallet } from '@solana/wallet-adapter-react';
import AuthorInformation from '@/components/author/author-information';
import { authorData } from '@/data/static/author';
import { Check } from '@/components/icons/check';
import { Copy } from '@/components/icons/copy';
import Button from '@/components/ui/button';
import AnchorLink from '@/components/ui/links/anchor-link';
import Avatar from '@/components/ui/avatar';
import ProfileTab from '@/components/profile/profile-tab';

export default function Profile() {
  const [copyButtonStatus, setCopyButtonStatus] = useState(false);
  const wallet = useWallet();

  const [_, copyToClipboard] = useCopyToClipboard();
  function handleCopyToClipboard() {
    if (wallet.publicKey) {
      copyToClipboard(wallet.publicKey.toString());
      setCopyButtonStatus(true);
      setTimeout(() => {
        setCopyButtonStatus(copyButtonStatus);
      }, 2500);
    }
  }
  return (
    <div className="flex w-full flex-col pt-4 md:flex-row md:pt-10 lg:flex-row 3xl:pt-12">
      <div className="shrink-0 border-dashed border-gray-200 dark:border-gray-700 md:w-72 ltr:md:border-r md:ltr:pr-7 rtl:md:border-l md:rtl:pl-7 lg:ltr:pr-10 lg:rtl:pl-10 2xl:w-80 3xl:w-96 3xl:ltr:pr-14 3xl:rtl:pl-14">
        <div className="text-center ltr:md:text-left rtl:md:text-right">
          <h2 className="text-xl font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl">
            {authorData?.name}
          </h2>
          <div className="mt-1 text-sm font-medium tracking-tighter text-gray-600 dark:text-gray-400 xl:mt-3">
            @{authorData?.user_name}
          </div>
          <div className="md:max-w-auto mx-auto my-5 flex h-9 max-w-sm items-center rounded-full bg-white shadow-card dark:bg-light-dark md:mx-0 xl:mt-6">
            {wallet.publicKey ? (
              <>
                <div className="text truncate text-ellipsis bg-center text-xs text-gray-500 ltr:pl-4 rtl:pr-4 dark:text-gray-300 sm:text-sm">
                  {wallet?.publicKey?.toString()}
                </div>
                <div
                  title="Copy Address"
                  className="flex cursor-pointer items-center px-4 text-gray-500 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                  onClick={() => handleCopyToClipboard()}
                >
                  {copyButtonStatus ? (
                    <Check className="h-auto w-3.5 text-green-500" />
                  ) : (
                    <Copy className="h-auto w-3.5" />
                  )}
                </div>
              </>
            ) : (
              <div className="w-full text-center">Connect Wallet</div>
            )}
          </div>
        </div>
        <AuthorInformation className="hidden md:block" data={authorData} />
      </div>
      <div className="grow pt-6 pb-9 md:-mt-2.5 md:pt-1.5 md:pb-0 md:ltr:pl-7 md:rtl:pr-7 lg:ltr:pl-10 lg:rtl:pr-10 3xl:ltr:pl-14 3xl:rtl:pr-14">
        <ProfileTab />
      </div>
      <AuthorInformation data={authorData} />
    </div>
  );
}
