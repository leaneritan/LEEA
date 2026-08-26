/* Our World Level 6 · Unit 7 — Wonders of the Natural World
   Source: Student's Book audio script TR 7.1-7.8. */
export default {
  unit: 7,
  title: "Wonders of the Natural World",
  jpTitle: "自然界の驚異",
  themeEmoji: "🏔️",
  slug: "wonders-of-the-natural-world",

  opener: {
    tr: "7.1",
    intro:
      "National Geographic explorers know it's important to be prepared before ascending steep mountains or descending into underwater caves. You need safety gear like a headlamp to shine the way and rope for a safe return. Curiosity helps, too!",
    goals: [
      { en: "Talk about exploring caves, mountains and rivers safely.", jp: "洞窟・山・川を安全に探検することについて話す。" },
      { en: "Use the passive with modals to say what must be done.", jp: "助動詞つきの受け身で「何がされなければならないか」を言う。" },
      { en: "Name the things you find inside a cave.", jp: "洞窟の中にあるものの名前を言う。" },
      { en: "Use make + someone + adjective to say how things feel.", jp: "make + 人 + 形容詞 を使って気持ちを表す。" },
      { en: "Read about Angel Falls and retell the discovery.", jp: "エンジェルフォールについて読み、その発見を伝える。" }
    ],
    photoCards: [
      { emoji: "🦴", title: "Matthew Berger's fossil", text: "Matthew Berger, son of famous explorer Lee Berger, made an amazing discovery in South Africa by accident. Nine-year-old Matthew was running after his dog when he tripped over and located a two-million-year-old fossil of a boy.", jp: "有名な探検家リー・バーガーの息子マシューは、南アフリカで偶然すばらしい発見をしました。9歳のマシューは犬を追いかけていてつまずき、200万年前の少年の化石を見つけました。" },
      { emoji: "🦍", title: "Mireya Mayor", text: "Mireya Mayor is an outdoor scientist who observes wildlife. To find gorillas, she crosses streams, climbs mountains, and crawls along tunnels. Once she was even chased by a gorilla! Mayor believes anyone with curiosity can be an explorer.", jp: "ミレヤ・メイヨーは野生動物を観察する野外科学者です。ゴリラを探すために小川を渡り、山に登り、トンネルをはって進みます。ゴリラに追いかけられたこともあります！好奇心があればだれでも探検家になれると信じています。" },
      { emoji: "🤿", title: "Kenny Broad", text: "Whenever Kenny Broad descends into a deep saltwater cave, he takes risks. Broad needs lights and most importantly a guideline, or rope, from the surface into the cave, which helps him find his way.", jp: "ケニー・ブロードは深い塩水の洞窟に潜るたびに危険をおかします。明かりと、そして何より地上から洞窟へのガイドライン（ロープ）が必要です。それが道を見つける助けになります。" },
      { emoji: "🔦", title: "Safety gear", text: "You need safety gear like a headlamp to shine the way and rope for a safe return.", jp: "道を照らすヘッドランプや、安全に戻るためのロープなどの安全装備が必要です。" }
    ],
    lookAndCheck: [
      { q: "How old was Matthew Berger when he found the fossil?", opts: ["Nine", "Nineteen", "Two"], correct: 0, jp: "9歳でした。" },
      { q: "How did Matthew find the fossil?", opts: ["He tripped over while running after his dog.", "He used a headlamp.", "He dived into a cave."], correct: 0, jp: "犬を追いかけていてつまずいたときです。" },
      { q: "What does Mireya Mayor do to find gorillas?", opts: ["Crosses streams, climbs mountains and crawls along tunnels", "Flies a plane", "Dives in caves"], correct: 0, jp: "小川を渡り、山に登り、トンネルをはって進みます。" },
      { q: "What does Kenny Broad need most of all?", opts: ["A guideline, or rope", "A camera", "A boat"], correct: 0, jp: "ガイドライン（ロープ）です。" }
    ],
    sort: {
      title: "Gear, action or place?",
      zones: [
        { id: "gear", label: "🎒 Safety gear" },
        { id: "action", label: "🏃 Actions" },
        { id: "place", label: "📍 Places" }
      ],
      tiles: [
        { text: "a headlamp", zone: "gear" },
        { text: "a rope", zone: "gear" },
        { text: "safety gear", zone: "gear" },
        { text: "ascend", zone: "action" },
        { text: "descend", zone: "action" },
        { text: "chase", zone: "action" },
        { text: "a stream", zone: "place" },
        { text: "a tunnel", zone: "place" },
        { text: "an underwater cave", zone: "place" }
      ]
    },
    quiz: [
      { q: "What must explorers be before they start?", opts: ["Prepared", "Tired", "Hungry"], correct: 0, jp: "準備ができていることです。" },
      { q: "A headlamp is used to ___.", opts: ["shine the way", "carry water", "measure depth"], correct: 0, jp: "道を照らすために使います。" },
      { q: "What is a rope for?", opts: ["A safe return", "Cooking", "Sleeping"], correct: 0, jp: "安全に戻るためです。" },
      { q: "How old was the fossil Matthew found?", opts: ["Two million years", "Two thousand years", "Two hundred years"], correct: 0, jp: "200万年前のものです。" },
      { q: "What was Mireya Mayor chased by?", opts: ["A gorilla", "A bat", "A bear"], correct: 0, jp: "ゴリラです。" },
      { q: "Who does Mayor believe can be an explorer?", opts: ["Anyone with curiosity", "Only scientists", "Only adults"], correct: 0, jp: "好奇心のある人ならだれでもです。" },
      { q: "Where does Kenny Broad descend?", opts: ["Into deep saltwater caves", "Into volcanoes", "Into tunnels under a city"], correct: 0, jp: "深い塩水の洞窟です。" },
      { q: "The guideline helps Broad ___.", opts: ["find his way", "breathe", "swim faster"], correct: 0, jp: "道を見つける助けになります。" }
    ]
  },

  v1: {
    tr: "7.2",
    words: [
      { w: "ascend", norm: "ascend", emoji: "🧗", ipa: "əˈsend", syl: "as-cend", pos: "verb", mean: "to go up.", jw: "登る", jr: "のぼる", jm: "上に行くこと。",
        tr: "Climbers use ropes to ascend mountains.",
        ex: [["Climbers use ropes to ascend mountains.", "登山者は山を登るためにロープを使います。"],
             ["We're deep underwater, and we want to ascend.", "私たちは水中深くにいて、上に戻りたいのです。"],
             ["The sub could ascend in seventy minutes.", "その潜水艇は70分で浮上できました。"]] },
      { w: "descend", norm: "descend", emoji: "🪜", ipa: "dɪˈsend", syl: "de-scend", pos: "verb", mean: "to go down.", jw: "降りる", jr: "おりる", jm: "下に行くこと。",
        tr: "It takes hours to descend into a deep cave.",
        ex: [["It takes hours to descend into a deep cave.", "深い洞窟に降りるには何時間もかかります。"],
             ["A rope can be used to help us descend.", "ロープは降りるのを助けるために使えます。"],
             ["Jimmie and his crew descended the mountain.", "ジミーと乗組員は山を降りました。"]] },
      { w: "underwater", norm: "underwater", emoji: "🌊", ipa: "ˌʌndərˈwɔːtər", syl: "un-der-wa-ter", pos: "adjective", mean: "below the surface of the water.", jw: "水中の", jr: "すいちゅうの", jm: "水面の下にあること。",
        tr: "The underwater plant life here is really beautiful.",
        ex: [["The underwater plant life here is really beautiful.", "ここの水中の植物は本当に美しいです。"],
             ["Explorers descend into underwater caves.", "探検家は水中の洞窟に潜ります。"],
             ["New species can't be analyzed underwater.", "新種は水中では分析できません。"]] },
      { w: "safety gear", norm: "safety gear", emoji: "🎒", ipa: "ˈseɪfti ɡɪr", syl: "safe-ty gear", pos: "noun", mean: "the equipment that keeps you safe.", jw: "安全装備", jr: "あんぜんそうび", jm: "身を守るための装備。",
        tr: "You must wear safety gear if you go into a cave.",
        ex: [["You must wear safety gear if you go into a cave.", "洞窟に入るなら安全装備を身につけなければなりません。"],
             ["Don't forget your safety gear and curiosity!", "安全装備と好奇心を忘れずに！"],
             ["Safety gear must be used to help us stay safe.", "安全を保つために安全装備を使わなければなりません。"]] },
      { w: "a headlamp", norm: "headlamp", emoji: "🔦", ipa: "ˈhedlæmp", syl: "head-lamp", pos: "noun", mean: "a lamp you wear on your head.", jw: "ヘッドランプ", jr: "へっどらんぷ", jm: "頭につける明かり。",
        tr: "Headlamps are a useful invention.",
        ex: [["Headlamps are a useful invention.", "ヘッドランプは便利な発明です。"],
             ["A headlamp can be worn to help us light our way.", "道を照らすためにヘッドランプを身につけられます。"],
             ["Headlamps must be worn in dark caves.", "暗い洞窟ではヘッドランプを身につけなければなりません。"]] },
      { w: "shine", norm: "shine", emoji: "💡", ipa: "ʃaɪn", syl: "shine", pos: "verb", mean: "to give out light, or point a light at something.", jw: "照らす", jr: "てらす", jm: "光を出す、または光を当てること。",
        tr: "Can you shine the flashlight on this rock?",
        ex: [["Can you shine the flashlight on this rock?", "この岩に懐中電灯を当ててくれますか。"],
             ["You need a headlamp to shine the way.", "道を照らすにはヘッドランプが必要です。"],
             ["Shine the light slowly across the cave wall.", "洞窟の壁をゆっくり照らしてください。"]] },
      { w: "a rope", norm: "rope", emoji: "🪢", ipa: "roʊp", syl: "rope", pos: "noun", mean: "a thick strong cord.", jw: "ロープ", jr: "ろーぷ", jm: "太くて丈夫なひも。",
        tr: "This rope is not very strong.",
        ex: [["This rope is not very strong.", "このロープはあまり丈夫ではありません。"],
             ["A rope can be used to help us ascend.", "ロープは登るのを助けるために使えます。"],
             ["Broad needs a guideline, or rope, from the surface.", "ブロードは地上からのガイドライン、つまりロープが必要です。"]] },
      { w: "curiosity", norm: "curiosity", emoji: "🤔", ipa: "ˌkjʊriˈɑːsəti", syl: "cu-ri-os-i-ty", pos: "noun", mean: "the wish to find out about things.", jw: "好奇心", jr: "こうきしん", jm: "物事を知りたいという気持ち。",
        tr: "To be an explorer, you need curiosity.",
        ex: [["To be an explorer, you need curiosity.", "探検家になるには好奇心が必要です。"],
             ["Mayor believes anyone with curiosity can be an explorer.", "メイヨーは好奇心があればだれでも探検家になれると信じています。"],
             ["Don't forget your safety gear and curiosity!", "安全装備と好奇心を忘れずに！"]] },
      { w: "by accident", norm: "by accident", emoji: "😲", ipa: "baɪ ˈæksɪdənt", syl: "by ac-ci-dent", pos: "adverb", mean: "without planning it.", jw: "偶然に", jr: "ぐうぜんに", jm: "計画せずに、たまたま。",
        tr: "I broke my leg by accident.",
        ex: [["I broke my leg by accident.", "私は偶然に脚を折りました。"],
             ["Matthew made an amazing discovery by accident.", "マシューは偶然にすばらしい発見をしました。"],
             ["By accident the Vector crashed into the Doña Paz.", "偶然にベクター号がドニャ・パス号に衝突しました。"]] },
      { w: "trip over", norm: "trip over", emoji: "🤕", ipa: "ˈtrɪp ˌoʊvər", syl: "trip o-ver", pos: "verb", mean: "to catch your foot on something and fall.", jw: "つまずく", jr: "つまずく", jm: "何かに足を引っかけて転ぶこと。",
        tr: "I tripped over a big stone in the road and fell.",
        ex: [["I tripped over a big stone in the road and fell.", "私は道の大きな石につまずいて転びました。"],
             ["Matthew was running after his dog when he tripped over.", "マシューは犬を追いかけていてつまずきました。"],
             ["I tripped over a stalagmite on the ground.", "私は地面の石筍につまずきました。"]] },
      { w: "locate", norm: "locate", emoji: "📍", ipa: "ˈloʊkeɪt", syl: "lo-cate", pos: "verb", mean: "to find exactly where something is.", jw: "見つける", jr: "みつける", jm: "何がどこにあるかを正確に見つけること。",
        tr: "Can you locate the cave without a map?",
        ex: [["Can you locate the cave without a map?", "地図なしでその洞窟を見つけられますか。"],
             ["He tripped over and located a two-million-year-old fossil.", "彼はつまずいて200万年前の化石を見つけました。"],
             ["Angel Falls is located in southeast Venezuela.", "エンジェルフォールはベネズエラ南東部にあります。"]] },
      { w: "cross", norm: "cross", emoji: "🌉", ipa: "krɔːs", syl: "cross", pos: "verb", mean: "to go from one side of something to the other.", jw: "渡る", jr: "わたる", jm: "一方の側から反対側へ行くこと。",
        tr: "The explorer crossed the river.",
        ex: [["The explorer crossed the river.", "その探検家は川を渡りました。"],
             ["To find gorillas, she crosses streams and climbs mountains.", "ゴリラを探すために、彼女は小川を渡り山に登ります。"],
             ["You have to cross streams and hike through the jungle.", "小川を渡り、ジャングルを歩かなければなりません。"]] },
      { w: "a stream", norm: "stream", emoji: "🏞️", ipa: "striːm", syl: "stream", pos: "noun", mean: "a small narrow river.", jw: "小川", jr: "おがわ", jm: "細くて小さな川。",
        tr: "We live next to a beautiful freshwater stream.",
        ex: [["We live next to a beautiful freshwater stream.", "私たちは美しい淡水の小川のとなりに住んでいます。"],
             ["She crosses streams to find gorillas.", "彼女はゴリラを探すために小川を渡ります。"],
             ["When the boat ride ends, you have to cross streams.", "ボートが終わったら小川を渡らなければなりません。"]] },
      { w: "a tunnel", norm: "tunnel", emoji: "🕳️", ipa: "ˈtʌnəl", syl: "tun-nel", pos: "noun", mean: "a long narrow passage under the ground.", jw: "トンネル", jr: "とんねる", jm: "地下の細長い通り道。",
        tr: "What is at the end of this tunnel?",
        ex: [["What is at the end of this tunnel?", "このトンネルの先には何がありますか。"],
             ["She crawls along tunnels to find gorillas.", "彼女はゴリラを探してトンネルをはって進みます。"],
             ["The tunnel was too narrow for safety gear.", "そのトンネルは安全装備には狭すぎました。"]] },
      { w: "chase", norm: "chase", emoji: "🏃", ipa: "tʃeɪs", syl: "chase", pos: "verb", mean: "to run after someone or something.", jw: "追いかける", jr: "おいかける", jm: "だれかや何かのあとを走って追うこと。",
        tr: "Bees sometimes chase you more if you scream.",
        ex: [["Bees sometimes chase you more if you scream.", "叫ぶとハチはもっと追いかけてくることがあります。"],
             ["Once she was even chased by a gorilla!", "彼女はゴリラに追いかけられたこともあります！"],
             ["Was it attacked and chased by pirates?", "それは海賊に襲われ追いかけられたのですか。"]] },
      { w: "a risk", norm: "risk", emoji: "⚠️", ipa: "rɪsk", syl: "risk", pos: "noun", mean: "the chance that something bad will happen.", jw: "危険", jr: "きけん", jm: "悪いことが起こる可能性。",
        tr: "Why do explorers take big risks?",
        ex: [["Why do explorers take big risks?", "探検家はなぜ大きな危険をおかすのですか。"],
             ["Whenever Kenny Broad descends into a cave, he takes risks.", "ケニー・ブロードは洞窟に潜るたびに危険をおかします。"],
             ["It was a huge risk before the ship even sailed.", "その船は出航する前から大きな危険をかかえていました。"]] }
    ]
  },

  v2: {
    tr: "7.5",
    words: [
      { w: "a stalactite", norm: "stalactite", emoji: "🔻", ipa: "stəˈlæktaɪt", syl: "sta-lac-tite", pos: "noun", mean: "a pointed rock that hangs from a cave ceiling.", jw: "鍾乳石", jr: "しょうにゅうせき", jm: "洞窟の天井からぶら下がるとがった岩。",
        tr: "Stalactites are pointed and hang from the ceiling.",
        ex: [["Stalactites are pointed and hang from the ceiling.", "鍾乳石はとがっていて天井からぶら下がっています。"],
             ["Hundreds of stalactites can be seen in this cave.", "この洞窟では何百もの鍾乳石が見られます。"],
             ["A stalactite grows down, very slowly.", "鍾乳石はとてもゆっくり下に伸びます。"]] },
      { w: "a column", norm: "column", emoji: "🏛️", ipa: "ˈkɑːləm", syl: "col-umn", pos: "noun", mean: "a tall round support that goes from floor to ceiling.", jw: "柱", jr: "はしら", jm: "床から天井まで届く丸くて高い支え。",
        tr: "Columns support buildings.",
        ex: [["Columns support buildings.", "柱は建物を支えます。"],
             ["Two have joined together to form a column.", "2つがつながって柱になっています。"],
             ["A column of water falls almost 980 meters.", "水の柱が約980メートル落ちます。"]] },
      { w: "a stalagmite", norm: "stalagmite", emoji: "🔺", ipa: "stəˈlæɡmaɪt", syl: "sta-lag-mite", pos: "noun", mean: "a pointed rock that rises from a cave floor.", jw: "石筍", jr: "せきじゅん", jm: "洞窟の床から立ち上がるとがった岩。",
        tr: "I tripped over a stalagmite on the ground.",
        ex: [["I tripped over a stalagmite on the ground.", "私は地面の石筍につまずきました。"],
             ["Stalagmites rise from the ground.", "石筍は地面から立ち上がります。"],
             ["A stalagmite and a stalactite can meet in the middle.", "石筍と鍾乳石は真ん中で出会うことがあります。"]] },
      { w: "a bat", norm: "bat", emoji: "🦇", ipa: "bæt", syl: "bat", pos: "noun", mean: "a small flying animal that comes out at night.", jw: "コウモリ", jr: "こうもり", jm: "夜に出てくる小さな飛ぶ動物。",
        tr: "Bats help humans by eating mosquitoes.",
        ex: [["Bats help humans by eating mosquitoes.", "コウモリは蚊を食べて人間を助けます。"],
             ["Above us, on the roof of the cave, bats can be heard.", "私たちの上、洞窟の天井でコウモリの声が聞こえます。"],
             ["A bat finds its way in complete darkness.", "コウモリは真っ暗な中でも道を見つけます。"]] },
      { w: "a painting", norm: "painting", emoji: "🎨", ipa: "ˈpeɪntɪŋ", syl: "paint-ing", pos: "noun", mean: "a picture made with paint.", jw: "絵", jr: "え", jm: "絵の具で描いた絵。",
        tr: "I like your painting of a volcano. It's beautiful.",
        ex: [["I like your painting of a volcano. It's beautiful.", "あなたの火山の絵が好きです。美しいです。"],
             ["It is a painting of a spotted horse.", "それは斑点のある馬の絵です。"],
             ["Our ancestors made this painting more than 10,000 years ago.", "私たちの祖先は1万年以上前にこの絵を描きました。"]] },
      { w: "an ancestor", norm: "ancestor", emoji: "👴", ipa: "ˈænsestər", syl: "an-ces-tor", pos: "noun", mean: "a person in your family who lived long ago.", jw: "祖先", jr: "そせん", jm: "ずっと昔に生きていた家族の人。",
        tr: "The fossil that Berger discovered was our ancestor.",
        ex: [["The fossil that Berger discovered was our ancestor.", "バーガーが発見した化石は私たちの祖先でした。"],
             ["It's hard to imagine that our ancestors painted it.", "祖先がそれを描いたとは想像しにくいです。"],
             ["An ancestor of ours lived two million years ago.", "私たちの祖先は200万年前に生きていました。"]] }
    ]
  },

  academic: ["describe", "details", "sequence", "predict", "research"],

  content: [
    { w: "a cave", norm: "cave", emoji: "🕳️", ipa: "keɪv", syl: "cave", pos: "noun", mean: "a large hole in a hill or under the ground.", jw: "洞窟", jr: "どうくつ", jm: "丘や地下にある大きな穴。",
      ex: [["Let's explore! Let's go inside a cave.", "探検しよう！洞窟に入ろう。"],
           ["Headlamps must be worn in a dark cave.", "暗い洞窟ではヘッドランプを身につけなければなりません。"],
           ["Caves make me scared.", "洞窟にいると怖くなります。"]] },
    { w: "a fossil", norm: "fossil", emoji: "🦴", ipa: "ˈfɑːsəl", syl: "fos-sil", pos: "noun", mean: "the remains of a plant or animal preserved in rock.", jw: "化石", jr: "かせき", jm: "岩の中に残された植物や動物のあと。",
      ex: [["He located a two-million-year-old fossil of a boy.", "彼は200万年前の少年の化石を見つけました。"],
           ["A fossil can be studied in a science lab.", "化石は科学の研究室で調べられます。"],
           ["The fossil that Berger discovered surprised everyone.", "バーガーが発見した化石はみんなを驚かせました。"]] },
    { w: "wildlife", norm: "wildlife", emoji: "🐾", ipa: "ˈwaɪldlaɪf", syl: "wild-life", pos: "noun", mean: "animals and plants living in nature.", jw: "野生生物", jr: "やせいせいぶつ", jm: "自然の中で生きている動物や植物。",
      ex: [["Mireya Mayor is an outdoor scientist who observes wildlife.", "ミレヤ・メイヨーは野生生物を観察する野外科学者です。"],
           ["The park protects wildlife from visitors.", "その公園は野生生物を訪問者から守ります。"],
           ["Photographing wildlife takes a lot of patience.", "野生生物の撮影にはとても忍耐が必要です。"]] },
    { w: "an expedition", norm: "expedition", emoji: "🧭", ipa: "ˌekspəˈdɪʃən", syl: "ex-pe-di-tion", pos: "noun", mean: "an organised journey made to explore or study something.", jw: "探検", jr: "たんけん", jm: "調べたり探検したりするために計画された旅。",
      ex: [["That year, Jimmie's expedition flew over the waterfall.", "その年、ジミーの探検隊は滝の上を飛びました。"],
           ["They arranged an expedition to the rain forest.", "彼らは熱帯雨林への探検を計画しました。"],
           ["Every expedition needs safety gear and a plan.", "どの探検にも安全装備と計画が必要です。"]] },
    { w: "a canyon", norm: "canyon", emoji: "🏜️", ipa: "ˈkænjən", syl: "can-yon", pos: "noun", mean: "a deep valley with steep sides.", jw: "峡谷", jr: "きょうこく", jm: "両側が切り立った深い谷。",
      ex: [["Not all of the water reaches the base of the canyon.", "水のすべてが峡谷の底に届くわけではありません。"],
           ["A river carved this canyon over millions of years.", "川が何百万年もかけてこの峡谷を削りました。"],
           ["The canyon walls made her nervous.", "峡谷の壁は彼女を不安にさせました。"]] }
  ],

  song: {
    tr: "7.3",
    title: "Let's Explore",
    jpTitle: "探検しよう",
    lyrics: [
      { t: "Let's go exploring!", jp: "探検に行こう！" },
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "Let's explore! Let's go inside a cave.", jp: "探検しよう！洞窟に入ろう。" },
      { t: "Let's explore! Be sure to be safe.", jp: "探検しよう！必ず安全に。" },
      { t: "Let's explore! There's so much to see.", jp: "探検しよう！見るものがたくさんある。" },
      { t: "Don't forget your safety gear and curiosity!", jp: "安全装備と好奇心を忘れずに！" },
      { t: "We're inside a cave.", jp: "私たちは洞窟の中にいる。" },
      { t: "We're ready to climb down.", jp: "降りる準備ができている。" },
      { t: "What should we use to keep us safe?", jp: "安全でいるために何を使えばいい？" },
      { t: "A rope can be used to help us descend.", jp: "ロープは降りるのを助けるために使える。" },
      { t: "A headlamp can be worn to help us light our way.", jp: "ヘッドランプは道を照らすために身につけられる。" },
      { t: "We're deep underwater,", jp: "私たちは水中深くにいる、" },
      { t: "and we want to ascend.", jp: "そして上に戻りたい。" },
      { t: "A rope can be used to help us ascend.", jp: "ロープは登るのを助けるために使える。" },
      { t: "Let's follow it to find our way back where we began.", jp: "それをたどって、始めた場所に戻ろう。" },
      { t: "When we're underwater in a jungle or a cave,", jp: "水中でもジャングルでも洞窟でも、" },
      { t: "safety gear must be used to help us stay safe.", jp: "安全を保つために安全装備を使わなければならない。" }
    ],
    tapWords: ["explore", "cave", "safe", "safety", "curiosity", "rope", "descend", "headlamp", "underwater", "ascend"],
    quiz: [
      { q: "What should you not forget, according to the song?", opts: ["Your safety gear and curiosity", "Your lunch", "Your homework"], correct: 0, jp: "安全装備と好奇心です。" },
      { q: "“A rope can be used to help us descend” is ___.", opts: ["a passive with a modal", "a question", "an imperative"], correct: 0, jp: "助動詞つきの受け身です。" },
      { q: "What can be worn to light the way?", opts: ["A headlamp", "A rope", "A jacket"], correct: 0, jp: "ヘッドランプです。" },
      { q: "Where are the singers in the second verse?", opts: ["Deep underwater", "On a mountain top", "In a city"], correct: 0, jp: "水中深くです。" },
      { q: "What do they follow to find their way back?", opts: ["The rope", "A map", "A bat"], correct: 0, jp: "ロープです。" },
      { q: "What must be used to help us stay safe?", opts: ["Safety gear", "A camera", "A boat"], correct: 0, jp: "安全装備です。" }
    ]
  },

  g1: {
    key: "passive_with_modals",
    tr: "7.4",
    component: "grammar-1",
    title: "Passive with modals",
    jpTitle: "助動詞つきの受け身",
    short: "must be + past participle",
    role: "obligation",
    rule: "Use a modal — must, must not, have to, can, can't — plus be plus the past participle to say what has to or can be done to something.",
    jpRule: "must・must not・have to・can・can't などの助動詞 + be + 過去分詞 で、何がされなければならないか、何ができるかを表します。",
    pattern: "subject + modal + be + past participle",
    jpPattern: "主語 + 助動詞 + be + 過去分詞",
    intro: [
      { t: "Headlamps must be worn in dark caves.", jp: "暗い洞窟ではヘッドランプを身につけなければなりません。" },
      { t: "Dangerous places must not be entered alone.", jp: "危険な場所に一人で入ってはいけません。" },
      { t: "New species have to be studied in a science lab.", jp: "新種は科学の研究室で調べなければなりません。" }
    ],
    rows: [
      { form: "must (obligation)", pattern: "subject + must be + past participle", example: "Headlamps must be worn in dark caves.", jp: "暗い洞窟ではヘッドランプを身につけなければなりません。" },
      { form: "must not (prohibition)", pattern: "subject + must not be + past participle", example: "Dangerous places must not be entered alone.", jp: "危険な場所に一人で入ってはいけません。" },
      { form: "have to (necessity)", pattern: "subject + have to be + past participle", example: "New species have to be studied in a science lab.", jp: "新種は科学の研究室で調べなければなりません。" },
      { form: "can't (impossibility)", pattern: "subject + can't be + past participle", example: "They can't be analyzed underwater.", jp: "それらは水中では分析できません。" },
      { form: "can (possibility)", pattern: "subject + can be + past participle", example: "A rope can be used to help us descend.", jp: "ロープは降りるのを助けるために使えます。" }
    ],
    noteRule: "Be never changes after a modal — only the past participle tells you what is done.",
    noteException: "Must not means it is forbidden. Can't means it is impossible.",
    noteExceptionDetail: "Have to changes for the subject (has to be studied for a singular subject) but must never changes.",
    table: {
      title: "modal + be + past participle",
      columns: ["Subject", "Modal", "be", "Past participle"],
      rows: [
        { cells: ["Headlamps", "must", "be", "worn in dark caves."], roles: ["subject", "obligation", "verb", "verb"] },
        { cells: ["Dangerous places", "must not", "be", "entered alone."], roles: ["subject", "prohibition", "verb", "verb"] },
        { cells: ["New species", "have to", "be", "studied in a science lab."], roles: ["subject", "obligation", "verb", "verb"] },
        { cells: ["They", "can't", "be", "analyzed underwater."], roles: ["subject", "prohibition", "verb", "verb"] }
      ],
      notes: [
        "Be always stays as be after a modal.",
        "Must not = forbidden. Can't = impossible."
      ]
    },
    samples: [
      { t: "Headlamps must be worn in dark caves.", jp: "暗い洞窟ではヘッドランプを身につけなければなりません。", h: "must be worn" },
      { t: "Dangerous places must not be entered alone.", jp: "危険な場所に一人で入ってはいけません。", h: "must not be entered" },
      { t: "New species have to be studied in a science lab.", jp: "新種は科学の研究室で調べなければなりません。", h: "have to be studied" },
      { t: "They can't be analyzed underwater.", jp: "それらは水中では分析できません。", h: "can't be analyzed" },
      { t: "A rope can be used to help us descend.", jp: "ロープは降りるのを助けるために使えます。", h: "can be used" },
      { t: "A headlamp can be worn to help us light our way.", jp: "ヘッドランプは道を照らすために身につけられます。", h: "can be worn" },
      { t: "Safety gear must be used to help us stay safe.", jp: "安全を保つために安全装備を使わなければなりません。", h: "must be used" },
      { t: "Hundreds of stalactites can be seen in this cave.", jp: "この洞窟では何百もの鍾乳石が見られます。", h: "can be seen" },
      { t: "Above us, bats can be heard.", jp: "私たちの上でコウモリの声が聞こえます。", h: "can be heard" },
      { t: "The fossil must not be moved before it is photographed.", jp: "化石は写真を撮る前に動かしてはいけません。", h: "must not be moved" }
    ],
    levelup: {
      rules: [
        { title: "must be + past participle for rules", jpTitle: "決まりには must be + 過去分詞",
          sub: "Use it for a rule everybody has to follow.", jpSub: "みんなが守るべき決まりに使います。",
          transforms: [["headlamps / wear / in dark caves", "Headlamps must be worn in dark caves."], ["safety gear / use / to stay safe", "Safety gear must be used to stay safe."]],
          examples: [{ t: "Safety gear must be used to help us stay safe.", jp: "安全を保つために安全装備を使わなければなりません。", h: "must be used" },
                     { t: "Ropes must be checked before every climb.", jp: "登る前に毎回ロープを点検しなければなりません。", h: "must be checked" }] },
        { title: "must not = forbidden, can't = impossible", jpTitle: "must not は禁止、can't は不可能",
          sub: "Choose the one that matches your meaning.", jpSub: "意味に合うほうを選びます。",
          transforms: [["dangerous places / enter / alone", "Dangerous places must not be entered alone."], ["new species / analyze / underwater", "New species can't be analyzed underwater."]],
          examples: [{ t: "Dangerous places must not be entered alone.", jp: "危険な場所に一人で入ってはいけません。", h: "must not be entered" },
                     { t: "They can't be analyzed underwater.", jp: "それらは水中では分析できません。", h: "can't be analyzed" }] },
        { title: "can be + past participle for what is possible", jpTitle: "できることは can be + 過去分詞",
          sub: "Use can be to say what the thing makes possible.", jpSub: "そのものによって何ができるかを表します。",
          transforms: [["a rope / use / to help us descend", "A rope can be used to help us descend."], ["stalactites / see / in this cave", "Stalactites can be seen in this cave."]],
          examples: [{ t: "A rope can be used to help us descend.", jp: "ロープは降りるのを助けるために使えます。", h: "can be used" },
                     { t: "Hundreds of stalactites can be seen in this cave.", jp: "この洞窟では何百もの鍾乳石が見られます。", h: "can be seen" }] }
      ],
      mixed: [
        { t: "The cave paintings must not be touched.", jp: "洞窟の絵にさわってはいけません。", h: "must not be touched" },
        { t: "Bats can be heard on the roof of the cave.", jp: "洞窟の天井でコウモリの声が聞こえます。", h: "can be heard" },
        { t: "The rope has to be tied to something solid.", jp: "ロープは固いものに結びつけなければなりません。", h: "has to be tied" },
        { t: "A fossil this old can't be moved by hand.", jp: "これほど古い化石は手で動かすことはできません。", h: "can't be moved" },
        { t: "Every stream must be crossed carefully.", jp: "どの小川も注意して渡らなければなりません。", h: "must be crossed" },
        { t: "The guideline can be followed back to the surface.", jp: "ガイドラインをたどって地上に戻れます。", h: "can be followed" }
      ]
    },
    quiz: [
      { stem: ["Headlamps must ", " in dark caves."], answers: ["be worn", "worn", "be wear", "wearing"], correct: 0, explTitle: "modal + be + past participle", explBody: "After must, use be + worn.", jp: "must のあとは be + 過去分詞です。" },
      { stem: ["Dangerous places must not ", " alone."], answers: ["be entered", "entered", "be enter", "entering"], correct: 0, explTitle: "must not + be + participle", explBody: "The negative keeps the same shape.", jp: "否定でも形は同じです。" },
      { stem: ["New species have to ", " in a science lab."], answers: ["be studied", "studied", "be study", "studying"], correct: 0, explTitle: "have to + be + participle", explBody: "Have to works like must here.", jp: "have to も must と同じ形です。" },
      { stem: ["They can't ", " underwater."], answers: ["be analyzed", "analyzed", "be analyze", "analyzing"], correct: 0, explTitle: "can't + be + participle", explBody: "Can't means it is impossible.", jp: "can't は不可能を表します。" },
      { stem: ["A rope can ", " to help us descend."], answers: ["be used", "used", "be use", "using"], correct: 0, explTitle: "can + be + participle", explBody: "Can be shows what is possible.", jp: "can be は可能を表します。" },
      { stem: ["What form does “be” take after a modal?", ""], answers: ["be", "is", "was", "being"], correct: 0, explTitle: "Base form", explBody: "Modals are always followed by be.", jp: "助動詞のあとは be です。" },
      { stem: ["Which one means “it is forbidden”?", ""], answers: ["must not be", "can't be", "has to be", "can be"], correct: 0, explTitle: "must not = forbidden", explBody: "Can't is about impossibility, not rules.", jp: "must not は禁止です。" },
      { stem: ["Hundreds of stalactites can ", " in this cave."], answers: ["be seen", "seen", "be see", "seeing"], correct: 0, explTitle: "can + be + participle", explBody: "Seen is the past participle of see.", jp: "see の過去分詞は seen です。" },
      { stem: ["The rope has ", " tied to something solid."], answers: ["to be", "be", "been", "being"], correct: 0, explTitle: "has to be + participle", explBody: "Singular subject → has to be.", jp: "単数主語なら has to be です。" },
      { stem: ["Safety gear must ", " to help us stay safe."], answers: ["be used", "used", "using", "be use"], correct: 0, explTitle: "must be + participle", explBody: "The line comes straight from the song.", jp: "歌の一節どおりの形です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["Headlamps must be worn in dark caves.", "Headlamps must worn in dark caves.", "Headlamps must be wear in dark caves.", "Headlamps must being worn in dark caves."], correct: 0, explTitle: "must + be + past participle", explBody: "Keep that shape.", jp: "must + be + 過去分詞です。" },
      { stem: ["Which sentence forbids something?", ""], answers: ["Dangerous places must not be entered alone.", "Dangerous places can be entered alone.", "Dangerous places have to be entered alone.", "Dangerous places can't be seen alone."], correct: 0, explTitle: "must not = forbidden", explBody: "It is a rule, not an impossibility.", jp: "must not は禁止を表します。" },
      { stem: ["Make it passive: “We must wear headlamps.”", ""], answers: ["Headlamps must be worn.", "Headlamps must worn.", "Headlamps must wear.", "Headlamps must been worn."], correct: 0, explTitle: "Object first", explBody: "Headlamps becomes the subject.", jp: "目的語が主語になります。" },
      { stem: ["Which participle completes it? “Bats can be ___ on the roof.”", ""], answers: ["heard", "hear", "hearing", "hears"], correct: 0, explTitle: "hear → heard", explBody: "Use the past participle.", jp: "過去分詞 heard を使います。" },
      { stem: ["Complete: “A fossil this old ___ be moved by hand.”", ""], answers: ["can't", "must", "have to", "is"], correct: 0, explTitle: "Impossibility", explBody: "It is physically impossible, so can't.", jp: "不可能なので can't です。" },
      { stem: ["Which sentence uses have to correctly?", ""], answers: ["New species have to be studied in a lab.", "New species have to studied in a lab.", "New species has to be studied in a lab.", "New species have to being studied in a lab."], correct: 0, explTitle: "Plural + have to be", explBody: "Species is plural here.", jp: "複数なので have to be です。" },
      { stem: ["What comes straight after the modal?", ""], answers: ["be", "the past participle", "the subject", "not"], correct: 0, explTitle: "modal + be", explBody: "Be comes first, then the participle.", jp: "助動詞のすぐあとは be です。" },
      { stem: ["Fix it: “The paintings must not touched.”", ""], answers: ["The paintings must not be touched.", "The paintings must be not touched.", "The paintings not must be touched.", "The paintings must not being touched."], correct: 0, explTitle: "Add be", explBody: "must not + be + touched.", jp: "be を入れます。" },
      { stem: ["Which sentence says something is possible?", ""], answers: ["The guideline can be followed back to the surface.", "The guideline must not be followed.", "The guideline can't be followed.", "The guideline has to be cut."], correct: 0, explTitle: "can be = possible", explBody: "Can be shows possibility.", jp: "can be は可能を表します。" },
      { stem: ["Complete: “Every stream ___ be crossed carefully.”", ""], answers: ["must", "musts", "musting", "to must"], correct: 0, explTitle: "Modals never change", explBody: "Must has only one form.", jp: "must は形が変わりません。" }
    ]
  },

  g2: {
    key: "make_someone_adjective",
    tr: "7.7",
    component: "grammar-2",
    title: "Make + someone + adjective",
    jpTitle: "make + 人 + 形容詞",
    short: "make me scared",
    role: "cause",
    rule: "Use make + a person + an adjective to say what causes a feeling. The adjective describes the person, not the thing.",
    jpRule: "make + 人 + 形容詞 で「何が人をどんな気持ちにさせるか」を表します。形容詞は人の気持ちを表します。",
    pattern: "thing + make(s) / made + person + adjective",
    jpPattern: "もの + make(s) / made + 人 + 形容詞",
    intro: [
      { t: "Caves make me scared.", jp: "洞窟は私を怖がらせます。" },
      { t: "Exploring makes Mireya happy.", jp: "探検はミレヤを幸せにします。" },
      { t: "Heights made her nervous.", jp: "高い場所は彼女を不安にさせました。" }
    ],
    rows: [
      { form: "Plural subject", pattern: "things + make + person + adjective", example: "Caves make me scared.", jp: "洞窟は私を怖がらせます。" },
      { form: "Singular subject", pattern: "thing + makes + person + adjective", example: "Exploring makes Mireya happy.", jp: "探検はミレヤを幸せにします。" },
      { form: "Past", pattern: "thing + made + person + adjective", example: "Heights made her nervous.", jp: "高い場所は彼女を不安にさせました。" },
      { form: "Object pronoun", pattern: "make + me / him / her / us / them + adjective", example: "That makes me so mad.", jp: "それは私をとても怒らせます。" },
      { form: "No to", pattern: "never say make me to be scared", example: "Caves make me scared.", jp: "make me to be scared とは言いません。" }
    ],
    noteRule: "The thing that causes the feeling is the subject; the person who feels it is the object.",
    noteException: "Use an object pronoun after make: me, him, her, us, them — never I, he, she.",
    noteExceptionDetail: "There is no to and no be: say it makes me happy, not it makes me to be happy.",
    table: {
      title: "make + object + adjective",
      columns: ["What causes it", "make / makes / made", "Person", "Feeling"],
      rows: [
        { cells: ["Caves", "make", "me", "scared."], roles: ["cause", "verb", "directObject", "effect"] },
        { cells: ["Exploring", "makes", "Mireya", "happy."], roles: ["cause", "verb", "directObject", "effect"] },
        { cells: ["Heights", "made", "her", "nervous."], roles: ["cause", "verb", "directObject", "effect"] },
        { cells: ["Shipwrecks", "make", "me", "sad."], roles: ["cause", "verb", "directObject", "effect"] }
      ],
      notes: [
        "Use makes with a singular subject and make with a plural one.",
        "The adjective always comes last."
      ]
    },
    samples: [
      { t: "Caves make me scared.", jp: "洞窟は私を怖がらせます。", h: "make me scared" },
      { t: "Exploring makes Mireya happy.", jp: "探検はミレヤを幸せにします。", h: "makes Mireya happy" },
      { t: "Heights made her nervous.", jp: "高い場所は彼女を不安にさせました。", h: "made her nervous" },
      { t: "It makes me sad that so many people lost their lives.", jp: "そんなに多くの人が命を落としたことは私を悲しくさせます。", h: "makes me sad" },
      { t: "That makes me so mad.", jp: "それは私をとても怒らせます。", h: "makes me so mad" },
      { t: "Dark tunnels make some explorers nervous.", jp: "暗いトンネルは探検家の中には不安になる人もいます。", h: "make some explorers nervous" },
      { t: "The waterfall made Jimmie curious.", jp: "その滝はジミーの好奇心をかき立てました。", h: "made Jimmie curious" },
      { t: "Bats in the cave made us jumpy.", jp: "洞窟のコウモリは私たちをびくびくさせました。", h: "made us jumpy" },
      { t: "A good rope makes climbers confident.", jp: "よいロープは登る人を自信のある気持ちにさせます。", h: "makes climbers confident" },
      { t: "Losing his headlamp made him anxious.", jp: "ヘッドランプをなくして彼は不安になりました。", h: "made him anxious" }
    ],
    levelup: {
      rules: [
        { title: "The cause is the subject", jpTitle: "原因が主語",
          sub: "Put the thing that causes the feeling first, then make, then the person.", jpSub: "気持ちを生む「もの」を先に置き、次に make、そして人です。",
          transforms: [["caves / me / scared", "Caves make me scared."], ["exploring / Mireya / happy", "Exploring makes Mireya happy."]],
          examples: [{ t: "Caves make me scared.", jp: "洞窟は私を怖がらせます。", h: "make me scared" },
                     { t: "A good rope makes climbers confident.", jp: "よいロープは登る人を自信のある気持ちにさせます。", h: "makes climbers confident" }] },
        { title: "Use an object pronoun", jpTitle: "目的格の代名詞を使う",
          sub: "After make you need me, him, her, us or them — never I, he or she.", jpSub: "make のあとは me・him・her・us・them を使います。",
          transforms: [["heights / she / nervous", "Heights made her nervous."], ["bats / we / jumpy", "Bats made us jumpy."]],
          examples: [{ t: "Heights made her nervous.", jp: "高い場所は彼女を不安にさせました。", h: "made her nervous" },
                     { t: "Bats in the cave made us jumpy.", jp: "洞窟のコウモリは私たちをびくびくさせました。", h: "made us jumpy" }] },
        { title: "No to and no be", jpTitle: "to も be も入れない",
          sub: "The adjective follows the person directly.", jpSub: "形容詞は人のすぐあとに続きます。",
          transforms: [["it / me / happy", "It makes me happy."], ["losing his headlamp / he / anxious", "Losing his headlamp made him anxious."]],
          examples: [{ t: "It makes me sad that so many people lost their lives.", jp: "そんなに多くの人が命を落としたことは私を悲しくさせます。", h: "makes me sad" },
                     { t: "Losing his headlamp made him anxious.", jp: "ヘッドランプをなくして彼は不安になりました。", h: "made him anxious" }] }
      ],
      mixed: [
        { t: "A last-minute winner makes Leo happy.", jp: "終了間際のゴールはレオを喜ばせます。", h: "makes Leo happy" },
        { t: "Deep water makes some divers nervous.", jp: "深い水はダイバーの中には不安になる人もいます。", h: "makes some divers nervous" },
        { t: "The cave painting made the whole team quiet.", jp: "その洞窟の絵はチーム全員を静かにさせました。", h: "made the whole team quiet" },
        { t: "Curiosity makes explorers brave.", jp: "好奇心は探検家を勇敢にします。", h: "makes explorers brave" },
        { t: "Bad reception made my mother angry.", jp: "電波が悪くて母は怒りました。", h: "made my mother angry" },
        { t: "Angel Falls makes visitors speechless.", jp: "エンジェルフォールは訪れる人を言葉を失わせます。", h: "makes visitors speechless" }
      ]
    },
    quiz: [
      { stem: ["Caves make ", " scared."], answers: ["me", "I", "my", "mine"], correct: 0, explTitle: "Object pronoun", explBody: "Use me, not I, after make.", jp: "make のあとは me です。" },
      { stem: ["Exploring ", " Mireya happy."], answers: ["makes", "make", "made to", "making"], correct: 0, explTitle: "Singular subject", explBody: "Exploring is singular, so makes.", jp: "単数主語なので makes です。" },
      { stem: ["Heights ", " her nervous."], answers: ["made", "make to", "makes to", "making"], correct: 0, explTitle: "Past tense", explBody: "Made is the simple past of make.", jp: "made は make の過去形です。" },
      { stem: ["Which sentence is correct?", ""], answers: ["It makes me happy.", "It makes me to be happy.", "It makes I happy.", "It make me happy."], correct: 0, explTitle: "No to, no be", explBody: "The adjective follows the person directly.", jp: "to も be も入れません。" },
      { stem: ["In “Caves make me scared”, the cause is ___.", ""], answers: ["caves", "me", "scared", "make"], correct: 0, explTitle: "The subject is the cause", explBody: "Caves cause the feeling.", jp: "主語が原因です。" },
      { stem: ["Bats in the cave made ", " jumpy."], answers: ["us", "we", "our", "ours"], correct: 0, explTitle: "Object pronoun", explBody: "Use us, not we.", jp: "we ではなく us です。" },
      { stem: ["Which word class comes last in this pattern?", ""], answers: ["an adjective", "a noun", "a verb", "an adverb"], correct: 0, explTitle: "Adjective last", explBody: "make + person + adjective.", jp: "最後は形容詞です。" },
      { stem: ["A good rope ", " climbers confident."], answers: ["makes", "make", "made to", "making"], correct: 0, explTitle: "Singular subject", explBody: "A good rope is singular.", jp: "単数主語なので makes です。" },
      { stem: ["Losing his headlamp ", " him anxious."], answers: ["made", "make", "makes to", "making"], correct: 0, explTitle: "Past tense", explBody: "The sentence is about the past.", jp: "過去の話なので made です。" },
      { stem: ["Which sentence is NOT correct?", ""], answers: ["Deep water makes nervous some divers.", "Deep water makes some divers nervous.", "Deep water made me nervous.", "Deep water makes them nervous."], correct: 0, explTitle: "Person before adjective", explBody: "The person comes before the adjective.", jp: "人が形容詞より前に来ます。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["Caves make me scared.", "Caves make I scared.", "Caves makes me scared.", "Caves make me to be scared."], correct: 0, explTitle: "make + me + adjective", explBody: "Plural subject, object pronoun, adjective.", jp: "make + me + 形容詞です。" },
      { stem: ["Complete: “Curiosity ___ explorers brave.”", ""], answers: ["makes", "make", "making", "made to"], correct: 0, explTitle: "Singular subject", explBody: "Curiosity is singular.", jp: "curiosity は単数です。" },
      { stem: ["Fix it: “The cave painting made quiet the whole team.”", ""], answers: ["The cave painting made the whole team quiet.", "The cave painting made quiet team the whole.", "The cave painting the whole team made quiet.", "Made the cave painting the whole team quiet."], correct: 0, explTitle: "Person before adjective", explBody: "Keep make + person + adjective.", jp: "make + 人 + 形容詞の順です。" },
      { stem: ["Which pronoun is correct? “Bad reception made ___ angry.”", ""], answers: ["her", "she", "hers", "her's"], correct: 0, explTitle: "Object pronoun", explBody: "Use her, not she.", jp: "she ではなく her です。" },
      { stem: ["Which sentence is in the past?", ""], answers: ["Heights made her nervous.", "Heights make her nervous.", "Heights makes her nervous.", "Heights are making her nervous."], correct: 0, explTitle: "made = past", explBody: "Made is the past form.", jp: "made が過去形です。" },
      { stem: ["What is “scared” in “Caves make me scared”?", ""], answers: ["an adjective describing me", "a verb", "a noun", "an adverb"], correct: 0, explTitle: "Adjective", explBody: "It describes how I feel.", jp: "私の気持ちを表す形容詞です。" },
      { stem: ["Complete: “Angel Falls ___ visitors speechless.”", ""], answers: ["makes", "make", "made to", "making"], correct: 0, explTitle: "Singular subject", explBody: "Angel Falls is treated as one place.", jp: "一つの場所なので makes です。" },
      { stem: ["Which is wrong after make?", ""], answers: ["to be", "me", "her", "them"], correct: 0, explTitle: "No to be", explBody: "Never insert to be.", jp: "to be は入れません。" },
      { stem: ["Choose the correct word order.", ""], answers: ["A last-minute winner makes Leo happy.", "A last-minute winner makes happy Leo.", "Makes a last-minute winner Leo happy.", "A last-minute winner Leo makes happy."], correct: 0, explTitle: "subject + makes + person + adjective", explBody: "Keep that order.", jp: "主語 + makes + 人 + 形容詞です。" },
      { stem: ["Which sentence explains a feeling's cause?", ""], answers: ["Deep water makes some divers nervous.", "Some divers are nervous people.", "Deep water is cold.", "Divers wear safety gear."], correct: 0, explTitle: "make shows cause", explBody: "The subject causes the feeling.", jp: "主語が気持ちの原因です。" }
    ]
  },

  reading: {
    tr: "7.8",
    title: "Angel Falls",
    jpTitle: "エンジェルフォール",
    intro: "Imagine searching for gold, but instead of finding it, you see one of the great wonders of the world. That's what happened to Jimmie Angel.",
    paras: [
      { t: "Jimmie loved to fly. A miner hired him to fly to Venezuela in search of gold. In 1933, during one of his flights, he saw an amazing waterfall.",
        q: "Why did Jimmie Angel fly to Venezuela?", opts: ["A miner hired him to search for gold.", "He wanted to find a waterfall.", "He was on holiday."], correct: 0, jp: "鉱山主に金を探すために雇われたからです。" },
      { t: "The waterfall became known to the world in 1937. That year, Jimmie's expedition flew over the waterfall and then landed on a tabletop mountain. A wheel sank into the mud and broke. The plane was stuck. Jimmie and his crew descended the mountain and then hiked through the jungle for 11 days.",
        q: "How long did they hike through the jungle?", opts: ["11 days", "11 hours", "11 weeks"], correct: 0, jp: "11日間です。" },
      { t: "After this adventure, the falls were named in Jimmie's honor: Angel Falls. Angel Falls is located in southeast Venezuela in Canaima National Park. It's the tallest waterfall in the world. A column of water falls almost 980 meters from the top of the mountain to its base.",
        q: "How far does the column of water fall?", opts: ["Almost 980 meters", "Almost 98 meters", "Almost 9,800 meters"], correct: 0, jp: "約980メートルです。" },
      { t: "Not all of the water reaches the base of the canyon. Some of it blows away into a fine mist. You can reach the falls by canoe or boat. When the boat ride ends, you have to cross streams and hike through the jungle to reach the falls. You can also reach them like Jimmie did, by plane.",
        q: "Why doesn't all the water reach the base?", opts: ["Some of it blows away into a fine mist.", "It freezes on the way down.", "It is used by the park."], correct: 0, jp: "一部は細かい霧になって飛ばされるからです。" }
    ],
    strategy: {
      title: "Reading strategy — comparing sizes",
      body: "The passage compares Angel Falls with buildings you may know: 62 meters taller than the Burj Khalifa, almost twice as tall as the Shanghai World Financial Center. When a text compares, ask what is being compared with what.",
      jp: "この文章はエンジェルフォールを有名な建物と比べています。比較が出てきたら「何と何を比べているのか」を確かめましょう。"
    },
    order: {
      title: "Put Jimmie Angel's story in order",
      items: [
        "A miner hired Jimmie to fly to Venezuela in search of gold.",
        "In 1933 he saw an amazing waterfall from his plane.",
        "In 1937 his expedition landed on a tabletop mountain.",
        "A wheel sank into the mud and the plane was stuck.",
        "Jimmie and his crew hiked through the jungle for 11 days.",
        "The falls were named Angel Falls in his honor."
      ]
    },
    quiz: [
      { q: "What was Jimmie Angel looking for?", opts: ["Gold", "A waterfall", "A cave"], correct: 0, jp: "金を探していました。" },
      { q: "In what year did he first see the waterfall?", opts: ["1933", "1937", "1943"], correct: 0, jp: "1933年です。" },
      { q: "What happened to the plane's wheel?", opts: ["It sank into the mud and broke.", "It fell off in the air.", "It was stolen."], correct: 0, jp: "泥に沈んで壊れました。" },
      { q: "Where is Angel Falls?", opts: ["Southeast Venezuela, in Canaima National Park", "Northern Brazil", "Southern Peru"], correct: 0, jp: "ベネズエラ南東部のカナイマ国立公園です。" },
      { q: "Angel Falls is the ___ waterfall in the world.", opts: ["tallest", "widest", "coldest"], correct: 0, jp: "世界一高い滝です。" },
      { q: "How much taller is it than the Burj Khalifa?", opts: ["62 meters", "620 meters", "6 meters"], correct: 0, jp: "62メートル高いです。" },
      { q: "How can you reach the falls?", opts: ["By canoe, boat or plane", "Only by car", "Only on foot"], correct: 0, jp: "カヌー・ボート・飛行機で行けます。" },
      { q: "What can you see outside the airport at Ciudad Bolívar?", opts: ["Jimmie's restored plane", "The waterfall", "A cave painting"], correct: 0, jp: "ジミーの復元された飛行機です。" }
    ]
  },

  writing: {
    genre: "A safety guide for explorers",
    jpGenre: "探検家のための安全ガイド",
    modelTitle: "Before You Enter a Cave",
    model: [
      "Caves make many people nervous, and that is a sensible feeling.",
      "Headlamps must be worn at all times, and a spare light has to be carried by every member of the group.",
      "A guideline must be tied at the entrance so that the way out can be followed.",
      "Dangerous passages must not be entered alone. Curiosity is good, but preparation keeps you alive."
    ],
    modelJp: "洞窟は多くの人を不安にさせますが、それは当然の気持ちです。ヘッドランプは常に身につけなければならず、全員が予備の明かりを持たなければなりません。",
    steps: [
      { t: "Start with how the place makes people feel, using make + someone + adjective.", jp: "make + 人 + 形容詞 を使って、その場所がどんな気持ちにさせるかから始める。" },
      { t: "Give two rules with must be + past participle.", jp: "must be + 過去分詞 で決まりを2つ書く。" },
      { t: "Give one thing that must not be done.", jp: "してはいけないことを1つ書く。" },
      { t: "End with one sentence of advice.", jp: "助言を1文書いて締めくくる。" }
    ],
    expressions: [
      { t: "___ make(s) people ___.", jp: "〜は人を〜な気持ちにさせます。" },
      { t: "___ must be ___ at all times.", jp: "〜は常に〜されなければなりません。" },
      { t: "___ has to be ___ by every member of the group.", jp: "〜はグループの全員によって〜されなければなりません。" },
      { t: "___ must not be ___ alone.", jp: "〜を一人で〜してはいけません。" }
    ],
    checklist: [
      "I used make + someone + adjective once.",
      "I used must be + past participle at least twice.",
      "I gave one must not rule.",
      "Every rule I wrote is something a real explorer would follow."
    ],
    quiz: [
      { q: "Choose the correct passive with a modal.", opts: ["Headlamps must be worn.", "Headlamps must worn.", "Headlamps must be wear."], correct: 0, jp: "must + be + 過去分詞です。" },
      { q: "Which sentence uses make correctly?", opts: ["Caves make people nervous.", "Caves make nervous people.", "Caves make people to be nervous."], correct: 0, jp: "make + 人 + 形容詞です。" },
      { q: "“Must not” means ___.", opts: ["it is forbidden", "it is impossible", "it is optional"], correct: 0, jp: "禁止という意味です。" },
      { q: "A safety guide should be written as ___.", opts: ["clear rules", "a story", "a poem"], correct: 0, jp: "はっきりした決まりとして書きます。" },
      { q: "Which piece of gear lights the way?", opts: ["A headlamp", "A rope", "A canoe"], correct: 0, jp: "ヘッドランプです。" },
      { q: "What follows a modal in the passive?", opts: ["be", "is", "was"], correct: 0, jp: "助動詞のあとは be です。" },
      { q: "Which is the best closing advice?", opts: ["Curiosity is good, but preparation keeps you alive.", "The end.", "I like caves."], correct: 0, jp: "行動につながる助言で締めくくります。" },
      { q: "“Can't be” means ___.", opts: ["it is impossible", "it is forbidden", "it is easy"], correct: 0, jp: "不可能という意味です。" }
    ]
  }
};
