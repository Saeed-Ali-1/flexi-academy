import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, BookOpen, PlayCircle, Brain, MessageSquareQuote, Sparkles } from 'lucide-react';
import { cn } from '../../lib/classNames.js';
import { getMoodleClient } from '../../api/moodleClient.js';

const TYPE_META = {
  'minds-on': { Icon: Brain, label: 'Minds on', className: 'text-iris-soft bg-iris/10 border-iris/30' },
  reading: { Icon: BookOpen, label: 'Reading', className: 'text-aurora-soft bg-aurora/10 border-aurora/30' },
  video: { Icon: PlayCircle, label: 'Watch', className: 'text-amber-warm bg-amber-warm/10 border-amber-warm/30' },
  check: { Icon: CheckCircle2, label: 'Check', className: 'text-iris-soft bg-iris/10 border-iris/30' },
  reflection: { Icon: MessageSquareQuote, label: 'Reflect', className: 'text-aurora-soft bg-aurora/10 border-aurora/30' },
};

function ChoiceQuestion({ activity, onSolved }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const correct = activity.answerIndex;

  const choose = (i) => {
    setSelected(i);
    setRevealed(true);
    if (i === correct) onSolved?.();
  };

  return (
    <div>
      <p className="text-alabaster">{activity.prompt}</p>
      <div className="mt-4 grid gap-2.5">
        {activity.choices.map((choice, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correct;
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={revealed}
              className={cn(
                'group flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                !revealed && 'border-white/10 bg-white/[0.03] hover:border-iris/40 hover:bg-iris/5',
                revealed && isCorrect && 'border-aurora/40 bg-aurora/10',
                revealed && isSelected && !isCorrect && 'border-danger/40 bg-danger/10',
                revealed && !isSelected && !isCorrect && 'border-white/[0.06] bg-white/[0.02] opacity-60'
              )}
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-muted-soft">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-alabaster">{choice}</span>
              {revealed && isCorrect && <CheckCircle2 size={16} className="text-aurora-soft" />}
            </button>
          );
        })}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn(
              'mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm',
              selected === correct
                ? 'border-aurora/30 bg-aurora/10 text-aurora-soft'
                : 'border-iris/30 bg-iris/10 text-iris-soft'
            )}
          >
            <Sparkles size={16} className="mt-0.5 shrink-0" />
            <div>
              <strong className="text-alabaster">
                {selected === correct ? 'Nice — exactly right.' : "Not quite. Here's why:"}
              </strong>
              <p className="mt-1 text-alabaster/80">{activity.rationale}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReflectionPrompt({ activity, onSubmit }) {
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <p className="text-alabaster">{activity.prompt}</p>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Take a breath. Write what you actually think."
        className="input-base mt-3 min-h-[96px] resize-none"
        disabled={submitted}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>{text.length} chars</span>
        {!submitted ? (
          <button
            disabled={text.trim().length < 20}
            onClick={() => {
              setSubmitted(true);
              onSubmit?.();
            }}
            className="btn-primary !py-2 !text-xs"
          >
            Submit reflection
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-aurora-soft">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

export default function ActivityBlock({ activity, lessonId, onComplete }) {
  const meta = TYPE_META[activity.type] ?? TYPE_META.reading;
  const Icon = meta.Icon;
  const [completion, setCompletion] = useState(activity.completion);

  const handleComplete = async () => {
    setCompletion(100);
    await getMoodleClient().markActivityComplete(lessonId, activity.id);
    onComplete?.();
  };

  return (
    <motion.section
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-card grain p-6 sm:p-8"
    >
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={cn('grid h-10 w-10 place-items-center rounded-xl border', meta.className)}>
            <Icon size={18} />
          </span>
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">{meta.label}</div>
            <h3 className="font-display text-xl leading-tight">{activity.title}</h3>
          </div>
        </div>
        {completion >= 100 ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-aurora/30 bg-aurora/10 px-3 py-1 text-xs font-semibold text-aurora-soft">
            <CheckCircle2 size={13} /> Complete
          </span>
        ) : (
          <button onClick={handleComplete} className="btn-ghost !py-1.5 !text-xs">
            Mark complete
          </button>
        )}
      </header>

      {activity.type === 'minds-on' && (
        <>
          <p className="mb-5 text-alabaster/90">{activity.body}</p>
          <ChoiceQuestion activity={activity} onSolved={handleComplete} />
        </>
      )}

      {activity.type === 'reading' && (
        <article className="prose-invert max-w-none text-base leading-relaxed text-alabaster/90">
          {activity.body}
        </article>
      )}

      {activity.type === 'video' && (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-black/40">
          <iframe
            src={activity.videoEmbed}
            title={activity.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {activity.type === 'check' && <ChoiceQuestion activity={activity} onSolved={handleComplete} />}

      {activity.type === 'reflection' && (
        <ReflectionPrompt activity={activity} onSubmit={handleComplete} />
      )}
    </motion.section>
  );
}
