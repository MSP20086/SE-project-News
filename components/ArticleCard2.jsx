import Image from "next/image"
import { Heart, Bookmark, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link" 

export function ArticleCard({ article, onLike, onDislike, onBookmark }) {
  return (
      <Card className="overflow-hidden transition-transform transform hover:scale-105">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 h-48 sm:h-auto relative">
            {article.image_url && article.image_url !== "No Image" ? (
              <Image
                src={article.image_url}
                alt={article.title}
                width={300}
                height={200}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p>No Image Available</p>
              </div>
            )}
          </div>
          <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
            <CardContent className="p-0">
            <Link href={`/articlepage/${article._id}`} className="block"> 
              <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
              </Link>
              <p className="text-muted-foreground">{article.excerpt}</p>
              {article.summarized_content && (
                <p className="mt-2 text-gray-700 italic">{article.summarized_content}</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end p-0 mt-4 space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onLike(article.id); }}
                className={article.liked ? "text-green-500" : ""}
                aria-label={article.liked ? "Unlike" : "Like"}
              >
                <Heart className={`h-5 w-5 ${article.liked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onDislike(article.id); }} 
                className={article.disliked ? "text-red-500" : ""}
                aria-label={article.disliked ? "Remove dislike" : "Dislike"}
              >
                <ThumbsDown className={`h-5 w-5 ${article.disliked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); onBookmark(article.id); }}
                className={article.bookmarked ? "text-blue-500" : ""}
                aria-label={article.bookmarked ? "Remove from bookmarks" : "Bookmark"}
              >
                <Bookmark className={`h-5 w-5 ${article.bookmarked ? "fill-current" : ""}`} />
              </Button>
            </CardFooter>
          </div>
        </div>
      </Card>
  )
}
