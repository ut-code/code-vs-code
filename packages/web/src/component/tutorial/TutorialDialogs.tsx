import tutorial11 from "../../../resources/tutorialImages/tutorial1_1.png";
import tutorial12 from "../../../resources/tutorialImages/tutorial1_2.png";
import tutorial13 from "../../../resources/tutorialImages/tutorial1_3.png";
import tutorial141 from "../../../resources/tutorialImages/tutorial1_4_1.png";
import tutorial142 from "../../../resources/tutorialImages/tutorial1_4_2.png";
import tutorial15 from "../../../resources/tutorialImages/tutorial1_5.png";
import tutorial21 from "../../../resources/tutorialImages/tutorial2_1.png";
import tutorial22 from "../../../resources/tutorialImages/tutorial2_2.png";
import tutorial23 from "../../../resources/tutorialImages/tutorial2_3.png";
import tutorial311 from "../../../resources/tutorialImages/tutorial3_1_1.png";
import tutorial312 from "../../../resources/tutorialImages/tutorial3_1_2.png";
import tutorial313 from "../../../resources/tutorialImages/tutorial3_1_3.png";
import tutorial32 from "../../../resources/tutorialImages/tutorial3_2.png";
import tutorial411 from "../../../resources/tutorialImages/tutorial4_1_1.png";
import tutorial412 from "../../../resources/tutorialImages/tutorial4_1_2.png";
import tutorial42 from "../../../resources/tutorialImages/tutorial4_2.png";
import tutorial43 from "../../../resources/tutorialImages/tutorial4_3.png";
import tutorial44 from "../../../resources/tutorialImages/tutorial4_4.png";

export interface TutorialDialogPropsStep {
  title: string;
  content: JSX.Element;
}

export interface TutorialDialogProps {
  goal: string;
  steps: TutorialDialogPropsStep[];
}

export const TutorialDialog1: TutorialDialogProps = {
  goal: "敵を倒す",
  steps: [
    {
      title: "Code vs Codeへようこそ",
      content: (
        <div>
          <h1>Code vs Codeへようこそ</h1>
          <p>
            Code vs
            CodeではあなただけのバトルAIを作って、他の人が作ったバトルAIと戦わせることができます。
            <br />
            表示されている他の機体のHPを0にして最後まで生き残ることができれば勝利です。
            <br />
            まずはチュートリアルを通じて機体の動作やルールを学んでいきましょう。
          </p>
          <img src={tutorial11} alt="tutorial11" width="100%" />
        </div>
      ),
    },
    {
      title: "チュートリアル1",
      content: (
        <div>
          <h1>チュートリアルについて</h1>
          <p>
            チュートリアルでは複数のページに分かれており、好きなページを選んで進めることができます。
            <br />
            各ページごとに目標が設定されており、目標を達成するとチュートリアルクリアとなります。
            <br />
            このページでの目標は<strong>「敵を倒す」</strong>です。
            <br />
            画面上で表示されている機体のうち、あなたのプレイヤー名が表示されているのが自分の機体でそれ以外が敵の機体です。
          </p>
          <img src={tutorial12} alt="tutorial12" width="50%" />
        </div>
      ),
    },
    {
      title: "チュートリアル2",
      content: (
        <div>
          <h1>ブロックの操作</h1>
          <p>
            バトルAIはブロックの組み合わせで作ります。ブロックはドラッグ・ドロップで操作でき、様々に組み合わせることができます。
            <br />
            左側のタブからブロックを選択して、ワークスペースにドラッグしてみましょう。
            <br />
            ブロックを反映させるには、一度右下の「リセット」ボタンを押す必要があります。
          </p>
          <img src={tutorial13} alt="tutorial13" width="100%" />
        </div>
      ),
    },
    {
      title: "チュートリアル3",
      content: (
        <div>
          <h1>行動ブロックと情報ブロック</h1>
          <p>
            情報ブロックはオレンジ色のブロックで、機体の情報を取得するためのブロックです。
            <br />
            行動ブロックは赤色のブロックで、機体の行動を決める最も重要なブロックです。
            <br />
          </p>
          <img src={tutorial141} alt="tutorial141" width="50%" />
          <img src={tutorial142} alt="tutorial142" width="50%" />
        </div>
      ),
    },
    {
      title: "チュートリアル4",
      content: (
        <div>
          <h1>「殴る」ブロック</h1>
          <p>
            行動ブロックの「殴る」は選択した相手にダメージを与えます。ただし十分相手に近くないと当たりません。
            <br />
            「敵を倒す」目標を達成するために、このブロックと情報ブロックを組み合わせて使ってみましょう。
          </p>
          <img src={tutorial15} alt="tutorial15" width="60%" />
        </div>
      ),
    },
  ],
};

