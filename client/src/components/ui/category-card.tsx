import { Link } from "wouter";
import { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { name, slug, imageUrl } = category;

  return (
    <Link href={`/products?category=${slug}`}>
      <a className="group relative rounded-xl overflow-hidden h-40 md:h-56 block">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
          <h3 className="text-xl font-semibold text-white">{name}</h3>
        </div>
      </a>
    </Link>
  );
}
