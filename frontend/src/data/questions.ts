import type { HomeworkGen } from './types';

/**
 * Original SAT-style question bank (amendment 4). All content is original —
 * not copied from any real test or prep book. Each question has 4 choices,
 * a correct index, and a short explanation shown on the review screen.
 *
 * ≥20 Math + ≥20 Reading & Writing. Solve sessions draw from the matching
 * pool (math homework → math bank, reading homework → R&W bank).
 */

export interface Question {
  stem: string;
  choices: string[];
  /** index into choices */
  answer: number;
  explanation: string;
}

export const MATH_BANK: Question[] = [
  {
    stem: 'If 3x + 7 = 22, what is the value of x?',
    choices: ['3', '5', '7', '9'],
    answer: 1,
    explanation: 'Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5.',
  },
  {
    stem: 'A line passes through (0, 4) with slope 2. What is its equation?',
    choices: ['y = 2x + 4', 'y = 4x + 2', 'y = 2x − 4', 'y = 0.5x + 4'],
    answer: 0,
    explanation: 'Slope-intercept form is y = mx + b. Here m = 2 and the y-intercept b = 4, so y = 2x + 4.',
  },
  {
    stem: 'If 5(x − 2) = 35, what is x?',
    choices: ['5', '7', '9', '11'],
    answer: 2,
    explanation: 'Divide both sides by 5: x − 2 = 7. Add 2: x = 9.',
  },
  {
    stem: 'What is the solution to the system y = x + 1 and y = 2x − 3?',
    choices: ['x = 2, y = 3', 'x = 4, y = 5', 'x = 3, y = 4', 'x = 1, y = 2'],
    answer: 1,
    explanation: 'Set x + 1 = 2x − 3, so 4 = x. Then y = 4 + 1 = 5. The lines cross at (4, 5).',
  },
  {
    stem: 'If f(x) = 2x² − 3, what is f(3)?',
    choices: ['9', '12', '15', '18'],
    answer: 2,
    explanation: 'f(3) = 2(3²) − 3 = 2(9) − 3 = 18 − 3 = 15.',
  },
  {
    stem: 'A shirt costs $40 after a 20% discount. What was the original price?',
    choices: ['$48', '$50', '$52', '$60'],
    answer: 1,
    explanation: '$40 is 80% of the original. Original = 40 ÷ 0.80 = $50.',
  },
  {
    stem: 'What is the slope of the line through (1, 2) and (5, 10)?',
    choices: ['1', '2', '3', '4'],
    answer: 1,
    explanation: 'Slope = (10 − 2) / (5 − 1) = 8 / 4 = 2.',
  },
  {
    stem: 'If 2x + 3y = 12 and x = 3, what is y?',
    choices: ['1', '2', '3', '4'],
    answer: 1,
    explanation: 'Substitute x = 3: 6 + 3y = 12, so 3y = 6 and y = 2.',
  },
  {
    stem: 'The ratio of boys to girls in a class is 3:4. If there are 12 boys, how many girls are there?',
    choices: ['9', '12', '16', '20'],
    answer: 2,
    explanation: 'Each ratio unit = 12 ÷ 3 = 4 students. Girls = 4 × 4 = 16.',
  },
  {
    stem: 'What is 15% of 260?',
    choices: ['26', '39', '45', '52'],
    answer: 1,
    explanation: '15% = 0.15. 0.15 × 260 = 39.',
  },
  {
    stem: 'If x² = 49 and x < 0, what is x?',
    choices: ['−7', '7', '−49', '49'],
    answer: 0,
    explanation: 'x = ±7, but since x < 0, x = −7.',
  },
  {
    stem: 'A car travels 180 miles in 3 hours. At the same rate, how far does it go in 5 hours?',
    choices: ['240 mi', '270 mi', '300 mi', '360 mi'],
    answer: 2,
    explanation: 'Rate = 180 ÷ 3 = 60 mph. Distance = 60 × 5 = 300 miles.',
  },
  {
    stem: 'Simplify: 4(2x + 3) − 2x.',
    choices: ['6x + 12', '6x + 3', '8x + 12', '10x + 3'],
    answer: 0,
    explanation: 'Distribute: 8x + 12 − 2x = 6x + 12.',
  },
  {
    stem: 'If the perimeter of a square is 36, what is its area?',
    choices: ['49', '64', '81', '144'],
    answer: 2,
    explanation: 'Side = 36 ÷ 4 = 9. Area = 9² = 81.',
  },
  {
    stem: 'What value of x satisfies (x/2) + 5 = 11?',
    choices: ['6', '8', '10', '12'],
    answer: 3,
    explanation: 'Subtract 5: x/2 = 6. Multiply by 2: x = 12.',
  },
  {
    stem: 'A triangle has angles measuring 40° and 75°. What is the third angle?',
    choices: ['55°', '65°', '75°', '115°'],
    answer: 1,
    explanation: 'Angles in a triangle sum to 180°. Third = 180 − 40 − 75 = 65°.',
  },
  {
    stem: 'If 3ⁿ = 81, what is n?',
    choices: ['2', '3', '4', '5'],
    answer: 2,
    explanation: '81 = 3⁴, so n = 4.',
  },
  {
    stem: 'The average of 4 numbers is 15. Three of them are 12, 18, and 20. What is the fourth?',
    choices: ['8', '10', '14', '16'],
    answer: 1,
    explanation: 'Sum = 15 × 4 = 60. Fourth = 60 − (12 + 18 + 20) = 60 − 50 = 10.',
  },
  {
    stem: 'What is the value of |−3 − 5|?',
    choices: ['2', '8', '−8', '−2'],
    answer: 1,
    explanation: '−3 − 5 = −8, and |−8| = 8.',
  },
  {
    stem: 'A rectangle is twice as long as it is wide. If its width is 6, what is its area?',
    choices: ['36', '48', '72', '96'],
    answer: 2,
    explanation: 'Length = 2 × 6 = 12. Area = 12 × 6 = 72.',
  },
  {
    stem: 'If 7x − 4 = 3x + 12, what is x?',
    choices: ['2', '3', '4', '5'],
    answer: 2,
    explanation: 'Subtract 3x: 4x − 4 = 12. Add 4: 4x = 16, so x = 4.',
  },
  {
    stem: 'A number increased by 25% becomes 75. What is the number?',
    choices: ['50', '55', '60', '65'],
    answer: 2,
    explanation: '1.25 × n = 75, so n = 75 ÷ 1.25 = 60.',
  },
];

