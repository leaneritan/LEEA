/* Our World Level 6 · Unit 3 — Chocolate!
   Source: Student's Book audio script TR 3.1-3.8. */
export default {
  unit: 3,
  title: "Chocolate!",
  jpTitle: "チョコレート！",
  themeEmoji: "🍫",
  slug: "chocolate",

  opener: {
    tr: "3.1",
    intro:
      "One thousand years ago, chocolate was so valuable that it was used as money! Now we use chocolate every day and on special occasions, such as International Chocolate Day on September 13.",
    goals: [
      { en: "Talk about where chocolate comes from and how it is made.", jp: "チョコレートがどこから来て、どう作られるかを話す。" },
      { en: "Use the past progressive to say what was happening.", jp: "過去進行形を使って「何が起きていたか」を言う。" },
      { en: "Follow and give a recipe.", jp: "レシピを読んだり伝えたりする。" },
      { en: "Use so that to explain cause and effect.", jp: "so that を使って原因と結果を説明する。" },
      { en: "Read the story of chocolate and retell it in order.", jp: "チョコレートの歴史を読み、順序どおりに伝える。" }
    ],
    photoCards: [
      { emoji: "🌳", title: "The cacao tree", text: "Chocolate comes from the cacao tree, which grows near the Equator. After four years, the trees start to produce pods.", jp: "チョコレートは赤道近くで育つカカオの木から作られます。4年後、木はさやをつけ始めます。" },
      { emoji: "🫘", title: "From pod to powder", text: "Farmers open the pods and take out the seeds. Vanilla, sugar, cinnamon, and other spices are added to the ground-up seeds.", jp: "農家がさやを開けて種を取り出します。すりつぶした種にバニラ・砂糖・シナモンなどの香辛料が加えられます。" },
      { emoji: "⛵", title: "1502 — across the ocean", text: "As early as 2,000 years ago, people of the Americas were mixing cacao beans, water, and spices to make a drink. In 1502, Christopher Columbus brought cacao beans back to Spain.", jp: "2,000年も前からアメリカ大陸の人々はカカオ豆と水と香辛料を混ぜて飲み物を作っていました。1502年、コロンブスがカカオ豆をスペインに持ち帰りました。" },
      { emoji: "🍬", title: "1847 — the candy bar", text: "People later learned how to change chocolate from liquid to solid. And by 1847 they were enjoying chocolate candy bars!", jp: "その後、人々はチョコレートを液体から固体に変える方法を学びました。1847年には板チョコを楽しんでいました。" }
    ],
    lookAndCheck: [
      { q: "Where does the cacao tree grow?", opts: ["Near the Equator", "Near the North Pole", "In the desert"], correct: 0, jp: "赤道の近くで育ちます。" },
      { q: "How long do cacao trees take to produce pods?", opts: ["Four years", "Four weeks", "Forty years"], correct: 0, jp: "4年かかります。" },
      { q: "What was chocolate used as one thousand years ago?", opts: ["Money", "Medicine", "Paint"], correct: 0, jp: "お金として使われていました。" },
      { q: "When is International Chocolate Day?", opts: ["September 13", "March 13", "December 3"], correct: 0, jp: "9月13日です。" }
    ],
    sort: {
      title: "Liquid, solid or ingredient?",
      zones: [
        { id: "liquid", label: "💧 Liquid" },
        { id: "solid", label: "🧊 Solid" },
        { id: "spice", label: "🌿 Spice or flavour" }
      ],
      tiles: [
        { text: "hot chocolate", zone: "liquid" },
        { text: "a milkshake", zone: "liquid" },
        { text: "melted chocolate", zone: "liquid" },
        { text: "a candy bar", zone: "solid" },
        { text: "a chocolate sculpture", zone: "solid" },
        { text: "cocoa powder", zone: "solid" },
        { text: "vanilla", zone: "spice" },
        { text: "cinnamon", zone: "spice" },
        { text: "caramel", zone: "spice" }
      ]
    },
    quiz: [
      { q: "Chocolate comes from the ___ tree.", opts: ["cacao", "coffee", "coconut"], correct: 0, jp: "カカオの木から作られます。" },
      { q: "What do farmers take out of the pods?", opts: ["The seeds", "The leaves", "The roots"], correct: 0, jp: "種を取り出します。" },
      { q: "Who brought cacao beans back to Spain in 1502?", opts: ["Christopher Columbus", "The Aztecs", "Joseph Fry"], correct: 0, jp: "クリストファー・コロンブスです。" },
      { q: "By what year were people enjoying chocolate candy bars?", opts: ["1847", "1502", "1200"], correct: 0, jp: "1847年です。" },
      { q: "What is added to the ground-up seeds?", opts: ["Vanilla, sugar, cinnamon and spices", "Salt and pepper", "Nothing at all"], correct: 0, jp: "バニラ・砂糖・シナモンなどが加えられます。" },
      { q: "People of the Americas mixed cacao beans, water and spices to make ___.", opts: ["a drink", "a candle", "paper"], correct: 0, jp: "飲み物を作りました。" },
      { q: "How many types of chocolate candy bars are there today?", opts: ["Thousands", "Three", "None"], correct: 0, jp: "何千種類もあります。" },
      { q: "Chocolate changed from ___ to ___.", opts: ["liquid to solid", "solid to gas", "powder to seed"], correct: 0, jp: "液体から固体に変わりました。" }
    ]
  },

  v1: {
    tr: "3.2",
    words: [
      { w: "an occasion", norm: "occasion", emoji: "🎉", ipa: "əˈkeɪʒən", syl: "oc-ca-sion", pos: "noun", mean: "a special time when something happens.", jw: "行事", jr: "ぎょうじ", jm: "何かが起こる特別なとき。",
        tr: "We eat birthday cake on special occasions.",
        ex: [["We eat birthday cake on special occasions.", "私たちは特別な行事に誕生日ケーキを食べます。"],
             ["We use chocolate every day and on special occasions.", "私たちは毎日も特別な行事にもチョコレートを使います。"],
             ["A World Cup final is a big occasion.", "ワールドカップの決勝は大きな行事です。"]] },
      { w: "a pod", norm: "pod", emoji: "🫛", ipa: "pɑːd", syl: "pod", pos: "noun", mean: "the long case on a plant that holds the seeds.", jw: "さや", jr: "さや", jm: "植物の種が入っている長い入れ物。",
        tr: "Pods have seeds.",
        ex: [["Pods have seeds.", "さやには種が入っています。"],
             ["After four years, the trees start to produce pods.", "4年後、木はさやをつけ始めます。"],
             ["Farmers open the pods and take out the seeds.", "農家はさやを開けて種を取り出します。"]] },
      { w: "vanilla", norm: "vanilla", emoji: "🌼", ipa: "vəˈnɪlə", syl: "va-nil-la", pos: "noun", mean: "a sweet flavour that comes from a plant.", jw: "バニラ", jr: "ばにら", jm: "植物から取れる甘い風味。",
        tr: "Many types of chocolate have vanilla.",
        ex: [["Many types of chocolate have vanilla.", "多くの種類のチョコレートにはバニラが入っています。"],
             ["Stir in some vanilla. Add some spice.", "バニラを混ぜ入れて。香辛料も加えて。"],
             ["Vanilla is added to the ground-up seeds.", "すりつぶした種にバニラが加えられます。"]] },
      { w: "cinnamon", norm: "cinnamon", emoji: "🥖", ipa: "ˈsɪnəmən", syl: "cin-na-mon", pos: "noun", mean: "a warm brown spice from the bark of a tree.", jw: "シナモン", jr: "しなもん", jm: "木の皮から取れる温かみのある茶色の香辛料。",
        tr: "Do you put cinnamon in hot chocolate?",
        ex: [["Do you put cinnamon in hot chocolate?", "ホットチョコレートにシナモンを入れますか。"],
             ["Sprinkle on some cinnamon.", "シナモンを少しふりかけて。"],
             ["Cinnamon is my favorite spice.", "シナモンは私のいちばん好きな香辛料です。"]] },
      { w: "a spice", norm: "spice", emoji: "🌶️", ipa: "spaɪs", syl: "spice", pos: "noun", mean: "a plant powder or seed that gives food a strong flavour.", jw: "香辛料", jr: "こうしんりょう", jm: "食べ物に強い風味をつける植物の粉や種。",
        tr: "Cinnamon is my favorite spice.",
        ex: [["Cinnamon is my favorite spice.", "シナモンは私のいちばん好きな香辛料です。"],
             ["The Aztecs added spices so that it would taste better.", "アステカの人々はおいしくするために香辛料を加えました。"],
             ["Other spices are added to the ground-up seeds.", "ほかの香辛料もすりつぶした種に加えられます。"]] },
      { w: "origin", norm: "origin", emoji: "🌱", ipa: "ˈɔːrɪdʒɪn", syl: "or-i-gin", pos: "noun", mean: "the place or time something started.", jw: "起源", jr: "きげん", jm: "何かが始まった場所や時。",
        tr: "What's the origin of coffee?",
        ex: [["What's the origin of coffee?", "コーヒーの起源は何ですか。"],
             ["The origin of chocolate is interesting.", "チョコレートの起源は興味深いです。"],
             ["Nobody agrees about the origin of the recipe.", "そのレシピの起源についてはだれも意見が一致しません。"]] },
      { w: "liquid", norm: "liquid", emoji: "💧", ipa: "ˈlɪkwɪd", syl: "liq-uid", pos: "noun", mean: "something that flows, like water.", jw: "液体", jr: "えきたい", jm: "水のように流れるもの。",
        tr: "Water is liquid.",
        ex: [["Water is liquid.", "水は液体です。"],
             ["People learned how to change chocolate from liquid to solid.", "人々はチョコレートを液体から固体に変える方法を学びました。"],
             ["Some artifacts show people pouring the liquid into cups.", "遺物には液体をカップに注ぐ人々が描かれています。"]] },
      { w: "solid", norm: "solid", emoji: "🧊", ipa: "ˈsɑːlɪd", syl: "sol-id", pos: "noun", mean: "something hard that keeps its shape.", jw: "固体", jr: "こたい", jm: "形を保つ硬いもの。",
        tr: "Ice is solid.",
        ex: [["Ice is solid.", "氷は固体です。"],
             ["The first solid candy bar was invented by Joseph Fry.", "最初の固形の板チョコはジョセフ・フライが発明しました。"],
             ["Chocolate becomes solid when it cools.", "チョコレートは冷えると固体になります。"]] },
      { w: "candy bar", norm: "candy bar", emoji: "🍫", ipa: "ˈkændi bɑːr", syl: "can-dy bar", pos: "noun", mean: "a bar of sweet chocolate you can buy in a shop.", jw: "板チョコ", jr: "いたちょこ", jm: "店で買える甘いチョコレートの棒。",
        tr: "Can I have that candy bar?",
        ex: [["Can I have that candy bar?", "その板チョコをもらえますか。"],
             ["By 1847 they were enjoying chocolate candy bars!", "1847年には板チョコを楽しんでいました！"],
             ["I remembered the candy bar in my backpack.", "私はリュックの中の板チョコを思い出しました。"]] },
      { w: "type", norm: "type", emoji: "🔠", ipa: "taɪp", syl: "type", pos: "noun", mean: "a kind or group of things that are alike.", jw: "種類", jr: "しゅるい", jm: "似ているものの集まり。",
        tr: "What type of chocolate do you like?",
        ex: [["What type of chocolate do you like?", "どの種類のチョコレートが好きですか。"],
             ["Today there are thousands of types of candy bars.", "今日、板チョコには何千もの種類があります。"],
             ["Many types of chocolate have vanilla.", "多くの種類のチョコレートにはバニラが入っています。"]] },
      { w: "filling", norm: "filling", emoji: "🍮", ipa: "ˈfɪlɪŋ", syl: "fill-ing", pos: "noun", mean: "the soft food inside something sweet.", jw: "中身", jr: "なかみ", jm: "お菓子の中に入っている柔らかい部分。",
        tr: "I like candy bars with fruit filling.",
        ex: [["I like candy bars with fruit filling.", "私はフルーツの中身が入った板チョコが好きです。"],
             ["We have chocolate with delicious fillings like caramel.", "キャラメルのようなおいしい中身のチョコレートがあります。"],
             ["What filling is inside this one?", "これの中身は何ですか。"]] },
      { w: "caramel", norm: "caramel", emoji: "🍯", ipa: "ˈkærəmel", syl: "car-a-mel", pos: "noun", mean: "a soft sweet food made from melted sugar.", jw: "キャラメル", jr: "きゃらめる", jm: "溶かした砂糖から作る柔らかい甘い食べ物。",
        tr: "Caramel is too sweet!",
        ex: [["Caramel is too sweet!", "キャラメルは甘すぎます！"],
             ["Some chocolate has delicious fillings like caramel.", "キャラメルのようなおいしい中身のチョコレートもあります。"],
             ["He poured warm caramel over the ice cream.", "彼はアイスクリームに温かいキャラメルをかけました。"]] },
      { w: "hot chocolate", norm: "hot chocolate", emoji: "☕", ipa: "hɑːt ˈtʃɔːklət", syl: "hot choc-o-late", pos: "noun", mean: "a warm sweet drink made with chocolate.", jw: "ホットチョコレート", jr: "ほっとちょこれーと", jm: "チョコレートで作る温かい甘い飲み物。",
        tr: "I drink hot chocolate in the morning.",
        ex: [["I drink hot chocolate in the morning.", "私は朝ホットチョコレートを飲みます。"],
             ["By 250 CE, people were drinking hot chocolate.", "西暦250年までに、人々はホットチョコレートを飲んでいました。"],
             ["I was making hot chocolate in the kitchen one night.", "ある夜、私は台所でホットチョコレートを作っていました。"]] },
      { w: "milkshake", norm: "milkshake", emoji: "🥤", ipa: "ˈmɪlkʃeɪk", syl: "milk-shake", pos: "noun", mean: "a cold drink made by mixing milk with ice cream or flavour.", jw: "ミルクセーキ", jr: "みるくせーき", jm: "牛乳にアイスや風味を混ぜた冷たい飲み物。",
        tr: "I'd like a strawberry milkshake, please.",
        ex: [["I'd like a strawberry milkshake, please.", "ストロベリーのミルクセーキをお願いします。"],
             ["Pour the milkshakes into two glasses.", "ミルクセーキをグラス2つに注いでください。"],
             ["We have chocolate ice cream, cereal, cookies and milkshakes.", "チョコレートのアイス、シリアル、クッキー、ミルクセーキがあります。"]] },
      { w: "powder", norm: "powder", emoji: "🥄", ipa: "ˈpaʊdər", syl: "pow-der", pos: "noun", mean: "very fine dry pieces, like flour or dust.", jw: "粉", jr: "こな", jm: "小麦粉やほこりのようなとても細かい乾いた粒。",
        tr: "We need to buy cocoa powder!",
        ex: [["We need to buy cocoa powder!", "ココアの粉を買わなければなりません！"],
             ["Add two teaspoons of cocoa powder.", "ココアの粉を小さじ2杯加えてください。"],
             ["The powder is made from ground-up seeds.", "その粉はすりつぶした種から作られます。"]] }
    ]
  },

  v2: {
    tr: "3.5",
    words: [
      { w: "a gram", norm: "gram", emoji: "⚖️", ipa: "ɡræm", syl: "gram", pos: "noun", mean: "a small unit for measuring weight.", jw: "グラム", jr: "ぐらむ", jm: "重さをはかる小さな単位。",
        tr: "How many grams of sugar do I need?",
        ex: [["How many grams of sugar do I need?", "砂糖は何グラム必要ですか。"],
             ["This recipe needs fifty grams of chocolate.", "このレシピにはチョコレート50グラムが必要です。"],
             ["A gram is much smaller than a kilogram.", "1グラムは1キログラムよりずっと小さいです。"]] },
      { w: "mix", norm: "mix", emoji: "🌀", ipa: "mɪks", syl: "mix", pos: "verb", mean: "to put two or more things together.", jw: "混ぜる", jr: "まぜる", jm: "2つ以上のものを一つにすること。",
        tr: "You have to mix carefully.",
        ex: [["You have to mix carefully.", "ていねいに混ぜなければなりません。"],
             ["Mix the ingredients together for one minute.", "材料を1分間混ぜ合わせてください。"],
             ["The Spanish mixed it with sugar.", "スペイン人はそれを砂糖と混ぜました。"]] },
      { w: "pour", norm: "pour", emoji: "🫗", ipa: "pɔːr", syl: "pour", pos: "verb", mean: "to make a liquid flow out of a container.", jw: "注ぐ", jr: "そそぐ", jm: "液体を入れ物から流し出すこと。",
        tr: "Pour it in your favorite cup.",
        ex: [["Pour it in your favorite cup.", "お気に入りのカップに注いでください。"],
             ["Pour the milkshakes into two glasses.", "ミルクセーキをグラス2つに注いでください。"],
             ["Some artifacts show people pouring the liquid into cups.", "遺物には液体をカップに注ぐ人々が描かれています。"]] },
      { w: "a recipe", norm: "recipe", emoji: "📜", ipa: "ˈresəpi", syl: "rec-i-pe", pos: "noun", mean: "a set of instructions for cooking something.", jw: "レシピ", jr: "れしぴ", jm: "料理の作り方を書いたもの。",
        tr: "Do you have a good recipe for chocolate cake?",
        ex: [["Do you have a good recipe for chocolate cake?", "チョコレートケーキのよいレシピはありますか。"],
             ["The boy printed out the recipe so that he could read it.", "その男の子は読めるようにレシピを印刷しました。"],
             ["The Spanish took the recipe back to Spain.", "スペイン人はそのレシピをスペインに持ち帰りました。"]] },
      { w: "an ingredient", norm: "ingredient", emoji: "🥣", ipa: "ɪnˈɡriːdiənt", syl: "in-gre-di-ent", pos: "noun", mean: "one of the foods you need to make a dish.", jw: "材料", jr: "ざいりょう", jm: "料理を作るために必要な食べ物の一つ。",
        tr: "This recipe has 25 ingredients!",
        ex: [["This recipe has 25 ingredients!", "このレシピには材料が25もあります！"],
             ["First, find the ingredients from the recipe.", "まず、レシピから材料を見つけてください。"],
             ["We put all the ingredients on the table.", "私たちは材料を全部テーブルに置きました。"]] },
      { w: "a teaspoon", norm: "teaspoon", emoji: "🥄", ipa: "ˈtiːspuːn", syl: "tea-spoon", pos: "noun", mean: "a small spoon, used as a measure in cooking.", jw: "小さじ", jr: "こさじ", jm: "料理ではかりに使う小さなスプーン。",
        tr: "Add two teaspoons of cocoa powder.",
        ex: [["Add two teaspoons of cocoa powder.", "ココアの粉を小さじ2杯加えてください。"],
             ["Add a teaspoon of sugar.", "砂糖を小さじ1杯加えてください。"],
             ["One teaspoon is much smaller than a cup.", "小さじ1杯はカップよりずっと少ないです。"]] }
    ]
  },

  academic: ["sequence", "steps", "cause_and_effect", "main_idea", "summarize"],

  content: [
    { w: "a bean", norm: "bean", emoji: "🫘", ipa: "biːn", syl: "bean", pos: "noun", mean: "a seed used as food, like a cacao or coffee bean.", jw: "豆", jr: "まめ", jm: "カカオ豆やコーヒー豆のように食べ物に使う種。",
      ex: [["Columbus brought cacao beans back to Spain.", "コロンブスはカカオ豆をスペインに持ち帰りました。"],
           ["The Mayas used the beans as currency.", "マヤの人々は豆を通貨として使いました。"],
           ["With ten beans they could buy a rabbit.", "豆10個でウサギを1匹買えました。"]] },
    { w: "currency", norm: "currency", emoji: "🪙", ipa: "ˈkɜːrənsi", syl: "cur-ren-cy", pos: "noun", mean: "the money people use to buy things.", jw: "通貨", jr: "つうか", jm: "物を買うために使うお金。",
      ex: [["The Mayas also used the seeds as currency.", "マヤの人々は種を通貨としても使いました。"],
           ["Between 1200 and 1500 CE, the Aztecs used chocolate as currency.", "1200年から1500年の間、アステカ人はチョコレートを通貨として使いました。"],
           ["Chocolate was a strange currency, but it worked.", "チョコレートは変わった通貨でしたが、役に立ちました。"]] },
    { w: "bitter", norm: "bitter", emoji: "😖", ipa: "ˈbɪtər", syl: "bit-ter", pos: "adjective", mean: "having a sharp, not sweet taste.", jw: "苦い", jr: "にがい", jm: "甘くなく、するどい味がすること。",
      ex: [["Without sugar it was extremely bitter.", "砂糖なしではとても苦かったのです。"],
           ["Dark chocolate can taste bitter.", "ダークチョコレートは苦く感じることがあります。"],
           ["The bitter drink surprised the Spanish.", "その苦い飲み物はスペイン人を驚かせました。"]] },
    { w: "residue", norm: "residue", emoji: "🧫", ipa: "ˈrezɪduː", syl: "res-i-due", pos: "noun", mean: "a small amount of something left behind.", jw: "残り", jr: "のこり", jm: "あとに残った少しの量。",
      ex: [["Scientists have analyzed chocolate residue from a ceramic teapot.", "科学者は陶器のポットのチョコレートの残りを分析しました。"],
           ["The residue showed what people drank.", "その残りから人々が何を飲んでいたか分かりました。"],
           ["Even a tiny residue can tell a story.", "ほんの少しの残りでも物語を語ることがあります。"]] },
    { w: "valuable", norm: "valuable", emoji: "💎", ipa: "ˈvæljuəbəl", syl: "val-u-a-ble", pos: "adjective", mean: "worth a lot of money or very useful.", jw: "価値のある", jr: "かちのある", jm: "とてもお金になる、またはとても役に立つこと。",
      ex: [["Chocolate was so valuable that it was used as money.", "チョコレートはお金として使われるほど価値がありました。"],
           ["Gold is valuable, and so was cacao.", "金は価値がありますが、カカオもそうでした。"],
           ["A valuable recipe was carried across the ocean.", "価値あるレシピが海を越えて運ばれました。"]] }
  ],

  song: {
    tr: "3.3",
    title: "Hot Chocolate",
    jpTitle: "ホットチョコレート",
    lyrics: [
      { t: "Hey! Do you like hot chocolate?", jp: "ねえ！ホットチョコレートは好き？" },
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "Put some chocolate in a cup.", jp: "カップにチョコレートを入れて。" },
      { t: "Get some milk and heat it up.", jp: "牛乳を用意して温めて。" },
      { t: "Stir in some vanilla. Add some spice.", jp: "バニラを混ぜ入れて。香辛料も加えて。" },
      { t: "Sprinkle on some cinnamon.", jp: "シナモンをふりかけて。" },
      { t: "It'll taste right!", jp: "きっとおいしくなる！" },
      { t: "I was making hot chocolate", jp: "私はホットチョコレートを作っていた" },
      { t: "in the kitchen one night.", jp: "ある夜、台所で。" },
      { t: "My grandma was telling me", jp: "おばあちゃんが言っていた" },
      { t: "I wasn't doing it right.", jp: "私のやり方は正しくないって。" },
      { t: "She was telling me about her mother.", jp: "彼女は自分の母のことを話していた。" },
      { t: "About how she made cocoa when she was young.", jp: "若い頃どうやってココアを作ったかを。" },
      { t: "Hot chocolate in a cup.", jp: "カップの中のホットチョコレート。" },
      { t: "Hot chocolate! Pour it to the top.", jp: "ホットチョコレート！いっぱいまで注いで。" },
      { t: "Hot chocolate tastes so good.", jp: "ホットチョコレートはとてもおいしい。" },
      { t: "I learned to make it like Grandma said I should.", jp: "おばあちゃんが言ったとおりに作れるようになった。" },
      { t: "I love hot chocolate!", jp: "ホットチョコレートが大好き！" }
    ],
    tapWords: ["chocolate", "vanilla", "spice", "cinnamon", "cocoa", "Pour", "cup", "milk"],
    quiz: [
      { q: "What do you put in the cup first?", opts: ["Some chocolate", "Some ice", "Some rice"], correct: 0, jp: "まずチョコレートを入れます。" },
      { q: "What do you sprinkle on top?", opts: ["Cinnamon", "Salt", "Pepper"], correct: 0, jp: "シナモンをふりかけます。" },
      { q: "“I was making hot chocolate” is in the ___.", opts: ["past progressive", "present perfect", "future"], correct: 0, jp: "過去進行形です。" },
      { q: "Who was telling the singer they were doing it wrong?", opts: ["Grandma", "Mom", "A teacher"], correct: 0, jp: "おばあちゃんです。" },
      { q: "What was Grandma telling the singer about?", opts: ["Her mother and how she made cocoa", "A soccer match", "A movie"], correct: 0, jp: "自分の母とココアの作り方についてです。" },
      { q: "What do you do with the milk?", opts: ["Heat it up", "Freeze it", "Throw it away"], correct: 0, jp: "温めます。" }
    ]
  },

  g1: {
    key: "past_progressive",
    tr: "3.4",
    component: "grammar-1",
    title: "Past progressive",
    jpTitle: "過去進行形",
    short: "was / were + -ing",
    role: "verb",
    rule: "Use was or were + verb-ing to talk about an action that was still going on at a moment in the past.",
    jpRule: "過去のある時点で続いていた動作は was / were + 動詞の -ing 形 で表します。",
    pattern: "subject + was / were + verb-ing",
    jpPattern: "主語 + was / were + 動詞の -ing 形",
    intro: [
      { t: "By 250 CE, people were drinking hot chocolate.", jp: "西暦250年までに、人々はホットチョコレートを飲んでいました。" },
      { t: "Was the cacao tree growing in Africa by then?", jp: "そのころカカオの木はアフリカで育っていましたか。" },
      { t: "We were talking about the history of chocolate when I remembered the chocolate bar in my backpack.", jp: "チョコレートの歴史について話していたとき、リュックの中の板チョコを思い出しました。" }
    ],
    rows: [
      { form: "I / He / She / It", pattern: "subject + was + verb-ing", example: "I was making hot chocolate in the kitchen.", jp: "私は台所でホットチョコレートを作っていました。" },
      { form: "You / We / They", pattern: "subject + were + verb-ing", example: "People were drinking hot chocolate by 250 CE.", jp: "西暦250年までに人々はホットチョコレートを飲んでいました。" },
      { form: "Negative", pattern: "subject + wasn't / weren't + verb-ing", example: "I wasn't doing it right.", jp: "私はやり方が正しくありませんでした。" },
      { form: "Question", pattern: "Was / Were + subject + verb-ing?", example: "Was the cacao tree growing in Africa by then?", jp: "そのころカカオの木はアフリカで育っていましたか。" },
      { form: "Interrupted action", pattern: "past progressive + when + simple past", example: "We were talking when I remembered the chocolate bar.", jp: "話していたとき、板チョコを思い出しました。" }
    ],
    noteRule: "The past progressive is the background; the simple past is the thing that happens in front of it.",
    noteException: "Use was with I/he/she/it, and were with you/we/they and plural nouns.",
    noteExceptionDetail: "Spelling: make → making (drop the e), stir → stirring (double the consonant), carry → carrying (keep the y).",
    table: {
      title: "was / were + verb-ing",
      columns: ["Subject", "was / were", "verb-ing", "Rest"],
      rows: [
        { cells: ["People", "were", "drinking", "hot chocolate by 250 CE."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["I", "was", "making", "hot chocolate one night."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["My grandma", "was", "telling", "me about her mother."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["I", "wasn't", "doing", "it right."], roles: ["subject", "verb", "verb", "clause"] }
      ],
      notes: [
        "Use the past progressive for the longer, background action.",
        "Use when + simple past for the short action that interrupts it."
      ],
      qa: [
        { question: "Was the cacao tree growing in Africa by then?", answer: "No, it wasn't. But it was growing there by the late 1800s." }
      ]
    },
    samples: [
      { t: "By 250 CE, people were drinking hot chocolate.", jp: "西暦250年までに、人々はホットチョコレートを飲んでいました。", h: "were drinking" },
      { t: "Was the cacao tree growing in Africa by then?", jp: "そのころカカオの木はアフリカで育っていましたか。", h: "Was the cacao tree growing" },
      { t: "No, it wasn't. But it was growing in Africa by the late 1800s.", jp: "いいえ。でも1800年代後半にはアフリカで育っていました。", h: "was growing" },
      { t: "We were talking about the history of chocolate when I remembered the chocolate bar.", jp: "チョコレートの歴史について話していたとき、板チョコを思い出しました。", h: "were talking" },
      { t: "I was making hot chocolate in the kitchen one night.", jp: "ある夜、私は台所でホットチョコレートを作っていました。", h: "was making" },
      { t: "My grandma was telling me I wasn't doing it right.", jp: "おばあちゃんは、私のやり方が正しくないと言っていました。", h: "was telling" },
      { t: "The Mayas were drinking chocolate 2,600 years ago.", jp: "マヤの人々は2,600年前にチョコレートを飲んでいました。", h: "were drinking" },
      { t: "People of the Americas were mixing cacao beans, water and spices.", jp: "アメリカ大陸の人々はカカオ豆と水と香辛料を混ぜていました。", h: "were mixing" },
      { t: "By 1500, people were paying thirty seeds for a rabbit.", jp: "1500年までに、人々はウサギ1匹に種30個を払っていました。", h: "were paying" },
      { t: "By 1847 they were enjoying chocolate candy bars.", jp: "1847年には板チョコを楽しんでいました。", h: "were enjoying" }
    ],
    levelup: {
      rules: [
        { title: "Use it for the background action", jpTitle: "背景の動作に使う",
          sub: "The past progressive sets the scene — something that was already going on.", jpSub: "すでに続いていた場面を表すのが過去進行形です。",
          transforms: [["people / drink hot chocolate / by 250 CE", "By 250 CE, people were drinking hot chocolate."], ["I / make hot chocolate / one night", "I was making hot chocolate one night."]],
          examples: [{ t: "The Mayas were growing cacao trees for 2,000 years.", jp: "マヤの人々は2,000年間カカオの木を育てていました。", h: "were growing" },
                     { t: "The Aztecs were adding spices to the drink.", jp: "アステカの人々はその飲み物に香辛料を加えていました。", h: "were adding" }] },
        { title: "Interrupt it with when + simple past", jpTitle: "when + 過去形でさえぎる",
          sub: "The long action takes -ing; the short action that cuts in takes the simple past.", jpSub: "長い動作は -ing、割り込む短い動作は過去形です。",
          transforms: [["we / talk about chocolate / I remember the bar", "We were talking about chocolate when I remembered the bar."], ["she / stir the cocoa / the milk boil", "She was stirring the cocoa when the milk boiled."]],
          examples: [{ t: "I was pouring the milkshake when the glass broke.", jp: "ミルクセーキを注いでいたとき、グラスが割れました。", h: "was pouring" },
                     { t: "They were mixing the ingredients when Grandma arrived.", jp: "材料を混ぜていたとき、おばあちゃんが来ました。", h: "were mixing" }] },
        { title: "Watch the -ing spelling", jpTitle: "-ing のつづりに注意",
          sub: "make → making, stir → stirring, carry → carrying.", jpSub: "make → making、stir → stirring、carry → carrying。",
          transforms: [["I / make / hot chocolate", "I was making hot chocolate."], ["she / stir / the pot", "She was stirring the pot."]],
          examples: [{ t: "He was stirring the hot chocolate slowly.", jp: "彼はホットチョコレートをゆっくりかき混ぜていました。", h: "was stirring" },
                     { t: "We were carrying the ingredients to the table.", jp: "私たちは材料をテーブルに運んでいました。", h: "were carrying" }] }
      ],
      mixed: [
        { t: "Leo was watching a Champions League match when the milk boiled over.", jp: "レオがチャンピオンズリーグの試合を見ていたとき、牛乳がふきこぼれました。", h: "was watching" },
        { t: "The farmers were opening the pods all morning.", jp: "農家は午前中ずっとさやを開けていました。", h: "were opening" },
        { t: "Nobody was using sugar in the drink at that time.", jp: "当時、その飲み物に砂糖を使う人はいませんでした。", h: "was using" },
        { t: "What were the Spanish doing with the cacao beans?", jp: "スペイン人はカカオ豆で何をしていたのですか。", h: "were the Spanish doing" },
        { t: "She was pouring the milkshake into two glasses.", jp: "彼女はミルクセーキをグラス2つに注いでいました。", h: "was pouring" },
        { t: "They weren't measuring the ingredients carefully.", jp: "彼らは材料をていねいにはかっていませんでした。", h: "weren't measuring" }
      ]
    },
    quiz: [
      { stem: ["By 250 CE, people ", " hot chocolate."], answers: ["were drinking", "was drinking", "are drinking", "drink"], correct: 0, explTitle: "Plural subject", explBody: "“People” is plural, so use were + -ing.", jp: "西暦250年までに人々はホットチョコレートを飲んでいました。" },
      { stem: ["I ", " hot chocolate in the kitchen one night."], answers: ["was making", "were making", "am making", "make"], correct: 0, explTitle: "I takes was", explBody: "The subject I pairs with was + -ing.", jp: "ある夜、私は台所でホットチョコレートを作っていました。" },
      { stem: ["", "Was the cacao tree growing in Africa by then?” The answer in the book is ___."], answers: ["No, it wasn't.", "Yes, it was.", "Yes, it did.", "No, it didn't."], correct: 0, explTitle: "Short answer matches the auxiliary", explBody: "Answer a Was ...? question with was / wasn't.", jp: "いいえ、育っていませんでした。" },
      { stem: ["We were talking about chocolate ", " I remembered the bar."], answers: ["when", "while", "so", "because"], correct: 0, explTitle: "when + the short action", explBody: "When introduces the action that interrupts.", jp: "話していたとき、板チョコを思い出しました。" },
      { stem: ["My grandma ", " me about her mother."], answers: ["was telling", "were telling", "tell", "tells"], correct: 0, explTitle: "Singular subject", explBody: "“My grandma” is singular, so was telling.", jp: "おばあちゃんは自分の母のことを話していました。" },
      { stem: ["I ", " it right, so Grandma showed me."], answers: ["wasn't doing", "weren't doing", "didn't doing", "not was doing"], correct: 0, explTitle: "Negative past progressive", explBody: "wasn't + -ing.", jp: "私はやり方が正しくなかったので、おばあちゃんが教えてくれました。" },
      { stem: ["Choose the correct -ing form of “make”.", ""], answers: ["making", "makeing", "makking", "maked"], correct: 0, explTitle: "Drop the silent e", explBody: "make → making.", jp: "make の -ing 形は making です。" },
      { stem: ["Choose the correct -ing form of “stir”.", ""], answers: ["stirring", "stiring", "stireing", "stirred"], correct: 0, explTitle: "Double the consonant", explBody: "stir → stirring.", jp: "stir の -ing 形は stirring です。" },
      { stem: ["By 1500, people ", " thirty seeds for a rabbit."], answers: ["were paying", "was paying", "pay", "paid"], correct: 0, explTitle: "Plural subject", explBody: "“People” takes were + -ing.", jp: "1500年までにウサギ1匹に種30個を払っていました。" },
      { stem: ["Which part of “We were mixing when Grandma arrived” is the background?", ""], answers: ["We were mixing", "Grandma arrived", "when", "Grandma"], correct: 0, explTitle: "The -ing clause is the background", explBody: "The past progressive is the longer action already going on.", jp: "進行形の部分が背景です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["They were mixing the ingredients.", "They was mixing the ingredients.", "They were mix the ingredients.", "They are mixing the ingredients yesterday."], correct: 0, explTitle: "were + -ing", explBody: "Plural subject + were + verb-ing.", jp: "彼らは材料を混ぜていました。" },
      { stem: ["Choose the correct question.", ""], answers: ["Was the tree growing in Africa?", "The tree was growing in Africa?", "Did the tree growing in Africa?", "Was growing the tree in Africa?"], correct: 0, explTitle: "Was before the subject", explBody: "Move was in front of the subject.", jp: "その木はアフリカで育っていましたか。" },
      { stem: ["Which sentence uses when correctly?", ""], answers: ["I was pouring the milk when it spilled.", "I poured the milk when it was spilling.", "I was pouring the milk when it was spilling.", "I pour the milk when it spilled."], correct: 0, explTitle: "Long action + when + short action", explBody: "Progressive for the background, simple past for the interruption.", jp: "長い動作 + when + 短い動作です。" },
      { stem: ["Choose the correct negative.", ""], answers: ["We weren't measuring carefully.", "We wasn't measuring carefully.", "We weren't measure carefully.", "We didn't measuring carefully."], correct: 0, explTitle: "weren't + -ing", explBody: "Plural subject + weren't + verb-ing.", jp: "私たちはていねいにはかっていませんでした。" },
      { stem: ["Which -ing form is wrong?", ""], answers: ["carrying → carring", "make → making", "stir → stirring", "pour → pouring"], correct: 0, explTitle: "carry keeps the y", explBody: "carry → carrying, not carring.", jp: "carry は y を残して carrying です。" },
      { stem: ["Complete: “The Mayas ", " cacao trees for 2,000 years.”"], answers: ["were growing", "was growing", "grow", "grows"], correct: 0, explTitle: "Plural subject", explBody: "The Mayas → were growing.", jp: "マヤの人々は2,000年間カカオの木を育てていました。" },
      { stem: ["Which sentence is NOT past progressive?", ""], answers: ["Columbus brought cacao beans to Spain.", "People were drinking chocolate.", "She was stirring the cocoa.", "They were paying with seeds."], correct: 0, explTitle: "That one is simple past", explBody: "“Brought” has no was/were + -ing.", jp: "最初の文は単純過去です。" },
      { stem: ["Complete: “What ", " the Spanish doing with the beans?”"], answers: ["were", "was", "did", "are"], correct: 0, explTitle: "Plural subject in a question", explBody: "“The Spanish” is plural, so were.", jp: "スペイン人は豆で何をしていたのですか。" },
      { stem: ["Choose the correct word order.", ""], answers: ["He was stirring the hot chocolate slowly.", "He stirring was the hot chocolate slowly.", "Was he stirring slowly the hot chocolate.", "He was the hot chocolate stirring slowly."], correct: 0, explTitle: "subject + was + -ing + object", explBody: "Keep that order.", jp: "主語 + was + -ing + 目的語の順です。" },
      { stem: ["Why use the past progressive in “I was making hot chocolate when Grandma came in”?", ""], answers: ["Making was already happening when she came in.", "Making happened after she came in.", "Making never happened.", "Making will happen tomorrow."], correct: 0, explTitle: "Background action", explBody: "The -ing action was already under way.", jp: "作る動作はすでに進行中でした。" }
    ]
  },

  g2: {
    key: "so_that_cause_effect",
    tr: "3.7",
    component: "grammar-2",
    title: "Cause and effect with simple past and modals",
    jpTitle: "過去形と助動詞で表す原因と結果",
    short: "so that + could / would",
    role: "cause",
    rule: "Use so that + could or would to give the reason someone did something in the past.",
    jpRule: "過去に何かをした理由を言うときは so that + could / would を使います。",
    pattern: "simple past clause + so that + subject + could / would + base verb",
    jpPattern: "過去形の文 + so that + 主語 + could / would + 動詞の原形",
    intro: [
      { t: "The boy printed out the recipe so that he could read it while he was cooking.", jp: "その男の子は料理しながら読めるようにレシピを印刷しました。" },
      { t: "We put all the ingredients on the table so that it would be easy to find them later.", jp: "あとで見つけやすいように、材料を全部テーブルに置きました。" },
      { t: "The Aztecs added spices so that it would taste better.", jp: "アステカの人々は、おいしくなるように香辛料を加えました。" }
    ],
    rows: [
      { form: "Ability / possibility", pattern: "…so that + subject + could + base verb", example: "He printed the recipe so that he could read it.", jp: "彼は読めるようにレシピを印刷しました。" },
      { form: "Expected result", pattern: "…so that + subject + would + base verb", example: "We put them on the table so that it would be easy.", jp: "簡単になるように、それらをテーブルに置きました。" },
      { form: "Negative result", pattern: "…so that + subject + wouldn't + base verb", example: "We wore life jackets so that no one would have an accident.", jp: "事故が起きないように救命胴衣を着けました。" },
      { form: "Taking it somewhere", pattern: "…so that + subject + could + take / drink / buy", example: "Some were buried with chocolate so that they could take it with them.", jp: "持って行けるように、チョコレートとともに埋葬された人もいました。" },
      { form: "Short form", pattern: "so that → so (in speech)", example: "He showed me how to climb rocks, so that I can get stronger.", jp: "強くなれるように、彼は岩の登り方を教えてくれました。" }
    ],
    noteRule: "So that answers the question “why did they do it?” — it gives the purpose, not the time.",
    noteException: "Use could for what someone was able to do, and would for what was expected to happen.",
    noteExceptionDetail: "The verb after could or would is always the base form: could read, would taste, wouldn't have.",
    table: {
      title: "so that + could / would",
      columns: ["What they did", "so that", "Purpose"],
      rows: [
        { cells: ["The boy printed out the recipe", "so that", "he could read it while he was cooking."], roles: [null, "cause", "effect"] },
        { cells: ["We put all the ingredients on the table", "so that", "it would be easy to find them later."], roles: [null, "cause", "effect"] },
        { cells: ["The Aztecs added spices", "so that", "it would taste better."], roles: [null, "cause", "effect"] },
        { cells: ["The Spanish took the seeds back to Spain", "so that", "they could drink chocolate there."], roles: [null, "cause", "effect"] }
      ],
      notes: [
        "The base verb always follows could or would.",
        "So that can be shortened to so in everyday speech."
      ]
    },
    samples: [
      { t: "The boy printed out the recipe so that he could read it while he was cooking.", jp: "その男の子は料理しながら読めるようにレシピを印刷しました。", h: "so that he could read" },
      { t: "We put all the ingredients on the table so that it would be easy to find them later.", jp: "あとで見つけやすいように、材料を全部テーブルに置きました。", h: "so that it would be easy" },
      { t: "The Aztecs added spices so that it would taste better.", jp: "アステカの人々は、おいしくなるように香辛料を加えました。", h: "so that it would taste better" },
      { t: "Some were buried with chocolate so that they could take it with them.", jp: "持って行けるように、チョコレートとともに埋葬された人もいました。", h: "so that they could take" },
      { t: "The Spanish took the seeds back to Spain so that they could drink chocolate there.", jp: "スペイン人は、そこでチョコレートを飲めるように種を持ち帰りました。", h: "so that they could drink" },
      { t: "We wore life jackets so that no one would have an accident.", jp: "だれも事故に遭わないように救命胴衣を着けました。", h: "so that no one would have" },
      { t: "He showed me how to climb rocks so that I could get stronger.", jp: "強くなれるように、彼は岩の登り方を教えてくれました。", h: "so that I could get stronger" },
      { t: "She heated the milk slowly so that it wouldn't burn.", jp: "焦げないように、彼女は牛乳をゆっくり温めました。", h: "so that it wouldn't burn" },
      { t: "They left the artifacts so that other teams could excavate them later.", jp: "ほかのチームがあとで発掘できるように、遺物を残しておきました。", h: "so that other teams could excavate" },
      { t: "I wrote the recipe down so that I would remember it.", jp: "覚えておけるように、私はレシピを書きとめました。", h: "so that I would remember" }
    ],
    levelup: {
      rules: [
        { title: "Use could for what someone was able to do", jpTitle: "「できるように」には could",
          sub: "If the purpose is an ability, use could + base verb.", jpSub: "目的が「〜できるように」なら could + 動詞の原形です。",
          transforms: [["He printed the recipe / read it", "He printed the recipe so that he could read it."], ["The Spanish took the seeds / drink chocolate in Spain", "The Spanish took the seeds so that they could drink chocolate in Spain."]],
          examples: [{ t: "He printed the recipe so that he could read it.", jp: "読めるように、彼はレシピを印刷しました。", h: "so that he could read" },
                     { t: "We labelled the jars so that we could find the spices.", jp: "香辛料を見つけられるように、びんに名前をつけました。", h: "so that we could find" }] },
        { title: "Use would for the expected result", jpTitle: "「〜になるように」には would",
          sub: "If the purpose is what you expected to happen, use would + base verb.", jpSub: "目的が「〜になるように」なら would + 動詞の原形です。",
          transforms: [["We put them on the table / it be easy to find them", "We put them on the table so that it would be easy to find them."], ["The Aztecs added spices / it taste better", "The Aztecs added spices so that it would taste better."]],
          examples: [{ t: "The Aztecs added spices so that it would taste better.", jp: "おいしくなるように香辛料を加えました。", h: "so that it would taste better" },
                     { t: "I stirred it slowly so that it would stay smooth.", jp: "なめらかなままになるように、ゆっくりかき混ぜました。", h: "so that it would stay smooth" }] },
        { title: "Make the purpose negative with wouldn't", jpTitle: "否定の目的は wouldn't",
          sub: "Use wouldn't + base verb for something you wanted to avoid.", jpSub: "避けたいことには wouldn't + 動詞の原形を使います。",
          transforms: [["She heated the milk slowly / it not burn", "She heated the milk slowly so that it wouldn't burn."], ["We wore life jackets / no one have an accident", "We wore life jackets so that no one would have an accident."]],
          examples: [{ t: "She heated the milk slowly so that it wouldn't burn.", jp: "焦げないようにゆっくり温めました。", h: "so that it wouldn't burn" },
                     { t: "They covered the pods so that the seeds wouldn't dry out.", jp: "種が乾かないように、さやを覆いました。", h: "so that the seeds wouldn't dry out" }] }
      ],
      mixed: [
        { t: "Leo watched the recipe video twice so that he could copy every step.", jp: "全部の手順をまねできるように、レオはレシピ動画を2回見ました。", h: "so that he could copy" },
        { t: "We weighed the sugar in grams so that the recipe would work.", jp: "レシピがうまくいくように、砂糖をグラムではかりました。", h: "so that the recipe would work" },
        { t: "The Mayas used ten seeds so that they could buy a rabbit.", jp: "ウサギを買えるように、マヤの人々は種10個を使いました。", h: "so that they could buy" },
        { t: "Grandma warmed the cups so that the cocoa wouldn't cool down.", jp: "ココアが冷めないように、おばあちゃんはカップを温めました。", h: "so that the cocoa wouldn't cool down" },
        { t: "I set a timer so that I wouldn't forget the milkshake.", jp: "ミルクセーキを忘れないように、タイマーをかけました。", h: "so that I wouldn't forget" },
        { t: "They wrote everything down so that other cooks could follow it.", jp: "ほかの料理人が従えるように、彼らはすべて書きとめました。", h: "so that other cooks could follow" }
      ]
    },
    quiz: [
      { stem: ["The boy printed out the recipe so that he ", " read it."], answers: ["could", "can", "will", "would have"], correct: 0, explTitle: "Past purpose takes could", explBody: "In a past sentence, use could for ability.", jp: "読めるように印刷しました。" },
      { stem: ["We put the ingredients on the table so that it ", " easy to find them."], answers: ["would be", "will be", "could been", "is"], correct: 0, explTitle: "would + base verb", explBody: "Would is followed by the base form be.", jp: "見つけやすくなるようにしました。" },
      { stem: ["The Aztecs added spices so that it ", " better."], answers: ["would taste", "will taste", "would tasted", "tastes"], correct: 0, explTitle: "would + base verb", explBody: "Use the base form after would.", jp: "おいしくなるように香辛料を加えました。" },
      { stem: ["She heated the milk slowly so that it ", "."], answers: ["wouldn't burn", "won't burn", "wouldn't burned", "didn't burning"], correct: 0, explTitle: "Negative purpose", explBody: "wouldn't + base verb.", jp: "焦げないようにゆっくり温めました。" },
      { stem: ["“So that” tells you ___.", ""], answers: ["why someone did it", "when it happened", "where it happened", "who did it"], correct: 0, explTitle: "Purpose, not time", explBody: "So that gives the purpose.", jp: "so that は目的を表します。" },
      { stem: ["The Spanish took the seeds back so that they ", " chocolate in Spain."], answers: ["could drink", "can drink", "could drank", "drink"], correct: 0, explTitle: "could + base verb", explBody: "Use could + the base form drink.", jp: "スペインで飲めるように持ち帰りました。" },
      { stem: ["Which sentence is correct?", ""], answers: ["I wrote it down so that I would remember.", "I wrote it down so that I will remember.", "I wrote it down so that I would remembered.", "I wrote it down so I remembering."], correct: 0, explTitle: "Past sentence, past modal", explBody: "A past main clause takes would, not will.", jp: "過去の文には will ではなく would を使います。" },
      { stem: ["Some were buried with chocolate so that they ", " it with them."], answers: ["could take", "can take", "could took", "take"], correct: 0, explTitle: "could + base verb", explBody: "Use the base form after could.", jp: "持って行けるようにチョコレートとともに埋葬されました。" },
      { stem: ["In speech, “so that” is often shortened to ___.", ""], answers: ["so", "such", "for", "because"], correct: 0, explTitle: "Everyday short form", explBody: "People often just say so.", jp: "話し言葉では so とだけ言うことが多いです。" },
      { stem: ["They left the artifacts so that other teams ", " them later."], answers: ["could excavate", "can excavate", "could excavated", "excavate"], correct: 0, explTitle: "could + base verb", explBody: "Purpose about ability in the past.", jp: "あとで発掘できるように残しておきました。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["He printed the recipe so that he could read it.", "He printed the recipe so that he can read it.", "He printed the recipe so that he could reading it.", "He printed the recipe so he could read it so that."], correct: 0, explTitle: "so that + could + base verb", explBody: "Keep the base form after could.", jp: "読めるようにレシピを印刷しました。" },
      { stem: ["Which one shows an expected result rather than an ability?", ""], answers: ["We put them out so that it would be easy.", "He printed it so that he could read it.", "They took the seeds so that they could drink it.", "I climbed rocks so that I could get stronger."], correct: 0, explTitle: "would = expected result", explBody: "Would talks about the result you expect.", jp: "would は期待される結果を表します。" },
      { stem: ["Complete: “We wore life jackets so that no one ", " an accident.”"], answers: ["would have", "will have", "would had", "having"], correct: 0, explTitle: "would + base verb", explBody: "Use the base form have.", jp: "だれも事故に遭わないようにしました。" },
      { stem: ["Fix it: “She stirred it so that it would burned.”", ""], answers: ["She stirred it so that it wouldn't burn.", "She stirred it so that it would burn.", "She stirred it so that it will burn.", "She stirred it so that it burned."], correct: 0, explTitle: "Negative purpose + base verb", explBody: "wouldn't + burn.", jp: "焦げないようにかき混ぜました。" },
      { stem: ["Which question does so that answer?", ""], answers: ["Why did they do it?", "When did they do it?", "Where did they do it?", "How many did they do?"], correct: 0, explTitle: "Purpose", explBody: "So that answers why.", jp: "so that は「なぜ」に答えます。" },
      { stem: ["Choose the correct modal: “The Mayas used ten seeds so that they ___ buy a rabbit.”", ""], answers: ["could", "can", "will", "shall"], correct: 0, explTitle: "Past ability", explBody: "Could is the past form of can.", jp: "could は can の過去形です。" },
      { stem: ["Which sentence has the clauses in the right order?", ""], answers: ["I set a timer so that I wouldn't forget.", "So that I wouldn't forget I set a timer so.", "I so that wouldn't forget set a timer.", "Set a timer I so that wouldn't forget."], correct: 0, explTitle: "Main clause first", explBody: "Do the action first, then say why.", jp: "先に行動、あとに理由です。" },
      { stem: ["Complete: “We weighed the sugar in grams so that the recipe ___ work.”", ""], answers: ["would", "will", "would to", "is"], correct: 0, explTitle: "Past main clause → would", explBody: "The main verb weighed is past, so use would.", jp: "主節が過去なので would を使います。" },
      { stem: ["Which is NOT a purpose clause?", ""], answers: ["He printed it because he was bored.", "He printed it so that he could read it.", "She stirred it so that it wouldn't burn.", "They wrote it so that others could follow."], correct: 0, explTitle: "because gives a reason, not a purpose", explBody: "Because explains a cause that already exists; so that gives an aim.", jp: "because は理由、so that は目的です。" },
      { stem: ["Complete: “Grandma warmed the cups so that the cocoa ___ cool down.”", ""], answers: ["wouldn't", "would", "will not", "didn't"], correct: 0, explTitle: "Negative purpose", explBody: "Use wouldn't for something you want to avoid.", jp: "冷めないように、には wouldn't を使います。" }
    ]
  },

  reading: {
    tr: "3.8",
    title: "The Story of Chocolate",
    jpTitle: "チョコレートの物語",
    intro: "The story of chocolate starts with the Olmecs and the Mayan people, who lived in the Americas more than 1,000 years ago.",
    paras: [
      { t: "The Mayas had been growing cacao trees and using the seeds to make chocolate drinks for 2,000 years or more. In fact, scientists have analyzed chocolate residue from a ceramic “teapot.” The results suggest that the Mayas were drinking chocolate as early as 2,600 years ago!",
        q: "How did scientists know the Mayas drank chocolate?", opts: ["They analyzed residue from a ceramic teapot.", "They read a Mayan recipe book.", "They found a candy bar."], correct: 0, jp: "陶器のポットの残りを分析して分かりました。" },
      { t: "Some artifacts show people pouring the liquid into cups. The Mayas also used the seeds as currency. With ten seeds they could buy a rabbit.",
        q: "What could ten cacao seeds buy?", opts: ["A rabbit", "A house", "A teapot"], correct: 0, jp: "ウサギを1匹買えました。" },
      { t: "The story continues with the Aztecs, who also loved chocolate and prepared it hot like the Mayas. But the Aztecs added spices so that it would taste better. Some rich people drank chocolate for breakfast, lunch, and dinner. Between 1200 and 1500 CE, the Aztecs also used chocolate as currency. In fact, by 1500, people were paying thirty seeds for a rabbit.",
        q: "Why did the Aztecs add spices?", opts: ["So that it would taste better", "So that it would be cheaper", "So that it would be solid"], correct: 0, jp: "おいしくなるようにするためです。" },
      { t: "When the Spanish arrived in the Aztec capital in 1519 CE, they tried chocolate and hated it. Without sugar it was extremely bitter, so the Spanish mixed it with sugar. In 1528 CE, the Spanish took the Aztec seeds and recipe back to Spain so that they could drink chocolate there. Before this, no one in Europe knew about chocolate!",
        q: "Why did the Spanish hate chocolate at first?", opts: ["It was extremely bitter without sugar.", "It was too hot.", "It was too expensive."], correct: 0, jp: "砂糖なしではとても苦かったからです。" }
    ],
    strategy: {
      title: "Reading strategy — following a sequence",
      body: "This passage moves through time: the Mayas, then the Aztecs, then the Spanish. Watch for the signal words starts, continues, then and by — they tell you which part of the story you are in.",
      jp: "この文章はマヤ → アステカ → スペインと時代を進みます。starts・continues・then・by といった語に注目すると、今どの場面かが分かります。"
    },
    order: {
      title: "Put the story of chocolate in order",
      items: [
        "The Mayas grew cacao trees and drank chocolate 2,600 years ago.",
        "The Mayas used ten seeds to buy a rabbit.",
        "The Aztecs added spices so that it would taste better.",
        "By 1500 people were paying thirty seeds for a rabbit.",
        "The Spanish arrived in 1519 and hated the bitter drink.",
        "In 1528 the Spanish took the seeds and recipe back to Spain."
      ]
    },
    quiz: [
      { q: "Who lived in the Americas more than 1,000 years ago?", opts: ["The Olmecs and the Mayan people", "The Spanish", "The Romans"], correct: 0, jp: "オルメカ人とマヤの人々です。" },
      { q: "How long had the Mayas been growing cacao trees?", opts: ["2,000 years or more", "20 years", "200 years"], correct: 0, jp: "2,000年以上です。" },
      { q: "How did the Aztecs prepare chocolate?", opts: ["Hot, like the Mayas", "Frozen", "As a candy bar"], correct: 0, jp: "マヤの人々と同じように温かくして飲みました。" },
      { q: "In what year did the Spanish arrive in the Aztec capital?", opts: ["1519", "1528", "1200"], correct: 0, jp: "1519年です。" },
      { q: "What did the Spanish add to the drink?", opts: ["Sugar", "Ice", "Salt"], correct: 0, jp: "砂糖を加えました。" },
      { q: "By 1500, how many seeds bought a rabbit?", opts: ["Thirty", "Ten", "Three"], correct: 0, jp: "30個です。" },
      { q: "Before 1528, who in Europe knew about chocolate?", opts: ["No one", "Everyone", "Only kings"], correct: 0, jp: "だれも知りませんでした。" },
      { q: "“The Mayas were drinking chocolate 2,600 years ago” is in the ___.", opts: ["past progressive", "present perfect", "future"], correct: 0, jp: "過去進行形です。" }
    ]
  },

  writing: {
    genre: "A how-to recipe",
    jpGenre: "作り方のレシピ",
    modelTitle: "How to Make Grandma's Hot Chocolate",
    model: [
      "You will need: 200 grams of dark chocolate, 500 millilitres of milk, one teaspoon of vanilla and a little cinnamon.",
      "First, put the chocolate in a pan so that it can melt slowly.",
      "Second, heat the milk carefully so that it won't burn, then mix it with the chocolate.",
      "Finally, pour the hot chocolate into two cups and sprinkle on some cinnamon."
    ],
    modelJp: "材料：ダークチョコレート200グラム、牛乳500ミリリットル、バニラ小さじ1、シナモン少々。まずチョコレートをゆっくり溶かせるように鍋に入れます。",
    steps: [
      { t: "List the ingredients with grams, teaspoons or millilitres.", jp: "材料をグラム・小さじ・ミリリットルで書き出す。" },
      { t: "Put the steps in order with First, Second, Third and Finally.", jp: "First・Second・Third・Finally を使って手順を順に並べる。" },
      { t: "Use so that to explain why each step matters.", jp: "so that を使って、それぞれの手順の理由を説明する。" },
      { t: "End with how to serve it.", jp: "どう出すかで締めくくる。" }
    ],
    expressions: [
      { t: "You will need ___ grams of ___.", jp: "〜グラムの〜が必要です。" },
      { t: "First, ___ so that it can ___.", jp: "まず、〜できるように〜します。" },
      { t: "Heat it slowly so that it won't ___.", jp: "〜しないようにゆっくり温めます。" },
      { t: "Finally, pour it into ___.", jp: "最後に〜に注ぎます。" }
    ],
    checklist: [
      "I listed every ingredient with an amount.",
      "I used First, Second, Third and Finally.",
      "I used so that at least twice to give a reason.",
      "My steps are in an order somebody could actually follow."
    ],
    quiz: [
      { q: "Which belongs in the ingredients list?", opts: ["200 grams of dark chocolate", "Stir it slowly", "I love chocolate"], correct: 0, jp: "分量つきの材料を書きます。" },
      { q: "Which word signals the last step?", opts: ["Finally", "First", "Also"], correct: 0, jp: "Finally が最後の手順を示します。" },
      { q: "Choose the correct purpose clause.", opts: ["Heat it slowly so that it won't burn.", "Heat it slowly so that it burned.", "Heat it slowly so that burn."], correct: 0, jp: "so that + wouldn't / won't + 原形です。" },
      { q: "A recipe should be written in what order?", opts: ["The order you actually do the steps", "Alphabetical order", "Random order"], correct: 0, jp: "実際に行う順番で書きます。" },
      { q: "Which unit measures a small amount of powder?", opts: ["A teaspoon", "A kilometre", "A litre"], correct: 0, jp: "小さじです。" },
      { q: "“So that” in a recipe explains ___.", opts: ["why you do a step", "who cooked it", "when you ate it"], correct: 0, jp: "その手順をする理由を説明します。" },
      { q: "Which is the best closing line?", opts: ["Finally, pour it into two cups and sprinkle on cinnamon.", "The end.", "I don't like cooking."], correct: 0, jp: "どう出すかで締めくくります。" },
      { q: "Which verb form starts a recipe instruction?", opts: ["Put / Heat / Pour", "Putting / Heating / Pouring", "Puts / Heats / Pours"], correct: 0, jp: "命令形（原形）で始めます。" }
    ]
  }
};
