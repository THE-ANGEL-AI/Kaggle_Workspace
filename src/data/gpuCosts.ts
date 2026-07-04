/* ──────────────────────────────────────────────
   GPU Cost Calculator — данные платформ
   Цены актуальны на июнь 2026.
   ────────────────────────────────────────────── */

export interface GpuPlatform {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** Hourly rate in USD for 1× T4 */
  ratePerHourT4: number;
  /** Number of T4 GPUs included */
  gpuCount: number;
  /** Free tier hours per week (0 if none) */
  freeHoursPerWeek: number;
  /** Monthly subscription if any */
  monthlySub: number;
  /** Link to sign up */
  url: string;
  /** Color accent */
  color: string;
  /** Pros highlighted */
  pros: string[];
  /** Cons highlighted */
  cons: string[];
}

export const gpuPlatforms: GpuPlatform[] = [
  {
    id: 'kaggle',
    name: 'Kaggle',
    icon: '🧠',
    description: 'Бесплатные 2× Tesla T4, 30+ часов в неделю',
    ratePerHourT4: 0,
    gpuCount: 2,
    freeHoursPerWeek: 30,
    monthlySub: 0,
    url: 'https://www.kaggle.com/code',
    color: '#00F5FF',
    pros: ['Абсолютно бесплатно', '2× T4 на сессию', 'CUDA 13.0 (580.x)'],
    cons: ['Нет гарантии сессии', '30h/нед лимит', 'Нет A100/H100'],
  },
  {
    id: 'colab',
    name: 'Colab',
    icon: '🔬',
    description: '1× T4 бесплатно или T4/P100/A100 за $10–50/мес',
    ratePerHourT4: 0.036,
    gpuCount: 1,
    freeHoursPerWeek: 12,
    monthlySub: 10,
    url: 'https://colab.research.google.com/',
    color: '#7B61FF',
    pros: ['Есть A100 в Pay-As-You-Go', 'Простой старт', 'TPU опционально'],
    cons: ['1 GPU на сессию', 'CUDA 12.8 (старее)', 'Лимиты на free'],
  },
  {
    id: 'runpod',
    name: 'RunPod',
    icon: '⚡',
    description: 'T4 от $0.16/h, A100 от $0.79/h, community cloud',
    ratePerHourT4: 0.16,
    gpuCount: 1,
    freeHoursPerWeek: 0,
    monthlySub: 0,
    url: 'https://www.runpod.io/',
    color: '#A855F7',
    pros: ['Гибкие инстансы', 'Serverless опция', 'Много GPU-типов'],
    cons: ['Плата за idle', 'Настройка вручную', 'Нет free tier'],
  },
  {
    id: 'vast',
    name: 'Vast.ai',
    icon: '🌐',
    description: 'Рынок GPU: T4 от $0.12/h, RTX 4090 от $0.20/h',
    ratePerHourT4: 0.12,
    gpuCount: 1,
    freeHoursPerWeek: 0,
    monthlySub: 0,
    url: 'https://vast.ai/',
    color: '#00FFB3',
    pros: ['Самые низкие цены', 'Выбор GPU (RTX, A100)', 'Почасовая оплата'],
    cons: ['Рынок — цены плавают', 'Без поддержки', 'Нужен опыт'],
  },
];

/** GPU specs for detail view */
interface GpuSpec {
  name: string;
  vram: string;
  architecture: string;
  fp16Tflops: string;
}

export const gpuSpecs: GpuSpec[] = [
  { name: 'Tesla T4', vram: '16 GB GDDR6', architecture: 'Turing (sm_75)', fp16Tflops: '65 TFLOPS' },
  { name: 'Tesla P100', vram: '16 GB HBM2', architecture: 'Pascal (sm_60)', fp16Tflops: '21 TFLOPS' },
  { name: 'A100', vram: '80 GB HBM2e', architecture: 'Ampere (sm_80)', fp16Tflops: '312 TFLOPS' },
  { name: 'RTX 4090', vram: '24 GB GDDR6X', architecture: 'Ada Lovelace', fp16Tflops: '165 TFLOPS' },
];

export function calcMonthlyCost(platform: GpuPlatform, hoursPerWeek: number): number {
  // Free tier: deduct free hours, bill remaining at hourly rate
  const billedHours = Math.max(0, hoursPerWeek - platform.freeHoursPerWeek) * 4.33;
  const gpuCost = billedHours * platform.ratePerHourT4 * platform.gpuCount;
  return gpuCost + platform.monthlySub;
}

export function calcYearlySavings(
  kaggleHoursPerWeek: number,
  alternative: GpuPlatform,
): number {
  if (alternative.id === 'kaggle') return 0;
  const monthly = calcMonthlyCost(alternative, kaggleHoursPerWeek);
  return monthly * 12;
}
