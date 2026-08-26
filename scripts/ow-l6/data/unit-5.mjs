/* Our World Level 6 · Unit 5 — It's a Small World
   Source: Student's Book audio script TR 5.1-5.8. */
export default {
  unit: 5,
  title: "It's a Small World",
  jpTitle: "小さな世界",
  themeEmoji: "🔬",
  slug: "its-a-small-world",

  opener: {
    tr: "5.1",
    intro:
      "We share our planet with millions of small creatures: cool spiders, beautiful striped butterflies, ugly bugs, cute hamsters, and fascinating fish. Can you think of more little creatures that live on Earth?",
    goals: [
      { en: "Describe tiny creatures and where they live.", jp: "小さな生き物と、そのすみかを説明する。" },
      { en: "Use reported speech to say what someone said.", jp: "話法を使って、だれかが言ったことを伝える。" },
      { en: "Put adjectives in the right order.", jp: "形容詞を正しい順番に並べる。" },
      { en: "Compare sizes in millimeters and centimeters.", jp: "ミリメートルとセンチメートルで大きさを比べる。" },
      { en: "Read about One Cubic Foot and explain the results.", jp: "「1立方フィート」について読み、その結果を説明する。" }
    ],
    photoCards: [
      { emoji: "👁️", title: "Eyelash mites", text: "Eyelash mites are 0.3 millimeters long. You can only see them through a microscope. They look horrible, but they're very common. Habitat: our eyelashes. These organisms eat dead skin cells and crawl around our skin at night.", jp: "まつげダニは0.3ミリメートル。顕微鏡でしか見えません。気持ち悪く見えますが、とてもふつうにいます。すみかは私たちのまつげ。死んだ皮膚の細胞を食べ、夜に肌をはい回ります。" },
      { emoji: "🐴", title: "The pygmy seahorse", text: "This seahorse is an orange fish that's just sixteen millimeters long. It's smaller than a human's tooth and has a long thin tail. Habitat: warm water, near coral. It uses camouflage and grabs food that floats by. Male seahorses have babies.", jp: "このタツノオトシゴは体長わずか16ミリのオレンジ色の魚です。人の歯より小さく、長く細い尾を持ちます。すみかはサンゴの近くの暖かい海。カモフラージュを使い、流れてくる食べ物をつかみます。子どもを産むのはオスです。" },
      { emoji: "🐦", title: "The bee hummingbird", text: "The male bee hummingbird is the smallest bird in the world. It's about five and a half centimeters long. The female is bigger. Its eggs are smaller than coffee beans. It can move its strong wings eighty times a second.", jp: "オスのマメハチドリは世界最小の鳥で、体長約5.5センチ。メスのほうが大きいです。卵はコーヒー豆より小さく、強い翼を1秒に80回動かせます。" },
      { emoji: "🔬", title: "Look closer", text: "Millions of small creatures share our planet. Most of them are too small to see without a microscope.", jp: "何百万もの小さな生き物が地球を共有しています。その多くは顕微鏡なしでは見えません。" }
    ],
    lookAndCheck: [
      { q: "How long is an eyelash mite?", opts: ["0.3 millimeters", "3 centimeters", "30 millimeters"], correct: 0, jp: "0.3ミリメートルです。" },
      { q: "Where do eyelash mites live?", opts: ["On our eyelashes", "In warm water", "Near flowers"], correct: 0, jp: "私たちのまつげにすんでいます。" },
      { q: "Which seahorse has the babies?", opts: ["The male", "The female", "Neither"], correct: 0, jp: "オスが子どもを産みます。" },
      { q: "How fast can a bee hummingbird move its wings?", opts: ["Eighty times a second", "Eight times a second", "Eight times a minute"], correct: 0, jp: "1秒に80回です。" }
    ],
    sort: {
      title: "Which habitat?",
      zones: [
        { id: "body", label: "🧍 On a human" },
        { id: "water", label: "🌊 In the water" },
        { id: "air", label: "🌸 Near flowers" }
      ],
      tiles: [
        { text: "an eyelash mite", zone: "body" },
        { text: "dead skin cells", zone: "body" },
        { text: "a pygmy seahorse", zone: "water" },
        { text: "coral", zone: "water" },
        { text: "a transparent octopus", zone: "water" },
        { text: "a bee hummingbird", zone: "air" },
        { text: "a butterfly", zone: "air" },
        { text: "a bee", zone: "air" }
      ]
    },
    quiz: [
      { q: "What do you need to see an eyelash mite?", opts: ["A microscope", "A telescope", "Nothing"], correct: 0, jp: "顕微鏡が必要です。" },
      { q: "What do eyelash mites eat?", opts: ["Dead skin cells", "Coffee beans", "Coral"], correct: 0, jp: "死んだ皮膚の細胞を食べます。" },
      { q: "How long is the pygmy seahorse?", opts: ["Sixteen millimeters", "Sixteen centimeters", "Sixty millimeters"], correct: 0, jp: "16ミリメートルです。" },
      { q: "What does the seahorse use to hide?", opts: ["Camouflage", "A shell", "A microscope"], correct: 0, jp: "カモフラージュを使います。" },
      { q: "Which is bigger, the male or female bee hummingbird?", opts: ["The female", "The male", "They are the same"], correct: 0, jp: "メスのほうが大きいです。" },
      { q: "Bee hummingbird eggs are smaller than ___.", opts: ["coffee beans", "footballs", "coral"], correct: 0, jp: "コーヒー豆より小さいです。" },
      { q: "Eyelash mites are ___.", opts: ["very common", "very rare", "extinct"], correct: 0, jp: "とてもふつうにいます。" },
      { q: "The pygmy seahorse is smaller than ___.", opts: ["a human's tooth", "a hand", "a coffee cup"], correct: 0, jp: "人の歯より小さいです。" }
    ]
  },

  v1: {
    tr: "5.2",
    words: [
      { w: "a millimeter", norm: "millimeter", emoji: "📏", ipa: "ˈmɪləmiːtər", syl: "mil-li-me-ter", pos: "noun", mean: "a very small unit of length — one thousandth of a meter.", jw: "ミリメートル", jr: "みりめーとる", jm: "とても小さい長さの単位。1メートルの1000分の1。",
        tr: "Wow, it's only one millimeter long.",
        ex: [["Wow, it's only one millimeter long.", "わあ、たった1ミリメートルの長さです。"],
             ["Eyelash mites are 0.3 millimeters long.", "まつげダニは0.3ミリメートルの長さです。"],
             ["He photographed everything down to one millimeter in size.", "彼は1ミリメートルの大きさのものまですべて撮影しました。"]] },
      { w: "a microscope", norm: "microscope", emoji: "🔬", ipa: "ˈmaɪkrəskoʊp", syl: "mi-cro-scope", pos: "noun", mean: "a tool that makes very small things look much bigger.", jw: "顕微鏡", jr: "けんびきょう", jm: "とても小さいものを大きく見せる道具。",
        tr: "I can't see anything. We need a microscope.",
        ex: [["I can't see anything. We need a microscope.", "何も見えません。顕微鏡が必要です。"],
             ["You can only see them through a microscope.", "それらは顕微鏡でしか見えません。"],
             ["Look into a microscope and tell me what you see.", "顕微鏡をのぞいて、何が見えるか教えてください。"]] },
      { w: "horrible", norm: "horrible", emoji: "😱", ipa: "ˈhɔːrəbəl", syl: "hor-ri-ble", pos: "adjective", mean: "very unpleasant to look at or think about.", jw: "ひどい", jr: "ひどい", jm: "見たり考えたりするのがとても不快なこと。",
        tr: "Spiders are horrible. I don't like them at all.",
        ex: [["Spiders are horrible. I don't like them at all.", "クモはひどいです。まったく好きではありません。"],
             ["They look horrible, but they're very common.", "見た目はひどいですが、とてもふつうにいます。"],
             ["Some look like strange monsters with horrible eyes.", "中には恐ろしい目をした変な怪物のようなものもいます。"]] },
      { w: "common", norm: "common", emoji: "🐜", ipa: "ˈkɑːmən", syl: "com-mon", pos: "adjective", mean: "happening often or found in many places.", jw: "ふつうの", jr: "ふつうの", jm: "よく起こる、または多くの場所で見られること。",
        tr: "Ants are very common at a picnic.",
        ex: [["Ants are very common at a picnic.", "アリはピクニックでとてもよく見かけます。"],
             ["They look horrible, but they're very common.", "見た目はひどいですが、とてもふつうにいます。"],
             ["This is a common red bug with a spotted back.", "これは背中に斑点のあるふつうの赤い虫です。"]] },
      { w: "habitat", norm: "habitat", emoji: "🏞️", ipa: "ˈhæbɪtæt", syl: "hab-i-tat", pos: "noun", mean: "the natural place where a plant or animal lives.", jw: "生息地", jr: "せいそくち", jm: "植物や動物が自然にすんでいる場所。",
        tr: "What kind of habitats do lions live in?",
        ex: [["What kind of habitats do lions live in?", "ライオンはどんな生息地にすんでいますか。"],
             ["Habitat: warm water, near coral.", "生息地：サンゴの近くの暖かい海。"],
             ["There are tiny habitats where predator and prey meet.", "捕食者と獲物が出会う小さな生息地があります。"]] },
      { w: "an organism", norm: "organism", emoji: "🦠", ipa: "ˈɔːrɡənɪzəm", syl: "or-gan-ism", pos: "noun", mean: "any living thing, big or small.", jw: "生物", jr: "せいぶつ", jm: "大きくても小さくても、生きているもの。",
        tr: "An organism is a living thing. It can be a plant or an animal.",
        ex: [["An organism is a living thing. It can be a plant or an animal.", "生物とは生きているもののことです。植物でも動物でもかまいません。"],
             ["These organisms eat dead skin cells.", "これらの生物は死んだ皮膚の細胞を食べます。"],
             ["More than a thousand different organisms were photographed.", "1,000種類以上の生物が撮影されました。"]] },
      { w: "a cell", norm: "cell", emoji: "🧫", ipa: "sel", syl: "cell", pos: "noun", mean: "the smallest living part of a plant or animal.", jw: "細胞", jr: "さいぼう", jm: "植物や動物の最も小さい生きた部分。",
        tr: "Humans have trillions of cells in their bodies.",
        ex: [["Humans have trillions of cells in their bodies.", "人間の体には何兆もの細胞があります。"],
             ["These organisms eat dead skin cells.", "これらの生物は死んだ皮膚の細胞を食べます。"],
             ["Every cell is far too small to see.", "細胞はどれも見るには小さすぎます。"]] },
      { w: "a human", norm: "human", emoji: "🧍", ipa: "ˈhjuːmən", syl: "hu-man", pos: "noun", mean: "a person.", jw: "人間", jr: "にんげん", jm: "人のこと。",
        tr: "Monkeys have some characteristics similar to humans.",
        ex: [["Monkeys have some characteristics similar to humans.", "サルは人間と似た特徴をいくつか持っています。"],
             ["It's smaller than a human's tooth.", "それは人の歯より小さいです。"],
             ["Creatures smaller than a human hair live in our world.", "人の髪より小さい生き物が私たちの世界にすんでいます。"]] },
      { w: "thin", norm: "thin", emoji: "📉", ipa: "θɪn", syl: "thin", pos: "adjective", mean: "narrow — not wide or fat.", jw: "細い", jr: "ほそい", jm: "幅がせまく、太くないこと。",
        tr: "Giraffes have long, thin necks.",
        ex: [["Giraffes have long, thin necks.", "キリンは長く細い首をしています。"],
             ["It has a long thin tail.", "それは長く細い尾を持っています。"],
             ["This ant has six long thin legs.", "このアリは6本の長く細い脚を持っています。"]] },
      { w: "grab", norm: "grab", emoji: "🤏", ipa: "ɡræb", syl: "grab", pos: "verb", mean: "to take hold of something quickly.", jw: "つかむ", jr: "つかむ", jm: "すばやく何かを手に取ること。",
        tr: "Elephants grab things with their trunks.",
        ex: [["Elephants grab things with their trunks.", "ゾウは鼻で物をつかみます。"],
             ["It grabs food that floats by.", "それは流れてくる食べ物をつかみます。"],
             ["He grabbed the rope before he fell.", "彼は落ちる前にロープをつかみました。"]] },
      { w: "male", norm: "male", emoji: "♂️", ipa: "meɪl", syl: "male", pos: "adjective", mean: "of the sex that does not have babies in most animals.", jw: "オスの", jr: "おすの", jm: "多くの動物で子どもを産まないほうの性。",
        tr: "My dad, my uncle, and my brother are male.",
        ex: [["My dad, my uncle, and my brother are male.", "父も、おじも、兄も男性です。"],
             ["Male seahorses have babies.", "タツノオトシゴはオスが子どもを産みます。"],
             ["The male bee hummingbird is the smallest bird in the world.", "オスのマメハチドリは世界最小の鳥です。"]] },
      { w: "a centimeter", norm: "centimeter", emoji: "📐", ipa: "ˈsentɪmiːtər", syl: "cen-ti-me-ter", pos: "noun", mean: "a unit of length equal to ten millimeters.", jw: "センチメートル", jr: "せんちめーとる", jm: "10ミリメートルにあたる長さの単位。",
        tr: "Some birds are very small. They're only 5 centimeters long!",
        ex: [["Some birds are very small. They're only 5 centimeters long!", "とても小さい鳥もいます。たった5センチメートルです！"],
             ["It's about five and a half centimeters long.", "それは約5.5センチメートルの長さです。"],
             ["One centimeter is ten millimeters.", "1センチメートルは10ミリメートルです。"]] },
      { w: "female", norm: "female", emoji: "♀️", ipa: "ˈfiːmeɪl", syl: "fe-male", pos: "adjective", mean: "of the sex that has babies in most animals.", jw: "メスの", jr: "めすの", jm: "多くの動物で子どもを産むほうの性。",
        tr: "My mom, my aunt, and my sister are female.",
        ex: [["My mom, my aunt, and my sister are female.", "母も、おばも、姉も女性です。"],
             ["The female bee hummingbird is bigger than the male.", "メスのマメハチドリはオスより大きいです。"],
             ["This female mummy was found in a tomb in Peru.", "この女性のミイラはペルーの墓で見つかりました。"]] }
    ]
  },

  v2: {
    tr: "5.5",
    words: [
      { w: "adult", norm: "adult", emoji: "🧑", ipa: "əˈdʌlt", syl: "a-dult", pos: "adjective", mean: "fully grown, not young any more.", jw: "おとなの", jr: "おとなの", jm: "すっかり成長して、もう若くないこと。",
        tr: "Did you know that adult elephants grow?",
        ex: [["Did you know that adult elephants grow?", "おとなのゾウも成長すると知っていましたか。"],
             ["Common adult spotted bugs are easy to find.", "斑点のあるおとなの虫はよく見つかります。"],
             ["An adult seahorse is still only sixteen millimeters long.", "おとなのタツノオトシゴでもわずか16ミリメートルです。"]] },
      { w: "tiny", norm: "tiny", emoji: "🐜", ipa: "ˈtaɪni", syl: "ti-ny", pos: "adjective", mean: "extremely small.", jw: "とても小さい", jr: "とてもちいさい", jm: "きわめて小さいこと。",
        tr: "We need a microscope to see this creature. It's tiny!",
        ex: [["We need a microscope to see this creature. It's tiny!", "この生き物を見るには顕微鏡が必要です。とても小さいのです！"],
             ["There's a tiny world in front of us.", "目の前には小さな世界があります。"],
             ["You can only see these tiny gray organisms under a microscope.", "この小さな灰色の生物は顕微鏡でしか見えません。"]] },
      { w: "pointed", norm: "pointed", emoji: "📌", ipa: "ˈpɔɪntɪd", syl: "point-ed", pos: "adjective", mean: "having a sharp, narrow end.", jw: "とがった", jr: "とがった", jm: "先が鋭く細くなっていること。",
        tr: "Some seahorses have a long pointed tail.",
        ex: [["Some seahorses have a long pointed tail.", "長くとがった尾を持つタツノオトシゴもいます。"],
             ["Stalactites are pointed and hang from the ceiling.", "鍾乳石はとがっていて天井からぶら下がっています。"],
             ["Look at the amazing red pointed tail on this creature.", "この生き物の見事な赤いとがった尾を見てください。"]] },
      { w: "furry", norm: "furry", emoji: "🐰", ipa: "ˈfɜːri", syl: "fur-ry", pos: "adjective", mean: "covered in soft hair.", jw: "毛でおおわれた", jr: "けでおおわれた", jm: "やわらかい毛におおわれていること。",
        tr: "I love rabbits. They're soft and furry.",
        ex: [["I love rabbits. They're soft and furry.", "私はウサギが大好きです。やわらかくて毛がふわふわです。"],
             ["Cute young striped furry creatures live here.", "かわいくて若い、しま模様の毛におおわれた生き物がここにいます。"],
             ["Look at this wonderful creature's soft furry ears.", "このすばらしい生き物のやわらかい毛の耳を見てください。"]] },
      { w: "strange", norm: "strange", emoji: "🛸", ipa: "streɪndʒ", syl: "strange", pos: "adjective", mean: "unusual and surprising.", jw: "変わった", jr: "かわった", jm: "ふつうと違っていて驚くこと。",
        tr: "What's that animal? It's beautiful, but it's so strange!",
        ex: [["What's that animal? It's beautiful, but it's so strange!", "あの動物は何ですか。美しいけれど、とても変わっています！"],
             ["He discovered a strange transparent octopus.", "彼は変わった透明なタコを発見しました。"],
             ["Some look like strange monsters with jaws and claws.", "あごや爪を持つ変な怪物のように見えるものもいます。"]] },
      { w: "spotted", norm: "spotted", emoji: "🐞", ipa: "ˈspɑːtɪd", syl: "spot-ted", pos: "adjective", mean: "covered in small round marks.", jw: "斑点のある", jr: "はんてんのある", jm: "小さな丸い模様がついていること。",
        tr: "This bug has a spotted back. It's beautiful.",
        ex: [["This bug has a spotted back. It's beautiful.", "この虫は背中に斑点があります。美しいです。"],
             ["It is a painting of a spotted horse.", "それは斑点のある馬の絵です。"],
             ["Common adult spotted bugs live in the garden.", "斑点のあるおとなの虫が庭にすんでいます。"]] }
    ]
  },

  academic: ["characteristics", "classify", "compare", "describe", "observe"],

  content: [
    { w: "a species", norm: "species", emoji: "🦋", ipa: "ˈspiːʃiːz", syl: "spe-cies", pos: "noun", mean: "one kind of animal or plant.", jw: "種", jr: "しゅ", jm: "動物や植物の一つの種類。",
      ex: [["There are about 1.5 million species on Earth.", "地球にはおよそ150万種がいます。"],
           ["Eighty percent of the world's species are insects.", "世界の種の80パーセントは昆虫です。"],
           ["He also discovered many new species.", "彼は新しい種もたくさん発見しました。"]] },
    { w: "camouflage", norm: "camouflage", emoji: "🎨", ipa: "ˈkæməflɑːʒ", syl: "cam-ou-flage", pos: "noun", mean: "colours or patterns that make an animal hard to see.", jw: "カモフラージュ", jr: "かもふらーじゅ", jm: "動物を見つけにくくする色や模様。",
      ex: [["It uses camouflage to hide near the coral.", "それはサンゴの近くに隠れるためカモフラージュを使います。"],
           ["Good camouflage keeps a tiny creature alive.", "よいカモフラージュは小さな生き物の命を守ります。"],
           ["Without camouflage, a seahorse is easy to spot.", "カモフラージュがなければ、タツノオトシゴは簡単に見つかります。"]] },
    { w: "biodiversity", norm: "biodiversity", emoji: "🌍", ipa: "ˌbaɪoʊdaɪˈvɜːrsəti", syl: "bi-o-di-ver-si-ty", pos: "noun", mean: "the number of different living things in one place.", jw: "生物多様性", jr: "せいぶつたようせい", jm: "一つの場所にいる生き物の種類の多さ。",
      ex: [["The coral reef had the most biodiversity.", "サンゴ礁がいちばん生物多様性がありました。"],
           ["Even a city park has real biodiversity.", "町の公園にも本当の生物多様性があります。"],
           ["Biodiversity means many different species live together.", "生物多様性とは多くの種がともに暮らしていることです。"]] },
    { w: "transparent", norm: "transparent", emoji: "🫧", ipa: "trænsˈpærənt", syl: "trans-par-ent", pos: "adjective", mean: "clear enough to see through.", jw: "透明な", jr: "とうめいな", jm: "向こうが見えるほど澄んでいること。",
      ex: [["He discovered a strange transparent octopus.", "彼は変わった透明なタコを発見しました。"],
           ["A transparent creature is very hard to photograph.", "透明な生き物は撮影がとても難しいです。"],
           ["The transparent body made it almost invisible.", "透明な体のおかげでほとんど見えませんでした。"]] },
    { w: "a predator", norm: "predator", emoji: "🦅", ipa: "ˈpredətər", syl: "pred-a-tor", pos: "noun", mean: "an animal that hunts and eats other animals.", jw: "捕食者", jr: "ほしょくしゃ", jm: "ほかの動物をとらえて食べる動物。",
      ex: [["There are tiny habitats where predator and prey have tiny battles.", "捕食者と獲物が小さな戦いをする小さな生息地があります。"],
           ["Every predator is prey for something bigger.", "どの捕食者も、より大きなものにとっては獲物です。"],
           ["A spider is a predator in the world of insects.", "クモは昆虫の世界では捕食者です。"]] }
  ],

  song: {
    tr: "5.3",
    title: "Look into a Microscope",
    jpTitle: "顕微鏡をのぞいて",
    lyrics: [
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "Look into a microscope.", jp: "顕微鏡をのぞいて。" },
      { t: "Tell me what you see.", jp: "何が見えるか教えて。" },
      { t: "There's a tiny world in front of us,", jp: "目の前には小さな世界がある、" },
      { t: "full of tiny things to see.", jp: "小さなもので満ちている。" },
      { t: "Let's take a look.", jp: "見てみよう。" },
      { t: "My teacher said that creatures", jp: "先生が言っていた、生き物は" },
      { t: "smaller than a human hair", jp: "人の髪より小さくて" },
      { t: "live in our world.", jp: "私たちの世界にすんでいると。" },
      { t: "She said we'd find them everywhere!", jp: "どこにでもいると言っていた！" },
      { t: "Some look like strange monsters,", jp: "変な怪物のように見えるものもいる、" },
      { t: "with jaws, and claws, and horrible eyes.", jp: "あごや爪、恐ろしい目を持って。" },
      { t: "But don't forget how small they are.", jp: "でもどれだけ小さいか忘れないで。" },
      { t: "Don't forget their size.", jp: "その大きさを忘れないで。" },
      { t: "There are tiny habitats", jp: "小さな生息地がある" },
      { t: "where predator and prey", jp: "そこでは捕食者と獲物が" },
      { t: "have tiny little battles", jp: "小さな戦いをしている" },
      { t: "every minute of the day.", jp: "一日じゅう、毎分。" },
      { t: "Mites live on our eyelashes!", jp: "ダニは私たちのまつげにすんでいる！" }
    ],
    tapWords: ["microscope", "tiny", "creatures", "human", "horrible", "habitats", "Mites", "world"],
    quiz: [
      { q: "What does the singer ask you to look into?", opts: ["A microscope", "A telescope", "A mirror"], correct: 0, jp: "顕微鏡です。" },
      { q: "“My teacher said that creatures live in our world” is an example of ___.", opts: ["reported speech", "a question", "the passive voice"], correct: 0, jp: "話法（間接話法）の例です。" },
      { q: "How small are the creatures the teacher describes?", opts: ["Smaller than a human hair", "Bigger than a hand", "As big as a cat"], correct: 0, jp: "人の髪より小さいです。" },
      { q: "What do the strange monsters have?", opts: ["Jaws, claws and horrible eyes", "Wings and feathers", "Wheels"], correct: 0, jp: "あご、爪、恐ろしい目です。" },
      { q: "Who has tiny battles in tiny habitats?", opts: ["Predator and prey", "Teachers and students", "Birds and planes"], correct: 0, jp: "捕食者と獲物です。" },
      { q: "Where do mites live, according to the song?", opts: ["On our eyelashes", "In the sea", "In a microscope"], correct: 0, jp: "私たちのまつげにすんでいます。" }
    ]
  },

  g1: {
    key: "reported_speech_statements",
    tr: "5.4",
    component: "grammar-1",
    title: "Reported speech: Statements",
    jpTitle: "話法：平叙文",
    short: "said that…",
    role: "clause",
    rule: "To report what someone said, use said (that) and move the verb one step into the past: is → was, don't → didn't, can → could.",
    jpRule: "だれかの発言を伝えるときは said (that) を使い、動詞を1つ過去にずらします。is → was、don't → didn't、can → could。",
    pattern: "subject + said (that) + subject + past verb",
    jpPattern: "主語 + said (that) + 主語 + 過去形の動詞",
    intro: [
      { t: "My dad said that the red beetle was really cool.", jp: "父は、その赤いカブトムシは本当にかっこいいと言いました。" },
      { t: "My mom said she didn't like things that crawled on her head.", jp: "母は、頭をはうものは好きではないと言いました。" },
      { t: "My teacher said that she could see the eyelash mite through the microscope.", jp: "先生は、顕微鏡でまつげダニが見えると言いました。" }
    ],
    rows: [
      { form: "is / are → was / were", pattern: "“It is cool.” → He said that it was cool.", example: "My dad said that the red beetle was really cool.", jp: "父はその赤いカブトムシは本当にかっこいいと言いました。" },
      { form: "don't → didn't", pattern: "“I don't like it.” → She said she didn't like it.", example: "My mom said she didn't like things that crawled on her head.", jp: "母は頭をはうものは好きではないと言いました。" },
      { form: "can → could", pattern: "“I can see it.” → She said she could see it.", example: "My teacher said that she could see the eyelash mite.", jp: "先生はまつげダニが見えると言いました。" },
      { form: "you → I / me", pattern: "pronouns change to match the new speaker", example: "Ben said that I was wrong.", jp: "ベンは私が間違っていると言いました。" },
      { form: "that is optional", pattern: "said that … = said …", example: "My mom said she didn't like things that crawled on her head.", jp: "that は省略できます。" }
    ],
    noteRule: "Reported speech has no quotation marks. The words move one step back in time.",
    noteException: "Pronouns change too: “You are wrong” becomes he said that I was wrong.",
    noteExceptionDetail: "That can be left out with no change in meaning: She said she could see it.",
    table: {
      title: "Direct speech → reported speech",
      columns: ["Someone said", "You report it"],
      rows: [
        { cells: ["“The red beetle is really cool.”", "My dad said that the red beetle was really cool."], roles: [null, "clause"] },
        { cells: ["“I don't like things that crawl on my head.”", "My mom said she didn't like things that crawled on her head."], roles: [null, "clause"] },
        { cells: ["“I can see the eyelash mite through the microscope.”", "My teacher said that she could see the eyelash mite through the microscope."], roles: [null, "clause"] },
        { cells: ["“You are wrong.”", "Ben said that I was wrong."], roles: [null, "clause"] }
      ],
      notes: [
        "Move the verb one step into the past.",
        "Change the pronouns so they still point at the right people."
      ]
    },
    samples: [
      { t: "My dad said that the red beetle was really cool.", jp: "父は、その赤いカブトムシは本当にかっこいいと言いました。", h: "said that the red beetle was" },
      { t: "My mom said she didn't like things that crawled on her head.", jp: "母は、頭をはうものは好きではないと言いました。", h: "said she didn't like" },
      { t: "My teacher said that she could see the eyelash mite through the microscope.", jp: "先生は、顕微鏡でまつげダニが見えると言いました。", h: "said that she could see" },
      { t: "Ben said that I was wrong.", jp: "ベンは私が間違っていると言いました。", h: "said that I was wrong" },
      { t: "My teacher said that creatures smaller than a human hair live in our world.", jp: "先生は、人の髪より小さい生き物が私たちの世界にいると言いました。", h: "said that creatures" },
      { t: "She said we'd find them everywhere.", jp: "彼女は、どこにでも見つかると言いました。", h: "said we'd find them" },
      { t: "Liittschwager said the One Cubic Foot experience was like finding treasure.", jp: "リッチュワガーは、「1立方フィート」の体験は宝探しのようだったと言いました。", h: "said the One Cubic Foot experience was" },
      { t: "The scientist said that the octopus was transparent.", jp: "その科学者は、そのタコは透明だと言いました。", h: "said that the octopus was" },
      { t: "Leo said that he could count six legs on the ant.", jp: "レオは、アリの脚を6本数えられたと言いました。", h: "said that he could count" },
      { t: "Dad said that spiders weren't horrible at all.", jp: "父は、クモはまったくひどくないと言いました。", h: "said that spiders weren't" }
    ],
    levelup: {
      rules: [
        { title: "Move the verb one step back", jpTitle: "動詞を1つ過去にずらす",
          sub: "is → was, are → were, like → liked, crawl → crawled.", jpSub: "is → was、are → were、like → liked、crawl → crawled。",
          transforms: [["“The red beetle is really cool.”", "My dad said that the red beetle was really cool."], ["“Ants are common.”", "She said that ants were common."]],
          examples: [{ t: "She said that ants were common at a picnic.", jp: "彼女は、ピクニックではアリがふつうにいると言いました。", h: "said that ants were" },
                     { t: "He said the mite looked horrible.", jp: "彼は、そのダニはひどく見えると言いました。", h: "said the mite looked" }] },
        { title: "can becomes could, don't becomes didn't", jpTitle: "can は could、don't は didn't になる",
          sub: "Modals and negatives shift back too.", jpSub: "助動詞や否定形も1つ過去にずれます。",
          transforms: [["“I can see the mite.”", "She said that she could see the mite."], ["“I don't like it.”", "She said she didn't like it."]],
          examples: [{ t: "My teacher said that she could see the eyelash mite.", jp: "先生はまつげダニが見えると言いました。", h: "said that she could see" },
                     { t: "My mom said she didn't like spiders.", jp: "母はクモが好きではないと言いました。", h: "said she didn't like" }] },
        { title: "Change the pronouns", jpTitle: "代名詞を変える",
          sub: "The speaker changes, so I, you, my and your have to change with them.", jpSub: "話し手が変わるので I・you・my・your も変えます。",
          transforms: [["“You are wrong.”", "Ben said that I was wrong."], ["“I don't like things that crawl on my head.”", "She said she didn't like things that crawled on her head."]],
          examples: [{ t: "Ben said that I was wrong.", jp: "ベンは私が間違っていると言いました。", h: "said that I was wrong" },
                     { t: "Leo said that his favourite creature was the seahorse.", jp: "レオは、いちばん好きな生き物はタツノオトシゴだと言いました。", h: "said that his favourite creature was" }] }
      ],
      mixed: [
        { t: "Dad said that Haaland was the best striker in the Premier League.", jp: "父は、ハーランドがプレミアリーグ最高のストライカーだと言いました。", h: "said that Haaland was" },
        { t: "The guide said that the cave had thousands of stalactites.", jp: "ガイドは、その洞窟には何千もの鍾乳石があると言いました。", h: "said that the cave had" },
        { t: "Mom said she couldn't see anything without a microscope.", jp: "母は、顕微鏡がないと何も見えないと言いました。", h: "said she couldn't see" },
        { t: "The photographer said that the cube was full of life.", jp: "その写真家は、立方体は生き物でいっぱいだと言いました。", h: "said that the cube was" },
        { t: "My sister said that she didn't want to touch the bug.", jp: "姉は、その虫にはさわりたくないと言いました。", h: "said that she didn't want" },
        { t: "Leo said that the hummingbird's eggs were smaller than coffee beans.", jp: "レオは、ハチドリの卵はコーヒー豆より小さいと言いました。", h: "said that the hummingbird's eggs were" }
      ]
    },
    quiz: [
      { stem: ["“The red beetle is really cool.” → My dad said that the red beetle ", " really cool."], answers: ["was", "is", "were", "be"], correct: 0, explTitle: "is → was", explBody: "Move the verb one step into the past.", jp: "is は was になります。" },
      { stem: ["“I don't like it.” → She said she ", " like it."], answers: ["didn't", "doesn't", "don't", "wasn't"], correct: 0, explTitle: "don't → didn't", explBody: "The negative shifts back too.", jp: "don't は didn't になります。" },
      { stem: ["“I can see the mite.” → She said she ", " see the mite."], answers: ["could", "can", "will", "would have"], correct: 0, explTitle: "can → could", explBody: "Modals also shift back.", jp: "can は could になります。" },
      { stem: ["“You are wrong.” → Ben said that ", " wrong."], answers: ["I was", "you are", "I am", "he is"], correct: 0, explTitle: "Pronouns change", explBody: "You becomes I when I am the one reporting.", jp: "you は I に変わります。" },
      { stem: ["“Ants are common.” → She said that ants ", " common."], answers: ["were", "are", "was", "be"], correct: 0, explTitle: "are → were", explBody: "Plural subject shifts to were.", jp: "are は were になります。" },
      { stem: ["Reported speech does NOT use ___.", ""], answers: ["quotation marks", "the word said", "a subject", "a verb"], correct: 0, explTitle: "No quotes", explBody: "Quotation marks belong to direct speech.", jp: "引用符は使いません。" },
      { stem: ["The word “that” after said is ___.", ""], answers: ["optional", "always needed", "never allowed", "a verb"], correct: 0, explTitle: "Optional", explBody: "You can leave that out.", jp: "that は省略できます。" },
      { stem: ["“Things crawl on my head.” → She said things ", " on her head."], answers: ["crawled", "crawl", "crawling", "crawls"], correct: 0, explTitle: "Regular verb shifts back", explBody: "crawl → crawled.", jp: "crawl は crawled になります。" },
      { stem: ["“My favourite creature is the seahorse.” → Leo said that ", " favourite creature was the seahorse."], answers: ["his", "my", "your", "their"], correct: 0, explTitle: "my → his", explBody: "The possessive changes with the speaker.", jp: "my は his に変わります。" },
      { stem: ["Which sentence is reported speech?", ""], answers: ["She said that ants were common.", "“Ants are common.”", "Are ants common?", "Ants are common."], correct: 0, explTitle: "It reports what was said", explBody: "It uses said + a past verb and no quotes.", jp: "said + 過去形で、引用符がありません。" }
    ],
    master: [
      { stem: ["Report it: “The mite is horrible.”", ""], answers: ["He said that the mite was horrible.", "He said that the mite is horrible.", "He said that the mite were horrible.", "He say that the mite was horrible."], correct: 0, explTitle: "is → was", explBody: "Shift the verb one step back.", jp: "is は was になります。" },
      { stem: ["Report it: “I can count six legs.”", ""], answers: ["He said that he could count six legs.", "He said that he can count six legs.", "He said that he could counted six legs.", "He said he can counting six legs."], correct: 0, explTitle: "can → could + base verb", explBody: "Could is followed by the base form.", jp: "could のあとは動詞の原形です。" },
      { stem: ["Which pronoun is right? “You are late.” → She said that ___ was late.", ""], answers: ["I", "you", "she", "we"], correct: 0, explTitle: "you → I", explBody: "If she was talking to me, you becomes I.", jp: "you は I になります。" },
      { stem: ["Which one is NOT a correct backshift?", ""], answers: ["don't → doesn't", "is → was", "can → could", "are → were"], correct: 0, explTitle: "don't becomes didn't", explBody: "The negative moves into the past, not the third person.", jp: "don't は didn't になります。" },
      { stem: ["Choose the correct sentence.", ""], answers: ["Mom said she couldn't see anything without a microscope.", "Mom said she can't see anything without a microscope.", "Mom said she couldn't saw anything without a microscope.", "Mom said she couldn't seeing anything."], correct: 0, explTitle: "couldn't + base verb", explBody: "Use the base form after couldn't.", jp: "couldn't のあとは原形です。" },
      { stem: ["Report it: “Ants are very common at a picnic.”", ""], answers: ["She said that ants were very common at a picnic.", "She said that ants are very common at a picnic.", "She said that ants was very common at a picnic.", "She said ants being very common at a picnic."], correct: 0, explTitle: "are → were", explBody: "Plural subject shifts to were.", jp: "are は were になります。" },
      { stem: ["What happens to “my” in reported speech?", ""], answers: ["It changes to match the speaker.", "It stays the same always.", "It disappears.", "It becomes a verb."], correct: 0, explTitle: "Possessives change", explBody: "My → his / her, depending on who spoke.", jp: "my は話し手に合わせて変わります。" },
      { stem: ["Choose the correct word order.", ""], answers: ["The guide said that the cave had stalactites.", "The guide said that had the cave stalactites.", "The guide that said the cave had stalactites.", "Said the guide that the cave had stalactites."], correct: 0, explTitle: "said + that + normal clause", explBody: "Keep the clause in normal order.", jp: "said + that + ふつうの語順です。" },
      { stem: ["Which sentence keeps the quotation marks correctly?", ""], answers: ["“The red beetle is really cool,” he said.", "He said that “the red beetle was really cool.”", "He said that the red beetle “was really cool.”", "“He said that the red beetle was really cool.”"], correct: 0, explTitle: "Quotes belong to direct speech", explBody: "Only the speaker's exact words go inside quotation marks.", jp: "引用符は直接話法だけに使います。" },
      { stem: ["Report it: “I don't want to touch the bug.”", ""], answers: ["She said that she didn't want to touch the bug.", "She said that she doesn't want to touch the bug.", "She said that she didn't wanted to touch the bug.", "She said she not want to touch the bug."], correct: 0, explTitle: "didn't + base verb", explBody: "Use the base form after didn't.", jp: "didn't のあとは原形です。" }
    ]
  },

  g2: {
    key: "order_of_adjectives",
    tr: "5.6",
    component: "grammar-2",
    title: "Order of adjectives",
    jpTitle: "形容詞の順序",
    short: "opinion → size → age → shape → colour → origin → material",
    role: "noun",
    rule: "When you use more than one adjective before a noun, put them in a fixed order: opinion, size, age, shape, colour, origin, then material.",
    jpRule: "名詞の前に形容詞を2つ以上置くときは、意見 → 大きさ → 新旧 → 形 → 色 → 出身 → 素材 の順に並べます。",
    pattern: "opinion + size + age + shape + colour + origin + noun",
    jpPattern: "意見 + 大きさ + 新旧 + 形 + 色 + 出身 + 名詞",
    intro: [
      { t: "cute young striped furry creatures", jp: "かわいくて若い、しま模様の毛におおわれた生き物" },
      { t: "tiny pointed gray ears", jp: "小さくてとがった灰色の耳" },
      { t: "strange black Australian hairy spiders", jp: "変わった黒いオーストラリアの毛深いクモ" }
    ],
    rows: [
      { form: "Opinion first", pattern: "cute / strange / horrible + …", example: "cute young striped furry creatures", jp: "かわいくて若い、しま模様の毛におおわれた生き物" },
      { form: "Size next", pattern: "tiny / big / long + …", example: "tiny pointed gray ears", jp: "小さくてとがった灰色の耳" },
      { form: "Then shape and colour", pattern: "pointed / round + gray / red", example: "a common red bug with a spotted back", jp: "背中に斑点のあるふつうの赤い虫" },
      { form: "Origin near the noun", pattern: "Australian / Colombian + noun", example: "strange black Australian hairy spiders", jp: "変わった黒いオーストラリアの毛深いクモ" },
      { form: "Age before shape", pattern: "young / adult + pointed / striped", example: "common adult spotted bugs", jp: "斑点のあるふつうのおとなの虫" }
    ],
    noteRule: "English speakers follow this order without thinking. A wrong order sounds strange even though every word is correct.",
    noteException: "Two or more adjectives before a noun usually take no commas in this pattern: a big red bug.",
    noteExceptionDetail: "Opinion adjectives (cute, strange, horrible, wonderful, amazing) always come first, before any fact adjective.",
    table: {
      title: "The order",
      columns: ["Opinion", "Size", "Age / shape", "Colour", "Noun"],
      rows: [
        { cells: ["cute", "—", "young striped furry", "—", "creatures"], roles: ["noun", null, "noun", null, null] },
        { cells: ["—", "tiny", "pointed", "gray", "ears"], roles: [null, "noun", "noun", "noun", null] },
        { cells: ["strange", "—", "hairy", "black", "Australian spiders"], roles: ["noun", null, "noun", "noun", null] },
        { cells: ["common", "—", "adult spotted", "—", "bugs"], roles: ["noun", null, "noun", null, null] }
      ],
      notes: [
        "Opinion adjectives always come before fact adjectives.",
        "Colour comes late, right before origin and the noun."
      ]
    },
    samples: [
      { t: "Look at the cute small hairy animal she is holding in her hand.", jp: "彼女が手に持っているかわいくて小さい毛深い動物を見てください。", h: "cute small hairy" },
      { t: "You can only see these tiny gray organisms under a microscope.", jp: "この小さな灰色の生物は顕微鏡でしか見えません。", h: "tiny gray" },
      { t: "These lovely tall creatures have long thin pink legs.", jp: "このすてきで背の高い生き物は長く細いピンクの脚を持っています。", h: "long thin pink" },
      { t: "This is a common red bug with a spotted back.", jp: "これは背中に斑点のあるふつうの赤い虫です。", h: "common red" },
      { t: "This cute little Colombian frog is smaller than a coin!", jp: "このかわいい小さなコロンビアのカエルは硬貨より小さいです！", h: "cute little Colombian" },
      { t: "Look at this wonderful creature's soft furry ears.", jp: "このすばらしい生き物のやわらかい毛の耳を見てください。", h: "soft furry" },
      { t: "These amazing green insects look like they're dancing.", jp: "この驚くべき緑の昆虫は踊っているように見えます。", h: "amazing green" },
      { t: "Ugh! This big brown hairy spider is horrible.", jp: "うわ！この大きな茶色い毛深いクモはひどいです。", h: "big brown hairy" },
      { t: "This ant has six long thin legs.", jp: "このアリは6本の長く細い脚を持っています。", h: "long thin" },
      { t: "Can you see that strange colorful creature in the sea?", jp: "海にいるあの変わったカラフルな生き物が見えますか。", h: "strange colorful" }
    ],
    levelup: {
      rules: [
        { title: "Opinion comes first", jpTitle: "意見の形容詞が先",
          sub: "Cute, strange, horrible and wonderful say what you think, so they go before any fact.", jpSub: "cute・strange・horrible・wonderful は「どう思うか」なので、事実より前に置きます。",
          transforms: [["hairy / cute / small / animal", "a cute small hairy animal"], ["hairy / big / brown / spider", "a big brown hairy spider"]],
          examples: [{ t: "Look at the cute small hairy animal she is holding.", jp: "彼女が持っているかわいくて小さい毛深い動物を見てください。", h: "cute small hairy" },
                     { t: "Ugh! This big brown hairy spider is horrible.", jp: "うわ！この大きな茶色い毛深いクモはひどいです。", h: "big brown hairy" }] },
        { title: "Size before shape and colour", jpTitle: "大きさは形や色より前",
          sub: "Say how big it is first, then what shape, then what colour.", jpSub: "大きさ → 形 → 色 の順に言います。",
          transforms: [["gray / pointed / tiny / ears", "tiny pointed gray ears"], ["pink / thin / long / legs", "long thin pink legs"]],
          examples: [{ t: "You can only see these tiny gray organisms under a microscope.", jp: "この小さな灰色の生物は顕微鏡でしか見えません。", h: "tiny gray" },
                     { t: "These lovely tall creatures have long thin pink legs.", jp: "このすてきで背の高い生き物は長く細いピンクの脚を持っています。", h: "long thin pink" }] },
        { title: "Origin sits right next to the noun", jpTitle: "出身は名詞のすぐ前",
          sub: "Australian, Colombian and Japanese come last, just before the noun.", jpSub: "Australian・Colombian・Japanese は最後、名詞の直前です。",
          transforms: [["Australian / black / strange / hairy / spiders", "strange black Australian hairy spiders"], ["Colombian / little / cute / frog", "a cute little Colombian frog"]],
          examples: [{ t: "This cute little Colombian frog is smaller than a coin!", jp: "このかわいい小さなコロンビアのカエルは硬貨より小さいです！", h: "cute little Colombian" },
                     { t: "Robovie R3 is a Japanese robot that helps older people.", jp: "Robovie R3 は高齢者を助ける日本のロボットです。", h: "Japanese" }] }
      ],
      mixed: [
        { t: "Leo drew a cute little spotted bug for his project.", jp: "レオは課題のためにかわいい小さな斑点の虫を描きました。", h: "cute little spotted" },
        { t: "The museum showed a strange transparent sea creature.", jp: "博物館は変わった透明な海の生き物を展示しました。", h: "strange transparent" },
        { t: "She photographed a common adult spotted beetle.", jp: "彼女は斑点のあるふつうのおとなのカブトムシを撮影しました。", h: "common adult spotted" },
        { t: "We found some amazing tiny green insects on the leaf.", jp: "私たちは葉の上で驚くほど小さな緑の昆虫を見つけました。", h: "amazing tiny green" },
        { t: "He has a wonderful old Spanish football shirt.", jp: "彼はすばらしい古いスペインのサッカーシャツを持っています。", h: "wonderful old Spanish" },
        { t: "That horrible big black spider was on the ceiling.", jp: "あのひどく大きな黒いクモが天井にいました。", h: "horrible big black" }
      ]
    },
    quiz: [
      { stem: ["Which order is correct?", ""], answers: ["a cute small hairy animal", "a hairy cute small animal", "a small hairy cute animal", "a hairy small cute animal"], correct: 0, explTitle: "Opinion → size → shape", explBody: "Cute is an opinion, so it goes first.", jp: "意見 → 大きさ → 形の順です。" },
      { stem: ["Which order is correct?", ""], answers: ["tiny pointed gray ears", "gray tiny pointed ears", "pointed gray tiny ears", "gray pointed tiny ears"], correct: 0, explTitle: "Size → shape → colour", explBody: "Colour comes last, before the noun.", jp: "大きさ → 形 → 色の順です。" },
      { stem: ["Which order is correct?", ""], answers: ["long thin pink legs", "pink long thin legs", "thin pink long legs", "pink thin long legs"], correct: 0, explTitle: "Size → shape → colour", explBody: "Long and thin come before pink.", jp: "長さ・形が色より前です。" },
      { stem: ["Which adjective is an opinion?", ""], answers: ["horrible", "gray", "tiny", "Australian"], correct: 0, explTitle: "Opinion", explBody: "Horrible says what you think.", jp: "horrible は意見を表します。" },
      { stem: ["Where does an origin adjective go?", ""], answers: ["Just before the noun", "First of all", "Before the size", "After the noun"], correct: 0, explTitle: "Origin is last", explBody: "Australian, Colombian, Japanese sit right before the noun.", jp: "出身は名詞の直前です。" },
      { stem: ["Which order is correct?", ""], answers: ["a cute little Colombian frog", "a Colombian cute little frog", "a little Colombian cute frog", "a Colombian little cute frog"], correct: 0, explTitle: "Opinion → size → origin", explBody: "Cute, then little, then Colombian.", jp: "意見 → 大きさ → 出身の順です。" },
      { stem: ["Which order is correct?", ""], answers: ["a big brown hairy spider", "a hairy brown big spider", "a brown big hairy spider", "a hairy big brown spider"], correct: 0, explTitle: "Size → colour → shape/texture", explBody: "Big comes before brown and hairy.", jp: "big が最初に来ます。" },
      { stem: ["Which order is correct?", ""], answers: ["common adult spotted bugs", "spotted common adult bugs", "adult spotted common bugs", "spotted adult common bugs"], correct: 0, explTitle: "Opinion → age → pattern", explBody: "Common, then adult, then spotted.", jp: "common → adult → spotted の順です。" },
      { stem: ["Do you normally use commas in “a big red bug”?", ""], answers: ["No", "Yes, always", "Only after the noun", "Only in questions"], correct: 0, explTitle: "No commas needed", explBody: "This pattern takes no commas.", jp: "この形ではコンマは不要です。" },
      { stem: ["Which order is correct?", ""], answers: ["strange black Australian hairy spiders", "Australian strange black hairy spiders", "hairy Australian strange black spiders", "black Australian strange hairy spiders"], correct: 0, explTitle: "Opinion first, origin near the noun", explBody: "Strange first; Australian close to spiders.", jp: "意見が先、出身は名詞の近くです。" }
    ],
    master: [
      { stem: ["Put them in order: hairy / cute / small / animal", ""], answers: ["a cute small hairy animal", "a small cute hairy animal", "a hairy small cute animal", "a cute hairy small animal"], correct: 0, explTitle: "Opinion → size → texture", explBody: "Cute, small, hairy.", jp: "cute → small → hairy の順です。" },
      { stem: ["Put them in order: gray / tiny / organisms", ""], answers: ["tiny gray organisms", "gray tiny organisms", "organisms tiny gray", "gray organisms tiny"], correct: 0, explTitle: "Size before colour", explBody: "Tiny comes before gray.", jp: "大きさが色より前です。" },
      { stem: ["Which sentence sounds wrong to an English speaker?", ""], answers: ["a red big bug", "a big red bug", "a tiny green insect", "a cute little frog"], correct: 0, explTitle: "Size before colour", explBody: "It should be a big red bug.", jp: "大きさが色より前です。" },
      { stem: ["Which category comes first of all?", ""], answers: ["opinion", "colour", "origin", "material"], correct: 0, explTitle: "Opinion first", explBody: "What you think comes before any fact.", jp: "意見がいちばん先です。" },
      { stem: ["Put them in order: Spanish / old / wonderful / shirt", ""], answers: ["a wonderful old Spanish shirt", "an old wonderful Spanish shirt", "a Spanish old wonderful shirt", "an old Spanish wonderful shirt"], correct: 0, explTitle: "Opinion → age → origin", explBody: "Wonderful, old, Spanish.", jp: "意見 → 新旧 → 出身の順です。" },
      { stem: ["Which one is a colour adjective?", ""], answers: ["gray", "pointed", "adult", "amazing"], correct: 0, explTitle: "Colour", explBody: "Gray is the colour.", jp: "gray が色の形容詞です。" },
      { stem: ["Put them in order: spotted / red / common / bug", ""], answers: ["a common red bug with a spotted back", "a red common spotted bug", "a spotted red common bug", "a red spotted common bug"], correct: 0, explTitle: "Opinion → colour", explBody: "Common comes before red.", jp: "common が red より前です。" },
      { stem: ["Which order matches the book's example?", ""], answers: ["cute young striped furry creatures", "furry striped young cute creatures", "young cute furry striped creatures", "striped furry cute young creatures"], correct: 0, explTitle: "Straight from TR 5.6", explBody: "That is the order the audio script gives.", jp: "音声スクリプトどおりの順序です。" },
      { stem: ["Where does “tiny” belong?", ""], answers: ["in the size group", "in the colour group", "in the origin group", "in the opinion group"], correct: 0, explTitle: "Size", explBody: "Tiny describes how big something is.", jp: "tiny は大きさを表します。" },
      { stem: ["Fix it: “a Colombian cute little frog”", ""], answers: ["a cute little Colombian frog", "a little cute Colombian frog", "a Colombian little cute frog", "a cute Colombian little frog"], correct: 0, explTitle: "Origin last", explBody: "Colombian belongs right before the noun.", jp: "出身は名詞の直前です。" }
    ]
  },

  reading: {
    tr: "5.8",
    title: "One Cubic Foot",
    jpTitle: "1立方フィート",
    intro: "There are about 1.5 million species on Earth, but how many do you see every day? You often see the big colorful animals, like birds, mammals, and fish. But look more closely.",
    paras: [
      { t: "Can you see the tiny creatures, too? Eighty percent of the world's species are insects. Look on the ground. Imagine you could look under the ground. Many tiny creatures live there, too. Every cubic foot on Earth has life in it.",
        q: "What percentage of the world's species are insects?", opts: ["Eighty percent", "Eight percent", "Eighteen percent"], correct: 0, jp: "80パーセントです。" },
      { t: "David Liittschwager is a photographer. He wanted to find out how many creatures are in one cubic foot. So he made an empty 12-inch cube with a green metal frame and put it in five different places around the world.",
        q: "What did Liittschwager want to find out?", opts: ["How many creatures are in one cubic foot", "How deep the ocean is", "How fast a hummingbird flies"], correct: 0, jp: "1立方フィートに何匹の生き物がいるかです。" },
      { t: "He chose a tropical rainforest (Costa Rica), a coral reef (Pacific Ocean), the Table Mountain (South Africa), a freshwater river (USA), and a city park (New York). He put the cube in each place for three weeks. He observed, counted, and took photos of everything—down to 1 millimeter in size—that crawled or flew into the cube.",
        q: "How long did the cube stay in each place?", opts: ["Three weeks", "Three days", "Three months"], correct: 0, jp: "3週間です。" },
      { t: "The results were amazing. Liittschwager found both common and rare creatures. He also discovered many new species, like a strange transparent octopus that is the size of a fingernail! In total, more than a thousand different organisms were photographed and studied. Although the coral reef had the most biodiversity, all the other places were also full of life. Even the city park!",
        q: "Which place had the most biodiversity?", opts: ["The coral reef", "The city park", "Table Mountain"], correct: 0, jp: "サンゴ礁です。" }
    ],
    strategy: {
      title: "Reading strategy — although and even",
      body: "Watch for although and even. Although the coral reef had the most biodiversity tells you a surprise is coming; Even the city park! tells you the surprise has landed.",
      jp: "although と even に注目しましょう。although は「意外なことが続く」合図、even は「その意外なことがここにある」という合図です。"
    },
    order: {
      title: "Put the One Cubic Foot project in order",
      items: [
        "Liittschwager wanted to know how many creatures live in one cubic foot.",
        "He made an empty 12-inch cube with a green metal frame.",
        "He put the cube in five different places around the world.",
        "He left the cube in each place for three weeks.",
        "He observed, counted and photographed everything down to 1 millimeter.",
        "More than a thousand different organisms were photographed and studied."
      ]
    },
    quiz: [
      { q: "About how many species are there on Earth?", opts: ["1.5 million", "1.5 thousand", "1.5 billion"], correct: 0, jp: "約150万種です。" },
      { q: "What is David Liittschwager's job?", opts: ["A photographer", "A pilot", "A doctor"], correct: 0, jp: "写真家です。" },
      { q: "How big was the cube?", opts: ["12 inches", "12 feet", "12 meters"], correct: 0, jp: "12インチです。" },
      { q: "How many places did he choose?", opts: ["Five", "Three", "Ten"], correct: 0, jp: "5か所です。" },
      { q: "What is the size of the transparent octopus he found?", opts: ["The size of a fingernail", "The size of a hand", "The size of a coin"], correct: 0, jp: "つめほどの大きさです。" },
      { q: "How many organisms were photographed in total?", opts: ["More than a thousand", "Fewer than a hundred", "Exactly ten"], correct: 0, jp: "1,000種類以上です。" },
      { q: "What did Liittschwager say the experience was like?", opts: ["Finding treasure", "Watching television", "Reading a book"], correct: 0, jp: "宝探しのようだったと言いました。" },
      { q: "What surprised him about the city park?", opts: ["It was also full of life", "It was empty", "It had no insects"], correct: 0, jp: "そこも生き物でいっぱいだったことです。" }
    ]
  },

  writing: {
    genre: "A creature fact file",
    jpGenre: "生き物のファクトファイル",
    modelTitle: "The Pygmy Seahorse",
    model: [
      "The pygmy seahorse is a tiny orange fish with a long thin tail.",
      "Habitat: warm water, near coral. Size: sixteen millimeters — smaller than a human's tooth.",
      "It uses camouflage and grabs food that floats by. Male seahorses have the babies.",
      "My teacher said that it was one of the hardest creatures in the ocean to photograph."
    ],
    modelJp: "ピグミーシーホースは長く細い尾を持つ小さなオレンジ色の魚です。生息地はサンゴの近くの暖かい海。体長16ミリメートルで、人の歯より小さいです。",
    steps: [
      { t: "Name your creature and describe it with two or three adjectives in the right order.", jp: "生き物の名前を書き、正しい順序の形容詞2〜3語で説明する。" },
      { t: "Give its habitat and its size in millimeters or centimeters.", jp: "生息地と、ミリまたはセンチでの大きさを書く。" },
      { t: "Give two characteristics: what it eats or how it moves.", jp: "特徴を2つ書く：何を食べるか、どう動くか。" },
      { t: "Finish with something someone said about it, using reported speech.", jp: "だれかがそれについて言ったことを、話法を使って書いて締めくくる。" }
    ],
    expressions: [
      { t: "The ___ is a ___ ___ ___ with ___.", jp: "〜は〜な〜な〜で、〜を持っています。" },
      { t: "Habitat: ___. Size: ___ millimeters.", jp: "生息地：〜。大きさ：〜ミリメートル。" },
      { t: "It uses ___ and grabs ___.", jp: "それは〜を使い、〜をつかみます。" },
      { t: "My teacher said that it was ___.", jp: "先生は、それは〜だと言いました。" }
    ],
    checklist: [
      "I used at least two adjectives in the correct order.",
      "I gave a habitat and a size with a unit.",
      "I gave two real characteristics.",
      "I used reported speech once, with said that and a past verb."
    ],
    quiz: [
      { q: "Which adjective order is correct?", opts: ["a tiny orange fish", "an orange tiny fish", "a fish tiny orange"], correct: 0, jp: "大きさが色より前です。" },
      { q: "Which unit fits a seahorse's size?", opts: ["Millimeters", "Kilometers", "Liters"], correct: 0, jp: "ミリメートルです。" },
      { q: "Choose the correct reported speech.", opts: ["She said that it was rare.", "She said that it is rare.", "She said that it were rare."], correct: 0, jp: "is は was になります。" },
      { q: "A fact file should include ___.", opts: ["habitat and size", "your favourite colour", "a shopping list"], correct: 0, jp: "生息地と大きさを書きます。" },
      { q: "Which is a characteristic, not an opinion?", opts: ["It grabs food that floats by.", "It is horrible.", "It is my favourite."], correct: 0, jp: "行動の説明が特徴です。" },
      { q: "Which adjective is an opinion?", opts: ["wonderful", "gray", "sixteen-millimeter"], correct: 0, jp: "wonderful は意見です。" },
      { q: "“Can” in reported speech becomes ___.", opts: ["could", "can", "will"], correct: 0, jp: "could になります。" },
      { q: "Where does an origin adjective like “Colombian” go?", opts: ["Right before the noun", "First", "After the noun"], correct: 0, jp: "名詞の直前です。" }
    ]
  }
};
