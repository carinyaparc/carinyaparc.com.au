// app/recipes/[slug]/page.tsx
import '@/src/styles/pages/recipes.css';

import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import matter from 'gray-matter';
import { SchemaMarkup } from '@/src/components/ui/SchemaMarkup';
import { Breadcrumb } from '@/src/components/ui/Breadcrumb';

// Define the Recipe frontmatter interface
interface RecipeFrontmatter {
  title?: string;
  date?: string;
  author?: string;
  description?: string;
  servings?: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  ingredients?: string[];
  tags?: string[];
  [key: string]: unknown;
}

// Function to check if a recipe exists and get its data
function getRecipePath(slug: string): string | null {
  const mdxPath = path.join(process.cwd(), 'content', 'recipes', `${slug}.mdx`);

  if (fs.existsSync(mdxPath)) {
    return mdxPath;
  }

  return null;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Await the params promise
  const { slug } = await params;
  const recipePath = getRecipePath(slug);

  if (!recipePath) {
    return {
      title: 'Recipe Not Found - Carinya Parc',
      description: 'The requested recipe could not be found.',
    };
  }

  // Read the recipe content
  const source = fs.readFileSync(recipePath, 'utf8');
  const { data: frontmatter } = matter(source) as { data: RecipeFrontmatter };

  return {
    title: `${frontmatter.title || slug} - Recipe - Carinya Parc`,
    description: frontmatter.description || 'A delicious recipe from Carinya Parc',
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: frontmatter.author ? [frontmatter.author] : undefined,
    },
  };
}

// Generate static paths for the recipes
export function generateStaticParams(): Array<{ slug: string }> {
  const recipesDir = path.join(process.cwd(), 'content', 'recipes');
  const fileNames = fs.readdirSync(recipesDir);

  return fileNames.map((fileName) => ({
    slug: fileName.replace(/\.mdx$/, ''),
  }));
}

// Recipe page component
export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipePath = getRecipePath(slug);

  if (!recipePath) {
    notFound();
  }

  // Read the recipe content
  const source = fs.readFileSync(recipePath, 'utf8');
  const { data: frontmatter } = matter(source) as { data: RecipeFrontmatter };

  try {
    // Import the MDX file directly
    const Content = (
      await import(
        /* webpackInclude: /\.mdx$/ */
        /* webpackMode: "eager" */
        `@/content/recipes/${slug}.mdx`
      )
    ).default;

    // Function to format ISO duration to human readable format
    const formatDuration = (isoDuration?: string) => {
      if (!isoDuration) return null;

      // Basic parsing of PT15M format
      const minutes = isoDuration.match(/PT(\d+)M/)?.[1];
      const hours = isoDuration.match(/PT(\d+)H/)?.[1];

      if (hours && minutes) {
        return `${hours} hr ${minutes} min`;
      } else if (hours) {
        return `${hours} hr`;
      } else if (minutes) {
        return `${minutes} min`;
      }
      return isoDuration;
    };

    // Prepare recipe data for schema
    const recipeData = {
      name: frontmatter.title || slug,
      description: frontmatter.description || '',
      author: frontmatter.author || 'Carinya Parc',
      datePublished: frontmatter.date,
      prepTime: frontmatter.prepTime,
      cookTime: frontmatter.cookTime,
      totalTime: frontmatter.totalTime,
      recipeYield: frontmatter.servings?.toString(),
      recipeIngredient: frontmatter.ingredients,
    };

    return (
      <>
        {/* Schema markup for recipe */}
        <SchemaMarkup
          type="recipe"
          data={{
            recipe: recipeData,
          }}
        />

        <main className="isolate min-h-screen">
          <div className="relative isolate overflow-hidden py-24 sm:py-32">
            <div className="container mx-auto max-w-4xl px-4">
              {/* Breadcrumb navigation */}
              <Breadcrumb />

              <article className="recipe-prose">
                <h1>{frontmatter.title}</h1>

                {/* Recipe metadata */}
                <div className="recipe-meta">
                  {frontmatter.servings && (
                    <div className="recipe-meta-item">
                      <span className="recipe-meta-label">Servings</span>
                      <span className="recipe-meta-value">{frontmatter.servings}</span>
                    </div>
                  )}
                  {frontmatter.prepTime && (
                    <div className="recipe-meta-item">
                      <span className="recipe-meta-label">Prep Time</span>
                      <span className="recipe-meta-value">
                        {formatDuration(frontmatter.prepTime)}
                      </span>
                    </div>
                  )}
                  {frontmatter.cookTime && (
                    <div className="recipe-meta-item">
                      <span className="recipe-meta-label">Cook Time</span>
                      <span className="recipe-meta-value">
                        {formatDuration(frontmatter.cookTime)}
                      </span>
                    </div>
                  )}
                  {frontmatter.totalTime && (
                    <div className="recipe-meta-item">
                      <span className="recipe-meta-label">Total Time</span>
                      <span className="recipe-meta-value">
                        {formatDuration(frontmatter.totalTime)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Display ingredients if they're in the frontmatter */}
                {frontmatter.ingredients && frontmatter.ingredients.length > 0 && (
                  <div className="recipe-ingredients">
                    <h2>Ingredients</h2>
                    <ul>
                      {frontmatter.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Content />

                {/* Display tags if present */}
                {frontmatter.tags && frontmatter.tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="blog-tags">
                      {frontmatter.tags.map((tag, index) => (
                        <span key={index} className="blog-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>
          </div>
        </main>
      </>
    );
  } catch (error) {
    console.error('Error loading recipe MDX file:', error);
    notFound();
  }
}
