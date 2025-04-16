import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li className="flex items-center">
          <Link href="/">
            <a className="flex items-center text-muted-foreground hover:text-foreground">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </a>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            {index === items.length - 1 || !item.href ? (
              <span className="ml-1 font-medium">{item.label}</span>
            ) : (
              <Link href={item.href}>
                <a className="ml-1 text-muted-foreground hover:text-foreground">
                  {item.label}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