export const TutorialDialog2: TutorialDialogProps = {
  goal: "敵に近づく",
  steps: [
    {
      title: "チュートリアル2",
      content: (
        <div>
          <h1>新規ブロック獲得！</h1>
          <p>
            新しいブロックが解放されました！
            <br />
            行動ブロックに「向かう」ブロックと「走る」ブロックが追加されました。
            <br />
            どちらも特定の地点に移動するためのブロックです。
          </p>
          <img src={tutorial21} alt="tutorial21" width="50%" />
        </div>
      ),
    },
    {
      title: "チュートリアル2番",
      content: (
        <div>
          <h1>「元気」について</h1>
          <p>
            先ほど紹介した二つのブロックの動作は似ていますが、「走る」ブロックの方が速く動ける分「元気」を多く消費します。
            <br />
            「HP」バーの下にある「元気」バーは、機体の行動によって減っていきます。「元気」が0になると機体は行動できなくなります。
            <br />
            そのため、行動ブロックを組み合わせる際は「元気」の消費量にも注意しましょう。
          </p>
          <img src={tutorial22} alt="tutorial22" width="100%" />
        </div>
      ),
    },
    {
      title: "チュートリアル2番",
      content: (
        <div>
          <h1>敵に近づく</h1>
          <p>
            このページでの目標は<strong>「敵に近づく」</strong>ことです。
            <br />
            追加されたブロックを使って、敵に近づくためのプログラムを作ってみましょう。
            敵に十分近づいたらクリアです。
          </p>
          <img src={tutorial23} alt="tutorial23" width="70%" />
        </div>
      ),
    },
  ],
};

export const TutorialDialog3: TutorialDialogProps = {
  goal: "遠くにいる敵を倒す",
  steps: [
    {
      title: "チュートリアル3番",
      content: (
        <div>
          <h1>新規ブロック獲得！</h1>
          <p>
            「論理」タブと「数」タブに複数のブロックが追加されました。また「情報」タブに「定数」ブロックが追加されました。
            <br />
            これらのブロックはより複雑なプログラムを作るために必要となってくるブロックです。
            <br />
            うまく活用してより強いバトルAIを作りましょう。
          </p>
          <img src={tutorial311} alt="tutorial311" width="20%" />
          <img src={tutorial312} alt="tutorial312" width="50%" />
        </div>
      ),
    },
    {
      title: "チュートリアル3番",
      content: (
        <div>
          <h1>2種類以上の行動をする</h1>
          <p>
            これまで「行動」ブロックは1つしか使っていませんでしたが、複雑な行動には複数の「行動」ブロックの組み合わせが必要です。
            <br />
            しかし、機体が一度に行える行動は1つだけで「行動」ブロックを二つ配置してもそのうち一つしか読み込まれません。そのため複数の行動を組み合わせる際は「論理」ブロックを使う必要があります。
            <br />
            「論理」ブロックは「もし～ならば」という形で使われ、条件によって異なる行動を行うことができます。
          </p>
          <img src={tutorial32} alt="tutorial32" width="70%" />
        </div>
      ),
    },
    {
      title: "チュートリアル3番",
      content: (
        <div>
          <h1>遠くにいる敵を倒す</h1>
          <p>
            このページでの目標は<strong>「遠くにいる敵を倒す」</strong>
            ことです。
            <br />
            この敵には「殴る」ブロックでは届かない距離にいるため、敵に近づいてから攻撃する必要があります。
            <br />
            敵との距離が「定数」ブロックにある「腕の長さ」より小さくなったら攻撃が当たるようになります。
            <br />
            論理ブロックを使って、遠くにいる敵に対しては「向かう」ブロックを使い、近くにいる敵に対しては「殴る」ブロックを使うようにプログラムを作ってみましょう。
            <br />
          </p>
          <img src={tutorial313} alt="tutorial313" width="50%" />
        </div>
      ),
    },
  ],
};

