/* Our World Level 6 · Unit 8 — Robots Rule
   Source: Student's Book audio script TR 8.1-8.8. */
export default {
  unit: 8,
  title: "Robots Rule",
  jpTitle: "ロボットの時代",
  themeEmoji: "🤖",
  slug: "robots-rule",

  opener: {
    tr: "8.1",
    intro:
      "Robots (or “bots”) are not just in science-fiction movies. In real life, they work in many environments—in space, on land, and underwater. They do amazing jobs!",
    goals: [
      { en: "Describe what robots can do in space, on land and underwater.", jp: "宇宙・陸・水中でロボットが何をできるかを説明する。" },
      { en: "Use wish statements to talk about what is not true.", jp: "wish の文を使って、事実ではないことを話す。" },
      { en: "Name a robot's features and abilities.", jp: "ロボットの特徴や能力の名前を言う。" },
      { en: "Use the future passive to say what will be done.", jp: "未来の受け身で「何がされるだろうか」を言う。" },
      { en: "Read about four kinds of bots and compare them.", jp: "4種類のロボットについて読み、比べる。" }
    ],
    photoCards: [
      { emoji: "🚀", title: "SPACE", text: "Robots can explore space easily because they are mobile and extremely precise. Also, they never need food or sleep. “Bots” have successfully visited Mars, Venus, and Jupiter, where they were controlled by humans on Earth using remote controls.", jp: "ロボットは動きが自由で非常に正確なので、宇宙を簡単に探査できます。食事も睡眠も必要ありません。ロボットは火星・金星・木星を訪れ、地球の人間がリモコンで操作しました。" },
      { emoji: "🏠", title: "EARTH", text: "On Earth, robots are often used to perform useful tasks like cleaning and shopping. Robovie R3 is a Japanese robot that helps older people. AIBO, the robot dog, is a wonderful companion. ASIMO, an android robot with human features, can even serve tea and play soccer.", jp: "地球ではロボットは掃除や買い物などの役立つ作業をします。Robovie R3 は高齢者を助ける日本のロボットです。ロボット犬 AIBO はすばらしい相棒です。人間のような特徴を持つ ASIMO はお茶を出したりサッカーをしたりもできます。" },
      { emoji: "🌊", title: "UNDERWATER", text: "Bots do tasks that are too dangerous or complex for humans. They can respond to commands underwater, like collecting information about ocean life. Scientists hope to be able to program them to clean oil spills, too.", jp: "ロボットは人間には危険すぎたり複雑すぎたりする作業をします。水中で命令に応じ、海の生き物の情報を集めます。科学者は流出した油の掃除もできるようにしたいと考えています。" },
      { emoji: "🎬", title: "Not science fiction", text: "Robots are not just in science-fiction movies. In real life, they work in many environments.", jp: "ロボットはSF映画の中だけのものではありません。実際に、さまざまな環境で働いています。" }
    ],
    lookAndCheck: [
      { q: "Why can robots explore space easily?", opts: ["They are mobile and extremely precise", "They like space", "They are cheap"], correct: 0, jp: "動きが自由で非常に正確だからです。" },
      { q: "Which planets have bots visited?", opts: ["Mars, Venus and Jupiter", "Only Mars", "Saturn and Neptune"], correct: 0, jp: "火星・金星・木星です。" },
      { q: "What is Robovie R3?", opts: ["A Japanese robot that helps older people", "A robot dog", "A Mars rover"], correct: 0, jp: "高齢者を助ける日本のロボットです。" },
      { q: "What do underwater bots collect?", opts: ["Information about ocean life", "Oil for fuel", "Coral for museums"], correct: 0, jp: "海の生き物についての情報です。" }
    ],
    sort: {
      title: "Where does each bot work?",
      zones: [
        { id: "space", label: "🚀 Space" },
        { id: "land", label: "🏠 On land" },
        { id: "water", label: "🌊 Underwater" }
      ],
      tiles: [
        { text: "a Mars rover", zone: "space" },
        { text: "a bot on Venus", zone: "space" },
        { text: "a bot on Jupiter", zone: "space" },
        { text: "Robovie R3", zone: "land" },
        { text: "AIBO the robot dog", zone: "land" },
        { text: "ASIMO", zone: "land" },
        { text: "an oil-spill cleaner", zone: "water" },
        { text: "an ocean-life recorder", zone: "water" }
      ]
    },
    quiz: [
      { q: "What do robots never need?", opts: ["Food or sleep", "Electricity", "Commands"], correct: 0, jp: "食事も睡眠も必要ありません。" },
      { q: "How were the space bots controlled?", opts: ["By humans on Earth using remote controls", "By other robots", "By themselves"], correct: 0, jp: "地球の人間がリモコンで操作しました。" },
      { q: "What social task can ASIMO do?", opts: ["Serve tea and play soccer", "Fly a plane", "Dig a tomb"], correct: 0, jp: "お茶を出したりサッカーをしたりできます。" },
      { q: "What kind of tasks do underwater bots do?", opts: ["Tasks too dangerous or complex for humans", "Only easy tasks", "No tasks at all"], correct: 0, jp: "人間には危険すぎたり複雑すぎたりする作業です。" },
      { q: "AIBO is a ___.", opts: ["robot dog", "robot cat", "robot bird"], correct: 0, jp: "ロボット犬です。" },
      { q: "ASIMO is an ___ robot.", opts: ["android", "underwater", "space"], correct: 0, jp: "アンドロイドロボットです。" },
      { q: "What do scientists hope to program bots to clean?", opts: ["Oil spills", "Beaches", "Windows"], correct: 0, jp: "流出した油です。" },
      { q: "Robots are used on Earth for tasks like ___.", opts: ["cleaning and shopping", "sleeping", "eating"], correct: 0, jp: "掃除や買い物などです。" }
    ]
  },

  v1: {
    tr: "8.2",
    words: [
      { w: "science fiction", norm: "science fiction", emoji: "🛸", ipa: "ˌsaɪəns ˈfɪkʃən", syl: "sci-ence fic-tion", pos: "noun", mean: "stories about the future, space or imagined technology.", jw: "SF", jr: "えすえふ", jm: "未来・宇宙・想像上の技術についての物語。",
        tr: "Do you enjoy science fiction movies?",
        ex: [["Do you enjoy science fiction movies?", "SF映画は好きですか。"],
             ["Robots are not just in science fiction movies.", "ロボットはSF映画の中だけのものではありません。"],
             ["Science fiction often becomes real technology later.", "SFはのちに本当の技術になることがよくあります。"]] },
      { w: "mobile", norm: "mobile", emoji: "🛞", ipa: "ˈmoʊbəl", syl: "mo-bile", pos: "adjective", mean: "able to move around easily.", jw: "動ける", jr: "うごける", jm: "自由に動き回れること。",
        tr: "Robots are very mobile. They can move on planets.",
        ex: [["Robots are very mobile. They can move on planets.", "ロボットはとても動きが自由です。惑星の上でも動けます。"],
             ["They can explore space easily because they are mobile.", "動きが自由なので、宇宙を簡単に探査できます。"],
             ["A mobile robot needs strong wheels or legs.", "動き回るロボットには丈夫な車輪か脚が必要です。"]] },
      { w: "precise", norm: "precise", emoji: "🎯", ipa: "prɪˈsaɪs", syl: "pre-cise", pos: "adjective", mean: "exact and correct in every detail.", jw: "正確な", jr: "せいかくな", jm: "細かいところまで正確であること。",
        tr: "When humans feel tired, they are not very precise.",
        ex: [["When humans feel tired, they are not very precise.", "人間は疲れているとあまり正確ではありません。"],
             ["Robots are mobile and extremely precise.", "ロボットは動きが自由で非常に正確です。"],
             ["A surgical robot has to be precise every time.", "手術用ロボットは毎回正確でなければなりません。"]] },
      { w: "control", norm: "control", emoji: "🕹️", ipa: "kənˈtroʊl", syl: "con-trol", pos: "verb", mean: "to make something do what you want.", jw: "操作する", jr: "そうさする", jm: "思いどおりに動かすこと。",
        tr: "In the future robots will control our cars!",
        ex: [["In the future robots will control our cars!", "将来ロボットが私たちの車を操作するでしょう！"],
             ["They were controlled by humans on Earth.", "それらは地球の人間によって操作されました。"],
             ["A doctor controls the robot's every move.", "医師がロボットの動きをすべて操作します。"]] },
      { w: "a remote control", norm: "remote control", emoji: "📱", ipa: "rɪˌmoʊt kənˈtroʊl", syl: "re-mote con-trol", pos: "noun", mean: "a device that operates a machine from a distance.", jw: "リモコン", jr: "りもこん", jm: "離れたところから機械を動かす装置。",
        tr: "Where's the remote control? I want to watch TV.",
        ex: [["Where's the remote control? I want to watch TV.", "リモコンはどこ？テレビが見たいのです。"],
             ["They were controlled by humans using remote controls.", "人間がリモコンを使って操作しました。"],
             ["A remote control works even from another room.", "リモコンは別の部屋からでも使えます。"]] },
      { w: "a task", norm: "task", emoji: "📋", ipa: "tæsk", syl: "task", pos: "noun", mean: "a piece of work that has to be done.", jw: "作業", jr: "さぎょう", jm: "しなければならない仕事。",
        tr: "Have you finished your homework task yet?",
        ex: [["Have you finished your homework task yet?", "宿題の課題はもう終わりましたか。"],
             ["Robots perform useful tasks like cleaning and shopping.", "ロボットは掃除や買い物などの役立つ作業をします。"],
             ["Bots do a task that is too dangerous for humans.", "ロボットは人間には危険すぎる作業をします。"]] },
      { w: "social", norm: "social", emoji: "🗣️", ipa: "ˈsoʊʃəl", syl: "so-cial", pos: "adjective", mean: "to do with being with other people.", jw: "社会的な", jr: "しゃかいてきな", jm: "ほかの人と一緒にいることに関わること。",
        tr: "Are you a social person? Do you like being with people?",
        ex: [["Are you a social person? Do you like being with people?", "あなたは社交的な人ですか。人と一緒にいるのが好きですか。"],
             ["Robots perform social tasks, too.", "ロボットは社会的な作業もします。"],
             ["Social robots are very popular.", "ソーシャルロボットはとても人気があります。"]] },
      { w: "a companion", norm: "companion", emoji: "🐕", ipa: "kəmˈpænjən", syl: "com-pan-ion", pos: "noun", mean: "someone or something that stays with you for company.", jw: "相棒", jr: "あいぼう", jm: "そばにいてくれる人やもの。",
        tr: "I'd like a horse. I think it would be a nice companion.",
        ex: [["I'd like a horse. I think it would be a nice companion.", "馬がほしいです。いい相棒になると思います。"],
             ["AIBO, the robot dog, is a wonderful companion for people.", "ロボット犬 AIBO は人にとってすばらしい相棒です。"],
             ["A companion robot can help someone who lives alone.", "相棒ロボットは一人暮らしの人を助けられます。"]] },
      { w: "a feature", norm: "feature", emoji: "🧩", ipa: "ˈfiːtʃər", syl: "fea-ture", pos: "noun", mean: "an important part or quality of something.", jw: "特徴", jr: "とくちょう", jm: "そのものの大事な部分や性質。",
        tr: "What kind of features does the robot have?",
        ex: [["What kind of features does the robot have?", "そのロボットにはどんな特徴がありますか。"],
             ["ASIMO is an android robot with human features.", "ASIMO は人間のような特徴を持つアンドロイドロボットです。"],
             ["But I wish I had more features.", "でも、もっと特徴があればいいのに。"]] },
      { w: "dangerous", norm: "dangerous", emoji: "☢️", ipa: "ˈdeɪndʒərəs", syl: "dan-ger-ous", pos: "adjective", mean: "likely to cause harm.", jw: "危険な", jr: "きけんな", jm: "害を与えるおそれがあること。",
        tr: "Robots do dangerous jobs that are not safe for humans.",
        ex: [["Robots do dangerous jobs that are not safe for humans.", "ロボットは人間には安全でない危険な仕事をします。"],
             ["Bots do tasks that are too dangerous for humans.", "ロボットは人間には危険すぎる作業をします。"],
             ["Robots will be programmed to do many of our dangerous jobs.", "ロボットは私たちの危険な仕事の多くをするようにプログラムされるでしょう。"]] },
      { w: "complex", norm: "complex", emoji: "🧠", ipa: "kəmˈpleks", syl: "com-plex", pos: "adjective", mean: "having many parts and difficult to understand.", jw: "複雑な", jr: "ふくざつな", jm: "部分が多くて理解しにくいこと。",
        tr: "This is a really complex machine. I don't understand it.",
        ex: [["This is a really complex machine. I don't understand it.", "これは本当に複雑な機械です。理解できません。"],
             ["Bots do tasks that are too complex for humans.", "ロボットは人間には複雑すぎる作業をします。"],
             ["A complex problem needs a precise machine.", "複雑な問題には正確な機械が必要です。"]] },
      { w: "respond to", norm: "respond to", emoji: "💬", ipa: "rɪˈspɑːnd tuː", syl: "re-spond to", pos: "verb", mean: "to answer or react to something.", jw: "反応する", jr: "はんのうする", jm: "何かに答えたり反応したりすること。",
        tr: "I told the robot to walk, but it didn't respond to me.",
        ex: [["I told the robot to walk, but it didn't respond to me.", "ロボットに歩くように言いましたが、反応しませんでした。"],
             ["They can respond to commands underwater.", "水中でも命令に反応できます。"],
             ["A social robot has to respond to a human voice.", "ソーシャルロボットは人の声に反応しなければなりません。"]] },
      { w: "a command", norm: "command", emoji: "📡", ipa: "kəˈmænd", syl: "com-mand", pos: "noun", mean: "an instruction given to a person or machine.", jw: "命令", jr: "めいれい", jm: "人や機械に出される指示。",
        tr: "The astronaut sent a command to her team on Earth.",
        ex: [["The astronaut sent a command to her team on Earth.", "その宇宙飛行士は地球のチームに命令を送りました。"],
             ["They can respond to commands underwater.", "水中でも命令に反応できます。"],
             ["Now, I am a robot. I follow all commands.", "今、私はロボット。すべての命令に従います。"]] },
      { w: "information", norm: "information", emoji: "📊", ipa: "ˌɪnfərˈmeɪʃən", syl: "in-for-ma-tion", pos: "noun", mean: "facts about something.", jw: "情報", jr: "じょうほう", jm: "何かについての事実。",
        tr: "I need some information about robots for my school project.",
        ex: [["I need some information about robots for my school project.", "学校の課題のためにロボットについての情報が必要です。"],
             ["They collect information about ocean life.", "それらは海の生き物についての情報を集めます。"],
             ["The samples will give scientists a lot of information.", "その見本は科学者に多くの情報を与えるでしょう。"]] },
      { w: "program", norm: "program", emoji: "💻", ipa: "ˈproʊɡræm", syl: "pro-gram", pos: "verb", mean: "to give a machine a set of instructions to follow.", jw: "プログラムする", jr: "ぷろぐらむする", jm: "機械に従うべき指示を与えること。",
        tr: "We can program robots to fly airplanes.",
        ex: [["We can program robots to fly airplanes.", "私たちはロボットに飛行機を操縦するようプログラムできます。"],
             ["Scientists hope to program them to clean oil spills.", "科学者は油の掃除ができるようプログラムしたいと考えています。"],
             ["I wish I could program a robot.", "ロボットをプログラムできたらいいのに。"]] }
    ]
  },

  v2: {
    tr: "8.5",
    words: [
      { w: "voice recognition", norm: "voice recognition", emoji: "🎙️", ipa: "ˌvɔɪs ˌrekəɡˈnɪʃən", syl: "voice rec-og-ni-tion", pos: "noun", mean: "the ability of a machine to understand speech.", jw: "音声認識", jr: "おんせいにんしき", jm: "機械が話し言葉を理解する能力。",
        tr: "She has voice recognition. She can understand you when you speak!",
        ex: [["She has voice recognition. She can understand you when you speak!", "彼女には音声認識があります。話すと理解できます！"],
             ["This robot has voice recognition abilities.", "このロボットには音声認識の能力があります。"],
             ["With voice recognition it can even have a conversation.", "音声認識があれば会話もできます。"]] },
      { w: "facial recognition", norm: "facial recognition", emoji: "🙂", ipa: "ˌfeɪʃəl ˌrekəɡˈnɪʃən", syl: "fa-cial rec-og-ni-tion", pos: "noun", mean: "the ability of a machine to know a person by their face.", jw: "顔認識", jr: "かおにんしき", jm: "機械が顔で人を見分ける能力。",
        tr: "She has facial recognition, too. When she sees your face, she knows who you are.",
        ex: [["She has facial recognition, too. When she sees your face, she knows who you are.", "彼女には顔認識もあります。顔を見ればだれか分かります。"],
             ["This robot has facial recognition, which means it can recognize about ten people.", "このロボットには顔認識があり、約10人を見分けられます。"],
             ["Facial recognition needs a good camera.", "顔認識にはよいカメラが必要です。"]] },
      { w: "mechanical", norm: "mechanical", emoji: "⚙️", ipa: "məˈkænɪkəl", syl: "me-chan-i-cal", pos: "adjective", mean: "worked by a machine, not by muscles.", jw: "機械の", jr: "きかいの", jm: "筋肉ではなく機械で動くこと。",
        tr: "She has mechanical legs and is learning to walk.",
        ex: [["She has mechanical legs and is learning to walk.", "彼女は機械の脚を持ち、歩くことを学んでいます。"],
             ["This robot has a mechanical arm, so that it can pick up objects.", "このロボットは物を持ち上げられるように機械の腕を持っています。"],
             ["Its mechanical arms picked up rocks and animals.", "その機械の腕は岩や生き物を拾い上げました。"]] },
      { w: "a sensor", norm: "sensor", emoji: "📶", ipa: "ˈsensər", syl: "sen-sor", pos: "noun", mean: "a part that lets a machine detect light, touch or sound.", jw: "センサー", jr: "せんさー", jm: "機械が光・触感・音を感じ取るための部品。",
        tr: "Maybe she will have sensors so that she can smell, touch, and taste things.",
        ex: [["Maybe she will have sensors so that she can smell, touch, and taste things.", "においや感触、味が分かるようにセンサーがつくかもしれません。"],
             ["It has touch sensors on its arms.", "その腕には触覚センサーがついています。"],
             ["A sensor tells the robot what is in front of it.", "センサーはロボットに目の前に何があるかを伝えます。"]] },
      { w: "a laser", norm: "laser", emoji: "🔴", ipa: "ˈleɪzər", syl: "la-ser", pos: "noun", mean: "a very narrow, strong beam of light.", jw: "レーザー", jr: "れーざー", jm: "とても細くて強い光の線。",
        tr: "Maybe lasers will help her to know what is in front of her.",
        ex: [["Maybe lasers will help her to know what is in front of her.", "レーザーが前に何があるか知る助けになるかもしれません。"],
             ["Using lasers, they can find their way around the house.", "レーザーを使って、家の中の道を見つけられます。"],
             ["The Botvac uses lasers to scan and map your room.", "Botvac はレーザーで部屋を読み取り地図を作ります。"]] }
    ]
  },

  academic: ["compare", "contrast", "features", "predict", "summarize"],

  content: [
    { w: "an android", norm: "android", emoji: "🤖", ipa: "ˈændrɔɪd", syl: "an-droid", pos: "noun", mean: "a robot that is made to look like a human.", jw: "アンドロイド", jr: "あんどろいど", jm: "人間そっくりに作られたロボット。",
      ex: [["ASIMO is an android robot with human features.", "ASIMO は人間のような特徴を持つアンドロイドロボットです。"],
           ["An android can serve tea and play soccer.", "アンドロイドはお茶を出したりサッカーをしたりできます。"],
           ["Building an android is harder than building a rover.", "アンドロイドを作るのは探査車を作るより難しいです。"]] },
    { w: "an engineer", norm: "engineer", emoji: "🧑‍🔧", ipa: "ˌendʒɪˈnɪr", syl: "en-gi-neer", pos: "noun", mean: "a person who designs and builds machines.", jw: "技術者", jr: "ぎじゅつしゃ", jm: "機械を設計して作る人。",
      ex: [["Pepper was developed by Japanese and French engineers.", "Pepper は日本とフランスの技術者によって開発されました。"],
           ["Thanks to robotics engineers, a girl has a new prosthetic arm.", "ロボット工学の技術者のおかげで、少女は新しい義手を得ました。"],
           ["An engineer decides what features a robot needs.", "技術者はロボットにどんな特徴が必要かを決めます。"]] },
    { w: "domestic", norm: "domestic", emoji: "🏡", ipa: "dəˈmestɪk", syl: "do-mes-tic", pos: "adjective", mean: "to do with the home.", jw: "家庭の", jr: "かていの", jm: "家に関わること。",
      ex: [["Domestic robots are very popular as well.", "家庭用ロボットもとても人気があります。"],
           ["A domestic robot can vacuum your room for you.", "家庭用ロボットは部屋の掃除機がけをしてくれます。"],
           ["Some domestic robots cost more than a sports car.", "家庭用ロボットの中にはスポーツカーより高いものもあります。"]] },
    { w: "an emotion", norm: "emotion", emoji: "😊", ipa: "ɪˈmoʊʃən", syl: "e-mo-tion", pos: "noun", mean: "a strong feeling such as joy or fear.", jw: "感情", jr: "かんじょう", jm: "喜びや恐れなどの強い気持ち。",
      ex: [["It can recognize human emotion and adapt its behavior.", "それは人間の感情を認識し、ふるまいを合わせられます。"],
           ["A robot has no emotion of its own.", "ロボット自身には感情がありません。"],
           ["Reading an emotion from a face is hard for a machine.", "顔から感情を読み取るのは機械には難しいです。"]] },
    { w: "a rover", norm: "rover", emoji: "🛰️", ipa: "ˈroʊvər", syl: "rov-er", pos: "noun", mean: "a vehicle that drives around and explores a planet.", jw: "探査車", jr: "たんさしゃ", jm: "惑星の上を走って調べる車。",
      ex: [["Two Mars rovers, Opportunity and Curiosity, are exploring Mars.", "オポチュニティとキュリオシティという2台の火星探査車が火星を調べています。"],
           ["A rover has to be mobile and precise.", "探査車は動きが自由で正確でなければなりません。"],
           ["The rover sent information back to Earth.", "その探査車は地球に情報を送りました。"]] }
  ],

  song: {
    tr: "8.3",
    title: "I Am a Robot",
    jpTitle: "私はロボット",
    lyrics: [
      { t: "If I were a robot, what would my life be like?", jp: "もし私がロボットだったら、人生はどんなだろう？" },
      { t: "I wish I were a robot! What would that life be like?", jp: "ロボットだったらいいのに！その人生はどんなだろう？" },
      { t: "Now, I am a robot. I follow all commands.", jp: "今、私はロボット。すべての命令に従う。" },
      { t: "But I wish I had more features.", jp: "でも、もっと特徴があればいいのに。" },
      { t: "I wish I had better hands.", jp: "もっとよい手があればいいのに。" },
      { t: "Now, I am a robot. I do what I am told.", jp: "今、私はロボット。言われたとおりにする。" },
      { t: "But I wish I had a birthday.", jp: "でも、誕生日があればいいのに。" },
      { t: "Then again, I never will get old.", jp: "とはいえ、私は年をとらない。" },
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "I am a robot. I can do many things.", jp: "私はロボット。いろいろなことができる。" },
      { t: "Have you ever met a robot that can sing?", jp: "歌えるロボットに会ったことある？" },
      { t: "Now, I am a robot. I'm helpful, and I'm smart.", jp: "今、私はロボット。役に立つし、かしこい。" },
      { t: "But I wish that I could fix myself. I sometimes fall apart.", jp: "でも、自分を直せたらいいのに。時々ばらばらになる。" },
      { t: "Now, I am a robot, made of wires and steel.", jp: "今、私はロボット。配線と鋼でできている。" },
      { t: "I always say the same thing if you ask me how I feel.", jp: "気分をたずねられると、いつも同じことを言う。" },
      { t: "Now, I am a robot, and I must say goodbye.", jp: "今、私はロボット。さよならを言わなければ。" },
      { t: "But even when I'm sad, I am programmed not to cry.", jp: "悲しいときでも、泣かないようにプログラムされている。" }
    ],
    tapWords: ["robot", "commands", "features", "programmed", "smart", "fix", "sing"],
    quiz: [
      { q: "“I wish I were a robot” means the singer ___.", opts: ["is not a robot", "is a robot", "will be a robot"], correct: 0, jp: "実際はロボットではない、という意味です。" },
      { q: "What does the robot wish it had more of?", opts: ["Features", "Commands", "Wires"], correct: 0, jp: "特徴です。" },
      { q: "Why will the robot never get old?", opts: ["It has no birthday", "It sleeps a lot", "It is new"], correct: 0, jp: "誕生日がないからです。" },
      { q: "What is the robot made of?", opts: ["Wires and steel", "Wood and paper", "Glass and water"], correct: 0, jp: "配線と鋼です。" },
      { q: "What is the robot programmed not to do?", opts: ["Cry", "Sing", "Walk"], correct: 0, jp: "泣かないようにプログラムされています。" },
      { q: "What does the robot wish it could do to itself?", opts: ["Fix itself", "Sell itself", "Paint itself"], correct: 0, jp: "自分を直すことです。" }
    ]
  },

  g1: {
    key: "wish_statements",
    tr: "8.4",
    component: "grammar-1",
    title: "Wish statements",
    jpTitle: "wish の文",
    short: "I wish I had…",
    role: "clause",
    rule: "Use wish + a past-tense verb to talk about something that is not true now but that you would like. Use were for every subject after wish.",
    jpRule: "今そうではないけれど、そうであってほしいことは wish + 過去形 で表します。wish のあとの be動詞はどの主語でも were を使います。",
    pattern: "subject + wish(es) + subject + past verb / could / were",
    jpPattern: "主語 + wish(es) + 主語 + 過去形の動詞 / could / were",
    intro: [
      { t: "I wish my teacher were a robot.", jp: "先生がロボットだったらいいのに。" },
      { t: "I wish I could program a robot.", jp: "ロボットをプログラムできたらいいのに。" },
      { t: "Mom wishes she had a robot that played table tennis!", jp: "母は卓球をするロボットがあればいいのにと思っています！" }
    ],
    rows: [
      { form: "be → were", pattern: "wish + subject + were", example: "I wish my teacher were a robot. (But my teacher is not a robot!)", jp: "先生がロボットだったらいいのに。（でも先生はロボットではありません！）" },
      { form: "can → could", pattern: "wish + subject + could + base verb", example: "I wish I could program a robot. (But I can't.)", jp: "ロボットをプログラムできたらいいのに。（でもできません。）" },
      { form: "have → had", pattern: "wish + subject + had", example: "Mom wishes she had a robot that played table tennis! (But she doesn't have one.)", jp: "母は卓球をするロボットがあればいいのにと思っています！（でも持っていません。）" },
      { form: "Negative wish", pattern: "wish + subject + didn't + base verb", example: "Dad wishes the vacuuming robot didn't cost so much. (But it costs a lot.)", jp: "父は掃除ロボットがそんなに高くなければいいのにと思っています。（でも高いのです。）" },
      { form: "Third person", pattern: "he / she / it + wishes", example: "Mom wishes she had a robot.", jp: "he / she / it には wishes を使います。" }
    ],
    noteRule: "The past tense after wish does not mean the past — it means “this is not true now”.",
    noteException: "After wish, use were for I, he, she and it, not was. I wish I were a robot.",
    noteExceptionDetail: "Every wish sentence has a hidden opposite: I wish I could program a robot = but I can't.",
    table: {
      title: "wish + past form",
      columns: ["Wish", "The reality"],
      rows: [
        { cells: ["I wish my teacher were a robot.", "But my teacher is not a robot!"], roles: ["clause", null] },
        { cells: ["I wish I could program a robot.", "But I can't."], roles: ["clause", null] },
        { cells: ["Mom wishes she had a robot that played table tennis!", "But she doesn't have one."], roles: ["clause", null] },
        { cells: ["Dad wishes the vacuuming robot didn't cost so much.", "But it costs a lot."], roles: ["clause", null] }
      ],
      notes: [
        "Use were after wish for every subject.",
        "The wish is always the opposite of what is true."
      ]
    },
    samples: [
      { t: "I wish my teacher were a robot.", jp: "先生がロボットだったらいいのに。", h: "wish my teacher were" },
      { t: "I wish I could program a robot.", jp: "ロボットをプログラムできたらいいのに。", h: "wish I could program" },
      { t: "Mom wishes she had a robot that played table tennis!", jp: "母は卓球をするロボットがあればいいのにと思っています！", h: "wishes she had" },
      { t: "Dad wishes the vacuuming robot didn't cost so much.", jp: "父は掃除ロボットがそんなに高くなければいいのにと思っています。", h: "wishes the vacuuming robot didn't cost" },
      { t: "I wish I were a robot!", jp: "私がロボットだったらいいのに！", h: "wish I were" },
      { t: "But I wish I had more features.", jp: "でも、もっと特徴があればいいのに。", h: "wish I had" },
      { t: "I wish I had better hands.", jp: "もっとよい手があればいいのに。", h: "wish I had" },
      { t: "But I wish I had a birthday.", jp: "でも、誕生日があればいいのに。", h: "wish I had" },
      { t: "But I wish that I could fix myself.", jp: "でも、自分を直せたらいいのに。", h: "wish that I could fix" },
      { t: "I wish I could dive underwater and visit that shipwreck!", jp: "水中に潜ってあの沈没船を訪ねられたらいいのに！", h: "wish I could dive" }
    ],
    levelup: {
      rules: [
        { title: "Use were, not was", jpTitle: "was ではなく were",
          sub: "After wish, every subject takes were — even I, he, she and it.", jpSub: "wish のあとは I・he・she・it でも were を使います。",
          transforms: [["my teacher / be a robot", "I wish my teacher were a robot."], ["I / be a robot", "I wish I were a robot!"]],
          examples: [{ t: "I wish I were a robot!", jp: "私がロボットだったらいいのに！", h: "wish I were" },
                     { t: "I wish my teacher were a robot.", jp: "先生がロボットだったらいいのに。", h: "wish my teacher were" }] },
        { title: "can becomes could", jpTitle: "can は could になる",
          sub: "For an ability you do not have, use could + base verb.", jpSub: "持っていない能力には could + 動詞の原形を使います。",
          transforms: [["I / program a robot", "I wish I could program a robot."], ["I / fix myself", "I wish I could fix myself."]],
          examples: [{ t: "I wish I could program a robot.", jp: "ロボットをプログラムできたらいいのに。", h: "wish I could program" },
                     { t: "But I wish that I could fix myself.", jp: "でも、自分を直せたらいいのに。", h: "wish that I could fix" }] },
        { title: "Every wish hides an opposite", jpTitle: "wish には必ず逆の事実がある",
          sub: "Say the wish, then check the reality it is denying.", jpSub: "wish を言ったら、それが否定している事実を確かめましょう。",
          transforms: [["Mom / have a robot that plays table tennis", "Mom wishes she had a robot that played table tennis."], ["Dad / the robot not cost so much", "Dad wishes the vacuuming robot didn't cost so much."]],
          examples: [{ t: "Mom wishes she had a robot that played table tennis!", jp: "母は卓球をするロボットがあればいいのにと思っています！", h: "wishes she had" },
                     { t: "Dad wishes the vacuuming robot didn't cost so much.", jp: "父は掃除ロボットがそんなに高くなければいいのにと思っています。", h: "wishes the vacuuming robot didn't cost" }] }
      ],
      mixed: [
        { t: "Leo wishes he could play in the Champions League.", jp: "レオはチャンピオンズリーグでプレーできたらいいのにと思っています。", h: "wishes he could play" },
        { t: "I wish this robot had voice recognition.", jp: "このロボットに音声認識があればいいのに。", h: "wish this robot had" },
        { t: "She wishes the robot arm were more precise.", jp: "彼女はそのロボットアームがもっと正確ならいいのにと思っています。", h: "wishes the robot arm were" },
        { t: "We wish domestic robots didn't cost more than a sports car.", jp: "家庭用ロボットがスポーツカーより高くなければいいのに。", h: "wish domestic robots didn't cost" },
        { t: "He wishes he could send a command from his phone.", jp: "彼はスマホから命令を送れたらいいのにと思っています。", h: "wishes he could send" },
        { t: "I wish the rover were still working on Mars.", jp: "その探査車がまだ火星で動いていればいいのに。", h: "wish the rover were" }
      ]
    },
    quiz: [
      { stem: ["I wish my teacher ", " a robot."], answers: ["were", "was", "is", "will be"], correct: 0, explTitle: "were after wish", explBody: "Use were for every subject after wish.", jp: "wish のあとは were です。" },
      { stem: ["I wish I ", " program a robot."], answers: ["could", "can", "will", "would have"], correct: 0, explTitle: "can → could", explBody: "Use could for an ability you do not have.", jp: "can は could になります。" },
      { stem: ["Mom ", " she had a robot that played table tennis."], answers: ["wishes", "wish", "wishing", "wished to"], correct: 0, explTitle: "Third person takes wishes", explBody: "Mom is he/she/it, so wishes.", jp: "3人称単数なので wishes です。" },
      { stem: ["Dad wishes the robot ", " so much."], answers: ["didn't cost", "doesn't cost", "won't cost", "not cost"], correct: 0, explTitle: "Negative wish", explBody: "Use didn't + base verb.", jp: "didn't + 原形を使います。" },
      { stem: ["“I wish I had more features” means I ___.", ""], answers: ["don't have many features", "have many features", "will have features", "had features yesterday"], correct: 0, explTitle: "The opposite is true", explBody: "A wish denies what is true now.", jp: "wish は今の事実の逆を表します。" },
      { stem: ["Which is correct after wish?", ""], answers: ["I wish I were taller.", "I wish I was taller.", "I wish I am taller.", "I wish I will be taller."], correct: 0, explTitle: "were, not was", explBody: "Use were after wish.", jp: "wish のあとは were です。" },
      { stem: ["The past tense after wish talks about ___.", ""], answers: ["now, not the past", "yesterday", "next year", "a habit"], correct: 0, explTitle: "Unreal present", explBody: "It describes something untrue now.", jp: "今そうではないことを表します。" },
      { stem: ["I wish this robot ", " voice recognition."], answers: ["had", "has", "will have", "have"], correct: 0, explTitle: "have → had", explBody: "Use the past form after wish.", jp: "wish のあとは had です。" },
      { stem: ["He wishes he ", " send a command from his phone."], answers: ["could", "can", "will", "may"], correct: 0, explTitle: "could for ability", explBody: "The ability does not exist yet.", jp: "まだできないので could です。" },
      { stem: ["Which sentence is a wish?", ""], answers: ["I wish I were a robot.", "I am a robot.", "Will I be a robot?", "I was a robot."], correct: 0, explTitle: "wish + were", explBody: "Only the first one uses wish.", jp: "wish を使っているのは最初の文です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["I wish I were a robot.", "I wish I am a robot.", "I wish I will be a robot.", "I wish I be a robot."], correct: 0, explTitle: "wish + were", explBody: "Use were for every subject.", jp: "wish のあとは were です。" },
      { stem: ["What is the reality behind “I wish I could program a robot”?", ""], answers: ["I can't program a robot.", "I can program a robot.", "I programmed a robot.", "I will program a robot."], correct: 0, explTitle: "The hidden opposite", explBody: "A wish denies the present fact.", jp: "wish は今の事実の逆です。" },
      { stem: ["Complete: “Mom ___ she had a robot.”", ""], answers: ["wishes", "wish", "wished to", "wishing"], correct: 0, explTitle: "Third-person singular", explBody: "Mom takes wishes.", jp: "Mom には wishes です。" },
      { stem: ["Choose the correct negative wish.", ""], answers: ["Dad wishes the robot didn't cost so much.", "Dad wishes the robot doesn't cost so much.", "Dad wishes the robot not cost so much.", "Dad wishes the robot won't cost so much."], correct: 0, explTitle: "didn't + base verb", explBody: "That is the negative wish form.", jp: "didn't + 原形です。" },
      { stem: ["Which one is NOT a wish about now?", ""], answers: ["I wished for a robot last birthday.", "I wish I were a robot.", "I wish I had a robot.", "I wish I could fix it."], correct: 0, explTitle: "That one is a past action", explBody: "Wished here is simply the past tense of wish.", jp: "最初の文は過去の行動です。" },
      { stem: ["Complete: “She wishes the robot arm ___ more precise.”", ""], answers: ["were", "was", "is", "will be"], correct: 0, explTitle: "were after wish", explBody: "Use were for every subject.", jp: "wish のあとは were です。" },
      { stem: ["Which verb form follows could?", ""], answers: ["the base form", "the past form", "the -ing form", "the past participle"], correct: 0, explTitle: "could + base verb", explBody: "could program, could fix, could send.", jp: "could のあとは原形です。" },
      { stem: ["Complete: “We wish domestic robots ___ so much.”", ""], answers: ["didn't cost", "don't cost", "wouldn't costing", "not cost"], correct: 0, explTitle: "Negative wish", explBody: "didn't + cost.", jp: "didn't + 原形です。" },
      { stem: ["Choose the correct word order.", ""], answers: ["I wish this robot had voice recognition.", "I wish had this robot voice recognition.", "I this robot wish had voice recognition.", "Wish I this robot had voice recognition."], correct: 0, explTitle: "wish + subject + past verb", explBody: "Keep normal clause order.", jp: "wish + 主語 + 過去形です。" },
      { stem: ["Which sentence comes from the song?", ""], answers: ["But I wish I had better hands.", "But I wish I have better hands.", "But I wish I will have better hands.", "But I wished better hands."], correct: 0, explTitle: "Straight from TR 8.3", explBody: "That is the line as sung.", jp: "歌の一節どおりです。" }
    ]
  },

  g2: {
    key: "passive_future",
    tr: "8.7",
    component: "grammar-2",
    title: "Passive voice: Future",
    jpTitle: "受け身の未来形",
    short: "will be + past participle",
    role: "futurePositive",
    rule: "Use will be or won't be + the past participle to say what will or will not be done to something in the future.",
    jpRule: "未来に何がされるか／されないかは will be / won't be + 過去分詞 で表します。",
    pattern: "subject + will (not) be + past participle",
    jpPattern: "主語 + will (not) be + 過去分詞",
    intro: [
      { t: "Robots will be programmed to do many of our dangerous jobs one day.", jp: "いつかロボットは私たちの危険な仕事の多くをするようプログラムされるでしょう。" },
      { t: "Most people won't be required to work more than a few hours a week.", jp: "ほとんどの人は週に数時間以上働くことを求められなくなるでしょう。" },
      { t: "What will be discovered next—and where?", jp: "次は何がどこで発見されるでしょうか。" }
    ],
    rows: [
      { form: "Affirmative", pattern: "subject + will be + past participle", example: "Robots will be programmed to do our dangerous jobs.", jp: "ロボットは私たちの危険な仕事をするようプログラムされるでしょう。" },
      { form: "Negative", pattern: "subject + won't be + past participle", example: "Most people won't be required to work long hours.", jp: "ほとんどの人は長時間働くことを求められなくなるでしょう。" },
      { form: "Question", pattern: "Will + subject + be + past participle?", example: "Will the oil spills be cleaned by robots?", jp: "油の流出はロボットによって掃除されるでしょうか。" },
      { form: "Wh- question", pattern: "What + will be + past participle?", example: "What will be discovered next?", jp: "次は何が発見されるでしょうか。" },
      { form: "With by", pattern: "…+ by + agent, only when it matters", example: "The room will be cleaned by a domestic robot.", jp: "その部屋は家庭用ロボットによって掃除されるでしょう。" }
    ],
    noteRule: "Will never changes, and be never changes — only the past participle carries the meaning.",
    noteException: "Won't is the short form of will not: won't be required.",
    noteExceptionDetail: "In questions, will moves in front of the subject and be stays after it: Will it be programmed?",
    table: {
      title: "will be + past participle",
      columns: ["Subject", "will (not) be", "Past participle", "Rest"],
      rows: [
        { cells: ["Robots", "will be", "programmed", "to do many of our dangerous jobs."], roles: ["subject", "futurePositive", "verb", "clause"] },
        { cells: ["Most people", "won't be", "required", "to work more than a few hours a week."], roles: ["subject", "futureNegative", "verb", "clause"] },
        { cells: ["The room", "will be", "cleaned", "by a domestic robot."], roles: ["subject", "futurePositive", "verb", "clause"] },
        { cells: ["What", "will be", "discovered", "next?"], roles: ["subject", "futurePositive", "verb", "clause"] }
      ],
      notes: [
        "Be always stays as be after will.",
        "Add by + agent only when who does it matters."
      ]
    },
    samples: [
      { t: "Robots will be programmed to do many of our dangerous jobs one day.", jp: "いつかロボットは私たちの危険な仕事の多くをするようプログラムされるでしょう。", h: "will be programmed" },
      { t: "Most people won't be required to work more than a few hours a week.", jp: "ほとんどの人は週に数時間以上働くことを求められなくなるでしょう。", h: "won't be required" },
      { t: "What will be discovered next—and where?", jp: "次は何がどこで発見されるでしょうか。", h: "will be discovered" },
      { t: "The room will be cleaned by a domestic robot.", jp: "その部屋は家庭用ロボットによって掃除されるでしょう。", h: "will be cleaned" },
      { t: "Oil spills will be cleaned by underwater bots.", jp: "流出した油は水中ロボットによって掃除されるでしょう。", h: "will be cleaned" },
      { t: "New species will be studied in a science lab.", jp: "新種は科学の研究室で調べられるでしょう。", h: "will be studied" },
      { t: "Commands will be sent from a phone.", jp: "命令はスマホから送られるでしょう。", h: "will be sent" },
      { t: "The grass will be cut by the Robomow.", jp: "芝は Robomow によって刈られるでしょう。", h: "will be cut" },
      { t: "Faces will be recognized by facial recognition software.", jp: "顔は顔認識ソフトによって認識されるでしょう。", h: "will be recognized" },
      { t: "That job won't be done by a human in ten years.", jp: "その仕事は10年後には人間によって行われないでしょう。", h: "won't be done" }
    ],
    levelup: {
      rules: [
        { title: "will be + past participle", jpTitle: "will be + 過去分詞",
          sub: "Nothing changes for the subject — will and be are always the same.", jpSub: "主語が何であっても will と be は変わりません。",
          transforms: [["robots / program / to do dangerous jobs", "Robots will be programmed to do dangerous jobs."], ["the room / clean / by a domestic robot", "The room will be cleaned by a domestic robot."]],
          examples: [{ t: "Oil spills will be cleaned by underwater bots.", jp: "流出した油は水中ロボットによって掃除されるでしょう。", h: "will be cleaned" },
                     { t: "New species will be studied in a science lab.", jp: "新種は科学の研究室で調べられるでしょう。", h: "will be studied" }] },
        { title: "won't be for the negative", jpTitle: "否定は won't be",
          sub: "Won't be + past participle says something will not happen.", jpSub: "won't be + 過去分詞 で「されないだろう」を表します。",
          transforms: [["most people / not require / to work long hours", "Most people won't be required to work long hours."], ["that job / not do / by a human", "That job won't be done by a human."]],
          examples: [{ t: "Most people won't be required to work more than a few hours a week.", jp: "ほとんどの人は週に数時間以上働くことを求められなくなるでしょう。", h: "won't be required" },
                     { t: "That job won't be done by a human in ten years.", jp: "その仕事は10年後には人間によって行われないでしょう。", h: "won't be done" }] },
        { title: "Questions move will to the front", jpTitle: "疑問文は will を前に出す",
          sub: "Will + subject + be + past participle?", jpSub: "Will + 主語 + be + 過去分詞？の形です。",
          transforms: [["the oil spills / clean / by robots", "Will the oil spills be cleaned by robots?"], ["what / discover / next", "What will be discovered next?"]],
          examples: [{ t: "What will be discovered next—and where?", jp: "次は何がどこで発見されるでしょうか。", h: "will be discovered" },
                     { t: "Commands will be sent from a phone.", jp: "命令はスマホから送られるでしょう。", h: "will be sent" }] }
      ],
      mixed: [
        { t: "The Champions League final will be watched by millions of people.", jp: "チャンピオンズリーグ決勝は何百万人にも見られるでしょう。", h: "will be watched" },
        { t: "The floor will be vacuumed while we are out.", jp: "私たちが出かけている間に床は掃除されるでしょう。", h: "will be vacuumed" },
        { t: "Dangerous jobs won't be given to humans any more.", jp: "危険な仕事はもう人間に与えられなくなるでしょう。", h: "won't be given" },
        { t: "The samples will be analyzed by a laboratory in Tokyo.", jp: "その見本は東京の研究所で分析されるでしょう。", h: "will be analyzed" },
        { t: "Your face will be recognized in less than a second.", jp: "あなたの顔は1秒もかからずに認識されるでしょう。", h: "will be recognized" },
        { t: "The rover's information will be sent back to Earth.", jp: "探査車の情報は地球に送り返されるでしょう。", h: "will be sent" }
      ]
    },
    quiz: [
      { stem: ["Robots ", " programmed to do our dangerous jobs."], answers: ["will be", "will", "are be", "will been"], correct: 0, explTitle: "will be + past participle", explBody: "Be always follows will.", jp: "will のあとは be です。" },
      { stem: ["Most people ", " required to work long hours."], answers: ["won't be", "won't", "don't be", "aren't will"], correct: 0, explTitle: "Negative future passive", explBody: "won't be + past participle.", jp: "won't be + 過去分詞です。" },
      { stem: ["What will be ", " next?"], answers: ["discovered", "discover", "discovering", "discovers"], correct: 0, explTitle: "Past participle", explBody: "Use discovered after will be.", jp: "will be のあとは過去分詞です。" },
      { stem: ["The room will be cleaned ", " a domestic robot."], answers: ["by", "from", "with", "of"], correct: 0, explTitle: "by + agent", explBody: "Use by before the doer.", jp: "動作主の前は by です。" },
      { stem: ["Choose the correct question.", ""], answers: ["Will the oil spills be cleaned by robots?", "Will be the oil spills cleaned by robots?", "The oil spills will be cleaned by robots?", "Will the oil spills cleaned by robots?"], correct: 0, explTitle: "Will + subject + be + participle", explBody: "Move will to the front.", jp: "will を先頭に出します。" },
      { stem: ["Which form does “be” take after will?", ""], answers: ["be", "is", "was", "being"], correct: 0, explTitle: "Base form", explBody: "Will is always followed by be.", jp: "will のあとは be です。" },
      { stem: ["The grass will be ", " by the Robomow."], answers: ["cut", "cutted", "cutting", "cuts"], correct: 0, explTitle: "cut → cut", explBody: "The past participle of cut is cut.", jp: "cut の過去分詞は cut です。" },
      { stem: ["That job ", " done by a human in ten years."], answers: ["won't be", "won't", "isn't", "doesn't be"], correct: 0, explTitle: "Negative", explBody: "won't be + done.", jp: "won't be + done です。" },
      { stem: ["Commands will be ", " from a phone."], answers: ["sent", "send", "sending", "sends"], correct: 0, explTitle: "send → sent", explBody: "Sent is the past participle.", jp: "send の過去分詞は sent です。" },
      { stem: ["Which sentence is future passive?", ""], answers: ["Faces will be recognized in a second.", "Faces recognize people.", "Faces were recognized yesterday.", "Faces are recognizing people."], correct: 0, explTitle: "will be + participle", explBody: "Only the first one uses the future passive.", jp: "最初の文だけが未来の受け身です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["Robots will be programmed to help us.", "Robots will programmed to help us.", "Robots will be program to help us.", "Robots will being programmed to help us."], correct: 0, explTitle: "will + be + past participle", explBody: "Keep that shape.", jp: "will + be + 過去分詞です。" },
      { stem: ["Make it passive: “Robots will clean the oil spills.”", ""], answers: ["The oil spills will be cleaned by robots.", "The oil spills will cleaned by robots.", "The oil spills will be clean by robots.", "Robots will be cleaned by the oil spills."], correct: 0, explTitle: "Object becomes subject", explBody: "The oil spills move to the front.", jp: "目的語が主語になります。" },
      { stem: ["Choose the correct negative.", ""], answers: ["Dangerous jobs won't be given to humans.", "Dangerous jobs won't given to humans.", "Dangerous jobs will be not given to humans.", "Dangerous jobs don't be given to humans."], correct: 0, explTitle: "won't be + participle", explBody: "Won't is will not.", jp: "won't は will not の短縮形です。" },
      { stem: ["Which participle completes it? “The samples will be ___ by a laboratory.”", ""], answers: ["analyzed", "analyze", "analyzing", "analyzes"], correct: 0, explTitle: "Past participle", explBody: "Use analyzed.", jp: "過去分詞 analyzed です。" },
      { stem: ["Where does “by + agent” go?", ""], answers: ["after the past participle", "before will", "before the subject", "it is never used"], correct: 0, explTitle: "At the end", explBody: "The agent phrase comes last.", jp: "動作主は最後に置きます。" },
      { stem: ["Complete: “Your face ___ recognized in less than a second.”", ""], answers: ["will be", "will", "is be", "will been"], correct: 0, explTitle: "will be", explBody: "Be always follows will.", jp: "will のあとは be です。" },
      { stem: ["Which sentence is a question?", ""], answers: ["Will the room be cleaned tonight?", "The room will be cleaned tonight.", "The room won't be cleaned tonight.", "Cleaning the room tonight."], correct: 0, explTitle: "Will at the front", explBody: "Questions start with Will.", jp: "疑問文は Will で始まります。" },
      { stem: ["Fix it: “The grass will cut by the Robomow.”", ""], answers: ["The grass will be cut by the Robomow.", "The grass will been cut by the Robomow.", "The grass will cutting by the Robomow.", "The grass will be cutting by the Robomow."], correct: 0, explTitle: "Add be", explBody: "will + be + cut.", jp: "be を入れます。" },
      { stem: ["Which tense is “was programmed”?", ""], answers: ["past passive", "future passive", "present passive", "present perfect"], correct: 0, explTitle: "Past passive", explBody: "Was + participle is the past passive.", jp: "過去の受け身です。" },
      { stem: ["Complete: “The rover's information ___ sent back to Earth.”", ""], answers: ["will be", "will", "is being will", "will been"], correct: 0, explTitle: "will be + sent", explBody: "Keep will + be + past participle.", jp: "will + be + 過去分詞です。" }
    ]
  },

  reading: {
    tr: "8.8",
    title: "Meet the Bots",
    jpTitle: "ロボットたちに会おう",
    intro: "Many people know that robots explore space and build things in factories. But did you know that there are many other kinds of robots? Let's meet some of these “bots” and find out what they do.",
    paras: [
      { t: "Social robots are very popular. The robot, Pepper, was developed by Japanese and French engineers. It can recognize human emotions and can even adapt its behavior to match the mood of whoever it is interacting with. Pepper was so popular that it sold out completely in just one minute!",
        q: "How quickly did Pepper sell out?", opts: ["In just one minute", "In one week", "In one year"], correct: 0, jp: "たった1分で完売しました。" },
      { t: "Medical robots are extremely important. The da Vinci Surgical System lets a doctor sit several feet away from a patient and controls the robot's every move. Thanks to robotics engineers, like Easton LaChappelle, a seven-year-old girl now has a new prosthetic arm. He made her an inexpensive robotic arm using a 3D printer and inexpensive ready-made parts.",
        q: "What did Easton LaChappelle use to make the arm?", opts: ["A 3D printer and ready-made parts", "Wood and glue", "A remote control"], correct: 0, jp: "3Dプリンターと既製の部品です。" },
      { t: "Domestic robots (robots that clean your house) are very popular as well. There are a lot of different robots that vacuum your room for you. The Botvac, for example, uses lasers to scan and map your room before choosing the best route to clean the entire room. And if you don't like doing yard work, the Robomow will cut the grass for you.",
        q: "What does the Botvac use lasers for?", opts: ["To scan and map your room", "To cut the grass", "To recognize faces"], correct: 0, jp: "部屋を読み取って地図を作るために使います。" },
      { t: "Explorer robots are incredibly useful, too. Two Mars rovers, Opportunity and Curiosity, are exploring Mars. Amazing! What will future bots do?",
        q: "What are Opportunity and Curiosity?", opts: ["Two Mars rovers", "Two social robots", "Two domestic robots"], correct: 0, jp: "2台の火星探査車です。" }
    ],
    strategy: {
      title: "Reading strategy — sorting by category",
      body: "This passage is organised by category: social robots, medical robots, domestic robots, explorer robots. Naming the category before you read the examples makes each paragraph much easier to hold.",
      jp: "この文章は「ソーシャル」「医療」「家庭用」「探査」と種類ごとに分かれています。例を読む前に種類の名前をつかむと理解しやすくなります。"
    },
    order: {
      title: "Put the four kinds of bots in the order the article gives them",
      items: [
        "Social robots — Pepper recognizes human emotions.",
        "Medical robots — the da Vinci Surgical System.",
        "A robotic arm made with a 3D printer for a seven-year-old girl.",
        "Domestic robots — the Botvac maps your room with lasers.",
        "The Robomow cuts the grass for you.",
        "Explorer robots — Opportunity and Curiosity on Mars."
      ]
    },
    quiz: [
      { q: "Who developed Pepper?", opts: ["Japanese and French engineers", "American engineers", "Mars scientists"], correct: 0, jp: "日本とフランスの技術者です。" },
      { q: "What can Pepper recognize?", opts: ["Human emotions", "Only faces", "Only voices"], correct: 0, jp: "人間の感情です。" },
      { q: "Where does the doctor sit with the da Vinci system?", opts: ["Several feet away from the patient", "Next to the patient", "In another country"], correct: 0, jp: "患者から数フィート離れたところです。" },
      { q: "How old was the girl who got the prosthetic arm?", opts: ["Seven", "Seventeen", "Ten"], correct: 0, jp: "7歳です。" },
      { q: "What does the Robomow do?", opts: ["Cuts the grass", "Vacuums the room", "Cleans oil spills"], correct: 0, jp: "芝を刈ります。" },
      { q: "Which category do Opportunity and Curiosity belong to?", opts: ["Explorer robots", "Social robots", "Medical robots"], correct: 0, jp: "探査ロボットです。" },
      { q: "Why was the robotic arm inexpensive?", opts: ["It used a 3D printer and ready-made parts", "It was second-hand", "It was very small"], correct: 0, jp: "3Dプリンターと既製部品を使ったからです。" },
      { q: "What does the article ask at the end?", opts: ["What will future bots do?", "Where can I buy one?", "Who invented robots?"], correct: 0, jp: "未来のロボットは何をするだろうか、と問いかけています。" }
    ]
  },

  writing: {
    genre: "A design proposal for a robot",
    jpGenre: "ロボットの設計提案",
    modelTitle: "My Robot: Coach-9",
    model: [
      "I wish I had a robot that could train with me every evening, so I designed Coach-9.",
      "Coach-9 has voice recognition, facial recognition and two mechanical arms.",
      "Passes will be counted automatically, and every shot will be recorded by its cameras.",
      "Dangerous drills won't be given to young players, because Coach-9 checks their age first."
    ],
    modelJp: "毎晩一緒に練習してくれるロボットがあればいいのにと思い、Coach-9 を設計しました。Coach-9 には音声認識、顔認識、そして2本の機械の腕があります。",
    steps: [
      { t: "Start with a wish that explains why the robot is needed.", jp: "なぜそのロボットが必要かを wish の文で書き出す。" },
      { t: "List its features and abilities.", jp: "特徴と能力を並べる。" },
      { t: "Say what will be done by the robot, using the future passive.", jp: "未来の受け身で、ロボットによって何がされるかを書く。" },
      { t: "Say one thing that won't be done, and why.", jp: "されないことを1つと、その理由を書く。" }
    ],
    expressions: [
      { t: "I wish I had a robot that could ___.", jp: "〜できるロボットがあればいいのに。" },
      { t: "It has ___, ___ and ___.", jp: "それは〜と〜と〜を備えています。" },
      { t: "___ will be ___ automatically.", jp: "〜は自動的に〜されます。" },
      { t: "___ won't be ___, because ___.", jp: "〜なので、〜はされません。" }
    ],
    checklist: [
      "I opened with a wish sentence using a past-form verb.",
      "I listed at least three features.",
      "I used will be + past participle at least twice.",
      "I used won't be + past participle once, with a reason."
    ],
    quiz: [
      { q: "Choose the correct wish sentence.", opts: ["I wish I had a robot.", "I wish I have a robot.", "I wish I will have a robot."], correct: 0, jp: "wish のあとは過去形です。" },
      { q: "Choose the correct future passive.", opts: ["Passes will be counted automatically.", "Passes will counted automatically.", "Passes will be count automatically."], correct: 0, jp: "will be + 過去分詞です。" },
      { q: "Which is a feature, not an opinion?", opts: ["It has voice recognition.", "It is the best robot.", "I love it."], correct: 0, jp: "備えている機能が特徴です。" },
      { q: "“Won't be” is short for ___.", opts: ["will not be", "would not be", "was not"], correct: 0, jp: "will not be の短縮形です。" },
      { q: "After wish, the be verb is ___.", opts: ["were", "was", "is"], correct: 0, jp: "wish のあとは were です。" },
      { q: "A design proposal should explain ___.", opts: ["why the robot is needed", "your holiday", "a recipe"], correct: 0, jp: "なぜそのロボットが必要かを説明します。" },
      { q: "Which sentence adds an agent?", opts: ["Every shot will be recorded by its cameras.", "Every shot will be recorded.", "Every shot is a goal."], correct: 0, jp: "by + 動作主が加わっています。" },
      { q: "Which robot type cleans houses?", opts: ["Domestic robots", "Explorer robots", "Medical robots"], correct: 0, jp: "家庭用ロボットです。" }
    ]
  }
};
