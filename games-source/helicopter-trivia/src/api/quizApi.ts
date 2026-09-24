import type { QuizQuestion } from '@/game/gameTypes'

const TIMEOUT_MS = 8_000

const FALLBACK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Which rotor provides anti-torque counter-rotation in a conventional helicopter?',
    options: ['Tail Rotor', 'Main Rotor', 'Mast Rotor', 'Turbine Impeller'],
    answer: 'Tail Rotor',
    hint: 'It is mounted horizontally on the vertical tail boom.',
  },
  {
    question: 'What physical principle allows helicopter rotor blades to generate aerodynamic lift?',
    options: ['Bernoulli Principle', 'Newton Gravitation', 'Archimedes Buoyancy', 'Doppler Shift'],
    answer: 'Bernoulli Principle',
    hint: 'Airfoil pressure differential between upper and lower blade camber.',
  },
  {
    question: 'Which famous attack helicopter is officially nicknamed the "Flying Tank" (AH-64)?',
    options: ['Apache', 'Cobra', 'Black Hawk', 'Chinook'],
    answer: 'Apache',
    hint: 'Named after the legendary Native American warrior tribe.',
  },
  {
    question: 'What flight control mechanism tilts the entire rotor disc to move forward, backward, or sideways?',
    options: ['Cyclic Control', 'Collective Pitch', 'Anti-Torque Pedals', 'Throttle Twist'],
    answer: 'Cyclic Control',
    hint: 'Operated by the primary joystick between the pilot legs.',
  },
  {
    question: 'Which planet in our solar system is known as the Red Planet?',
    options: ['Mars', 'Venus', 'Jupiter', 'Mercury'],
    answer: 'Mars',
    hint: 'Named after the Roman god of war, rich in iron oxide surface dust.',
  },
]

export async function fetchQuiz(): Promise<QuizQuestion[]> {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const api = urlParams.get('api');
    const slug = urlParams.get('slug');

    if (!api || !slug) {
      console.warn('API credentials missing from URL, using tactical classified mission dataset.')
      return FALLBACK_QUIZ_QUESTIONS
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    const response = await fetch(`${api}/api/public/projects/${slug}/session`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.warn(`Server responded with ${response.status}, falling back to tactical dataset.`)
      return FALLBACK_QUIZ_QUESTIONS
    }

    const json = await response.json()
    
    // Adapt our backend format to the game's QuizQuestion format
    const rawArray = json.questions && Array.isArray(json.questions) ? json.questions : [];
    if (rawArray.length === 0) return FALLBACK_QUIZ_QUESTIONS;

    return rawArray.map((q: any) => {
      const options = [];
      if (q.optionA) options.push(q.optionA);
      if (q.optionB) options.push(q.optionB);
      if (q.optionC) options.push(q.optionC);
      if (q.optionD) options.push(q.optionD);
      if (options.length === 0 && q.options) {
          options.push(...q.options);
      }
      return {
        question: q.field1 || q.question,
        answer: q.correctAnswer || q.field2 || q.answer,
        hint: q.field3 || q.hint || '',
        options: options.length > 0 ? options : ["A", "B", "C", "D"]
      };
    }) as QuizQuestion[];

  } catch (err) {
    console.warn('Network or validation failure, using tactical dataset:', (err as Error).message)
    return FALLBACK_QUIZ_QUESTIONS
  }
}
