"use client"
import Image from 'next/image';
import Link from 'next/link';

const ArticleCard = ({ title, imageUrl, category, slug }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <Link href={`/articlepage/${slug}`} className="block flex-grow">
        <div className="relative aspect-video">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="transition-transform duration-300 hover:scale-105 object-cover"
          />
        </div>
        <div className="p-4 flex-grow">
          <span className="text-sm font-semibold text-blue-600 mb-2 block">{category}</span>
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h2>
        </div>
      </Link>
    </div>
  );
};

export default ArticleCard;
