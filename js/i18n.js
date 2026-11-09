// Lingue: italiano (principale) e russo (di prova).
let lang = 'it';
try { lang = localStorage.getItem('ml.lang') || 'it'; } catch {}
if (lang !== 'it' && lang !== 'ru') lang = 'it';

export const getLang = () => lang;
export function setLang(l) {
  lang = l === 'ru' ? 'ru' : 'it';
  try { localStorage.setItem('ml.lang', lang); } catch {}
  document.documentElement.lang = lang;
}
export const L = (it, ru) => ({ it, ru });
export const t = (o) => (o == null ? '' : typeof o === 'string' ? o : (o[lang] ?? o.it ?? ''));

const UI = {
  brand: L('Coniche', 'Коники'),
  homeTitle: L('Le coniche, viste e capite', 'Конические сечения: увидеть и понять'),
  homeLead: L('Prevedi, esplora la figura, capisci la formula, poi esercitati.', 'Предскажи, исследуй фигуру, пойми формулу, затем потренируйся.'),
  diag: L('Punto di partenza', 'Точка старта'),
  diagLead: L('5 domande sui prerequisiti: scopri cosa ripassare prima di iniziare.', '5 вопросов по базовым темам: узнай, что повторить перед началом.'),
  diagDone: L('Fatto', 'Пройдено'),
  intro: L('Da dove nascono le coniche', 'Откуда берутся коники'),
  introLead: L('Taglia un cono con un piano e guarda che curva esce.', 'Разрежь конус плоскостью и посмотри, какая кривая получится.'),
  mix: L('Allenamento misto', 'Смешанная тренировка'),
  mixLead: L('Esercizi di tutti gli argomenti, in ordine casuale.', 'Задачи по всем темам в случайном порядке.'),
  review: L('Ripasso', 'Повторение'),
  reviewLead: L('Gli esercizi sbagliati tornano dopo 1, 3 e 7 giorni.', 'Ошибочные задачи возвращаются через 1, 3 и 7 дней.'),
  reviewNone: L('Niente da ripassare oggi.', 'Сегодня повторять нечего.'),
  reviewEarly: L('Ripassa comunque', 'Повторить всё равно'),
  reviewPending: L('In attesa', 'В ожидании'),
  home: L('← Inizio', '← На главную'),
  back: L('← Indietro', '← Назад'),
  stages: L('Tappe', 'Этапы'),
  test: L('Verifica finale', 'Итоговый тест'),
  testLead: L('6 domande, un solo tentativo, nessun aiuto.', '6 вопросов, одна попытка, без подсказок.'),
  best: L('Miglior risultato', 'Лучший результат'),
  sPredict: L('Prevedi', 'Прогноз'),
  sExplore: L('Esplora', 'Исследуй'),
  sLearn: L('Capisci', 'Пойми'),
  sPractice: L('Pratica', 'Практика'),
  predictHead: L('Prima di guardare: cosa ti aspetti?', 'Прежде чем смотреть: чего ты ждёшь?'),
  predictSaved: L('Risposta registrata. Ora verificala con la figura.', 'Ответ записан. Теперь проверь его на фигуре.'),
  predOk: L('La tua previsione era giusta.', 'Твой прогноз был верным.'),
  predBad: L('La tua previsione era sbagliata: ecco perché.', 'Твой прогноз был неверным — вот почему.'),
  tryIt: L('Prova tu', 'Попробуй'),
  example: L('Esempio svolto', 'Разобранный пример'),
  next: L('Avanti', 'Дальше'),
  toPractice: L('Vai agli esercizi', 'К задачам'),
  check: L('Verifica', 'Проверить'),
  hint: L('Suggerimento', 'Подсказка'),
  showSol: L('Mostra soluzione', 'Показать решение'),
  right: L('Giusto!', 'Верно!'),
  wrongRetry: L('Non ancora. Riprova o chiedi un suggerimento.', 'Пока нет. Попробуй ещё раз или возьми подсказку.'),
  wrong: L('Sbagliato.', 'Неверно.'),
  solution: L('Soluzione', 'Решение'),
  nextQ: L('Prossimo', 'Следующая'),
  finish: L('Fine', 'Завершить'),
  result: L('Risultato', 'Результат'),
  again: L('Ancora', 'Ещё раз'),
  stageDone: L('Tappa completata!', 'Этап пройден!'),
  nextStage: L('Tappa successiva', 'Следующий этап'),
  toTopic: L("Torna all'argomento", 'К теме'),
  passed: L('Verifica superata.', 'Тест сдан.'),
  failed: L('Sotto il 70%: ripassa le tappe e riprova.', 'Меньше 70%: повтори этапы и попробуй снова.'),
  toReview: L('Gli errori sono stati aggiunti al ripasso.', 'Ошибки добавлены в повторение.'),
  inputTip: L('Puoi scrivere numeri negativi, decimali o frazioni, per esempio -3/2.', 'Можно вводить отрицательные числа, десятичные и дроби, например -3/2.'),
  fill: L('Compila tutti i campi.', 'Заполни все поля.'),
  drag3d: L('Trascina per ruotare il cono.', 'Проведи пальцем, чтобы повернуть конус.'),
  footer: L('I progressi restano salvati su questo dispositivo.', 'Прогресс сохраняется на этом устройстве.'),
  q: L('Domanda', 'Вопрос'),
  of: L('di', 'из'),
};
export const u = (k) => t(UI[k]);
