import { useModal } from '@/components/modal-views/context';
import AnchorLink from '@/components/ui/links/anchor-link';
import cn from 'classnames';
import Image from '@/components/ui/image';
import AuctionCountdown from '@/components/nft/auction-countdown';
import Button from '@/components/ui/button';
import Avatar1 from '@/assets/images/avatar/3.png';

interface NftFooterProps {
  className?: string;
  currentBid: any;
  auctionTime: Date | string | number;
  isAuction?: boolean;
  price?: number;
}

export default function NftFooter({
  className = 'md:hidden',
  currentBid,
  auctionTime,
  isAuction,
  price,
}: NftFooterProps) {
  const { openModal } = useModal();
  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 bg-body dark:bg-dark md:-mx-2',
        className
      )}
    >
      <div className="-mx-4 border-t-2 border-gray-900 px-4 pt-4 pb-5 dark:border-gray-700 sm:-mx-6 sm:px-6 md:mx-2 md:px-0 md:pt-5 lg:pt-6 lg:pb-7">
        <div className="grid grid-cols-2 gap-3">
          <Button shape="rounded">
            {isAuction ? 'PLACE A BID' : `BUY FOR ${price} ETH`}
          </Button>
          <Button
            shape="rounded"
            variant="solid"
            color="gray"
            className="dark:bg-gray-800"
            onClick={() => openModal('SHARE_VIEW')}
          >
            SHARE
          </Button>
        </div>
      </div>
    </div>
  );
}
