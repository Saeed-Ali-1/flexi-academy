import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMoodleQuery } from '../hooks/useMoodleQuery.js';
import { getMoodleClient } from '../api/moodleClient.js';
import OmniSearch from '../components/library/OmniSearch.jsx';
import CategoryPills from '../components/library/CategoryPills.jsx';
import CourseCard from '../components/library/CourseCard.jsx';
import UpcomingEvents from '../components/library/UpcomingEvents.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const { data: allCourses, isLoading } = useMoodleQuery(
    () => getMoodleClient().getCourses({}),
    []
  );

  const categories = useMemo(
    () => [...new Set((allCourses ?? []).map((c) => c.category))],
    [allCourses]
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (allCourses ?? []).filter((c) => {
      const matchesCategory = category === 'all' || c.category === category;
      const matchesSearch =
        !term ||
        c.title.toLowerCase().includes(term) ||
        c.subject.toLowerCase().includes(term) ||
        c.teacher.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [allCourses, search, category]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <header className="mb-7">
        <div className="eyebrow">Library</div>
        <h1 className="heading-display mt-1">Your courses.</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-soft">
          Search, filter, and dive in. Each tile shows where you are in the journey — no clicks to find out.
        </p>
      </header>

      <div className="grid gap-7 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <OmniSearch value={search} onChange={setSearch} />
          <CategoryPills categories={categories} active={category} onChange={setCategory} />

          <div className="text-xs text-muted">
            {isLoading ? 'Loading courses…' : `${filtered.length} of ${allCourses?.length ?? 0} courses`}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {isLoading
              ? [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-80 rounded-2xl" />)
              : (
                <AnimatePresence mode="popLayout">
                  {filtered.map((c, i) => (
                    <CourseCard key={c.id} course={c} index={i} />
                  ))}
                </AnimatePresence>
              )}
            {!isLoading && filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card col-span-full p-10 text-center text-muted"
              >
                No courses match your filters.
              </motion.div>
            )}
          </div>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <UpcomingEvents />
        </aside>
      </div>
    </div>
  );
}
