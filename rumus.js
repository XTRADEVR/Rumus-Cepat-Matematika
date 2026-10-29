const FORMULA_DATA = [
  {
    id: 'persegi',
    name: 'Luas Persegi',
    category: 'Luas Bangun Datar',
    notation: 'L = s × s',
    description: 'Menghitung luas bidang persegi empat dari panjang sisinya.',
    variables: [
      { symbol: 'L', name: 'Luas', unit: 'cm²' },
      { symbol: 's', name: 'Panjang Sisi', unit: 'cm' }
    ],
    targetVariables: ['L', 's'],
    example: {
      question: 'Panjang sisi persegi adalah 8 cm. Berapakah luasnya?',
      steps: ['Rumus: L = s × s', 'L = 8 × 8', 'L = 64 cm²'],
      answer: '64 cm²'
    },
    solve: (target, inputs) => {
      if (target === 'L') {
        const s = parseFloat(inputs.s);
        if (isNaN(s) || s <= 0) return { error: 'Panjang sisi (s) harus angka lebih besar dari 0!' };
        const res = s * s;
        return { result: res.toFixed(2), unit: 'cm²', steps: [`Rumus: L = s × s`, `L = ${s} × ${s}`, `L = ${res.toFixed(2)} cm²`] };
      } else {
        const L = parseFloat(inputs.L);
        if (isNaN(L) || L <= 0) return { error: 'Luas (L) harus angka lebih besar dari 0!' };
        const res = Math.sqrt(L);
        return { result: res.toFixed(2), unit: 'cm', steps: [`Rumus: s = √L`, `s = √(${L})`, `s = ${res.toFixed(2)} cm`] };
      }
    }
  },
  {
    id: 'persegi_panjang',
    name: 'Luas Persegi Panjang',
    category: 'Luas Bangun Datar',
    notation: 'L = p × l',
    description: 'Menghitung luas dari panjang (p) dan lebar (l).',
    variables: [
      { symbol: 'L', name: 'Luas', unit: 'cm²' },
      { symbol: 'p', name: 'Panjang', unit: 'cm' },
      { symbol: 'l', name: 'Lebar', unit: 'cm' }
    ],
    targetVariables: ['L', 'p', 'l'],
    example: {
      question: 'Persegi panjang dengan p = 12 cm dan l = 5 cm. Hitung luasnya!',
      steps: ['Rumus: L = p × l', 'L = 12 × 5', 'L = 60 cm²'],
      answer: '60 cm²'
    },
    solve: (target, inputs) => {
      if (target === 'L') {
        const p = parseFloat(inputs.p), l = parseFloat(inputs.l);
        if (isNaN(p) || isNaN(l) || p <= 0 || l <= 0) return { error: 'Nilai p dan l harus angka positif!' };
        const res = p * l;
        return { result: res.toFixed(2), unit: 'cm²', steps: [`L = p × l`, `L = ${p} × ${l}`, `L = ${res.toFixed(2)} cm²`] };
      } else if (target === 'p') {
        const L = parseFloat(inputs.L), l = parseFloat(inputs.l);
        if (isNaN(L) || isNaN(l) || L <= 0 || l <= 0) return { error: 'Nilai L dan l harus angka positif!' };
        const res = L / l;
        return { result: res.toFixed(2), unit: 'cm', steps: [`p = L / l`, `p = ${L} / ${l}`, `p = ${res.toFixed(2)} cm`] };
      } else {
        const L = parseFloat(inputs.L), p = parseFloat(inputs.p);
        if (isNaN(L) || isNaN(p) || L <= 0 || p <= 0) return { error: 'Nilai L dan p harus angka positif!' };
        const res = L / p;
        return { result: res.toFixed(2), unit: 'cm', steps: [`l = L / p`, `l = ${L} / ${p}`, `l = ${res.toFixed(2)} cm`] };
      }
    }
  },
  {
    id: 'pythagoras',
    name: 'Teorema Pythagoras',
    category: 'Teorema Pythagoras',
    notation: 'c² = a² + b²',
    description: 'Menghitung sisi segitiga siku-siku (a, b, c).',
    variables: [
      { symbol: 'c', name: 'Sisi Miring (c)', unit: 'cm' },
      { symbol: 'a', name: 'Sisi Tegak (a)', unit: 'cm' },
      { symbol: 'b', name: 'Sisi Tegak (b)', unit: 'cm' }
    ],
    targetVariables: ['c', 'a', 'b'],
    example: {
      question: 'Segitiga siku-siku dengan a = 3 cm dan b = 4 cm. Berapa c?',
      steps: ['Rumus: c = √(a² + b²)', 'c = √(3² + 4²) = √(9 + 16)', 'c = √25 = 5 cm'],
      answer: '5 cm'
    },
    solve: (target, inputs) => {
      if (target === 'c') {
        const a = parseFloat(inputs.a), b = parseFloat(inputs.b);
        if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) return { error: 'Nilai a dan b harus angka positif!' };
        const res = Math.sqrt(a * a + b * b);
        return { result: res.toFixed(2), unit: 'cm', steps: [`c = √(a² + b²)`, `c = √(${a}² + ${b}²)`, `c = ${res.toFixed(2)} cm`] };
      } else if (target === 'a') {
        const c = parseFloat(inputs.c), b = parseFloat(inputs.b);
        if (isNaN(c) || isNaN(b) || c <= b) return { error: 'Sisi miring (c) harus lebih besar dari (b)!' };
        const res = Math.sqrt(c * c - b * b);
        return { result: res.toFixed(2), unit: 'cm', steps: [`a = √(c² - b²)`, `a = ${res.toFixed(2)} cm`] };
      } else {
        const c = parseFloat(inputs.c), a = parseFloat(inputs.a);
        if (isNaN(c) || isNaN(a) || c <= a) return { error: 'Sisi miring (c) harus lebih besar dari (a)!' };
        const res = Math.sqrt(c * c - a * a);
        return { result: res.toFixed(2), unit: 'cm', steps: [`b = √(c² - a²)`, `b = ${res.toFixed(2)} cm`] };
      }
    }
  },
  {
    id: 'hukum_newton_2',
    name: 'Hukum Newton II',
    category: 'Hukum Newton',
    notation: 'F = m × a',
    description: 'Menghitung gaya (F), massa (m), atau percepatan (a).',
    variables: [
      { symbol: 'F', name: 'Gaya', unit: 'N' },
      { symbol: 'm', name: 'Massa', unit: 'kg' },
      { symbol: 'a', name: 'Percepatan', unit: 'm/s²' }
    ],
    targetVariables: ['F', 'm', 'a'],
    example: {
      question: 'Benda bermassa 10 kg didorong dengan a = 2.5 m/s². Berapa gayanya?',
      steps: ['Rumus: F = m × a', 'F = 10 × 2.5', 'F = 25 N'],
      answer: '25 N'
    },
    solve: (target, inputs) => {
      if (target === 'F') {
        const m = parseFloat(inputs.m), a = parseFloat(inputs.a);
        if (isNaN(m) || isNaN(a) || m <= 0) return { error: 'Massa (m) harus angka lebih besar dari 0!' };
        const res = m * a;
        return { result: res.toFixed(2), unit: 'N', steps: [`F = m × a`, `F = ${m} × ${a}`, `F = ${res.toFixed(2)} N`] };
      } else if (target === 'm') {
        const F = parseFloat(inputs.F), a = parseFloat(inputs.a);
        if (isNaN(F) || isNaN(a) || a === 0) return { error: 'Pembagian dengan nol! Percepatan (a) tidak boleh 0.' };
        const res = F / a;
        return { result: res.toFixed(2), unit: 'kg', steps: [`m = F / a`, `m = ${F} / ${a}`, `m = ${res.toFixed(2)} kg`] };
      } else {
        const F = parseFloat(inputs.F), m = parseFloat(inputs.m);
        if (isNaN(F) || isNaN(m) || m <= 0) return { error: 'Pembagian dengan nol! Massa (m) harus > 0.' };
        const res = F / m;
        return { result: res.toFixed(2), unit: 'm/s²', steps: [`a = F / m`, `a = ${F} / ${m}`, `a = ${res.toFixed(2)} m/s²`] };
      }
    }
  },
  {
    id: 'kecepatan',
    name: 'Kecepatan, Jarak & Waktu',
    category: 'Kecepatan',
    notation: 'v = s / t',
    description: 'Hubungan antara kecepatan (v), jarak (s), dan waktu (t).',
    variables: [
      { symbol: 'v', name: 'Kecepatan', unit: 'm/s' },
      { symbol: 's', name: 'Jarak', unit: 'm' },
      { symbol: 't', name: 'Waktu', unit: 'detik' }
    ],
    targetVariables: ['v', 's', 't'],
    example: {
      question: 'Motor menempuh jarak 100 m dalam waktu 20 detik. Hitung kecepatannya!',
      steps: ['Rumus: v = s / t', 'v = 100 / 20', 'v = 5 m/s'],
      answer: '5 m/s'
    },
    solve: (target, inputs) => {
      if (target === 'v') {
        const s = parseFloat(inputs.s), t = parseFloat(inputs.t);
        if (isNaN(s) || isNaN(t) || t === 0) return { error: 'Pembagian dengan nol! Waktu (t) tidak boleh 0.' };
        const res = s / t;
        return { result: res.toFixed(2), unit: 'm/s', steps: [`v = s / t`, `v = ${s} / ${t}`, `v = ${res.toFixed(2)} m/s`] };
      } else if (target === 's') {
        const v = parseFloat(inputs.v), t = parseFloat(inputs.t);
        if (isNaN(v) || isNaN(t)) return { error: 'Masukkan angka valid!' };
        const res = v * t;
        return { result: res.toFixed(2), unit: 'm', steps: [`s = v × t`, `s = ${v} × ${t}`, `s = ${res.toFixed(2)} m`] };
      } else {
        const s = parseFloat(inputs.s), v = parseFloat(inputs.v);
        if (isNaN(s) || isNaN(v) || v === 0) return { error: 'Pembagian dengan nol! Kecepatan (v) tidak boleh 0.' };
        const res = s / v;
        return { result: res.toFixed(2), unit: 'detik', steps: [`t = s / v`, `t = ${s} / ${v}`, `t = ${res.toFixed(2)} s`] };
      }
    }
  },
  {
    id: 'tekanan',
    name: 'Tekanan',
    category: 'Tekanan',
    notation: 'P = F / A',
    description: 'Menghitung tekanan (P) dari gaya (F) dan luas bidang (A).',
    variables: [
      { symbol: 'P', name: 'Tekanan', unit: 'Pa' },
      { symbol: 'F', name: 'Gaya', unit: 'N' },
      { symbol: 'A', name: 'Luas Bidang', unit: 'm²' }
    ],
    targetVariables: ['P', 'F', 'A'],
    example: {
      question: 'Gaya 500 N menekan permukaan seluas 2 m². Berapa tekanannya?',
      steps: ['Rumus: P = F / A', 'P = 500 / 2', 'P = 250 Pa'],
      answer: '250 Pa'
    },
    solve: (target, inputs) => {
      if (target === 'P') {
        const F = parseFloat(inputs.F), A = parseFloat(inputs.A);
        if (isNaN(F) || isNaN(A) || A === 0) return { error: 'Pembagian dengan nol! Luas (A) tidak boleh 0.' };
        const res = F / A;
        return { result: res.toFixed(2), unit: 'Pa', steps: [`P = F / A`, `P = ${F} / ${A}`, `P = ${res.toFixed(2)} Pa`] };
      } else if (target === 'F') {
        const P = parseFloat(inputs.P), A = parseFloat(inputs.A);
        if (isNaN(P) || isNaN(A)) return { error: 'Masukkan angka valid!' };
        const res = P * A;
        return { result: res.toFixed(2), unit: 'N', steps: [`F = P × A`, `F = ${P} × ${A}`, `F = ${res.toFixed(2)} N`] };
      } else {
        const F = parseFloat(inputs.F), P = parseFloat(inputs.P);
        if (isNaN(F) || isNaN(P) || P === 0) return { error: 'Pembagian dengan nol! Tekanan (P) tidak boleh 0.' };
        const res = F / P;
        return { result: res.toFixed(2), unit: 'm²', steps: [`A = F / P`, `A = ${F} / ${P}`, `A = ${res.toFixed(2)} m²`] };
      }
    }
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Sebuah persegi memiliki panjang sisi 9 cm. Berapakah luasnya?',
    options: ['36 cm²', '81 cm²', '18 cm²', '72 cm²'],
    correct: 1,
    explanation: 'Luas persegi = s × s = 9 × 9 = 81 cm².'
  },
  {
    id: 2,
    question: 'Mobil melaju dengan kecepatan 80 km/jam selama 3 jam. Berapa jarak tempuhnya?',
    options: ['240 km', '160 km', '120 km', '24 km'],
    correct: 0,
    explanation: 'Jarak s = v × t = 80 × 3 = 240 km.'
  },
  {
    id: 3,
    question: 'Gaya sebesar 40 N bekerja pada benda bermassa 8 kg. Percepatannya adalah...',
    options: ['320 m/s²', '5 m/s²', '0.2 m/s²', '48 m/s²'],
    correct: 1,
    explanation: 'Percepatan a = F / m = 40 / 8 = 5 m/s².'
  }
];