export const READING_BANK: Question[] = [
  {
    stem: 'The committee’s decision was met with widespread ______, as few had expected such a bold move. Which word best fits?',
    choices: ['astonishment', 'indifference', 'fatigue', 'routine'],
    answer: 0,
    explanation: 'A "bold move" few expected would provoke surprise; "astonishment" matches, while the others suggest a lack of reaction.',
  },
  {
    stem: 'A passage argues that community gardens improve neighborhood health. Which detail would MOST strengthen the claim?',
    choices: [
      'A survey showing gardeners report lower stress and better diets',
      'The gardens are pleasant to look at',
      'Gardening is an ancient practice',
      'Some cities lack open space',
    ],
    answer: 0,
    explanation: 'Evidence tying gardens to measurable health outcomes directly supports the claim; the others are irrelevant or off-topic.',
  },
  {
    stem: 'The author’s primary purpose is best described as an effort to:',
    choices: [
      'persuade readers to support a specific policy',
      'describe a scientific process without opinion',
      'recount a personal childhood memory',
      'compare two unrelated novels',
    ],
    answer: 0,
    explanation: 'When a passage builds an argument toward a recommendation, its purpose is to persuade rather than merely describe or narrate.',
  },
  {
    stem: 'Her argument was cogent. The word "cogent" most nearly means:',
    choices: ['convincing', 'confusing', 'lengthy', 'emotional'],
    answer: 0,
    explanation: '"Cogent" describes reasoning that is clear and persuasive, i.e., convincing.',
  },
  {
    stem: 'Which choice best maintains the sentence’s formal tone? "The results were ______."',
    choices: ['inconclusive', 'kind of unclear', 'all over the place', 'a total mess'],
    answer: 0,
    explanation: '"Inconclusive" is precise and formal; the other options are casual or slang.',
  },
  {
    stem: 'Which transition best connects a cause to its effect?',
    choices: ['Consequently', 'However', 'Meanwhile', 'For instance'],
    answer: 0,
    explanation: '"Consequently" signals a result. "However" contrasts, "Meanwhile" shows time, "For instance" gives an example.',
  },
  {
    stem: 'Choose the option that corrects the underlined verb: "The list of ingredients ______ on the label."',
    choices: ['is printed', 'are printed', 'were printed', 'have printed'],
    answer: 0,
    explanation: 'The subject is "list" (singular), not "ingredients," so the singular verb "is" is correct.',
  },
  {
    stem: 'Which word best completes the sentence? "The scientist remained ______, refusing to accept the theory without more data."',
    choices: ['skeptical', 'gullible', 'careless', 'enthusiastic'],
    answer: 0,
    explanation: 'Refusing to accept a claim without evidence describes a "skeptical" attitude.',
  },
  {
    stem: 'Select the choice that best combines the ideas: "The bridge was old. The bridge was still safe."',
    choices: ['The bridge was old but still safe.', 'The bridge was old, it was safe.', 'The bridge, old, safe.', 'Old and safe was the bridge being.'],
    answer: 0,
    explanation: '"But" concisely joins the two clauses and shows the contrast between age and safety.',
  },
  {
    stem: 'In context, "novel" most nearly means: "Her novel approach surprised the panel."',
    choices: ['new', 'fictional', 'lengthy', 'difficult'],
    answer: 0,
    explanation: 'Here "novel" is an adjective meaning new or original, not a book.',
  },
  {
    stem: 'Which choice provides the best supporting evidence that a policy reduced traffic?',
    choices: [
      'Average commute times fell 18% after the policy began',
      'Drivers said they disliked the change',
      'The policy was widely reported in the news',
      'The city has many roads',
    ],
    answer: 0,
    explanation: 'A measurable drop in commute times is direct evidence of reduced traffic; opinions and popularity are not.',
  },
  {
    stem: 'Choose the most concise version: "Due to the fact that it rained, the game was postponed."',
    choices: ['Because it rained, the game was postponed.', 'Owing to the rain fact, the game postponed.', 'It rained, so postponed the game was.', 'The game, rained, was postponed.'],
    answer: 0,
    explanation: '"Because" replaces the wordy "due to the fact that" without losing meaning.',
  },
  {
    stem: 'Which punctuation correctly joins these clauses? "The lab closed early ___ the experiment was finished."',
    choices: ['; ', ', ', ' ', ' but,'],
    answer: 0,
    explanation: 'Two independent clauses can be joined with a semicolon. A comma alone would create a splice.',
  },
  {
    stem: '"Ephemeral" most nearly means:',
    choices: ['short-lived', 'permanent', 'colorful', 'expensive'],
    answer: 0,
    explanation: '"Ephemeral" describes something that lasts a very short time.',
  },
  {
    stem: 'Which sentence uses the apostrophe correctly?',
    choices: ["The students’ projects were displayed.", "The student's projects, were displayed.", "The students projects’ were displayed.", "The students’ project's were displayed."],
    answer: 0,
    explanation: 'For a plural noun ending in -s, the possessive apostrophe follows the s: students’.',
  },
  {
    stem: 'The passage most strongly suggests that the narrator feels ______ about leaving home.',
    choices: ['conflicted', 'indifferent', 'delighted', 'furious'],
    answer: 0,
    explanation: 'When a narrator shows both sadness and hope, "conflicted" best captures the mixed feeling.',
  },
  {
    stem: 'Choose the word that best fits: "The instructions were so ______ that no one could follow them."',
    choices: ['convoluted', 'straightforward', 'brief', 'helpful'],
    answer: 0,
    explanation: 'If no one could follow them, the instructions were "convoluted" (overly complex).',
  },
  {
    stem: 'Which revision best corrects the dangling modifier? "Walking to school, the rain soaked my jacket."',
    choices: ['Walking to school, I got my jacket soaked by the rain.', 'The rain, walking to school, soaked my jacket.', 'Walking to school the jacket rain soaked.', 'Soaked walking, the rain jacket to school.'],
    answer: 0,
    explanation: 'The modifier "walking to school" must describe a person (I), not the rain.',
  },
  {
    stem: 'A writer wants to add a detail that emphasizes urgency. Which sentence works best?',
    choices: [
      'The deadline was only hours away, and nothing was ready.',
      'The deadline was on a Tuesday.',
      'The office had a nice view.',
      'The team had met before.',
    ],
    answer: 0,
    explanation: 'Highlighting the shrinking time and lack of readiness conveys urgency; the others are neutral facts.',
  },
  {
    stem: '"Meticulous" most nearly means:',
    choices: ['careful and precise', 'lazy', 'loud', 'generous'],
    answer: 0,
    explanation: '"Meticulous" describes showing great attention to detail — careful and precise.',
  },
  {
    stem: 'Which choice best maintains parallel structure? "She likes hiking, swimming, and ______."',
    choices: ['cycling', 'to cycle', 'cycled', 'a cycle'],
    answer: 0,
    explanation: 'To match "hiking" and "swimming" (gerunds), the third item should be "cycling."',
  },
  {
    stem: 'The main idea of a passage is best found by:',
    choices: [
      'identifying the point the author supports throughout',
      'reading only the first sentence',
      'counting how often a word appears',
      'looking at the longest paragraph',
    ],
    answer: 0,
    explanation: 'The main idea is the central claim the whole passage develops, not a single line or word frequency.',
  },
];

/** Deterministic pool selection for a solve session (math homework → math bank). */
export function questionsFor(gen: HomeworkGen | undefined, count: number): Question[] {
  const bank = gen === 'read' ? READING_BANK : MATH_BANK;
  const out: Question[] = [];
  for (let i = 0; i < count; i++) out.push(bank[i % bank.length]);
  return out;
}
