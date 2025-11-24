import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  [key: string]: string | number | boolean | undefined;
}

export async function getFileBySlug(type: string, slug: string) {
  const filePath = path.join(process.cwd(), 'content', type, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const { content, data } = matter(fileContents);

  return {
    content,
    frontmatter: data as Frontmatter,
  };
}

export async function getAllFiles(type: string) {
  const filesPath = path.join(process.cwd(), 'content', type);
  const fileNames = fs.readdirSync(filesPath);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const filePath = path.join(filesPath, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');

      const { data } = matter(fileContents);

      return {
        slug,
        frontmatter: data as Frontmatter,
      };
    });

  return posts;
}
