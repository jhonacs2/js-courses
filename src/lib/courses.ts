import { getCollection } from 'astro:content';

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  duration: string;
  type: string;
  order: number;
  topics?: string[];
}

export interface SectionMeta {
  slug: string;
  title: string;
  order: number;
  color: string;
  duration: string;
  lessons: LessonMeta[];
}

const sectionFiles = import.meta.glob('../content/lessons/**/section.json', { eager: true }) as Record<string, any>;

function getSectionMeta(courseSlug: string, sectionFolder: string): Omit<SectionMeta, 'lessons'> {
  const key = `../content/lessons/${courseSlug}/${sectionFolder}/section.json`;
  const data = sectionFiles[key];
  const d = data?.default ?? data ?? {};
  return {
    slug: sectionFolder,
    title: d.title ?? sectionFolder,
    order: d.order ?? 99,
    color: d.color ?? '#666',
    duration: d.duration ?? '',
  };
}

export async function getCourseSections(courseSlug: string): Promise<SectionMeta[]> {
  const allLessons = await getCollection('lessons', (entry) => {
    return entry.id.startsWith(`${courseSlug}/`);
  });

  const sectionMap = new Map<string, LessonMeta[]>();

  for (const lesson of allLessons) {
    const parts = lesson.id.split('/');
    if (parts.length < 3) continue;

    const sectionFolder = parts[1];
    const lessonSlug = parts[2].replace(/\.(mdx?|md)$/, '');

    if (!sectionMap.has(sectionFolder)) {
      sectionMap.set(sectionFolder, []);
    }

    sectionMap.get(sectionFolder)!.push({
      slug: lessonSlug,
      title: lesson.data.title,
      description: lesson.data.description,
      duration: lesson.data.duration,
      type: lesson.data.type,
      order: lesson.data.order,
      topics: lesson.data.topics,
    });
  }

  const sections: SectionMeta[] = [];
  for (const [sectionFolder, lessonList] of sectionMap) {
    const meta = getSectionMeta(courseSlug, sectionFolder);
    sections.push({
      ...meta,
      lessons: lessonList.sort((a, b) => a.order - b.order),
    });
  }

  return sections.sort((a, b) => a.order - b.order);
}

export function flattenLessons(sections: SectionMeta[]): Array<{ sectionSlug: string; lesson: LessonMeta }> {
  return sections.flatMap(section =>
    section.lessons.map(lesson => ({ sectionSlug: section.slug, lesson }))
  );
}
