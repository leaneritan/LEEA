/* Our World Level 6 · Unit 1 — Exciting Sports
   Source: Student's Book audio script TR 1.1-1.8. */
export default {
  unit: 1,
  title: "Exciting Sports",
  jpTitle: "エキサイティングなスポーツ",
  themeEmoji: "🏂",
  slug: "exciting-sports",

  opener: {
    tr: "1.1",
    intro:
      "These days many young people do dangerous and exciting sports called “extreme sports.” They can be done in the air, in the water, or on land.",
    goals: [
      { en: "Talk about extreme sports and what makes them exciting.", jp: "エクストリームスポーツと、その面白さについて話す。" },
      { en: "Use the present perfect with for and since to say how long.", jp: "現在完了形と for / since を使って「どのくらい」を言う。" },
      { en: "Name the safety gear athletes wear.", jp: "選手が身につける安全装備の名前を言う。" },
      { en: "Use adverbs of emphasis like so, really, incredibly and totally.", jp: "so・really・incredibly・totally などの強調の副詞を使う。" },
      { en: "Read about two brave athletes and retell their stories.", jp: "2人の勇敢な選手について読み、その話を伝える。" }
    ],
    photoCards: [
      { emoji: "⛷️", title: "Extreme skiing", text: "Extreme skiers reach speeds of 240 kilometers an hour and fly the length of two football fields before they land!", jp: "エクストリームスキーヤーは時速240キロに達し、着地するまでにサッカー場2面分の長さを飛びます。" },
      { emoji: "🚵", title: "BMX", text: "Another popular land sport is BMX (bicycle motocross). In skiing and BMX, people flip in the air.", jp: "もう一つ人気のある陸上スポーツが BMX（自転車モトクロス）です。スキーと BMX では、空中で宙返りをします。" },
      { emoji: "🪁", title: "Kitesurfing", text: "An athlete travels skillfully across the water at speeds of 55 kilometers an hour or more. Kitesurfers need lots of strength in their arms.", jp: "選手は時速55キロ以上で水面を巧みに進みます。カイトサーファーは腕にたくさんの力が必要です。" },
      { emoji: "🪂", title: "Hang-gliding", text: "Hang-gliding is one of the most popular extreme sports, although the equipment is expensive. Imagine flying like a bird at a height of 6,000 meters!", jp: "ハンググライダーは用具が高価ですが、最も人気のあるエクストリームスポーツの一つです。高さ6,000メートルを鳥のように飛ぶ姿を想像してみてください。" }
    ],
    lookAndCheck: [
      { q: "Where can extreme sports be done?", opts: ["In the air, in the water, or on land", "Only on snow", "Only indoors"], correct: 0, jp: "エクストリームスポーツは空中・水中・陸上で行えます。" },
      { q: "How fast can an extreme skier go?", opts: ["240 kilometers an hour", "55 kilometers an hour", "6,000 kilometers an hour"], correct: 0, jp: "エクストリームスキーヤーは時速240キロに達します。" },
      { q: "What do kitesurfers need a lot of?", opts: ["Strength in their arms", "Snow", "A motocross bike"], correct: 0, jp: "カイトサーファーは腕の力がたくさん必要です。" },
      { q: "Why don't more people go hang-gliding?", opts: ["The equipment is expensive", "It is illegal", "It is too slow"], correct: 0, jp: "用具が高価だからです。" }
    ],
    sort: {
      title: "Air, water or land?",
      zones: [
        { id: "air", label: "🌬️ In the air" },
        { id: "water", label: "🌊 In the water" },
        { id: "land", label: "🏔️ On land" }
      ],
      tiles: [
        { text: "hang-gliding", zone: "air" },
        { text: "a ski flip", zone: "air" },
        { text: "kitesurfing", zone: "water" },
        { text: "surfing", zone: "water" },
        { text: "motocross", zone: "land" },
        { text: "BMX", zone: "land" },
        { text: "skiing", zone: "land" },
        { text: "skateboarding", zone: "land" }
      ]
    },
    quiz: [
      { q: "“Extreme sports” are sports that are ___.", opts: ["dangerous and exciting", "quiet and slow", "played only indoors"], correct: 0, jp: "エクストリームスポーツは危険で刺激的なスポーツです。" },
      { q: "BMX stands for ___.", opts: ["bicycle motocross", "big motor cross", "best motor experience"], correct: 0, jp: "BMX は bicycle motocross の略です。" },
      { q: "Kitesurfing is a new kind of ___.", opts: ["surfing", "skiing", "cycling"], correct: 0, jp: "カイトサーフィンは新しい種類のサーフィンです。" },
      { q: "Kitesurfers are nicknamed ___.", opts: ["Charlie Browners", "Snow Flyers", "Wind Kings"], correct: 0, jp: "カイトサーファーは「チャーリー・ブラウナーズ」と呼ばれます。" },
      { q: "Serious accidents in hang-gliding are ___.", opts: ["not common", "very common", "impossible"], correct: 0, jp: "重大な事故は多くはありません。" },
      { q: "An extreme skier can fly the ___ of two football fields.", opts: ["length", "height", "strength"], correct: 0, jp: "サッカー場2面分の長さを飛びます。" },
      { q: "Hang-gliders can fly at a height of ___ meters.", opts: ["6,000", "600", "60"], correct: 0, jp: "高さ6,000メートルを飛びます。" },
      { q: "People sometimes have injuries when they ___.", opts: ["land", "watch", "sleep"], correct: 0, jp: "着地するときにけがをすることがあります。" }
    ]
  },

  v1: {
    tr: "1.2",
    words: [
      { w: "length", emoji: "📏", ipa: "leŋkθ", syl: "length", pos: "noun", mean: "how long something is from one end to the other.", jw: "長さ", jr: "ながさ", jm: "端から端までの長さのこと。",
        tr: "Extreme skiers can fly the length of two football fields.",
        ex: [["Extreme skiers can fly the length of two football fields.", "エクストリームスキーヤーはサッカー場2面分の長さを飛べます。"],
             ["The length of the pool is fifty meters.", "そのプールの長さは50メートルです。"],
             ["He measured the length of the rope before climbing.", "彼は登る前にロープの長さを測りました。"]] },
      { w: "land", emoji: "🛬", ipa: "lænd", syl: "land", pos: "verb", mean: "to come down onto the ground after being in the air.", jw: "着地する", jr: "ちゃくちする", jm: "空中から地面に降りること。",
        tr: "He landed after hang-gliding for two hours.",
        ex: [["He landed after hang-gliding for two hours.", "彼は2時間ハンググライダーをしてから着地しました。"],
             ["The plane landed safely on the runway.", "飛行機は滑走路に無事着陸しました。"],
             ["Skateboarders have to land on both wheels.", "スケートボーダーは両方の車輪で着地しなければなりません。"]] },
      { w: "motocross", emoji: "🏍️", ipa: "ˈmoʊtoʊkrɔːs", syl: "mo-to-cross", pos: "noun", mean: "a race on motorcycles or bicycles over rough ground.", jw: "モトクロス", jr: "もとくろす", jm: "でこぼこの地面をバイクや自転車で走るレース。",
        tr: "A motocross can be dangerous.",
        ex: [["A motocross can be dangerous.", "モトクロスは危険なことがあります。"],
             ["My cousin races motocross every weekend.", "いとこは毎週末モトクロスのレースに出ています。"],
             ["The motocross track was full of mud after the rain.", "雨のあと、モトクロスのコースは泥だらけでした。"]] },
      { w: "skiing", emoji: "⛷️", ipa: "ˈskiːɪŋ", syl: "ski-ing", pos: "noun", mean: "the sport of moving over snow on skis.", jw: "スキー", jr: "すきー", jm: "スキー板で雪の上を滑るスポーツ。",
        tr: "Skiing is my favorite winter sport.",
        ex: [["Skiing is my favorite winter sport.", "スキーは私のいちばん好きな冬のスポーツです。"],
             ["We went skiing in Nagano last winter.", "私たちは去年の冬、長野へスキーに行きました。"],
             ["Skiing down a steep hill takes a lot of practice.", "急な坂をスキーで滑り降りるにはたくさんの練習が必要です。"]] },
      { w: "flip", emoji: "🤸", ipa: "flɪp", syl: "flip", pos: "verb", mean: "to turn over quickly in the air.", jw: "宙返りする", jr: "ちゅうがえりする", jm: "空中ですばやく回転すること。",
        tr: "Some skiers flip in the air.",
        ex: [["Some skiers flip in the air.", "空中で宙返りするスキーヤーもいます。"],
             ["The gymnast can flip twice before landing.", "その体操選手は着地する前に2回宙返りできます。"],
             ["BMX riders flip their bikes over the ramp.", "BMX の選手はランプの上で自転車を回転させます。"]] },
      { w: "kitesurfing", emoji: "🪁", ipa: "ˈkaɪtsɜːrfɪŋ", syl: "kite-surf-ing", pos: "noun", mean: "a water sport where a large kite pulls you across the water on a board.", jw: "カイトサーフィン", jr: "かいとさーふぃん", jm: "大きなカイトに引かれてボードで水面を進むスポーツ。",
        tr: "Kitesurfing is fun.",
        ex: [["Kitesurfing is fun.", "カイトサーフィンは楽しいです。"],
             ["Kitesurfing needs strong wind and open water.", "カイトサーフィンには強い風と広い水面が必要です。"],
             ["He tried kitesurfing for the first time in Okinawa.", "彼は沖縄で初めてカイトサーフィンをやってみました。"]] },
      { w: "skillful", emoji: "🎯", ipa: "ˈskɪlfəl", syl: "skill-ful", pos: "adjective", mean: "very good at doing something because you have practiced a lot.", jw: "上手な", jr: "じょうずな", jm: "たくさん練習して、とても上手にできること。",
        tr: "She is a very skillful athlete.",
        ex: [["She is a very skillful athlete.", "彼女はとても上手な選手です。"],
             ["Lamine Yamal is a skillful winger for Barcelona.", "ラミン・ヤマルはバルセロナの上手なウインガーです。"],
             ["You need skillful hands to control a kite.", "カイトを操るには上手な手さばきが必要です。"]] },
      { w: "crash", emoji: "💥", ipa: "kræʃ", syl: "crash", pos: "verb", mean: "to hit something hard and be damaged.", jw: "衝突する", jr: "しょうとつする", jm: "強くぶつかって壊れること。",
        tr: "Be careful. Don't crash.",
        ex: [["Be careful. Don't crash.", "気をつけて。ぶつからないで。"],
             ["The BMX rider crashed into the fence.", "BMX の選手はフェンスに衝突しました。"],
             ["If he isn't skillful, he'll crash.", "上手でなければ、彼は衝突するでしょう。"]] },
      { w: "strength", emoji: "💪", ipa: "streŋkθ", syl: "strength", pos: "noun", mean: "how strong your body is.", jw: "力", jr: "ちから", jm: "体の強さのこと。",
        tr: "Surfers need a lot of strength.",
        ex: [["Surfers need a lot of strength.", "サーファーにはたくさんの力が必要です。"],
             ["Kitesurfers need strength in their arms.", "カイトサーファーは腕の力が必要です。"],
             ["Weight training builds strength in your legs.", "筋力トレーニングは脚の力をつけます。"]] },
      { w: "hang-gliding", emoji: "🪂", ipa: "ˈhæŋˌɡlaɪdɪŋ", syl: "hang-glid-ing", pos: "noun", mean: "the sport of flying with a large, light wing.", jw: "ハンググライダー", jr: "はんぐぐらいだー", jm: "大きくて軽い翼で飛ぶスポーツ。",
        tr: "I enjoy hang-gliding.",
        ex: [["I enjoy hang-gliding.", "私はハンググライダーを楽しみます。"],
             ["Hang-gliding lets you fly like a bird.", "ハンググライダーをすると鳥のように飛べます。"],
             ["She went hang-gliding above the valley.", "彼女は谷の上をハンググライダーで飛びました。"]] },
      { w: "equipment", emoji: "🎒", ipa: "ɪˈkwɪpmənt", syl: "e-quip-ment", pos: "noun", mean: "the things you need in order to do an activity.", jw: "用具", jr: "ようぐ", jm: "ある活動をするために必要な道具のこと。",
        tr: "I bought some ski equipment.",
        ex: [["I bought some ski equipment.", "私はスキーの用具を買いました。"],
             ["Hang-gliding equipment is expensive.", "ハンググライダーの用具は高価です。"],
             ["Check your equipment before every ride.", "乗る前に毎回用具を点検しましょう。"]] },
      { w: "accident", emoji: "🚑", ipa: "ˈæksɪdənt", syl: "ac-ci-dent", pos: "noun", mean: "something bad that happens without anyone planning it.", jw: "事故", jr: "じこ", jm: "だれも計画していないのに起こる悪いできごと。",
        tr: "That skier had an accident.",
        ex: [["That skier had an accident.", "あのスキーヤーは事故にあいました。"],
             ["Serious accidents are not common in this sport.", "このスポーツでは重大な事故は多くありません。"],
             ["He had an accident on the motocross track.", "彼はモトクロスのコースで事故にあいました。"]] },
      { w: "injury", emoji: "🩹", ipa: "ˈɪndʒəri", syl: "in-ju-ry", pos: "noun", mean: "damage to a part of your body.", jw: "けが", jr: "けが", jm: "体の一部が傷つくこと。",
        tr: "Many people have sports injuries.",
        ex: [["One month after her injury, she was back in the water.", "けがの1か月後、彼女は水に戻っていました。"],
             ["A knee injury kept him out of the game.", "ひざのけがで彼は試合に出られませんでした。"],
             ["Wear pads to avoid an injury.", "けがを避けるためにパッドをつけましょう。"]] },
      { w: "height", emoji: "📐", ipa: "haɪt", syl: "height", pos: "noun", mean: "how high something is above the ground.", jw: "高さ", jr: "たかさ", jm: "地面からどれくらい高いかということ。",
        tr: "He is flying at a height of two thousand meters.",
        ex: [["He is flying at a height of two thousand meters.", "彼は高さ2,000メートルを飛んでいます。"],
             ["Imagine flying at a height of 6,000 meters!", "高さ6,000メートルを飛ぶ姿を想像してみて！"],
             ["The height of the wave scared the young surfer.", "波の高さが若いサーファーを怖がらせました。"]] }
    ]
  },

  v2: {
    tr: "1.5",
    words: [
      { w: "elbow pads", norm: "elbow pads", emoji: "🛡️", ipa: "ˈelboʊ pædz", syl: "el-bow pads", pos: "noun", mean: "soft covers you wear to protect your elbows.", jw: "ひじあて", jr: "ひじあて", jm: "ひじを守るためにつける柔らかいあて物。",
        tr: "She's wearing elbow pads.",
        ex: [["She's wearing elbow pads.", "彼女はひじあてをつけています。"],
             ["Skateboarders wear elbow pads and knee pads.", "スケートボーダーはひじあてとひざあてをつけます。"],
             ["Put on your elbow pads before you ride.", "乗る前にひじあてをつけなさい。"]] },
      { w: "knee pads", norm: "knee pads", emoji: "🦵", ipa: "niː pædz", syl: "knee pads", pos: "noun", mean: "soft covers you wear to protect your knees.", jw: "ひざあて", jr: "ひざあて", jm: "ひざを守るためにつける柔らかいあて物。",
        tr: "She's wearing knee pads.",
        ex: [["She's wearing knee pads.", "彼女はひざあてをつけています。"],
             ["My knee pads saved me when I fell.", "転んだとき、ひざあてのおかげで助かりました。"],
             ["You can borrow my old knee pads.", "私の古いひざあてを貸してあげるよ。"]] },
      { w: "a helmet", norm: "helmet", emoji: "⛑️", ipa: "ˈhelmɪt", syl: "hel-met", pos: "noun", mean: "a hard hat that protects your head.", jw: "ヘルメット", jr: "へるめっと", jm: "頭を守る固い帽子。",
        tr: "She's wearing a helmet.",
        ex: [["She's wearing a helmet.", "彼女はヘルメットをかぶっています。"],
             ["Always wear a helmet when you cycle.", "自転車に乗るときは必ずヘルメットをかぶりましょう。"],
             ["Danny MacAskill has broken twelve helmets.", "ダニー・マカスキルはヘルメットを12個壊しました。"]] },
      { w: "brakes", norm: "brakes", emoji: "🛑", ipa: "breɪks", syl: "brakes", pos: "noun", mean: "the parts that make a bike or a car stop.", jw: "ブレーキ", jr: "ぶれーき", jm: "自転車や車を止める部分。",
        tr: "Always check your brakes.",
        ex: [["Always check your brakes.", "いつもブレーキを点検しましょう。"],
             ["We still need to check the brakes.", "まだブレーキを点検する必要があります。"],
             ["His brakes stopped working on the hill.", "坂道で彼のブレーキがきかなくなりました。"]] },
      { w: "a life jacket", norm: "life jacket", emoji: "🦺", ipa: "laɪf ˌdʒækɪt", syl: "life jack-et", pos: "noun", mean: "a jacket that keeps you floating in water.", jw: "救命胴衣", jr: "きゅうめいどうい", jm: "水に浮いていられるようにするための上着。",
        tr: "Always wear a life jacket on a boat.",
        ex: [["Always wear a life jacket on a boat.", "ボートでは必ず救命胴衣を着けましょう。"],
             ["It's on the floor, next to your life jacket.", "それは床の、あなたの救命胴衣のとなりにあります。"],
             ["We wore life jackets so no one would have an accident.", "事故が起きないように、私たちは救命胴衣を着けました。"]] }
    ]
  },

  academic: ["sequence", "compare", "describe", "evaluate", "details"],

  content: [
    { w: "an athlete", norm: "athlete", emoji: "🏃", ipa: "ˈæθliːt", syl: "ath-lete", pos: "noun", mean: "a person who is very good at a sport.", jw: "選手", jr: "せんしゅ", jm: "スポーツがとても上手な人。",
      ex: [["An athlete travels skillfully across the water.", "選手は水面を巧みに進みます。"],
           ["Bethany Hamilton is an incredibly brave athlete.", "ベサニー・ハミルトンはとても勇敢な選手です。"],
           ["Every athlete needs rest as well as training.", "どの選手にも練習だけでなく休養が必要です。"]] },
    { w: "extreme", norm: "extreme", emoji: "🔥", ipa: "ɪkˈstriːm", syl: "ex-treme", pos: "adjective", mean: "much more than usual — very great or very dangerous.", jw: "極端な", jr: "きょくたんな", jm: "ふつうよりずっと大きい、またはとても危険なこと。",
      ex: [["Extreme sports can be done in the air, in the water, or on land.", "エクストリームスポーツは空中・水中・陸上で行えます。"],
           ["Extreme skiers reach very high speeds.", "エクストリームスキーヤーはとても速い速度に達します。"],
           ["He loves extreme weather as much as extreme sports.", "彼は極端な天気もエクストリームスポーツと同じくらい好きです。"]] },
    { w: "brave", norm: "brave", emoji: "🦁", ipa: "breɪv", syl: "brave", pos: "adjective", mean: "not afraid to do something difficult or dangerous.", jw: "勇敢な", jr: "ゆうかんな", jm: "難しいことや危険なことをこわがらないこと。",
      ex: [["Danny and Bethany are two incredibly brave athletes.", "ダニーとベサニーはとても勇敢な2人の選手です。"],
           ["It was brave of her to surf again.", "もう一度サーフィンをしたのは勇敢でした。"],
           ["You have to be brave to fly a hang-glider.", "ハンググライダーで飛ぶには勇敢でなければなりません。"]] },
    { w: "a competition", norm: "competition", emoji: "🏆", ipa: "ˌkɑːmpəˈtɪʃən", syl: "com-pe-ti-tion", pos: "noun", mean: "an event where people try to win by being the best.", jw: "大会", jr: "たいかい", jm: "だれが一番かを決めるためのもよおし。",
      ex: [["She has won competitions since her accident.", "彼女は事故のあとも大会で優勝しています。"],
           ["The kitesurfing competition starts on Saturday.", "カイトサーフィンの大会は土曜日に始まります。"],
           ["Leo watched the skateboarding competition on TV.", "レオはテレビでスケートボードの大会を見ました。"]] },
    { w: "viral", norm: "viral", emoji: "📈", ipa: "ˈvaɪrəl", syl: "vi-ral", pos: "adjective", mean: "shared very quickly by a huge number of people online.", jw: "拡散した", jr: "かくさんした", jm: "インターネットで一気に大勢に広まること。",
      ex: [["The video went viral in 2009.", "その動画は2009年に一気に広まりました。"],
           ["A viral clip can be watched a hundred million times.", "拡散した動画は1億回も見られることがあります。"],
           ["His viral videos made him famous.", "拡散した動画のおかげで彼は有名になりました。"]] }
  ],

  song: {
    tr: "1.3",
    title: "Extreme Sports",
    jpTitle: "エクストリームスポーツ",
    lyrics: [
      { t: "A kitesurfer rides the waves.", jp: "カイトサーファーが波に乗る。" },
      { t: "A kitesurfer rides the wind.", jp: "カイトサーファーが風に乗る。" },
      { t: "I've kitesurfed in my dreams", jp: "夢の中でカイトサーフィンをしてきた" },
      { t: "ever since I was a kid!", jp: "子どもの頃からずっと！" },
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "Extreme sports.", jp: "エクストリームスポーツ。" },
      { t: "Flying high in the air!", jp: "空高く飛んでいる！" },
      { t: "Other sports don't compare!", jp: "ほかのスポーツとは比べものにならない！" },
      { t: "Extreme sports. Look around.", jp: "エクストリームスポーツ。まわりを見て。" },
      { t: "They're everywhere!", jp: "どこにでもあるよ！" },
      { t: "Super cool sports!", jp: "とてもかっこいいスポーツ！" },
      { t: "Skiers flip so skillfully,", jp: "スキーヤーはとても上手に宙返りする、" },
      { t: "incredibly high above the snow.", jp: "雪のはるか上、信じられないほど高く。" },
      { t: "I've skied in my dreams", jp: "夢の中でスキーをしてきた" },
      { t: "ever since I was a kid.", jp: "子どもの頃からずっと。" },
      { t: "Motocross and hang-gliding,", jp: "モトクロスとハンググライダー、" },
      { t: "are so incredibly fun!", jp: "本当に信じられないくらい楽しい！" },
      { t: "I've dreamed of doing both", jp: "両方やる夢を見てきた" },
      { t: "ever since I was a kid!", jp: "子どもの頃からずっと！" }
    ],
    tapWords: ["kitesurfer", "waves", "wind", "kitesurfed", "flip", "skillfully", "skied", "Motocross", "hang-gliding", "sports"],
    quiz: [
      { q: "What does the kitesurfer ride?", opts: ["The waves and the wind", "A motocross bike", "A hang-glider"], correct: 0, jp: "カイトサーファーは波と風に乗ります。" },
      { q: "“I've kitesurfed in my dreams ever since I was a kid” uses ___.", opts: ["the present perfect with since", "the simple past", "the future"], correct: 0, jp: "since を使った現在完了形です。" },
      { q: "How do the skiers flip?", opts: ["So skillfully", "Very slowly", "Not at all"], correct: 0, jp: "スキーヤーはとても上手に宙返りします。" },
      { q: "The word “incredibly” in the song is ___.", opts: ["an adverb of emphasis", "a noun", "a past participle"], correct: 0, jp: "incredibly は強調の副詞です。" },
      { q: "Which two sports are named together in the last verse?", opts: ["Motocross and hang-gliding", "Skiing and surfing", "BMX and swimming"], correct: 0, jp: "モトクロスとハンググライダーです。" },
      { q: "“Other sports don't compare” means other sports are ___.", opts: ["not as exciting", "much safer", "more expensive"], correct: 0, jp: "ほかのスポーツはこれほど刺激的ではない、という意味です。" }
    ]
  },

  g1: {
    key: "present_perfect_for_since",
    tr: "1.4",
    component: "grammar-1",
    title: "Present perfect with for and since",
    jpTitle: "現在完了形と for / since",
    short: "for / since",
    role: "verb",
    rule: "Use have/has + the past participle to talk about something that started in the past and is still true now. Use for with a length of time and since with a point in time when it started.",
    jpRule: "過去に始まって今も続いていることは have/has + 過去分詞 で表します。期間の長さには for、始まった時点には since を使います。",
    pattern: "subject + have/has + past participle + for / since + time",
    jpPattern: "主語 + have/has + 過去分詞 + for / since + 時間",
    intro: [
      { t: "Kitesurfing has been popular for about fifteen years.", jp: "カイトサーフィンは約15年間ずっと人気があります。" },
      { t: "Surfing and skateboarding have been popular since the 1970s.", jp: "サーフィンとスケートボードは1970年代からずっと人気があります。" },
      { t: "How long have you done extreme sports?", jp: "どのくらいエクストリームスポーツをしていますか。" }
    ],
    rows: [
      { form: "I / You / We / They", pattern: "subject + have + past participle", example: "They have been friends since 2019.", jp: "彼らは2019年からずっと友達です。" },
      { form: "He / She / It", pattern: "subject + has + past participle", example: "Kitesurfing has been popular for fifteen years.", jp: "カイトサーフィンは15年間ずっと人気があります。" },
      { form: "for + length of time", pattern: "for + a month / five years / an hour", example: "I have played soccer for six years.", jp: "私は6年間サッカーをしています。" },
      { form: "since + starting point", pattern: "since + June / 2019 / I was born", example: "He has skied since he was born.", jp: "彼は生まれたときからずっとスキーをしています。" },
      { form: "Question", pattern: "How long + have/has + subject + past participle?", example: "How long have you done extreme sports?", jp: "どのくらいエクストリームスポーツをしていますか。" }
    ],
    noteRule: "The present perfect connects the past to now. The action or state started earlier and has not finished.",
    noteException: "Use for with a length of time (for five years) and since with the moment it began (since 2019).",
    noteExceptionDetail: "Never use since with a length of time: say for an hour, not since an hour. Ask about the length with How long...?",
    table: {
      title: "for and since",
      columns: ["Subject", "have / has", "Past participle", "for / since"],
      rows: [
        { cells: ["Kitesurfing", "has", "been popular", "for about fifteen years."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["Surfing and skateboarding", "have", "been popular", "since the 1970s."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["I", "have", "played soccer", "for six years."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["He", "has", "not skied", "since last winter."], roles: ["subject", "verb", "verb", "clause"] }
      ],
      notes: [
        "Contract have/has in speech: I've, you've, he's, she's, it's, we've, they've.",
        "Make the negative with haven't / hasn't: I haven't skied since last winter."
      ],
      qa: [
        { question: "How long have you done extreme sports?", answer: "I've done them for three years." },
        { question: "How long has he been a kitesurfer?", answer: "He's been a kitesurfer since 2021." }
      ]
    },
    samples: [
      { t: "Kitesurfing has been popular for about fifteen years.", jp: "カイトサーフィンは約15年間ずっと人気があります。", h: "has been popular for" },
      { t: "Surfing and skateboarding have been popular since the 1970s.", jp: "サーフィンとスケートボードは1970年代からずっと人気があります。", h: "have been popular since" },
      { t: "How long have you done extreme sports?", jp: "どのくらいエクストリームスポーツをしていますか。", h: "have you done" },
      { t: "I have played soccer for six years.", jp: "私は6年間サッカーをしています。", h: "have played soccer for" },
      { t: "He has skied since he was born.", jp: "彼は生まれたときからずっとスキーをしています。", h: "has skied since" },
      { t: "Danny has ridden his bicycle since he was a kid.", jp: "ダニーは子どもの頃からずっと自転車に乗っています。", h: "has ridden his bicycle since" },
      { t: "Bethany has surfed with one arm since 2003.", jp: "ベサニーは2003年から片腕でサーフィンをしています。", h: "has surfed with one arm since" },
      { t: "We have not seen him for two weeks.", jp: "私たちは2週間彼に会っていません。", h: "have not seen him for" },
      { t: "Salah has played for Liverpool since 2017.", jp: "サラーは2017年からリバプールでプレーしています。", h: "has played for Liverpool since" },
      { t: "They have known each other for ten years.", jp: "彼らは10年間ずっと知り合いです。", h: "have known each other for" }
    ],
    levelup: {
      rules: [
        { title: "Use for with a length of time", jpTitle: "for は「期間の長さ」に使う",
          sub: "Ask yourself: how long did it last? If the answer is a number of minutes, hours, days or years, use for.",
          jpSub: "「どのくらいの長さか」を考えます。分・時間・日・年など長さで答えるなら for を使います。",
          transforms: [["Kitesurfing / popular / fifteen years", "Kitesurfing has been popular for fifteen years."], ["I / play soccer / six years", "I have played soccer for six years."]],
          examples: [{ t: "I have owned this helmet for a month.", jp: "私はこのヘルメットを1か月持っています。", h: "have owned this helmet for" },
                     { t: "She has trained for two hours.", jp: "彼女は2時間練習しています。", h: "has trained for" }] },
        { title: "Use since with a starting point", jpTitle: "since は「始まった時点」に使う",
          sub: "If the answer names a moment — a year, a month, a day, or an event — use since.",
          jpSub: "年・月・日・できごとなど「いつ始まったか」で答えるなら since を使います。",
          transforms: [["Surfing / popular / the 1970s", "Surfing has been popular since the 1970s."], ["He / ski / he was born", "He has skied since he was born."]],
          examples: [{ t: "He has been famous since 2012.", jp: "彼は2012年からずっと有名です。", h: "has been famous since" },
                     { t: "I have wanted a hang-glider since last summer.", jp: "私は去年の夏からハンググライダーが欲しいです。", h: "have wanted a hang-glider since" }] },
        { title: "Ask with How long ...?", jpTitle: "How long ...? でたずねる",
          sub: "Put have or has before the subject to make a question. Answer with for or since.",
          jpSub: "have / has を主語の前に出して疑問文を作ります。答えるときは for か since を使います。",
          transforms: [["you / do extreme sports", "How long have you done extreme sports?"], ["she / be a kitesurfer", "How long has she been a kitesurfer?"]],
          examples: [{ t: "How long has Bethany surfed with one arm?", jp: "ベサニーはどのくらい片腕でサーフィンをしていますか。", h: "has Bethany surfed" },
                     { t: "How long have they lived in Hawaii?", jp: "彼らはどのくらいハワイに住んでいますか。", h: "have they lived" }] }
      ],
      mixed: [
        { t: "Leo has watched extreme sports videos for two years.", jp: "レオは2年間エクストリームスポーツの動画を見ています。", h: "has watched extreme sports videos for" },
        { t: "Haaland has scored for Manchester City since 2022.", jp: "ハーランドは2022年からマンチェスター・シティで得点しています。", h: "has scored for Manchester City since" },
        { t: "We have not crashed since we bought new brakes.", jp: "新しいブレーキを買ってから一度も衝突していません。", h: "have not crashed since" },
        { t: "My dad has hang-glided for twenty years.", jp: "父は20年間ハンググライダーをしています。", h: "has hang-glided for" },
        { t: "How long have you had those knee pads?", jp: "そのひざあてをどのくらい持っていますか。", h: "have you had" },
        { t: "The equipment has been expensive since the beginning.", jp: "その用具は最初からずっと高価です。", h: "has been expensive since" }
      ]
    },
    quiz: [
      { stem: ["Kitesurfing ", " been popular for fifteen years."], answers: ["has", "have", "is", "did"], correct: 0, explTitle: "Singular subject takes has", explBody: "“Kitesurfing” is singular, so it takes has + past participle.", jp: "カイトサーフィンは15年間ずっと人気があります。" },
      { stem: ["Surfing and skateboarding have been popular ", " the 1970s."], answers: ["since", "for", "from", "during"], correct: 0, explTitle: "since names the starting point", explBody: "“The 1970s” is a moment in time, so use since.", jp: "1970年代からずっと人気があります。" },
      { stem: ["I have played soccer ", " six years."], answers: ["for", "since", "in", "ago"], correct: 0, explTitle: "for names a length", explBody: "“Six years” is a length of time, so use for.", jp: "私は6年間サッカーをしています。" },
      { stem: ["How long ", " you done extreme sports?"], answers: ["have", "has", "are", "did"], correct: 0, explTitle: "you takes have", explBody: "Questions with you use have before the subject.", jp: "どのくらいエクストリームスポーツをしていますか。" },
      { stem: ["He ", " skied since he was born."], answers: ["has", "have", "is", "was"], correct: 0, explTitle: "He takes has", explBody: "Third-person singular subjects take has + past participle.", jp: "彼は生まれたときからずっとスキーをしています。" },
      { stem: ["We ", " seen him for two weeks."], answers: ["haven't", "didn't", "aren't", "don't"], correct: 0, explTitle: "Negative present perfect", explBody: "Make the negative with haven't / hasn't + past participle.", jp: "私たちは2週間彼に会っていません。" },
      { stem: ["Bethany has surfed with one arm ", " 2003."], answers: ["since", "for", "already", "yet"], correct: 0, explTitle: "A year is a starting point", explBody: "2003 is a moment in time, so use since.", jp: "ベサニーは2003年から片腕でサーフィンをしています。" },
      { stem: ["Danny has made videos ", " more than ten years."], answers: ["for", "since", "from", "by"], correct: 0, explTitle: "for + length", explBody: "“More than ten years” is a length of time.", jp: "ダニーは10年以上動画を作っています。" },
      { stem: ["They have ", " each other for ten years."], answers: ["known", "know", "knew", "knowing"], correct: 0, explTitle: "Use the past participle", explBody: "After have, use the past participle: known.", jp: "彼らは10年間ずっと知り合いです。" },
      { stem: ["", "Salah has played for Liverpool since 2017.” This means he ___."], answers: ["still plays for Liverpool", "stopped playing in 2017", "will play in 2017", "played only in 2017"], correct: 0, explTitle: "The present perfect reaches now", explBody: "The action started in 2017 and is still true today.", jp: "サラーは2017年から今もリバプールでプレーしています。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["I have played BMX for three years.", "I have played BMX since three years.", "I am played BMX for three years.", "I have play BMX for three years."], correct: 0, explTitle: "for + length of time", explBody: "Use for with a length: for three years.", jp: "私は3年間 BMX をしています。" },
      { stem: ["Choose the correct question.", ""], answers: ["How long has she been a kitesurfer?", "How long she has been a kitesurfer?", "How long is she been a kitesurfer?", "How long have she been a kitesurfer?"], correct: 0, explTitle: "has before the subject", explBody: "In questions, has comes before the subject.", jp: "彼女はどのくらいカイトサーファーですか。" },
      { stem: ["Choose the correct negative.", ""], answers: ["He hasn't crashed since last year.", "He doesn't crashed since last year.", "He hasn't crash since last year.", "He isn't crashed since last year."], correct: 0, explTitle: "hasn't + past participle", explBody: "The negative is hasn't + past participle.", jp: "彼は去年から一度も衝突していません。" },
      { stem: ["Which word completes it? “We have waited ", " an hour.”"], answers: ["for", "since", "from", "at"], correct: 0, explTitle: "An hour is a length", explBody: "Use for with a length of time.", jp: "私たちは1時間待っています。" },
      { stem: ["Which word completes it? “She has been famous ", " 2012.”"], answers: ["since", "for", "during", "by"], correct: 0, explTitle: "A year is a starting point", explBody: "Use since with the moment something began.", jp: "彼女は2012年からずっと有名です。" },
      { stem: ["Choose the correct past participle of “break”.", ""], answers: ["broken", "breaked", "broke", "breaking"], correct: 0, explTitle: "Irregular past participle", explBody: "break → broke → broken.", jp: "break の過去分詞は broken です。" },
      { stem: ["Which sentence uses the present perfect correctly?", ""], answers: ["His videos have been watched a hundred million times.", "His videos has been watched a hundred million times.", "His videos have been watch a hundred million times.", "His videos are been watched a hundred million times."], correct: 0, explTitle: "Plural subject takes have", explBody: "“His videos” is plural, so use have.", jp: "彼の動画は1億回見られています。" },
      { stem: ["“How long have you had those brakes?” The best answer is ___.", ""], answers: ["For about six months.", "Since six months.", "In six months.", "Six months ago."], correct: 0, explTitle: "Answer a length with for", explBody: "“Six months” is a length, so answer with for.", jp: "「6か月くらいです」と答えます。" },
      { stem: ["Choose the sentence with the correct word order.", ""], answers: ["Skateboarding has been popular since the 1970s.", "Skateboarding been has popular since the 1970s.", "Has skateboarding been popular since the 1970s.", "Skateboarding has popular been since the 1970s."], correct: 0, explTitle: "subject + has + past participle", explBody: "Keep the order subject + has + past participle.", jp: "スケートボードは1970年代からずっと人気があります。" },
      { stem: ["Which one is NOT correct?", ""], answers: ["I have kitesurfed since two years.", "I have kitesurfed for two years.", "I have kitesurfed since 2024.", "I haven't kitesurfed since 2024."], correct: 0, explTitle: "since never takes a length", explBody: "“Since two years” is wrong — use for two years or since 2024.", jp: "since に「長さ」は使えません。" }
    ]
  },

  g2: {
    key: "adverbs_of_emphasis",
    tr: "1.7",
    component: "grammar-2",
    title: "Adverbs of emphasis",
    jpTitle: "強調の副詞",
    short: "so / really / incredibly",
    role: "clause",
    rule: "Put an adverb of emphasis — so, very, really, incredibly, extremely, super, totally — in front of an adjective to make it stronger.",
    jpRule: "so・very・really・incredibly・extremely・super・totally などの副詞を形容詞の前に置くと、意味を強められます。",
    pattern: "subject + be + adverb of emphasis + adjective",
    jpPattern: "主語 + be動詞 + 強調の副詞 + 形容詞",
    intro: [
      { t: "Skateboarding is so exciting.", jp: "スケートボードはとてもわくわくします。" },
      { t: "That trick is incredibly scary.", jp: "あの技は信じられないほど怖いです。" },
      { t: "This boy's helmet looks totally cool.", jp: "この男の子のヘルメットは完全にかっこよく見えます。" }
    ],
    rows: [
      { form: "so", pattern: "be + so + adjective", example: "Skateboarding is so exciting.", jp: "スケートボードはとてもわくわくします。" },
      { form: "very", pattern: "be + very + adjective", example: "Skateboarding is very cool.", jp: "スケートボードはとてもかっこいいです。" },
      { form: "really", pattern: "be + really + adjective", example: "That trick is really dangerous.", jp: "あの技は本当に危険です。" },
      { form: "incredibly / extremely", pattern: "be + incredibly + adjective", example: "That trick is incredibly scary.", jp: "あの技は信じられないほど怖いです。" },
      { form: "super / totally", pattern: "look + super + adjective", example: "Those knee pads look super silly.", jp: "あのひざあては超おかしく見えます。" }
    ],
    noteRule: "The adverb goes in front of the adjective, never after it.",
    noteException: "Look and seem work like be: Those knee pads look extremely cool.",
    noteExceptionDetail: "Incredibly, extremely and totally are stronger than very. Super is informal — use it with friends, not in a report.",
    table: {
      title: "Adverbs of emphasis",
      columns: ["Subject", "be / look", "Adverb", "Adjective"],
      rows: [
        { cells: ["Skateboarding", "is", "so", "exciting."], roles: ["subject", "verb", "clause", "clause"] },
        { cells: ["That trick", "is", "really", "dangerous."], roles: ["subject", "verb", "clause", "clause"] },
        { cells: ["That trick", "is", "incredibly", "scary."], roles: ["subject", "verb", "clause", "clause"] },
        { cells: ["Those knee pads", "look", "extremely", "cool."], roles: ["subject", "verb", "clause", "clause"] }
      ],
      notes: [
        "Order is always adverb + adjective: incredibly scary, not scary incredibly.",
        "Do not stack two emphasis adverbs: say really scary, not very really scary."
      ]
    },
    samples: [
      { t: "Skateboarding is so exciting.", jp: "スケートボードはとてもわくわくします。", h: "so exciting" },
      { t: "Skateboarding is very cool.", jp: "スケートボードはとてもかっこいいです。", h: "very cool" },
      { t: "That trick is really dangerous.", jp: "あの技は本当に危険です。", h: "really dangerous" },
      { t: "That trick is incredibly scary.", jp: "あの技は信じられないほど怖いです。", h: "incredibly scary" },
      { t: "That trick is very difficult.", jp: "あの技はとても難しいです。", h: "very difficult" },
      { t: "Those knee pads look extremely cool.", jp: "あのひざあてはとてもかっこよく見えます。", h: "extremely cool" },
      { t: "Those knee pads look super silly.", jp: "あのひざあては超おかしく見えます。", h: "super silly" },
      { t: "This boy's helmet looks totally cool.", jp: "この男の子のヘルメットは完全にかっこよく見えます。", h: "totally cool" },
      { t: "Danny MacAskill is incredibly brave.", jp: "ダニー・マカスキルは信じられないほど勇敢です。", h: "incredibly brave" },
      { t: "Hang-gliding equipment is extremely expensive.", jp: "ハンググライダーの用具はとても高価です。", h: "extremely expensive" }
    ],
    levelup: {
      rules: [
        { title: "Put the adverb before the adjective", jpTitle: "副詞は形容詞の前に置く",
          sub: "The adverb always comes first, and the adjective comes second.", jpSub: "副詞が先、形容詞があとの順番です。",
          transforms: [["Skateboarding / exciting / so", "Skateboarding is so exciting."], ["That trick / scary / incredibly", "That trick is incredibly scary."]],
          examples: [{ t: "The waves are really big today.", jp: "今日は波が本当に大きいです。", h: "really big" },
                     { t: "The kite is extremely light.", jp: "そのカイトはとても軽いです。", h: "extremely light" }] },
        { title: "look and seem work like be", jpTitle: "look と seem は be動詞と同じように使う",
          sub: "You can use the same adverbs after look and seem.", jpSub: "look や seem のあとにも同じ副詞が使えます。",
          transforms: [["Those pads / silly / super", "Those pads look super silly."], ["His helmet / cool / totally", "His helmet looks totally cool."]],
          examples: [{ t: "That jump looks incredibly high.", jp: "あのジャンプは信じられないほど高く見えます。", h: "incredibly high" },
                     { t: "The track seems really muddy.", jp: "そのコースは本当にぬかるんで見えます。", h: "really muddy" }] },
        { title: "Choose the right strength", jpTitle: "強さを選ぶ",
          sub: "very < really < incredibly / extremely / totally. Super is informal.", jpSub: "very < really < incredibly / extremely / totally の順に強くなります。super はくだけた言い方です。",
          transforms: [["The equipment / expensive / extremely", "The equipment is extremely expensive."], ["Bethany / brave / incredibly", "Bethany is incredibly brave."]],
          examples: [{ t: "Serious accidents are extremely rare.", jp: "重大な事故は極めてまれです。", h: "extremely rare" },
                     { t: "The video was totally amazing.", jp: "その動画は完全にすばらしかったです。", h: "totally amazing" }] }
      ],
      mixed: [
        { t: "Lamine Yamal is incredibly skillful.", jp: "ラミン・ヤマルは信じられないほど上手です。", h: "incredibly skillful" },
        { t: "The Champions League final was really exciting.", jp: "チャンピオンズリーグ決勝は本当にわくわくしました。", h: "really exciting" },
        { t: "That motocross track looks extremely dangerous.", jp: "あのモトクロスのコースはとても危険に見えます。", h: "extremely dangerous" },
        { t: "Leo's new brakes are super quiet.", jp: "レオの新しいブレーキは超静かです。", h: "super quiet" },
        { t: "The Dark Knight is totally awesome.", jp: "『ダークナイト』は完全にすばらしいです。", h: "totally awesome" },
        { t: "Kitesurfing looks so difficult.", jp: "カイトサーフィンはとても難しそうに見えます。", h: "so difficult" }
      ]
    },
    quiz: [
      { stem: ["Skateboarding is ", " exciting."], answers: ["so", "much", "many", "well"], correct: 0, explTitle: "so + adjective", explBody: "So goes in front of the adjective to make it stronger.", jp: "スケートボードはとてもわくわくします。" },
      { stem: ["That trick is ", " dangerous."], answers: ["really", "real", "reality", "realness"], correct: 0, explTitle: "Use the adverb, not the adjective", explBody: "Really is the adverb; real is an adjective.", jp: "あの技は本当に危険です。" },
      { stem: ["Those knee pads look ", " cool."], answers: ["extremely", "extreme", "extremity", "extremes"], correct: 0, explTitle: "Adverb before adjective", explBody: "Extremely is the adverb form of extreme.", jp: "あのひざあてはとてもかっこよく見えます。" },
      { stem: ["Which is correct?", ""], answers: ["It is incredibly scary.", "It is scary incredibly.", "It incredibly is scary.", "Incredibly it scary is."], correct: 0, explTitle: "Word order", explBody: "be + adverb + adjective.", jp: "それは信じられないほど怖いです。" },
      { stem: ["This helmet looks ", " cool."], answers: ["totally", "total", "totality", "totals"], correct: 0, explTitle: "totally is the adverb", explBody: "Totally is the adverb form of total.", jp: "このヘルメットは完全にかっこよく見えます。" },
      { stem: ["Hang-gliding equipment is ", " expensive."], answers: ["very", "much", "lot", "too much"], correct: 0, explTitle: "very + adjective", explBody: "Very is the most common emphasis adverb.", jp: "ハンググライダーの用具はとても高価です。" },
      { stem: ["Which sentence is NOT correct?", ""], answers: ["The trick is very really hard.", "The trick is really hard.", "The trick is very hard.", "The trick is incredibly hard."], correct: 0, explTitle: "Do not stack two adverbs", explBody: "Use only one emphasis adverb at a time.", jp: "強調の副詞を2つ重ねてはいけません。" },
      { stem: ["Bethany Hamilton is ", " brave."], answers: ["incredibly", "incredible", "incredibility", "incredibles"], correct: 0, explTitle: "Adverb form", explBody: "Incredibly is the adverb; incredible is the adjective.", jp: "ベサニー・ハミルトンは信じられないほど勇敢です。" },
      { stem: ["Which adverb is the most informal?", ""], answers: ["super", "very", "extremely", "really"], correct: 0, explTitle: "super is informal", explBody: "Super is friendly, spoken English — not for reports.", jp: "super はくだけた言い方です。" },
      { stem: ["The video went viral because it was ", " amazing."], answers: ["so", "such", "much", "more"], correct: 0, explTitle: "so + adjective", explBody: "So goes before an adjective; such goes before a noun phrase.", jp: "その動画はとてもすばらしかったので拡散しました。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["Kitesurfing is really exciting.", "Kitesurfing is exciting really.", "Kitesurfing really is exciting so.", "Kitesurfing is real exciting."], correct: 0, explTitle: "adverb + adjective", explBody: "Really goes right before the adjective.", jp: "カイトサーフィンは本当にわくわくします。" },
      { stem: ["Choose the strongest sentence.", ""], answers: ["That jump is incredibly high.", "That jump is quite high.", "That jump is a little high.", "That jump is fairly high."], correct: 0, explTitle: "incredibly is the strongest here", explBody: "Incredibly is stronger than quite, a little or fairly.", jp: "incredibly が最も強い強調です。" },
      { stem: ["Which one works after “look”?", ""], answers: ["Those pads look super silly.", "Those pads look silly super.", "Those pads super look silly.", "Super those pads look silly."], correct: 0, explTitle: "look + adverb + adjective", explBody: "Look behaves like be here.", jp: "look のあとも副詞 + 形容詞の順です。" },
      { stem: ["Fix it: “The brakes are dangerous very.”", ""], answers: ["The brakes are very dangerous.", "The brakes very are dangerous.", "Very the brakes are dangerous.", "The brakes are dangerously very."], correct: 0, explTitle: "Move the adverb forward", explBody: "The adverb belongs before the adjective.", jp: "副詞は形容詞の前に置きます。" },
      { stem: ["Which word is an adjective, not an adverb?", ""], answers: ["extreme", "extremely", "incredibly", "really"], correct: 0, explTitle: "extreme is the adjective", explBody: "Extreme describes a noun; extremely describes an adjective.", jp: "extreme は形容詞です。" },
      { stem: ["Complete: “Serious accidents are ", " rare.”"], answers: ["extremely", "extreme", "extremeness", "extremer"], correct: 0, explTitle: "Adverb form needed", explBody: "Use extremely before the adjective rare.", jp: "重大な事故は極めてまれです。" },
      { stem: ["Which sentence emphasises the most?", ""], answers: ["The equipment is totally amazing.", "The equipment is okay.", "The equipment is fine.", "The equipment is all right."], correct: 0, explTitle: "totally amazing is the strongest", explBody: "Totally amazing carries the strongest emphasis.", jp: "totally amazing がいちばん強い表現です。" },
      { stem: ["Choose the correct word order.", ""], answers: ["His helmet looks totally cool.", "His helmet totally looks cool so.", "Totally his helmet cool looks.", "His helmet looks cool totally."], correct: 0, explTitle: "look + adverb + adjective", explBody: "Keep the order look + adverb + adjective.", jp: "look + 副詞 + 形容詞の順です。" },
      { stem: ["Which is best in a school report?", ""], answers: ["The results were extremely clear.", "The results were super clear.", "The results were totally clear, dude.", "The results were mega clear."], correct: 0, explTitle: "Choose the formal adverb", explBody: "Extremely is the formal choice; super and mega are informal.", jp: "レポートでは extremely が適切です。" },
      { stem: ["Complete: “The waves were ", " big that we stayed on the beach.”"], answers: ["so", "very", "really", "totally"], correct: 0, explTitle: "so ... that", explBody: "Only so pairs with that in the pattern so + adjective + that.", jp: "so + 形容詞 + that の形です。" }
    ]
  },

  reading: {
    tr: "1.8",
    title: "Cool Adventurers",
    jpTitle: "かっこいい冒険者たち",
    intro: "Danny MacAskill and Bethany Hamilton are two incredibly brave athletes who love being outdoors. Both have known success and failure in their lives.",
    paras: [
      { t: "Danny MacAskill is a skillful cyclist who flips off buildings and rides trains on his bicycle. He has often fallen out of trees and crashed since he began extreme cycling. He's been very lucky—serious accidents often happen to athletes, but he has only broken a few bones and twelve helmets. Every time he's in the hospital, he thinks of new places to ride.",
        q: "What has happened to Danny since he began extreme cycling?", opts: ["He has fallen out of trees and crashed.", "He has never had an accident.", "He has stopped cycling."], correct: 0, jp: "ダニーは木から落ちたり衝突したりしてきました。" },
      { t: "Born in 1985 in Scotland, he loved cycling as a kid, but he never expected to be famous. Then in 2009, a video of him appeared on YouTube. The video went viral. In 2012, he became a National Geographic “Adventurer of the Year.” Since then, he has made several more YouTube videos. His videos have been watched over a hundred million times!",
        q: "What happened in 2012?", opts: ["He became a National Geographic “Adventurer of the Year.”", "He was born in Scotland.", "His first video appeared."], correct: 0, jp: "2012年にナショナルジオグラフィックの「アドベンチャラー・オブ・ザ・イヤー」になりました。" },
      { t: "Super cool surfer Bethany Hamilton was born in Hawaii in 1990. She was already an extremely skillful surfer at the age of eight. But in 2003, when she was just thirteen years old, a shark attacked her, and she lost her left arm. Just one month after her injury, she was back in the water.",
        q: "How long after her injury did Bethany return to the water?", opts: ["One month", "One year", "Ten years"], correct: 0, jp: "けがの1か月後に水に戻りました。" },
      { t: "Since then, she has learned to surf with one arm. She needs more strength in her legs than other surfers because she only has one arm, but she has won competitions. She has written a book about her accident. The book became a movie in 2011. She got married in 2013 and had her second child, a boy, in 2018.",
        q: "Why does Bethany need more strength in her legs?", opts: ["Because she only has one arm", "Because she skis in winter", "Because her board is heavy"], correct: 0, jp: "片腕しかないので、脚の力がより必要だからです。" }
    ],
    strategy: {
      title: "Reading strategy — signal words for time",
      body: "Words like since, for, in 2012, then, and every time tell you when something happened and whether it is still true. Underline them as you read.",
      jp: "since・for・in 2012・then・every time などの語は、いつ起きたか、今も続いているかを教えてくれます。読みながら線を引きましょう。"
    },
    order: {
      title: "Put Bethany's life in order",
      items: [
        "Bethany was born in Hawaii in 1990.",
        "At eight she was already an extremely skillful surfer.",
        "In 2003 a shark attacked her and she lost her left arm.",
        "One month later she was back in the water.",
        "Her book became a movie in 2011.",
        "She got married in 2013."
      ]
    },
    quiz: [
      { q: "How many helmets has Danny broken?", opts: ["Twelve", "Two", "A hundred"], correct: 0, jp: "ダニーはヘルメットを12個壊しました。" },
      { q: "Where was Danny born?", opts: ["Scotland", "Hawaii", "Spain"], correct: 0, jp: "ダニーはスコットランド生まれです。" },
      { q: "What made Danny famous?", opts: ["A YouTube video that went viral", "A book", "A shark attack"], correct: 0, jp: "拡散した YouTube 動画で有名になりました。" },
      { q: "How old was Bethany when the shark attacked her?", opts: ["Thirteen", "Eight", "Twenty"], correct: 0, jp: "13歳のときでした。" },
      { q: "What did Bethany write about her accident?", opts: ["A book", "A song", "A poem"], correct: 0, jp: "彼女は事故について本を書きました。" },
      { q: "In what year did the book become a movie?", opts: ["2011", "2003", "2018"], correct: 0, jp: "2011年に映画になりました。" },
      { q: "What do Danny and Bethany have in common?", opts: ["Both have known success and failure.", "Both are cyclists.", "Both were born in Hawaii."], correct: 0, jp: "2人とも成功と失敗の両方を経験しています。" },
      { q: "“His videos have been watched over a hundred million times” is in the ___.", opts: ["present perfect", "simple past", "future"], correct: 0, jp: "現在完了形です。" }
    ]
  },

  writing: {
    genre: "A short biography",
    jpGenre: "短い伝記",
    modelTitle: "My Sports Hero",
    model: [
      "Lamine Yamal is an incredibly skillful winger. He was born in Spain in 2007.",
      "He has played for Barcelona since he was a small boy, and he has been in the first team since 2023.",
      "He needs strength in his legs and quick feet. He has won trophies with Barcelona and with Spain.",
      "Lamine Yamal is my sports hero because he shows that young players can be really brave."
    ],
    modelJp: "ラミン・ヤマルはとても上手なウインガーです。2007年にスペインで生まれました。小さい頃からバルセロナでプレーし、2023年からトップチームにいます。",
    steps: [
      { t: "Choose your athlete and say what sport they do.", jp: "選手を選び、どのスポーツをするか書く。" },
      { t: "Give the facts: where and when they were born.", jp: "事実を書く：いつ、どこで生まれたか。" },
      { t: "Use the present perfect with for or since to say how long.", jp: "for / since と現在完了形で「どのくらい」を書く。" },
      { t: "Use an adverb of emphasis to say why they are special.", jp: "強調の副詞を使って、なぜ特別なのかを書く。" }
    ],
    expressions: [
      { t: "___ was born in ___ in ____.", jp: "〜は〜年に〜で生まれました。" },
      { t: "He/She has ___ since ____.", jp: "彼／彼女は〜年から〜しています。" },
      { t: "He/She has ___ for ___ years.", jp: "彼／彼女は〜年間〜しています。" },
      { t: "___ is incredibly ___ because ___.", jp: "〜は〜なのでとても〜です。" }
    ],
    checklist: [
      "I used the present perfect with for or since at least twice.",
      "I used one adverb of emphasis (so, really, incredibly, extremely).",
      "I gave the year my athlete was born.",
      "I checked has for he/she/it and have for I/you/we/they."
    ],
    quiz: [
      { q: "Which sentence belongs in a biography?", opts: ["He was born in Scotland in 1985.", "I like pizza.", "Turn left at the shop."], correct: 0, jp: "伝記には生まれた場所と年を書きます。" },
      { q: "Choose the correct present perfect.", opts: ["She has surfed since 2003.", "She has surf since 2003.", "She have surfed since 2003."], correct: 0, jp: "has + 過去分詞が正しい形です。" },
      { q: "Which adverb of emphasis is the most formal?", opts: ["extremely", "super", "mega"], correct: 0, jp: "extremely が最も改まった言い方です。" },
      { q: "Which is the best closing sentence?", opts: ["He is my sports hero because he never gives up.", "The end.", "That's all I know."], correct: 0, jp: "理由を添えて締めくくります。" },
      { q: "“for” goes with ___.", opts: ["a length of time", "a year", "a person"], correct: 0, jp: "for は期間の長さと使います。" },
      { q: "“since” goes with ___.", opts: ["a starting point", "a length of time", "an adjective"], correct: 0, jp: "since は始まった時点と使います。" },
      { q: "Which sentence uses an adverb of emphasis correctly?", opts: ["She is incredibly brave.", "She is brave incredibly.", "She incredibly is brave."], correct: 0, jp: "副詞は形容詞の前に置きます。" },
      { q: "A biography is written about ___.", opts: ["a real person's life", "an imaginary robot", "a recipe"], correct: 0, jp: "伝記は実在の人物の人生について書きます。" }
    ]
  }
};
