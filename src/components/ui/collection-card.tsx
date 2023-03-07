import Image from '@/components/ui/image';
import cn from 'classnames';
import { StaticImageData } from 'next/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import Avatar from '@/components/ui/avatar';

type ItemType = {
  id?: string | number;
  name: string;
  slug: string;
  title: string;
  cover_image: StaticImageData;
  image?: StaticImageData;
  number_of_artwork: number;
  user: {
    avatar?: StaticImageData;
    name: string;
    slug: string;
  };
};
type CardProps = {
  item: ItemType;
  className?: string;
};

export default function CollectionCard({ item, className = '' }: CardProps) {
  const { name, slug, title, cover_image, image, number_of_artwork, user } =
    item ?? {};
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <div className="relative flex aspect-[8/11] w-full justify-center overflow-hidden rounded-lg">
        <Image
          src={cover_image}
          placeholder="blur"
          layout="fill"
          quality={100}
          objectFit="cover"
          alt={name}
        />
      </div>
      <div className="absolute top-0 left-0 z-[5] flex h-full w-full flex-col justify-between bg-gradient-to-t from-black p-5 md:p-6">
        {/* <div className="flex justify-between gap-3">
          <div
            className="inline-flex h-8 shrink-0 items-center rounded-2xl bg-white/20 px-4 text-xs font-medium uppercase -tracking-wide text-white
          backdrop-blur-[40px]"
          >
            {name}
          </div>
          {image && <Avatar image={image} alt={name} shape="rounded" />}
        </div> */}
        <div className="my-3 block flex h-full flex-col justify-between text-center">
          <h2 className="mb-1.5 truncate text-lg font-medium -tracking-wider text-white">
            {title}
          </h2>
          {/* <div className="text-sm font-medium -tracking-wide text-[#B6AAA2]">
            {number_of_artwork} Artworks
          </div> */}
          <div>
            <AnchorLink
              href={slug}
              className="relative z-10 mt-3.5 inline-flex items-center rounded-3xl bg-white/20 p-2 backdrop-blur-[40px]"
            >
              <div className="truncate text-sm -tracking-wide text-white ltr:ml-2 ltr:pr-2 rtl:mr-2 rtl:pl-2">
                View Details
              </div>
            </AnchorLink>
          </div>
        </div>
      </div>
    </div>
  );
}
