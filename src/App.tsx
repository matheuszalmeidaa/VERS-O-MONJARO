/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  CheckCircle2, 
  Scale, 
  Activity, 
  Droplets, 
  Moon, 
  Clock, 
  Target,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Users
} from 'lucide-react';
import { Question, UserAnswers, QuizState } from './types';

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Quantos quilos você quer perder?",
    type: 'choice',
    options: [
      { label: "3 a 5kg", value: "3-5" },
      { label: "6 a 10kg", value: "6-10" },
      { label: "10kg ou mais", value: "10+" }
    ],
    feedback: "Entendido! Vamos ajustar sua meta de forma realista e saudável 👊"
  },
  {
    id: 2,
    text: "Como você classifica seu corpo?",
    type: 'choice',
    options: [
      { label: "Magro com gordura localizada", value: "skinny-fat" },
      { label: "Normal, mas com barriga", value: "normal-belly" },
      { label: "Acima do peso", value: "overweight" },
      { label: "Muito acima do peso", value: "obese" }
    ],
    feedback: "Isso é mais comum do que você imagina 👀"
  },
  {
    id: 3,
    text: "Qual área mais te incomoda?",
    type: 'choice',
    options: [
      { label: "Barriga", value: "belly" },
      { label: "Culote", value: "hips" },
      { label: "Braços", value: "arms" },
      { label: "Pernas", value: "legs" },
      { label: "Corpo todo", value: "full-body" }
    ],
    feedback: "Analisando padrão de acúmulo..."
  },
  {
    id: 4,
    text: "Qual seu peso atual?",
    type: 'number',
    unit: 'kg',
    placeholder: "Ex: 75"
  },
  {
    id: 5,
    text: "Qual sua altura?",
    type: 'number',
    unit: 'cm',
    placeholder: "Ex: 170"
  },
  {
    id: 6,
    text: "Como é sua rotina?",
    type: 'choice',
    options: [
      { label: "Muito corrida", value: "busy" },
      { label: "Moderada", value: "moderate" },
      { label: "Sedentária", value: "sedentary" },
      { label: "Ativa", value: "active" }
    ]
  },
  {
    id: 7,
    text: "Quantas horas você dorme?",
    type: 'choice',
    options: [
      { label: "Menos de 5", value: "less-5" },
      { label: "6 a 7", value: "6-7" },
      { label: "8 ou mais", value: "8+" }
    ]
  },
  {
    id: 8,
    text: "Quanto de água você bebe por dia?",
    type: 'choice',
    options: [
      { label: "Menos de 1L", value: "less-1" },
      { label: "1 a 2L", value: "1-2" },
      { label: "Mais de 2L", value: "more-2" }
    ],
    feedback: "Hidratação impacta diretamente na retenção de líquidos 💧"
  },
  {
    id: 9,
    text: "O que você acha que mais te impede de emagrecer?",
    type: 'choice',
    options: [
      { label: "Ansiedade", value: "anxiety" },
      { label: "Fome constante", value: "hunger" },
      { label: "Falta de tempo", value: "time" },
      { label: "Falta de disciplina", value: "discipline" }
    ]
  }
];

