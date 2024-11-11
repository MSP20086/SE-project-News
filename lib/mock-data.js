export const mockArticles = Array(30)
  .fill(null)
  .map((_, i) => ({
    id: i + 1,
    title: `Article ${i + 1}`,
    excerpt: `This is a short excerpt for Article ${i +
      1}. It gives a brief overview of the article's content.`,
    image: `/placeholder.svg?height=200&width=300`,
    liked: false,
    disliked: false,
    bookmarked: false
  }))

export const categories = [
  "For You",
  "Entertainment",
  "Politics",
  "Environment",
  "Technology",
  "Sports"
]
