// Contenuti delle lezioni. Per aggiungere una tappa basta aggiungere un oggetto qui:
// predict (domanda di previsione), scene (figura), missions, theory, example, practice (id dei generatori).
import { L } from './i18n.js';

const R = String.raw;

export const INTRO = {
  text: L(
    R`<p>Circonferenza, ellisse, parabola e iperbole hanno un'origine comune: sono le curve che si ottengono tagliando un <b>cono a due falde</b> con un piano. Per questo si chiamano <b>coniche</b>.</p>
<p>Cambia solo l'inclinazione del piano. Muovi il cursore e osserva il momento in cui la curva smette di chiudersi (parabola) e quello in cui compare il secondo ramo (iperbole).</p>`,
    R`<p>Окружность, эллипс, парабола и гипербола имеют общее происхождение: это кривые, которые получаются при пересечении <b>двуполостного конуса</b> плоскостью. Поэтому их называют <b>кониками</b>.</p>
<p>Меняется только наклон плоскости. Двигай ползунок и поймай момент, когда кривая перестаёт замыкаться (парабола), и момент, когда появляется вторая ветвь (гипербола).</p>`),
};

export const TOPICS = [
  {
    id: 'circ',
    title: L('Circonferenza', 'Окружность'),
    lead: L('Tutti i punti alla stessa distanza dal centro.', 'Все точки на одном расстоянии от центра.'),
    test: ['circ.read', 'circ.general', 'circ.write', 'circ.through', 'circ.line', 'circ.graph'],
    stages: [
      {
        title: L('Equazione con centro e raggio', 'Уравнение через центр и радиус'),
        predict: {
          q: L(R`Nell'equazione $(x-2)^2+(y+1)^2=9$, dov'è il centro?`, R`Где центр окружности $(x-2)^2+(y+1)^2=9$?`),
          choices: [R`$(2;\,-1)$`, R`$(-2;\,1)$`, R`$(2;\,1)$`, R`$(9;\,0)$`], correct: 0,
          why: L(R`Il centro è il punto che annulla le due parentesi: $x-2=0$ e $y+1=0$, cioè $(2;\,-1)$.`, R`Центр — точка, обнуляющая обе скобки: $x-2=0$ и $y+1=0$, то есть $(2;\,-1)$.`),
        },
        scene: 'circ-std',
        missions: [
          L('Sposta $a$ e $b$: cosa cambia nella figura e nella formula?', 'Меняй $a$ и $b$: что меняется на рисунке и в формуле?'),
          L('Porta il centro in $(-2;\\,3)$. Che segni compaiono nelle parentesi?', 'Поставь центр в $(-2;\\,3)$. Какие знаки появились в скобках?'),
          L('Fai girare $P$ con $\\theta$: la distanza $CP$ cambia?', 'Вращай $P$ с помощью $\\theta$: меняется ли расстояние $CP$?'),
        ],
        theory: L(
          R`<p>La <b>circonferenza</b> è il luogo dei punti del piano che hanno la stessa distanza $r$ (raggio) da un punto fisso $C$ (centro).</p>
<p>Se $C(a;\,b)$ e $P(x;\,y)$ è un punto qualsiasi della curva, la condizione $CP=r$ scritta con la formula della distanza diventa:</p>
$$(x-a)^2+(y-b)^2=r^2$$
<div class="warn">Due errori frequenti: nelle parentesi le coordinate del centro hanno il <b>segno cambiato</b>, e a destra c'è $r^2$, non $r$.</div>
<p>Se il centro è l'origine l'equazione si riduce a $x^2+y^2=r^2$.</p>`,
          R`<p><b>Окружность</b> — множество точек плоскости, удалённых на одно и то же расстояние $r$ (радиус) от фиксированной точки $C$ (центра).</p>
<p>Если $C(a;\,b)$, а $P(x;\,y)$ — любая точка кривой, условие $CP=r$, записанное через формулу расстояния, даёт:</p>
$$(x-a)^2+(y-b)^2=r^2$$
<div class="warn">Две частые ошибки: в скобках координаты центра стоят с <b>противоположным знаком</b>, а справа стоит $r^2$, а не $r$.</div>
<p>Если центр в начале координат, уравнение упрощается до $x^2+y^2=r^2$.</p>`),
        example: L(
          R`Centro $C(3;\,-2)$, raggio $4$. Sostituisco: $(x-3)^2+(y-(-2))^2=4^2$, cioè $$(x-3)^2+(y+2)^2=16$$`,
          R`Центр $C(3;\,-2)$, радиус $4$. Подставляю: $(x-3)^2+(y-(-2))^2=4^2$, то есть $$(x-3)^2+(y+2)^2=16$$`),
        practice: ['circ.read', 'circ.write', 'circ.through', 'circ.point'],
      },
      {
        title: L('Forma generale', 'Общий вид'),
        predict: {
          q: L(R`$x^2+y^2-6x=0$ è una circonferenza. Dov'è il centro?`, R`$x^2+y^2-6x=0$ — окружность. Где её центр?`),
          choices: [R`$(3;\,0)$`, R`$(-3;\,0)$`, R`$(0;\,3)$`, R`$(-6;\,0)$`], correct: 0,
          why: L(R`L'ascissa del centro è l'opposto della metà del coefficiente di $x$: $-\frac{-6}{2}=3$. Manca il termine in $y$, quindi l'ordinata è $0$.`, R`Абсцисса центра — половина коэффициента при $x$ с обратным знаком: $-\frac{-6}{2}=3$. Слагаемого с $y$ нет, значит ордината равна $0$.`),
        },
        scene: 'circ-gen',
        missions: [
          L('Muovi solo $a$: in che direzione si sposta il centro?', 'Меняй только $a$: в какую сторону движется центр?'),
          L('Aumenta $c$ fino a far sparire la circonferenza. Quando succede?', 'Увеличивай $c$, пока окружность не исчезнет. Когда это происходит?'),
          L("Con $c=0$ la curva passa sempre per l'origine: perché?", 'При $c=0$ кривая всегда проходит через начало координат: почему?'),
        ],
        theory: L(
          R`<p>Sviluppando i quadrati di $(x-\alpha)^2+(y-\beta)^2=r^2$ si ottiene la <b>forma generale</b>:</p>
$$x^2+y^2+ax+by+c=0$$
<p>Per tornare a centro e raggio:</p>
$$C\left(-\frac{a}{2};\,-\frac{b}{2}\right)\qquad r=\sqrt{\alpha^2+\beta^2-c}$$
<p>dove $\alpha$ e $\beta$ sono le coordinate del centro.</p>
<ul><li>$x^2$ e $y^2$ devono avere lo <b>stesso coefficiente</b> e non deve esserci il termine $xy$.</li>
<li>Serve $\alpha^2+\beta^2-c>0$: altrimenti non c'è nessuna circonferenza.</li>
<li>Se $c=0$ la circonferenza passa per l'origine.</li></ul>`,
          R`<p>Раскрыв квадраты в $(x-\alpha)^2+(y-\beta)^2=r^2$, получаем <b>общий вид</b>:</p>
$$x^2+y^2+ax+by+c=0$$
<p>Чтобы вернуться к центру и радиусу:</p>
$$C\left(-\frac{a}{2};\,-\frac{b}{2}\right)\qquad r=\sqrt{\alpha^2+\beta^2-c}$$
<p>где $\alpha$ и $\beta$ — координаты центра.</p>
<ul><li>У $x^2$ и $y^2$ должен быть <b>одинаковый коэффициент</b>, слагаемого $xy$ быть не должно.</li>
<li>Нужно $\alpha^2+\beta^2-c>0$, иначе окружности нет.</li>
<li>Если $c=0$, окружность проходит через начало координат.</li></ul>`),
        example: L(
          R`$x^2+y^2-4x+6y-12=0$. Centro: $\left(-\frac{-4}{2};\,-\frac{6}{2}\right)=(2;\,-3)$. Raggio: $r=\sqrt{4+9-(-12)}=\sqrt{25}=5$.`,
          R`$x^2+y^2-4x+6y-12=0$. Центр: $\left(-\frac{-4}{2};\,-\frac{6}{2}\right)=(2;\,-3)$. Радиус: $r=\sqrt{4+9-(-12)}=\sqrt{25}=5$.`),
        practice: ['circ.general', 'circ.general', 'circ.read', 'circ.graph'],
      },
      {
        title: L('Retta e circonferenza', 'Прямая и окружность'),
        predict: {
          q: L('Una retta dista 5 dal centro di una circonferenza di raggio 5. Quanti punti hanno in comune?', 'Прямая удалена на 5 от центра окружности радиуса 5. Сколько у них общих точек?'),
          choices: [L('nessuno', 'ни одной'), L('uno', 'одна'), L('due', 'две'), L('infiniti', 'бесконечно много')], correct: 1,
          why: L('Se la distanza è uguale al raggio, la retta tocca la circonferenza in un solo punto: è tangente.', 'Если расстояние равно радиусу, прямая касается окружности в одной точке: это касательная.'),
        },
        scene: 'circ-line',
        missions: [
          L('Con $m=0$ alza $q$ finché la retta diventa tangente. Quanto vale $q$?', 'При $m=0$ поднимай $q$, пока прямая не станет касательной. Чему равно $q$?'),
          L('Tieni $q=4$ e cambia $m$: la retta può tornare secante?', 'Оставь $q=4$ и меняй $m$: может ли прямая снова стать секущей?'),
        ],
        theory: L(
          R`<p>Per capire come sta una retta rispetto a una circonferenza basta confrontare la <b>distanza $d$</b> del centro dalla retta con il <b>raggio $r$</b>:</p>
<ul><li>$d<r$: <b>secante</b>, 2 punti in comune;</li><li>$d=r$: <b>tangente</b>, 1 punto;</li><li>$d>r$: <b>esterna</b>, nessun punto.</li></ul>
<p>Distanza del punto $(x_0;\,y_0)$ dalla retta $ax+by+c=0$:</p>
$$d=\frac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$$
<p>In alternativa si mette a sistema retta e circonferenza: il $\Delta$ dell'equazione risolvente dice quante sono le intersezioni ($\Delta>0$ due, $\Delta=0$ una, $\Delta<0$ nessuna).</p>`,
          R`<p>Чтобы понять, как прямая расположена относительно окружности, достаточно сравнить <b>расстояние $d$</b> от центра до прямой с <b>радиусом $r$</b>:</p>
<ul><li>$d<r$: <b>секущая</b>, 2 общие точки;</li><li>$d=r$: <b>касательная</b>, 1 точка;</li><li>$d>r$: <b>внешняя</b>, общих точек нет.</li></ul>
<p>Расстояние от точки $(x_0;\,y_0)$ до прямой $ax+by+c=0$:</p>
$$d=\frac{|ax_0+by_0+c|}{\sqrt{a^2+b^2}}$$
<p>Другой способ — решить систему из прямой и окружности: $\Delta$ получившегося уравнения показывает число пересечений ($\Delta>0$ — два, $\Delta=0$ — одно, $\Delta<0$ — ни одного).</p>`),
        example: L(
          R`Circonferenza $x^2+y^2=25$, retta $3x+4y-25=0$. Centro $(0;0)$: $d=\frac{|-25|}{\sqrt{9+16}}=5=r$. La retta è tangente.`,
          R`Окружность $x^2+y^2=25$, прямая $3x+4y-25=0$. Центр $(0;0)$: $d=\frac{|-25|}{\sqrt{9+16}}=5=r$. Прямая — касательная.`),
        practice: ['circ.line', 'circ.line', 'circ.point', 'circ.graph'],
      },
    ],
  },
  {
    id: 'par',
    title: L('Parabola', 'Парабола'),
    lead: L('Tutti i punti equidistanti da un fuoco e da una retta.', 'Все точки, равноудалённые от фокуса и от прямой.'),
    test: ['par.vertex', 'par.focus', 'par.focus2', 'par.zeros', 'par.delta', 'par.graph'],
    stages: [
      {
        title: L('Fuoco, direttrice e $y=ax^2$', 'Фокус, директриса и $y=ax^2$'),
        predict: {
          q: L('In $y=ax^2$, se $a$ passa da 1 a 3 la parabola…', 'В $y=ax^2$ при увеличении $a$ с 1 до 3 парабола…'),
          choices: [L('si stringe', 'сужается'), L('si allarga', 'расширяется'), L("si sposta verso l'alto", 'сдвигается вверх'), L('si capovolge', 'переворачивается')], correct: 0,
          why: L('Con $a$ più grande la $y$ cresce più in fretta: la parabola sale più ripida e si stringe. Si capovolge solo se $a$ cambia segno.', 'При большем $a$ значение $y$ растёт быстрее: парабола круче и уже. Переворачивается она только при смене знака $a$.'),
        },
        scene: 'par-focus',
        missions: [
          L('Muovi $P$: confronta $PF$ e $PH$.', 'Двигай $P$: сравни $PF$ и $PH$.'),
          L('Aumenta $a$: dove va il fuoco? E la direttrice?', 'Увеличивай $a$: куда движется фокус? А директриса?'),
          L('Rendi $a$ negativo: cosa si scambia?', 'Сделай $a$ отрицательным: что меняется местами?'),
        ],
        theory: L(
          R`<p>La <b>parabola</b> è il luogo dei punti equidistanti da un punto fisso $F$ (<b>fuoco</b>) e da una retta fissa $d$ (<b>direttrice</b>).</p>
<p>Con il vertice nell'origine e l'asse coincidente con l'asse $y$, l'equazione è $y=ax^2$ e:</p>
$$F\left(0;\,\frac{1}{4a}\right)\qquad d:\ y=-\frac{1}{4a}$$
<ul><li>$a>0$: concavità verso l'alto; $a<0$: verso il basso.</li>
<li>Più $|a|$ è grande, più la parabola è stretta e più il fuoco è vicino al vertice.</li>
<li>Il vertice è sempre a metà strada tra fuoco e direttrice.</li></ul>`,
          R`<p><b>Парабола</b> — множество точек, равноудалённых от фиксированной точки $F$ (<b>фокуса</b>) и фиксированной прямой $d$ (<b>директрисы</b>).</p>
<p>Если вершина в начале координат, а ось совпадает с осью $y$, уравнение имеет вид $y=ax^2$ и:</p>
$$F\left(0;\,\frac{1}{4a}\right)\qquad d:\ y=-\frac{1}{4a}$$
<ul><li>$a>0$: ветви вверх; $a<0$: ветви вниз.</li>
<li>Чем больше $|a|$, тем уже парабола и тем ближе фокус к вершине.</li>
<li>Вершина всегда посередине между фокусом и директрисой.</li></ul>`),
        example: L(
          R`$y=\frac{1}{8}x^2$: $a=\frac18$, quindi $\frac{1}{4a}=2$. Fuoco $F(0;\,2)$, direttrice $y=-2$.`,
          R`$y=\frac{1}{8}x^2$: $a=\frac18$, значит $\frac{1}{4a}=2$. Фокус $F(0;\,2)$, директриса $y=-2$.`),
        practice: ['par.focus', 'par.fromvertex', 'par.focus', 'par.graph'],
      },
      {
        title: L('$y=ax^2+bx+c$: vertice e asse', '$y=ax^2+bx+c$: вершина и ось'),
        predict: {
          q: L('In $y=x^2-4x+3$, che cosa indica il numero 3?', 'Что показывает число 3 в $y=x^2-4x+3$?'),
          choices: [L("dove la parabola taglia l'asse $y$", 'где парабола пересекает ось $y$'), L("l'ordinata del vertice", 'ординату вершины'), L("l'asse di simmetria", 'ось симметрии'), L("un punto in cui taglia l'asse $x$", 'точку пересечения с осью $x$')], correct: 0,
          why: L("Con $x=0$ resta $y=c$: il termine noto è l'ordinata del punto in cui la parabola incontra l'asse $y$.", 'При $x=0$ остаётся $y=c$: свободный член — ордината точки пересечения с осью $y$.'),
        },
        scene: 'par-abc',
        missions: [
          L('Cambia solo $c$: come si muove la parabola?', 'Меняй только $c$: как движется парабола?'),
          L('Cambia solo $b$: segui il vertice. Che percorso fa?', 'Меняй только $b$: следи за вершиной. По какой траектории она идёт?'),
          L("Trova $a$, $b$, $c$ per avere il vertice in $(2;\\,-3)$.", 'Подбери $a$, $b$, $c$ так, чтобы вершина была в $(2;\\,-3)$.'),
        ],
        theory: L(
          R`<p>Ogni parabola con asse parallelo all'asse $y$ ha equazione $y=ax^2+bx+c$ con $a\neq0$.</p>
$$V\left(-\frac{b}{2a};\,-\frac{\Delta}{4a}\right)\qquad \text{asse: } x=-\frac{b}{2a}\qquad \Delta=b^2-4ac$$
<ul><li>In pratica: calcola $x_V=-\frac{b}{2a}$ e sostituiscilo nell'equazione per avere $y_V$.</li>
<li>$c$ è l'ordinata dell'intersezione con l'asse $y$.</li>
<li>Fuoco e direttrice si trovano a partire dal vertice: $F\left(x_V;\,y_V+\frac{1}{4a}\right)$, direttrice $y=y_V-\frac{1}{4a}$.</li></ul>
<p>La stessa parabola si può scrivere $y=a(x-x_V)^2+y_V$: è $y=ax^2$ traslata nel vertice.</p>`,
          R`<p>Любая парабола с осью, параллельной оси $y$, задаётся уравнением $y=ax^2+bx+c$, где $a\neq0$.</p>
$$V\left(-\frac{b}{2a};\,-\frac{\Delta}{4a}\right)\qquad \text{ось: } x=-\frac{b}{2a}\qquad \Delta=b^2-4ac$$
<ul><li>На практике: найди $x_V=-\frac{b}{2a}$ и подставь в уравнение, чтобы получить $y_V$.</li>
<li>$c$ — ордината точки пересечения с осью $y$.</li>
<li>Фокус и директриса отсчитываются от вершины: $F\left(x_V;\,y_V+\frac{1}{4a}\right)$, директриса $y=y_V-\frac{1}{4a}$.</li></ul>
<p>Ту же параболу можно записать как $y=a(x-x_V)^2+y_V$: это $y=ax^2$, перенесённая в вершину.</p>`),
        example: L(
          R`$y=x^2-4x+3$. $x_V=-\frac{-4}{2}=2$; $y_V=4-8+3=-1$. Vertice $V(2;\,-1)$, asse $x=2$, taglia l'asse $y$ in $3$.`,
          R`$y=x^2-4x+3$. $x_V=-\frac{-4}{2}=2$; $y_V=4-8+3=-1$. Вершина $V(2;\,-1)$, ось $x=2$, пересечение с осью $y$ в точке $3$.`),
        practice: ['par.vertex', 'par.vertex', 'par.focus2', 'par.graph'],
      },
      {
        title: L('Zeri e discriminante', 'Нули и дискриминант'),
        predict: {
          q: L("Una parabola ha il vertice sopra l'asse $x$ e la concavità verso l'alto. Quante volte taglia l'asse $x$?", 'Вершина параболы выше оси $x$, ветви направлены вверх. Сколько раз она пересекает ось $x$?'),
          choices: [L('mai', 'ни разу'), L('una volta', 'один раз'), L('due volte', 'два раза'), L('dipende da $c$', 'зависит от $c$')], correct: 0,
          why: L("Il vertice è il punto più basso: se è già sopra l'asse $x$, tutta la parabola resta sopra. È il caso $\\Delta<0$.", 'Вершина — самая низкая точка: если она уже выше оси $x$, вся парабола выше. Это случай $\\Delta<0$.'),
        },
        scene: 'par-delta',
        missions: [
          L('Per quale $c$ la parabola è tangente all’asse $x$?', 'При каком $c$ парабола касается оси $x$?'),
          L('Osserva il segno di $\\Delta$ mentre il vertice attraversa l’asse.', 'Следи за знаком $\\Delta$, когда вершина пересекает ось.'),
        ],
        theory: L(
          R`<p>Gli <b>zeri</b> della parabola sono le ascisse dei punti in cui taglia l'asse $x$: si trovano ponendo $y=0$, cioè risolvendo $ax^2+bx+c=0$.</p>
<ul><li>$\Delta>0$: due zeri $x_{1,2}=\frac{-b\pm\sqrt{\Delta}}{2a}$;</li>
<li>$\Delta=0$: uno zero, la parabola è tangente all'asse $x$ nel vertice;</li>
<li>$\Delta<0$: nessuno zero.</li></ul>
<p>Con due zeri la parabola si scrive anche $y=a(x-x_1)(x-x_2)$ e l'asse passa a metà: $x_V=\frac{x_1+x_2}{2}$.</p>
<p>Lo stesso metodo vale per retta e parabola: metti a sistema, ottieni un'equazione di secondo grado e guardi il $\Delta$ (secante, tangente, esterna).</p>`,
          R`<p><b>Нули</b> параболы — абсциссы точек, где она пересекает ось $x$: их находят, положив $y=0$, то есть решая $ax^2+bx+c=0$.</p>
<ul><li>$\Delta>0$: два нуля $x_{1,2}=\frac{-b\pm\sqrt{\Delta}}{2a}$;</li>
<li>$\Delta=0$: один нуль, парабола касается оси $x$ в вершине;</li>
<li>$\Delta<0$: нулей нет.</li></ul>
<p>При двух нулях параболу можно записать как $y=a(x-x_1)(x-x_2)$, а ось проходит посередине: $x_V=\frac{x_1+x_2}{2}$.</p>
<p>Тот же метод работает для прямой и параболы: решаешь систему, получаешь квадратное уравнение и смотришь на $\Delta$ (секущая, касательная, внешняя).</p>`),
        example: L(
          R`$y=x^2-2x-3$. $\Delta=4+12=16>0$: $x=\frac{2\pm4}{2}$, cioè $x_1=-1$ e $x_2=3$. Quindi $y=(x+1)(x-3)$ e $x_V=\frac{-1+3}{2}=1$.`,
          R`$y=x^2-2x-3$. $\Delta=4+12=16>0$: $x=\frac{2\pm4}{2}$, то есть $x_1=-1$ и $x_2=3$. Значит, $y=(x+1)(x-3)$ и $x_V=\frac{-1+3}{2}=1$.`),
        practice: ['par.zeros', 'par.delta', 'par.zeros', 'par.vertex'],
      },
    ],
  },
  {
    id: 'hyp',
    title: L('Iperbole', 'Гипербола'),
    lead: L('Due rami, due fuochi, due asintoti.', 'Две ветви, два фокуса, две асимптоты.'),
    test: ['hyp.abc', 'hyp.asym', 'hyp.ecc', 'hyp.orient', 'hyp.xyk', 'hyp.graph'],
    stages: [
      {
        title: L('Definizione ed equazione canonica', 'Определение и каноническое уравнение'),
        predict: {
          q: L(R`L'iperbole $\frac{x^2}{9}-\frac{y^2}{16}=1$ incontra l'asse $y$?`, R`Пересекает ли гипербола $\frac{x^2}{9}-\frac{y^2}{16}=1$ ось $y$?`),
          choices: [L('no, mai', 'нет, никогда'), L('sì, in due punti', 'да, в двух точках'), L('sì, in un punto', 'да, в одной точке'), L('sì, in quattro punti', 'да, в четырёх точках')], correct: 0,
          why: L(R`Con $x=0$ resta $-\frac{y^2}{16}=1$, cioè $y^2=-16$: impossibile. L'iperbole taglia solo l'asse $x$, nei vertici $(\pm3;\,0)$.`, R`При $x=0$ остаётся $-\frac{y^2}{16}=1$, то есть $y^2=-16$: невозможно. Гипербола пересекает только ось $x$, в вершинах $(\pm3;\,0)$.`),
        },
        scene: 'hyp-std',
        missions: [
          L('Muovi $P$: guarda la differenza $PF_1-PF_2$.', 'Двигай $P$: следи за разностью $PF_1-PF_2$.'),
          L('Aumenta $b$ tenendo fermo $a$: cosa succede ai rami e agli asintoti?', 'Увеличивай $b$ при постоянном $a$: что происходит с ветвями и асимптотами?'),
          L('I vertici dipendono da $a$ o da $b$?', 'Вершины зависят от $a$ или от $b$?'),
        ],
        theory: L(
          R`<p>L'<b>iperbole</b> è il luogo dei punti per cui è costante la <b>differenza</b> delle distanze da due punti fissi, i <b>fuochi</b>: $|PF_1-PF_2|=2a$.</p>
<p>Con i fuochi sull'asse $x$ e il centro nell'origine:</p>
$$\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$$
<ul><li>Vertici: $(\pm a;\,0)$.</li>
<li>Fuochi: $(\pm c;\,0)$ con $c^2=a^2+b^2$.</li>
<li>Asintoti: $y=\pm\frac{b}{a}x$. I rami si avvicinano a queste rette senza mai toccarle.</li></ul>
<div class="warn">Nell'ellisse $c^2=a^2-b^2$; nell'iperbole $c^2=a^2+b^2$. I fuochi dell'iperbole sono più lontani dei vertici.</div>
<p>Per disegnarla: traccia il rettangolo di lati $2a$ e $2b$, le sue diagonali sono gli asintoti.</p>`,
          R`<p><b>Гипербола</b> — множество точек, для которых постоянна <b>разность</b> расстояний до двух фиксированных точек, <b>фокусов</b>: $|PF_1-PF_2|=2a$.</p>
<p>Если фокусы на оси $x$, а центр в начале координат:</p>
$$\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$$
<ul><li>Вершины: $(\pm a;\,0)$.</li>
<li>Фокусы: $(\pm c;\,0)$, где $c^2=a^2+b^2$.</li>
<li>Асимптоты: $y=\pm\frac{b}{a}x$. Ветви приближаются к этим прямым, но не касаются их.</li></ul>
<div class="warn">У эллипса $c^2=a^2-b^2$, у гиперболы $c^2=a^2+b^2$. Фокусы гиперболы дальше от центра, чем вершины.</div>
<p>Как рисовать: построй прямоугольник со сторонами $2a$ и $2b$, его диагонали — асимптоты.</p>`),
        example: L(
          R`$\frac{x^2}{9}-\frac{y^2}{16}=1$: $a=3$, $b=4$, $c=\sqrt{9+16}=5$. Vertici $(\pm3;\,0)$, fuochi $(\pm5;\,0)$, asintoti $y=\pm\frac43x$.`,
          R`$\frac{x^2}{9}-\frac{y^2}{16}=1$: $a=3$, $b=4$, $c=\sqrt{9+16}=5$. Вершины $(\pm3;\,0)$, фокусы $(\pm5;\,0)$, асимптоты $y=\pm\frac43x$.`),
        practice: ['hyp.abc', 'hyp.asym', 'hyp.write', 'hyp.graph'],
      },
      {
        title: L('Fuochi sull’asse $y$ ed eccentricità', 'Фокусы на оси $y$ и эксцентриситет'),
        predict: {
          q: L("L'eccentricità $e=\\frac{c}{a}$ di un'iperbole è sempre…", 'Эксцентриситет $e=\\frac{c}{a}$ гиперболы всегда…'),
          choices: [L('maggiore di 1', 'больше 1'), L('compresa tra 0 e 1', 'между 0 и 1'), L('uguale a 1', 'равен 1'), L('negativa', 'отрицателен')], correct: 0,
          why: L('Poiché $c^2=a^2+b^2$, si ha $c>a$ e quindi $e>1$. (Nell’ellisse è minore di 1, nella parabola vale 1.)', 'Так как $c^2=a^2+b^2$, имеем $c>a$, значит $e>1$. (У эллипса он меньше 1, у параболы равен 1.)'),
        },
        scene: 'hyp-orient',
        missions: [
          L('Passa da «fuochi su $x$» a «fuochi su $y$»: cosa cambia nell’equazione? E negli asintoti?', 'Переключи «фокусы на $x$» на «фокусы на $y$»: что меняется в уравнении? А в асимптотах?'),
          L('Aumenta $b$ con i fuochi su $x$: l’eccentricità cresce o diminuisce? E i rami?', 'Увеличивай $b$ при фокусах на $x$: эксцентриситет растёт или убывает? А ветви?'),
        ],
        theory: L(
          R`<p>Se i fuochi stanno sull'<b>asse $y$</b> l'equazione diventa:</p>
$$\frac{x^2}{a^2}-\frac{y^2}{b^2}=-1$$
<ul><li>Vertici: $(0;\,\pm b)$. Fuochi: $(0;\,\pm c)$, sempre con $c^2=a^2+b^2$.</li>
<li>Gli asintoti restano $y=\pm\frac{b}{a}x$.</li></ul>
<p>Per riconoscere l'asse dei fuochi poni $x=0$ e $y=0$: l'iperbole taglia solo l'asse su cui stanno vertici e fuochi.</p>
<p>L'<b>eccentricità</b> è il rapporto tra semidistanza focale e semiasse trasverso: $e=\frac{c}{a}$ (fuochi su $x$) oppure $e=\frac{c}{b}$ (fuochi su $y$). È sempre $e>1$: più è grande, più i rami sono aperti.</p>`,
          R`<p>Если фокусы лежат на <b>оси $y$</b>, уравнение принимает вид:</p>
$$\frac{x^2}{a^2}-\frac{y^2}{b^2}=-1$$
<ul><li>Вершины: $(0;\,\pm b)$. Фокусы: $(0;\,\pm c)$, по-прежнему $c^2=a^2+b^2$.</li>
<li>Асимптоты остаются $y=\pm\frac{b}{a}x$.</li></ul>
<p>Чтобы определить ось фокусов, подставь $x=0$ и $y=0$: гипербола пересекает только ту ось, на которой лежат вершины и фокусы.</p>
<p><b>Эксцентриситет</b> — отношение фокусного полурасстояния к действительной полуоси: $e=\frac{c}{a}$ (фокусы на $x$) или $e=\frac{c}{b}$ (фокусы на $y$). Всегда $e>1$: чем он больше, тем шире раскрыты ветви.</p>`),
        example: L(
          R`$\frac{x^2}{16}-\frac{y^2}{9}=-1$: $a=4$, $b=3$, $c=5$. Vertici $(0;\,\pm3)$, fuochi $(0;\,\pm5)$, asintoti $y=\pm\frac34x$, $e=\frac{c}{b}=\frac53$.`,
          R`$\frac{x^2}{16}-\frac{y^2}{9}=-1$: $a=4$, $b=3$, $c=5$. Вершины $(0;\,\pm3)$, фокусы $(0;\,\pm5)$, асимптоты $y=\pm\frac34x$, $e=\frac{c}{b}=\frac53$.`),
        practice: ['hyp.orient', 'hyp.yfoci', 'hyp.ecc', 'hyp.graph'],
      },
      {
        title: L('Iperbole equilatera e $xy=k$', 'Равносторонняя гипербола и $xy=k$'),
        predict: {
          q: L('Nell’iperbole $xy=6$, se $x$ raddoppia allora $y$…', 'В гиперболе $xy=6$ при удвоении $x$ значение $y$…'),
          choices: [L('si dimezza', 'уменьшается вдвое'), L('raddoppia', 'удваивается'), L('resta uguale', 'не меняется'), L('aumenta di 6', 'увеличивается на 6')], correct: 0,
          why: L('Il prodotto deve restare 6: se un fattore raddoppia, l’altro si dimezza. È la proporzionalità inversa.', 'Произведение должно оставаться равным 6: если один множитель удваивается, другой уменьшается вдвое. Это обратная пропорциональность.'),
        },
        scene: 'hyp-xy',
        missions: [
          L('Muovi $P$: l’area del rettangolo cambia?', 'Двигай $P$: меняется ли площадь прямоугольника?'),
          L('Rendi $k$ negativo: dove vanno i rami?', 'Сделай $k$ отрицательным: куда переходят ветви?'),
          L('Cosa succede ai rami quando $|k|$ cresce?', 'Что происходит с ветвями, когда $|k|$ растёт?'),
        ],
        theory: L(
          R`<p>Un'iperbole è <b>equilatera</b> quando $a=b$: l'equazione diventa $x^2-y^2=a^2$.</p>
<ul><li>Gli asintoti sono $y=\pm x$, cioè le bisettrici dei quadranti: sono <b>perpendicolari</b>.</li>
<li>$c=a\sqrt2$ e l'eccentricità vale sempre $e=\sqrt2$.</li></ul>
<p>Ruotando la figura di 45° gli asintoti diventano gli assi cartesiani e l'equazione si semplifica:</p>
$$xy=k$$
<ul><li>$k>0$: rami nel I e III quadrante; $k<0$: nel II e IV.</li>
<li>Gli asintoti sono gli assi $x$ e $y$.</li>
<li>È il grafico della <b>proporzionalità inversa</b> $y=\frac{k}{x}$.</li></ul>`,
          R`<p>Гипербола называется <b>равносторонней</b>, когда $a=b$: уравнение принимает вид $x^2-y^2=a^2$.</p>
<ul><li>Асимптоты $y=\pm x$ — биссектрисы четвертей: они <b>перпендикулярны</b>.</li>
<li>$c=a\sqrt2$, а эксцентриситет всегда равен $e=\sqrt2$.</li></ul>
<p>Если повернуть рисунок на 45°, асимптоты станут осями координат, и уравнение упростится:</p>
$$xy=k$$
<ul><li>$k>0$: ветви в I и III четвертях; $k<0$: во II и IV.</li>
<li>Асимптоты — оси $x$ и $y$.</li>
<li>Это график <b>обратной пропорциональности</b> $y=\frac{k}{x}$.</li></ul>`),
        example: L(
          R`L'iperbole $xy=k$ passa per $(2;\,-5)$: $k=2\cdot(-5)=-10$. Equazione $xy=-10$, rami nel II e IV quadrante. Per $x=4$: $y=-\frac{10}{4}=-\frac52$.`,
          R`Гипербола $xy=k$ проходит через $(2;\,-5)$: $k=2\cdot(-5)=-10$. Уравнение $xy=-10$, ветви во II и IV четвертях. При $x=4$: $y=-\frac{10}{4}=-\frac52$.`),
        practice: ['hyp.xyk', 'hyp.xyy', 'hyp.asym', 'hyp.graph'],
      },
    ],
  },
];