export default function App() {
  const [state, setState] = useState<QuizState>({
    step: 'opening',
    currentQuestionIndex: 0,
    answers: {}
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [tempNumber, setTempNumber] = useState('');

  const currentQuestion = QUESTIONS[state.currentQuestionIndex];

  const bmi = useMemo(() => {
    if (state.answers.weight && state.answers.height) {
      const heightInMeters = state.answers.height / 100;
      return (state.answers.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  }, [state.answers.weight, state.answers.height]);

  const handleStart = () => {
    setState(prev => ({ ...prev, step: 'question' }));
  };

  const handleAnswer = (value: string | number) => {
    const fieldMap: Record<number, keyof UserAnswers> = {
      0: 'goal',
      1: 'bodyType',
      2: 'focusArea',
      3: 'weight',
      4: 'height',
      5: 'routine',
      6: 'sleep',
      7: 'water',
      8: 'obstacle'
    };

    const field = fieldMap[state.currentQuestionIndex];
    const newAnswers = { ...state.answers, [field]: value };

    if (currentQuestion.feedback) {
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        proceed(newAnswers);
      }, 2000);
    } else {
      proceed(newAnswers);
    }
  };

  const proceed = (newAnswers: UserAnswers) => {
    if (state.currentQuestionIndex === 4) {
      setState(prev => ({ ...prev, answers: newAnswers, step: 'partial_result' }));
    } else if (state.currentQuestionIndex === 8) {
      setState(prev => ({ ...prev, answers: newAnswers, step: 'social_proof' }));
    } else {
      setState(prev => ({ 
        ...prev, 
        answers: newAnswers, 
        currentQuestionIndex: prev.currentQuestionIndex + 1 
      }));
      setTempNumber('');
    }
  };

  const renderOpening = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto text-center px-6 py-12"
    >
      <div className="mb-8 inline-block p-3 bg-emerald-50 rounded-2xl">
        <Activity className="w-12 h-12 text-emerald-600" />
      </div>
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
        Descubra por que seu corpo pode estar acumulando gordura mesmo fazendo dieta 😯
      </h1>
      <p className="text-xl text-slate-600 mb-10">
        Responda 10 perguntas rápidas e gere seu Protocolo Personalizado.
      </p>
      <button onClick={handleStart} className="btn-primary flex items-center gap-2 mx-auto text-lg">
        Começar agora <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderQuestion = () => (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
            Pergunta {state.currentQuestionIndex + 1} de 10
          </span>
          <span className="text-sm text-slate-400">
            {Math.round(((state.currentQuestionIndex + 1) / 10) * 100)}% concluído
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((state.currentQuestionIndex + 1) / 10) * 100}%` }}
            className="h-full bg-emerald-500"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showFeedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="text-center py-12"
          >
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-emerald-100 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800">
              {currentQuestion.feedback}
            </h2>
          </motion.div>
        ) : (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-3xl font-serif font-bold mb-8 text-slate-900">
              {currentQuestion.text}
            </h2>

            {currentQuestion.id === 3 && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="https://picsum.photos/seed/body-areas/600/300" 
                  alt="Áreas corporais" 
                  className="w-full h-48 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {currentQuestion.type === 'choice' ? (
              <div className="space-y-4">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(option.value)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all flex justify-between items-center group"
                  >
                    <span className="text-lg font-medium text-slate-700 group-hover:text-emerald-700">
                      {option.label}
                    </span>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="number"
                    value={tempNumber}
                    onChange={(e) => setTempNumber(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="input-field pr-16"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {currentQuestion.unit}
                  </span>
                </div>
                <button
                  disabled={!tempNumber}
                  onClick={() => handleAnswer(Number(tempNumber))}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderPartialResult = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-6 py-12 text-center"
    >
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm font-bold uppercase tracking-wider">
        <ShieldCheck className="w-4 h-4" /> Pelas suas respostas…
      </div>
      <h2 className="text-3xl font-serif font-bold mb-4">
        Seu corpo pode estar em modo de:
      </h2>
      <div className="text-4xl font-bold text-emerald-600 mb-8">
        "Acúmulo Estratégico de Energia"
      </div>

      <div className="glass-card p-8 mb-10">
        <div className="flex justify-center mb-4">
          <Scale className="w-10 h-10 text-slate-400" />
        </div>
        <div className="text-slate-500 uppercase text-xs font-bold tracking-widest mb-2">Seu IMC calculado</div>
        <div className="text-6xl font-bold text-slate-900 mb-4">{bmi}</div>
        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex mb-4">
          <div className="h-full bg-blue-400" style={{ width: '18.5%' }} />
          <div className="h-full bg-emerald-400" style={{ width: '25%' }} />
          <div className="h-full bg-amber-400" style={{ width: '30%' }} />
          <div className="h-full bg-red-400" style={{ width: '26.5%' }} />
        </div>
        <p className="text-slate-600 italic">
          "Mesmo estando dentro da faixa normal, seu metabolismo pode estar mais lento do que deveria."
        </p>
      </div>

      <button 
        onClick={() => setState(prev => ({ ...prev, step: 'question', currentQuestionIndex: 5 }))}
        className="btn-primary w-full max-w-sm"
      >
        Continuar análise <ArrowRight className="ml-2 w-5 h-5 inline" />
      </button>
    </motion.div>
  );

  const renderSocialProof = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-4">
          <Users className="w-4 h-4" /> O que dizem no nosso Grupo VIP
        </div>
        <h2 className="text-3xl font-serif font-bold">Resultados Reais</h2>
      </div>

      <div className="space-y-6 mb-12 bg-[#e5ddd5] rounded-3xl shadow-inner relative overflow-hidden border-4 border-white">
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] p-4 flex items-center gap-3 text-white relative z-10">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold">
            PV
          </div>
          <div>
            <div className="font-bold text-sm">Grupo VIP - Protocolo Metabólico</div>
            <div className="text-[10px] opacity-80">Mariana, Ricardo, Ana, Carla...</div>
          </div>
        </div>

        <div className="p-6 space-y-6 relative">
          {/* WhatsApp Background Pattern Overlay (Subtle) */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          
          {[
            {
              name: "Mariana Silva",
              time: "10:24",
              text: "Gente, comecei o protocolo há 1 semana e já sinto minha calça mais larga! To chocada 😍",
              color: "text-pink-600"
            },
            {
              name: "Ricardo Oliveira",
              time: "11:15",
              text: "O desafio de 21 dias é sensacional. Perdi 4kg sem passar fome. Valeu muito a pena!",
              color: "text-blue-600"
            },
            {
              name: "Ana Paula",
              time: "14:40",
              text: "Finalmente algo que funciona pra quem tem rotina corrida. O grupo VIP ajuda demais! Minha disposição mudou da água pro vinho.",
              color: "text-purple-600"
            },
            {
              name: "Carla Mendes",
              time: "16:02",
              text: "Eu já tinha tentado de tudo, mas esse método de ativação metabólica foi o único que destravou meu peso. -5kg na balança! 🙏✨",
              color: "text-orange-600"
            }
          ].map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} relative z-10`}
            >
              <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm relative ${i % 2 === 0 ? 'bg-white rounded-tl-none' : 'bg-[#dcf8c6] rounded-tr-none'}`}>
                <div className={`text-xs font-bold mb-1 ${msg.color}`}>{msg.name}</div>
                <p className="text-slate-800 text-sm leading-relaxed pr-10">{msg.text}</p>
                <span className="absolute bottom-1 right-2 text-[10px] text-slate-400 flex items-center gap-1">
                  {msg.time} 
                  <span className="text-blue-400">✓✓</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={() => setState(prev => ({ ...prev, step: 'final_result' }))}
          className="btn-primary w-full max-w-sm"
        >
          Ver meu protocolo final <ArrowRight className="ml-2 w-5 h-5 inline" />
        </button>
      </div>
    </motion.div>
  );

  const renderFinalResult = () => {
    const focusAreaLabel = QUESTIONS[2].options?.find(o => o.value === state.answers.focusArea)?.label;
    const goalLabel = QUESTIONS[0].options?.find(o => o.value === state.answers.goal)?.label;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto px-6 py-12"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-2">
            Seu Protocolo Metabólico foi gerado!
          </h2>
          <p className="text-slate-500">Análise completa baseada no seu perfil</p>
        </div>

        <div className="glass-card p-8 mb-8 space-y-6">
          <div className="bg-emerald-50 -mx-8 -mt-8 p-8 rounded-t-3xl border-b border-emerald-100">
            <h3 className="text-xl font-serif font-bold text-emerald-900 mb-3">Como funciona o Plano?</h3>
            <p className="text-slate-700 leading-relaxed text-sm">
              Com base nas suas informações pessoais e objetivos, criamos um plano 100% personalizado para você usar o <strong>Mounjaro de Pobre</strong>. Nossa abordagem estratégica foi feita para que você consiga potencializar sua perda de peso em 4 semanas, respeitando seu estilo de vida, sua rotina e o que você gosta de comer.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">IMC</div>
              <div className="text-xl font-bold text-slate-900">{bmi}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Foco</div>
              <div className="text-xl font-bold text-slate-900">{focusAreaLabel}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">Meta</div>
              <div className="text-xl font-bold text-slate-900">{goalLabel}</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-800">Seu plano inclui:</h3>
            {[
              "Estratégia de ativação metabólica",
              "Organização alimentar simplificada",
              "Desafio de 21 dias",
              "Método anti efeito sanfona",
              "Acesso ao grupo VIP"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-700">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center bg-emerald-50 rounded-3xl p-8 border-2 border-emerald-100">
          <div className="text-slate-500 line-through text-sm mb-1">De R$ 197,00</div>
          <div className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-2">Oferta Exclusiva</div>
          <div className="mb-6">
            <div className="text-slate-600 text-sm mb-1">Apenas 5x de</div>
            <div className="text-6xl font-bold text-slate-900">
              <span className="text-2xl font-medium">R$</span> 8,39
            </div>
            <div className="text-slate-500 text-xs mt-2">ou R$ 37,90 à vista</div>
          </div>
          <a 
            href="https://pay.kiwify.com.br/Duxe15O?afid=E60tZ2Sw"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-xl block text-center"
          >
            👉 Gerar meu acesso agora
          </a>
          <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Pagamento 100% seguro via Kiwify
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-6 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Metabolic<span className="text-emerald-600">Pro</span></span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center">
        <AnimatePresence mode="wait">
          {state.step === 'opening' && renderOpening()}
          {state.step === 'question' && renderQuestion()}
          {state.step === 'partial_result' && renderPartialResult()}
          {state.step === 'social_proof' && renderSocialProof()}
          {state.step === 'final_result' && renderFinalResult()}
        </AnimatePresence>
      </main>

      <footer className="p-8 text-center text-slate-400 text-sm">
        <p>&copy; 2024 MetabolicPro. Todos os direitos reservados.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-slate-600">Termos</a>
          <a href="#" className="hover:text-slate-600">Privacidade</a>
        </div>
      </footer>
    </div>
  );
}
