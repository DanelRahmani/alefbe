// Print every lesson-quiz question: lesson key, index, prompt, answers.
// Used to pick the placement check's questions by hand.
//   npx tsx scripts/quizzes.ts [unit-slug…] < /dev/null

import { LESSON_QUIZZES } from "../content/lesson-quizzes";

const only = process.argv.slice(2);
for (const [key, l] of Object.entries(LESSON_QUIZZES)) {
  if (only.length && !only.includes(key.split("/")[0])) continue;
  console.log(`\n## ${l.number} ${key}: ${l.title}`);
  l.questions.forEach((q, i) => {
    console.log(`  [${i}] (${q.lang}) ${q.prompt}`);
    console.log(`      = ${q.answers.join(" | ")}`);
  });
}