const TutorialDialog4: TutorialDialogProps = {
  goal: "武器を使って敵を倒す",
  steps: [
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>新規ブロック獲得！</h1>
          <p>
            「情報」タブと「行動」タブに「武器」に関連するブロックが追加されました。これらは「武器」を扱うためのブロックです。
            <br />
            また「情報」タブに「ファイター情報」ブロックが追加されました。これは自分や敵の機体の情報を取得するためのブロックです。様々な状況判断を行うことに用いられます。
          </p>
          <img src={tutorial411} alt="tutorial411" width="40%" />
          <img src={tutorial412} alt="tutorial412" width="50%" />
        </div>
      ),
    },
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>「武器」の使い方</h1>
          <p>
            あなたの機体は、はじめは「武器」をもっておらず、「殴る」以外の攻撃ができません。
            <br />
            「武器」を使うには、まずフィールド上にランダムに現れる「武器」を手に入れ、それを敵に向けて使用するという手順を踏まなければいけません。
          </p>
          <img src={tutorial42} alt="tutorial42" width="70%" />
        </div>
      ),
    },
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>新規ブロックの使い方</h1>
          <p>
            フィールド上の「武器」を取得するには「腕の長さ」よりも近づいて、「拾う」ブロックを使う必要があります。
            <br />
            「武器」を手に入れたら「武器を使う」ブロックを使って敵に向けて使用しましょう。ただし武器には射程距離があり、それよりも遠い敵には当たりません。「腕の長さ」と同じブロックに定数(400)として含まれているので活用してみましょう。
          </p>
          <img src={tutorial43} alt="tutorial43" width="70%" />
        </div>
      ),
    },
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>武器を使って敵を倒す</h1>
          <p>
            このページでの目標は<strong>「武器を使って敵を倒す」</strong>
            ことです。
            <br />
            このページでは「殴る」ブロックは使えません。代わりに「武器を使う」ブロックを使って敵を倒してみましょう。
            <br />
            「武器」を持っていないときは「武器」に近づいて「拾う」、持っているときは「武器を使う」を行うように場合を分けてプログラムを作ってみましょう。
            <br />
            「武器」を拾うためにも場合を分けて「行動」ブロックを使わなければいけないことに注意してください。
          </p>
          <img src={tutorial44} alt="tutorial44" width="70%" />
        </div>
      ),
    },
  ],
};

const TutorialDialog5: TutorialDialogProps = {
  goal: "キノコを利用する",
  steps: [
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>新規ブロック獲得！</h1>
          <p>
            「情報」タブと「行動」タブにスピードアップキノコに関連するブロックが追加されました。
            <br />
            フィールド上のキノコを獲得することで機体のスピードを一時的に上げることができます。
          </p>
        </div>
      ),
    },
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>「キノコ」の使い方</h1>
          <p>
            キノコの効果は重複し、獲得するほど速く移動できるようになり、時間経過で効果が切れます。
            <br />
            キノコは武器と違い十分に近づいていれば自動的に獲得できるので、「拾う」ブロックは必要ありません。
            <br />
            現在の速さは左下の「移動:×」表示で確認できます。
          </p>
        </div>
      ),
    },
    {
      title: "チュートリアル4番",
      content: (
        <div>
          <h1>キノコを利用する</h1>
          <p>
            このページでの目標は<strong>「キノコを利用する」</strong>ことです。
            <br />
            「キノコ」を複数獲得して、スピードを4倍に出来ればクリアです。
            <br />
            ただし敵もキノコを狙っているので、工夫してキノコを獲得しましょう。
          </p>
        </div>
      ),
    },
  ],
};

export const tutorialDialogs = [
  TutorialDialog1,
  TutorialDialog2,
  TutorialDialog3,
  TutorialDialog4,
  TutorialDialog5,
];
