/* Our World Level 6 · Unit 4 — Water, Water Everywhere
   Source: Student's Book audio script TR 4.1-4.8. */
export default {
  unit: 4,
  title: "Water, Water Everywhere",
  jpTitle: "水はどこにでも",
  themeEmoji: "💧",
  slug: "water-water-everywhere",

  opener: {
    tr: "4.1",
    intro:
      "Some of the most beautiful places on earth are made up of water: oceans, rivers, waterfalls, and ice. Read about three famous wet places.",
    goals: [
      { en: "Describe famous places made of water.", jp: "水でできた有名な場所を説明する。" },
      { en: "Use the present perfect progressive to say how long something has been going on.", jp: "現在完了進行形を使って「どのくらい続いているか」を言う。" },
      { en: "Talk about saving water at home.", jp: "家で水を節約することについて話す。" },
      { en: "Use whatever, whenever, wherever and whoever.", jp: "whatever・whenever・wherever・whoever を使う。" },
      { en: "Read about the world's water and explain the numbers.", jp: "世界の水について読み、その数字を説明する。" }
    ],
    photoCards: [
      { emoji: "🧂", title: "The Dead Sea", text: "The salt water in the Dead Sea is good for your body. This sea is about eight times saltier than an ocean. You can float on it. It is about 400 meters below sea level and is the world's deepest saltwater lake.", jp: "死海の塩水は体によいとされます。海の約8倍の塩分で、浮くことができます。海面下約400メートルにあり、世界一深い塩水湖です。" },
      { emoji: "🧊", title: "The Hubbard Glacier", text: "The beautiful Hubbard Glacier has been flowing slowly towards the ocean for centuries, carving rocks along the way. Around 70 percent of fresh water on the planet's surface is frozen.", jp: "美しいハバード氷河は何世紀も海に向かってゆっくり流れ、岩を削っています。地表の淡水の約70パーセントは凍っています。" },
      { emoji: "🐊", title: "The Asmat Swamp", text: "The Asmat Swamp in Indonesia is home to amazing animals like crocodiles, sea snakes, and Komodo dragons. These wetlands control floods, and the plants filter dirty water and make it clean.", jp: "インドネシアのアスマット湿地にはワニ、ウミヘビ、コモドドラゴンなどが住みます。湿地は洪水を防ぎ、植物が汚れた水をろ過してきれいにします。" },
      { emoji: "❄️", title: "Frozen for billions of years", text: "The glacier is formed from drops of water that froze billions of years ago.", jp: "氷河は何十億年も前に凍った水のしずくからできています。" }
    ],
    lookAndCheck: [
      { q: "How much saltier is the Dead Sea than an ocean?", opts: ["About eight times", "About two times", "About a hundred times"], correct: 0, jp: "海の約8倍です。" },
      { q: "How far below sea level is the Dead Sea?", opts: ["About 400 meters", "About 40 meters", "About 4,000 meters"], correct: 0, jp: "海面下約400メートルです。" },
      { q: "What does the Hubbard Glacier do to the rocks?", opts: ["It carves them.", "It melts them.", "It paints them."], correct: 0, jp: "岩を削ります。" },
      { q: "Why are wetlands important?", opts: ["They control floods and filter dirty water.", "They make salt.", "They stop the wind."], correct: 0, jp: "洪水を防ぎ、汚れた水をろ過するからです。" }
    ],
    sort: {
      title: "Fresh water, salt water or frozen?",
      zones: [
        { id: "fresh", label: "🚰 Fresh water" },
        { id: "salt", label: "🧂 Salt water" },
        { id: "frozen", label: "🧊 Frozen" }
      ],
      tiles: [
        { text: "a river", zone: "fresh" },
        { text: "a swamp", zone: "fresh" },
        { text: "groundwater", zone: "fresh" },
        { text: "the Dead Sea", zone: "salt" },
        { text: "an ocean", zone: "salt" },
        { text: "the sea", zone: "salt" },
        { text: "a glacier", zone: "frozen" },
        { text: "an ice storm", zone: "frozen" },
        { text: "70% of surface fresh water", zone: "frozen" }
      ]
    },
    quiz: [
      { q: "Which is the world's deepest saltwater lake?", opts: ["The Dead Sea", "Lake Titicaca", "The Asmat Swamp"], correct: 0, jp: "死海です。" },
      { q: "How long has the Hubbard Glacier been flowing towards the ocean?", opts: ["For centuries", "For a week", "For a year"], correct: 0, jp: "何世紀もの間です。" },
      { q: "What percent of surface fresh water is frozen?", opts: ["Around 70 percent", "Around 7 percent", "Around 97 percent"], correct: 0, jp: "約70パーセントです。" },
      { q: "Where is the Asmat Swamp?", opts: ["Indonesia", "Venezuela", "Egypt"], correct: 0, jp: "インドネシアです。" },
      { q: "What can you do in the Dead Sea?", opts: ["Float", "Ski", "Dig"], correct: 0, jp: "浮くことができます。" },
      { q: "What do swamp plants do to dirty water?", opts: ["Filter it", "Freeze it", "Sell it"], correct: 0, jp: "ろ過します。" },
      { q: "Which animals live in the Asmat Swamp?", opts: ["Crocodiles, sea snakes and Komodo dragons", "Penguins and polar bears", "Camels and lions"], correct: 0, jp: "ワニ、ウミヘビ、コモドドラゴンです。" },
      { q: "The Hubbard Glacier is formed from drops of water that ___.", opts: ["froze billions of years ago", "fell last year", "came from the Dead Sea"], correct: 0, jp: "何十億年も前に凍った水のしずくからできています。" }
    ]
  },

  v1: {
    tr: "4.2",
    words: [
      { w: "a waterfall", norm: "waterfall", emoji: "🏞️", ipa: "ˈwɔːtərfɔːl", syl: "wa-ter-fall", pos: "noun", mean: "water falling straight down from a high place.", jw: "滝", jr: "たき", jm: "高い場所からまっすぐ落ちる水。",
        tr: "The highest waterfall in the world is in Venezuela.",
        ex: [["The highest waterfall in the world is in Venezuela.", "世界一高い滝はベネズエラにあります。"],
             ["Angel Falls is the tallest waterfall in the world.", "エンジェルフォールは世界一高い滝です。"],
             ["We could hear the waterfall before we could see it.", "その滝は見えるより先に音が聞こえました。"]] },
      { w: "wet", norm: "wet", emoji: "🌧️", ipa: "wet", syl: "wet", pos: "adjective", mean: "covered in water or not dry.", jw: "ぬれた", jr: "ぬれた", jm: "水がついていて乾いていないこと。",
        tr: "I don't like wet weather. I like sunny, dry weather.",
        ex: [["I don't like wet weather. I like sunny, dry weather.", "私は雨の天気が好きではありません。晴れて乾いた天気が好きです。"],
             ["Read about three famous wet places.", "有名な3つの水の多い場所について読みましょう。"],
             ["My shoes were wet after the storm.", "嵐のあと、私の靴はぬれていました。"]] },
      { w: "soak", norm: "soak", emoji: "🛁", ipa: "soʊk", syl: "soak", pos: "verb", mean: "to leave something in water for a while.", jw: "浸す", jr: "ひたす", jm: "しばらく水の中に入れておくこと。",
        tr: "Can you soak these clothes in water for me?",
        ex: [["Can you soak these clothes in water for me?", "この服を水に浸しておいてくれますか。"],
             ["Do you like to soak your feet in the ocean?", "海に足を浸すのは好きですか。"],
             ["Soak the beans overnight before you cook them.", "煮る前に豆を一晩水に浸しておきましょう。"]] },
      { w: "salt water", norm: "salt water", emoji: "🧂", ipa: "ˈsɔːlt ˌwɔːtər", syl: "salt wa-ter", pos: "noun", mean: "water with salt in it, like the sea.", jw: "塩水", jr: "しおみず", jm: "海のように塩の入った水。",
        tr: "Ugh. This soda tastes like salt water.",
        ex: [["Ugh. This soda tastes like salt water.", "うわ。この炭酸は塩水みたいな味がします。"],
             ["The salt water in the Dead Sea is good for your body.", "死海の塩水は体によいとされます。"],
             ["97.5% of the earth's water is salt water.", "地球の水の97.5パーセントは塩水です。"]] },
      { w: "a sea", norm: "sea", emoji: "🌊", ipa: "siː", syl: "sea", pos: "noun", mean: "a large area of salt water, smaller than an ocean.", jw: "海", jr: "うみ", jm: "大洋より小さい塩水の広い場所。",
        tr: "Let's swim in the sea.",
        ex: [["Let's swim in the sea.", "海で泳ぎましょう。"],
             ["This sea is about eight times saltier than an ocean.", "この海は大洋の約8倍しょっぱいです。"],
             ["There's water in lakes, and water in the sea.", "湖にも海にも水があります。"]] },
      { w: "float", norm: "float", emoji: "🛟", ipa: "floʊt", syl: "float", pos: "verb", mean: "to stay on the top of water without sinking.", jw: "浮く", jr: "うく", jm: "沈まずに水の上にいること。",
        tr: "Can you float on your back in the sea?",
        ex: [["Can you float on your back in the sea?", "海であおむけに浮けますか。"],
             ["You can float on the Dead Sea.", "死海では浮くことができます。"],
             ["Life jackets float and we don't!", "救命胴衣は浮きますが、私たちは浮きません！"]] },
      { w: "sea level", norm: "sea level", emoji: "📏", ipa: "ˈsiː ˌlevəl", syl: "sea lev-el", pos: "noun", mean: "the height of the surface of the sea, used to measure other heights.", jw: "海面", jr: "かいめん", jm: "高さをはかる基準になる海の表面の高さ。",
        tr: "Most people live above sea level.",
        ex: [["Most people live above sea level.", "ほとんどの人は海面より上に住んでいます。"],
             ["The Dead Sea is about 400 meters below sea level.", "死海は海面下約400メートルにあります。"],
             ["The Challenger Deep is 11,000 meters below sea level.", "チャレンジャー海淵は海面下11,000メートルです。"]] },
      { w: "a lake", norm: "lake", emoji: "🏔️", ipa: "leɪk", syl: "lake", pos: "noun", mean: "a large area of water with land all around it.", jw: "湖", jr: "みずうみ", jm: "まわりを陸に囲まれた広い水の場所。",
        tr: "The highest lake in the world is Lake Titicaca.",
        ex: [["The highest lake in the world is Lake Titicaca.", "世界一高い場所にある湖はチチカカ湖です。"],
             ["The Dead Sea is the world's deepest saltwater lake.", "死海は世界一深い塩水湖です。"],
             ["There's water in lakes, and water in the sea.", "湖にも海にも水があります。"]] },
      { w: "a glacier", norm: "glacier", emoji: "🧊", ipa: "ˈɡleɪʃər", syl: "gla-cier", pos: "noun", mean: "a very large mass of ice that moves slowly.", jw: "氷河", jr: "ひょうが", jm: "ゆっくり動くとても大きな氷の塊。",
        tr: "When a glacier reaches the ocean, pieces break off.",
        ex: [["When a glacier reaches the ocean, pieces break off.", "氷河が海に達すると、かけらが割れて落ちます。"],
             ["The Hubbard Glacier has been flowing for centuries.", "ハバード氷河は何世紀も流れ続けています。"],
             ["Most frozen fresh water is in a glacier.", "凍った淡水のほとんどは氷河にあります。"]] },
      { w: "carve", norm: "carve", emoji: "🪓", ipa: "kɑːrv", syl: "carve", pos: "verb", mean: "to cut a shape into something hard, slowly.", jw: "削る", jr: "けずる", jm: "硬いものをゆっくり切って形をつくること。",
        tr: "Rivers carve through mountains.",
        ex: [["Rivers carve through mountains.", "川は山を削って進みます。"],
             ["The glacier has carved these rocks along the way.", "その氷河は進みながらこれらの岩を削ってきました。"],
             ["Water carved this canyon over millions of years.", "水が何百万年もかけてこの峡谷を削りました。"]] },
      { w: "a drop of water", norm: "drop of water", emoji: "💧", ipa: "drɑːp əv ˈwɔːtər", syl: "drop of wa-ter", pos: "noun", mean: "one very small round amount of water.", jw: "水のしずく", jr: "みずのしずく", jm: "とても小さくて丸い水のかたまり一つ。",
        tr: "A drop of water just fell on my head.",
        ex: [["A drop of water just fell on my head.", "水のしずくが頭に落ちてきました。"],
             ["A glacier is formed from a drop of water that froze long ago.", "氷河は昔凍った水のしずくからできています。"],
             ["Every drop of water on Earth has been here for billions of years.", "地球の水のしずくはどれも何十億年もここにあります。"]] },
      { w: "freeze", norm: "freeze", emoji: "❄️", ipa: "friːz", syl: "freeze", pos: "verb", mean: "to become hard and cold, and turn into ice.", jw: "凍る", jr: "こおる", jm: "冷たく硬くなって氷になること。",
        tr: "When water falls in cold places, it freezes.",
        ex: [["When water falls in cold places, it freezes.", "寒い場所に水が落ちると、凍ります。"],
             ["Drops of water freeze into ice inside a glacier.", "水のしずくは氷河の中で凍って氷になります。"],
             ["Water freezes at zero degrees.", "水は0度で凍ります。"]] },
      { w: "fresh water", norm: "fresh water", emoji: "🚰", ipa: "ˈfreʃ ˌwɔːtər", syl: "fresh wa-ter", pos: "noun", mean: "water without salt, the kind we can drink.", jw: "淡水", jr: "たんすい", jm: "塩の入っていない、飲める水。",
        tr: "Many fish live in fresh water.",
        ex: [["Many fish live in fresh water.", "多くの魚は淡水にすんでいます。"],
             ["Around 70 percent of fresh water on the surface is frozen.", "地表の淡水の約70パーセントは凍っています。"],
             ["We can only drink about 1% of the world's fresh water.", "世界の淡水のうち飲めるのは約1パーセントだけです。"]] },
      { w: "a swamp", norm: "swamp", emoji: "🐊", ipa: "swɑːmp", syl: "swamp", pos: "noun", mean: "soft wet land where water covers the ground.", jw: "湿地", jr: "しっち", jm: "水が地面をおおう、やわらかくぬれた土地。",
        tr: "Many insects live near swamps.",
        ex: [["Many insects live near swamps.", "多くの昆虫は湿地の近くにすんでいます。"],
             ["The Asmat Swamp is home to crocodiles and sea snakes.", "アスマット湿地にはワニやウミヘビがすんでいます。"],
             ["A swamp can control floods.", "湿地は洪水を防ぐことができます。"]] },
      { w: "filter", norm: "filter", emoji: "🫗", ipa: "ˈfɪltər", syl: "fil-ter", pos: "verb", mean: "to pass water through something to take the dirt out.", jw: "ろ過する", jr: "ろかする", jm: "水を何かに通して汚れを取り除くこと。",
        tr: "Drinking water is filtered.",
        ex: [["Drinking water is filtered.", "飲み水はろ過されています。"],
             ["The plants filter dirty water and make it clean.", "植物が汚れた水をろ過してきれいにします。"],
             ["We filter the water before we drink it.", "私たちは飲む前に水をろ過します。"]] }
    ]
  },

  v2: {
    tr: "4.5",
    words: [
      { w: "a faucet", norm: "faucet", emoji: "🚰", ipa: "ˈfɔːsɪt", syl: "fau-cet", pos: "noun", mean: "the handle you turn to let water out of a pipe.", jw: "蛇口", jr: "じゃぐち", jm: "水を出すために回す取っ手。",
        tr: "How do you turn on the faucet?",
        ex: [["How do you turn on the faucet?", "蛇口はどうやって開けますか。"],
             ["Turn off the faucet if you wash the dishes by hand.", "手で皿を洗うときは蛇口を閉めましょう。"],
             ["Only 5% of fresh water goes to the faucets in our homes.", "淡水のうち家の蛇口に届くのは5パーセントだけです。"]] },
      { w: "leak", norm: "leak", emoji: "💦", ipa: "liːk", syl: "leak", pos: "verb", mean: "to escape slowly through a hole.", jw: "もれる", jr: "もれる", jm: "穴からゆっくり出てしまうこと。",
        tr: "The water is leaking on the floor.",
        ex: [["The water is leaking on the floor.", "水が床にもれています。"],
             ["Do you tell someone when water is leaking in your home?", "家で水がもれているとき、だれかに言いますか。"],
             ["A tap that leaks wastes 230 liters a day.", "もれる蛇口は1日に230リットルをむだにします。"]] },
      { w: "a drain", norm: "drain", emoji: "🕳️", ipa: "dreɪn", syl: "drain", pos: "noun", mean: "the pipe that carries used water away.", jw: "排水口", jr: "はいすいこう", jm: "使った水を流す管。",
        tr: "That drain smells bad.",
        ex: [["That drain smells bad.", "その排水口はにおいます。"],
             ["Fifteen liters of water go down the drain each time.", "そのたびに15リットルの水が排水口に流れます。"],
             ["Whoever threw paint down the drain is in trouble!", "排水口にペンキを流した人は困ったことになります！"]] },
      { w: "save", norm: "save", emoji: "🛟", ipa: "seɪv", syl: "save", pos: "verb", mean: "to use less of something so there is more left.", jw: "節約する", jr: "せつやくする", jm: "少なく使って残しておくこと。",
        tr: "People need to save water. There's a drought.",
        ex: [["People need to save water. There's a drought.", "人々は水を節約する必要があります。干ばつだからです。"],
             ["You can save a lot of water by taking quick showers.", "短いシャワーでたくさんの水を節約できます。"],
             ["Do whatever you can to save water.", "水を節約するためにできることは何でもしましょう。"]] },
      { w: "running water", norm: "running water", emoji: "🚿", ipa: "ˈrʌnɪŋ ˌwɔːtər", syl: "run-ning wa-ter", pos: "noun", mean: "water that comes into a home through pipes.", jw: "水道水", jr: "すいどうすい", jm: "管を通って家に届く水。",
        tr: "Many people don't have running water in their homes.",
        ex: [["Many people don't have running water in their homes.", "家に水道水がない人がたくさんいます。"],
             ["Running water is something easy to take for granted.", "水道水は当たり前だと思いがちなものです。"],
             ["Don't leave the running water on while you brush your teeth.", "歯をみがいている間、水道水を出しっぱなしにしないでください。"]] },
      { w: "waste", norm: "waste", emoji: "🗑️", ipa: "weɪst", syl: "waste", pos: "verb", mean: "to use something badly so it is lost for nothing.", jw: "むだにする", jr: "むだにする", jm: "うまく使わず、何にもならずに失うこと。",
        tr: "Don't waste water. You should save it.",
        ex: [["Don't waste water. You should save it.", "水をむだにしないで。節約すべきです。"],
             ["Baths waste a lot of water.", "お風呂は水をたくさんむだにします。"],
             ["If we want water in the future, we must not waste it now.", "将来水がほしければ、今むだにしてはいけません。"]] }
    ]
  },

  academic: ["percentage", "compare", "information_graphic", "main_idea", "support"],

  content: [
    { w: "groundwater", norm: "groundwater", emoji: "⛲", ipa: "ˈɡraʊndwɔːtər", syl: "ground-wa-ter", pos: "noun", mean: "water that is under the ground.", jw: "地下水", jr: "ちかすい", jm: "地面の下にある水。",
      ex: [["Water that's under the ground is called groundwater.", "地面の下の水は地下水と呼ばれます。"],
           ["We can only reach 30% of our groundwater.", "地下水のうち届くのは30パーセントだけです。"],
           ["Most groundwater is polluted.", "地下水の多くは汚染されています。"]] },
    { w: "water vapor", norm: "water vapor", emoji: "☁️", ipa: "ˈwɔːtər ˌveɪpər", syl: "wa-ter va-por", pos: "noun", mean: "water in the air as a gas.", jw: "水蒸気", jr: "すいじょうき", jm: "気体になって空気中にある水。",
      ex: [["Water even exists in the sky. That is called water vapor.", "水は空にもあります。それは水蒸気と呼ばれます。"],
           ["Water vapor becomes cloud when it cools.", "水蒸気は冷えると雲になります。"],
           ["You cannot see water vapor, but it is there.", "水蒸気は見えませんが、そこにあります。"]] },
    { w: "polluted", norm: "polluted", emoji: "🛢️", ipa: "pəˈluːtɪd", syl: "pol-lut-ed", pos: "adjective", mean: "made dirty and unsafe by waste.", jw: "汚染された", jr: "おせんされた", jm: "ごみや廃棄物で汚れて危険になっていること。",
      ex: [["Most of our groundwater is polluted.", "地下水の多くは汚染されています。"],
           ["She polluted the rivers and flooded the land.", "彼女は川を汚し、土地を水びたしにしました。"],
           ["We must not waste water or leave it polluted.", "水をむだにしたり汚染したままにしてはいけません。"]] },
    { w: "a water footprint", norm: "water footprint", emoji: "👣", ipa: "ˈwɔːtər ˌfʊtprɪnt", syl: "wa-ter foot-print", pos: "noun", mean: "the total amount of water a person or product uses.", jw: "ウォーターフットプリント", jr: "うぉーたーふっとぷりんと", jm: "人や製品が使う水の総量。",
      ex: [["The water we don't see is a big part of our water footprint.", "見えない水は私たちのウォーターフットプリントの大部分です。"],
           ["A T-shirt has a surprisingly large water footprint.", "Tシャツのウォーターフットプリントは驚くほど大きいです。"],
           ["Your water footprint is the total amount of water you use.", "ウォーターフットプリントとは、あなたが使う水の総量です。"]] },
    { w: "surface water", norm: "surface water", emoji: "🏞️", ipa: "ˈsɜːrfɪs ˌwɔːtər", syl: "sur-face wa-ter", pos: "noun", mean: "water above the ground, like lakes and rivers.", jw: "地表水", jr: "ちひょうすい", jm: "湖や川のように地面の上にある水。",
      ex: [["There is water above ground called surface water.", "地面の上には地表水と呼ばれる水があります。"],
           ["Lakes, swamps and rivers are all surface water.", "湖も湿地も川もすべて地表水です。"],
           ["Surface water is easier to reach than groundwater.", "地表水は地下水より届きやすいです。"]] }
  ],

  song: {
    tr: "4.3",
    title: "A World of Water",
    jpTitle: "水の世界",
    lyrics: [
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "A world of wonder. A world of water.", jp: "不思議の世界。水の世界。" },
      { t: "I've been thinking about", jp: "ずっと考えている" },
      { t: "all the water in our world.", jp: "この世界の水すべてのことを。" },
      { t: "There's water in lakes, and water in the sea.", jp: "湖にも海にも水がある。" },
      { t: "There's even water in you and me!", jp: "きみと私の中にも水がある！" },
      { t: "A puddle of water. A waterfall.", jp: "水たまり。滝。" },
      { t: "A tall glass of water. I love it all!", jp: "大きなコップ一杯の水。全部大好き！" },
      { t: "Fresh water, salt water, water in the sink.", jp: "淡水も塩水も、流しの水も。" },
      { t: "I've been taking some time to think", jp: "少し時間をとって考えてきた" },
      { t: "about how much water there is in the world!", jp: "世界にどれだけ水があるのかを！" },
      { t: "It's everywhere!", jp: "どこにでもある！" },
      { t: "Why do we need water in this world?", jp: "この世界でなぜ水が必要なの？" },
      { t: "We need water for crops and water for grass.", jp: "作物にも草にも水が必要。" },
      { t: "We need water for plants and animals, too!", jp: "植物にも動物にも水が必要！" },
      { t: "Everything needs water.", jp: "すべてに水が必要。" },
      { t: "I know that's true!", jp: "それは本当だと知っている！" },
      { t: "Have you been thinking about all the water in our world?", jp: "この世界の水についてずっと考えてきましたか。" }
    ],
    tapWords: ["water", "lakes", "sea", "waterfall", "Fresh", "salt", "crops", "plants"],
    quiz: [
      { q: "Where does the song say there is water?", opts: ["In lakes, in the sea, and in you and me", "Only in the sea", "Only in a glass"], correct: 0, jp: "湖にも海にも、そして私たちの中にもあります。" },
      { q: "“I've been thinking about all the water” is in the ___.", opts: ["present perfect progressive", "simple past", "past progressive"], correct: 0, jp: "現在完了進行形です。" },
      { q: "What do we need water for, in the song?", opts: ["Crops, grass, plants and animals", "Only for drinking", "Only for washing"], correct: 0, jp: "作物・草・植物・動物のためです。" },
      { q: "What two kinds of water does the chorus name?", opts: ["Fresh water and salt water", "Hot water and cold water", "Clean water and paint"], correct: 0, jp: "淡水と塩水です。" },
      { q: "“It's everywhere!” refers to ___.", opts: ["water", "grass", "a sink"], correct: 0, jp: "水のことです。" },
      { q: "What does the singer say about everything?", opts: ["Everything needs water.", "Everything is wet.", "Everything is frozen."], correct: 0, jp: "すべてに水が必要だと言っています。" }
    ]
  },

  g1: {
    key: "present_perfect_progressive",
    tr: "4.4",
    component: "grammar-1",
    title: "Present perfect progressive with for and since",
    jpTitle: "現在完了進行形と for / since",
    short: "have been + -ing",
    role: "verb",
    rule: "Use have or has + been + verb-ing to talk about an action that started in the past and is still going on now. Use for with a length of time and since with the moment it started.",
    jpRule: "過去に始まって今も続いている動作は have / has + been + 動詞の -ing 形 で表します。期間の長さには for、始まった時点には since を使います。",
    pattern: "subject + have / has + been + verb-ing + for / since + time",
    jpPattern: "主語 + have / has + been + 動詞の -ing 形 + for / since + 時間",
    intro: [
      { t: "How long have you and your sister been taking swimming lessons?", jp: "あなたとお姉さんはどのくらい水泳を習っていますか。" },
      { t: "I've been taking swimming lessons for three months.", jp: "私は3か月間水泳を習っています。" },
      { t: "My sister has been taking swimming lessons since March.", jp: "姉は3月から水泳を習っています。" }
    ],
    rows: [
      { form: "I / You / We / They", pattern: "subject + have been + verb-ing", example: "I've been taking swimming lessons for three months.", jp: "私は3か月間水泳を習っています。" },
      { form: "He / She / It", pattern: "subject + has been + verb-ing", example: "My sister has been taking swimming lessons since March.", jp: "姉は3月から水泳を習っています。" },
      { form: "for + length of time", pattern: "for + three months / a year / centuries", example: "I've been taking swimming lessons for about a year.", jp: "私は1年ほど水泳を習っています。" },
      { form: "since + starting point", pattern: "since + March / she was nine", example: "My sister has been taking lessons since she was nine.", jp: "姉は9歳のときから習っています。" },
      { form: "Question", pattern: "How long + have/has + subject + been + verb-ing?", example: "How long have you been taking swimming lessons?", jp: "どのくらい水泳を習っていますか。" }
    ],
    noteRule: "The present perfect progressive stresses that the action is still going on and has lasted a while.",
    noteException: "Use for with a length of time and since with the point it began — the same rule as the present perfect.",
    noteExceptionDetail: "Contract it in speech: I've been, she's been, they've been. The negative is haven't been / hasn't been + verb-ing.",
    table: {
      title: "have / has been + verb-ing",
      columns: ["Subject", "have / has been", "verb-ing", "for / since"],
      rows: [
        { cells: ["I", "'ve been", "taking swimming lessons", "for three months."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["My sister", "has been", "taking swimming lessons", "since March."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["The Hubbard Glacier", "has been", "flowing towards the ocean", "for centuries."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["I", "haven't been", "wasting water", "since the drought started."], roles: ["subject", "verb", "verb", "clause"] }
      ],
      notes: [
        "Been never changes — only have / has does.",
        "Put How long at the front to ask about the length."
      ],
      qa: [
        { question: "How long have you been taking swimming lessons?", answer: "I've been taking them for three months." },
        { question: "How long has your sister been taking them?", answer: "She's been taking them since she was nine." }
      ]
    },
    samples: [
      { t: "How long have you and your sister been taking swimming lessons?", jp: "あなたとお姉さんはどのくらい水泳を習っていますか。", h: "have you and your sister been taking" },
      { t: "I've been taking swimming lessons for three months.", jp: "私は3か月間水泳を習っています。", h: "'ve been taking" },
      { t: "I've been taking swimming lessons for about a year.", jp: "私は1年ほど水泳を習っています。", h: "'ve been taking" },
      { t: "My sister has been taking swimming lessons since March.", jp: "姉は3月から水泳を習っています。", h: "has been taking" },
      { t: "My sister has been taking swimming lessons since she was nine.", jp: "姉は9歳のときから水泳を習っています。", h: "has been taking" },
      { t: "The Hubbard Glacier has been flowing towards the ocean for centuries.", jp: "ハバード氷河は何世紀も海に向かって流れ続けています。", h: "has been flowing" },
      { t: "I've been thinking about all the water in our world.", jp: "私はこの世界の水についてずっと考えています。", h: "'ve been thinking" },
      { t: "I've been taking some time to think.", jp: "私は考える時間をとってきました。", h: "'ve been taking" },
      { t: "We haven't been wasting water since the drought started.", jp: "干ばつが始まってから、私たちは水をむだにしていません。", h: "haven't been wasting" },
      { t: "Scientists have been studying the world's fresh water for decades.", jp: "科学者たちは何十年も世界の淡水を研究し続けています。", h: "have been studying" }
    ],
    levelup: {
      rules: [
        { title: "Been never changes", jpTitle: "been は形が変わらない",
          sub: "Only have and has change with the subject. Been stays the same, and the main verb always takes -ing.", jpSub: "変わるのは have / has だけです。been はそのまま、動詞は必ず -ing 形です。",
          transforms: [["I / take swimming lessons / three months", "I've been taking swimming lessons for three months."], ["My sister / take lessons / March", "My sister has been taking lessons since March."]],
          examples: [{ t: "He has been saving water since last summer.", jp: "彼は去年の夏から水を節約しています。", h: "has been saving" },
                     { t: "They have been filtering the river water for years.", jp: "彼らは何年も川の水をろ過しています。", h: "have been filtering" }] },
        { title: "for a length, since a starting point", jpTitle: "for は期間、since は始まった時点",
          sub: "Ask yourself whether the answer is a length (three months) or a moment (March).", jpSub: "答えが「長さ」なら for、「いつから」なら since です。",
          transforms: [["the glacier / flow / centuries", "The glacier has been flowing for centuries."], ["I / save water / the drought started", "I have been saving water since the drought started."]],
          examples: [{ t: "The glacier has been carving rocks for centuries.", jp: "その氷河は何世紀も岩を削り続けています。", h: "has been carving" },
                     { t: "I have been saving water since the drought started.", jp: "干ばつが始まってから水を節約しています。", h: "have been saving" }] },
        { title: "Ask with How long ... been ...ing?", jpTitle: "How long ... been ...ing? でたずねる",
          sub: "Move have or has in front of the subject; been and the -ing verb stay where they are.", jpSub: "have / has を主語の前に出します。been と -ing はそのままです。",
          transforms: [["you / take swimming lessons", "How long have you been taking swimming lessons?"], ["the glacier / flow", "How long has the glacier been flowing?"]],
          examples: [{ t: "How long has the glacier been flowing?", jp: "その氷河はどのくらい流れ続けていますか。", h: "has the glacier been flowing" },
                     { t: "How long have they been leaking?", jp: "それはどのくらいもれ続けていますか。", h: "have they been leaking" }] }
      ],
      mixed: [
        { t: "Leo has been playing soccer since he was six.", jp: "レオは6歳のときからサッカーをしています。", h: "has been playing" },
        { t: "The faucet has been leaking for two days.", jp: "その蛇口は2日間もれ続けています。", h: "has been leaking" },
        { t: "We have been taking quicker showers since March.", jp: "3月から私たちは短いシャワーにしています。", h: "have been taking" },
        { t: "The plants have been filtering the dirty water all summer.", jp: "植物はひと夏じゅう汚れた水をろ過し続けています。", h: "have been filtering" },
        { t: "How long has the Dead Sea been shrinking?", jp: "死海はどのくらい縮み続けていますか。", h: "has the Dead Sea been shrinking" },
        { t: "I haven't been wasting water since I read this page.", jp: "このページを読んでから、私は水をむだにしていません。", h: "haven't been wasting" }
      ]
    },
    quiz: [
      { stem: ["I ", " taking swimming lessons for three months."], answers: ["have been", "has been", "am been", "was been"], correct: 0, explTitle: "I takes have been", explBody: "The subject I pairs with have been + -ing.", jp: "私は3か月間水泳を習っています。" },
      { stem: ["My sister ", " taking lessons since March."], answers: ["has been", "have been", "is been", "was been"], correct: 0, explTitle: "Singular takes has been", explBody: "My sister is third-person singular.", jp: "姉は3月から習っています。" },
      { stem: ["The glacier has been flowing ", " centuries."], answers: ["for", "since", "from", "during"], correct: 0, explTitle: "for + length", explBody: "Centuries is a length of time.", jp: "何世紀も流れ続けています。" },
      { stem: ["My sister has been taking lessons ", " she was nine."], answers: ["since", "for", "in", "ago"], correct: 0, explTitle: "since + starting point", explBody: "“She was nine” names when it began.", jp: "9歳のときから習っています。" },
      { stem: ["How long ", " you been taking swimming lessons?"], answers: ["have", "has", "are", "did"], correct: 0, explTitle: "have before you", explBody: "Questions with you use have.", jp: "どのくらい水泳を習っていますか。" },
      { stem: ["The word after “been” always ends in ___.", ""], answers: ["-ing", "-ed", "-s", "-er"], correct: 0, explTitle: "been + verb-ing", explBody: "The main verb takes the -ing form.", jp: "been のあとは -ing 形です。" },
      { stem: ["We ", " wasting water since the drought started."], answers: ["haven't been", "hasn't been", "didn't been", "aren't been"], correct: 0, explTitle: "Plural negative", explBody: "We takes haven't been + -ing.", jp: "干ばつが始まってから水をむだにしていません。" },
      { stem: ["Scientists ", " studying fresh water for decades."], answers: ["have been", "has been", "is being", "was being"], correct: 0, explTitle: "Plural subject", explBody: "Scientists is plural, so have been.", jp: "科学者は何十年も淡水を研究しています。" },
      { stem: ["The faucet has been leaking ", " two days."], answers: ["for", "since", "at", "by"], correct: 0, explTitle: "for + length", explBody: "Two days is a length of time.", jp: "その蛇口は2日間もれ続けています。" },
      { stem: ["“I've been thinking about the water” means I ___.", ""], answers: ["started thinking earlier and am still thinking", "stopped thinking", "will think tomorrow", "never thought"], correct: 0, explTitle: "Still going on", explBody: "The action started before now and continues.", jp: "前から今も考え続けているという意味です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["She has been saving water since May.", "She have been saving water since May.", "She has been save water since May.", "She has being saved water since May."], correct: 0, explTitle: "has been + -ing", explBody: "Singular subject + has been + verb-ing.", jp: "彼女は5月から水を節約しています。" },
      { stem: ["Choose the correct question.", ""], answers: ["How long has the glacier been flowing?", "How long the glacier has been flowing?", "How long has been the glacier flowing?", "How long is the glacier been flowing?"], correct: 0, explTitle: "has before the subject", explBody: "Move has in front of the subject.", jp: "その氷河はどのくらい流れ続けていますか。" },
      { stem: ["Which word completes it? “They have been filtering the water ___ years.”", ""], answers: ["for", "since", "from", "at"], correct: 0, explTitle: "for + length", explBody: "Years is a length of time.", jp: "何年もろ過し続けています。" },
      { stem: ["Choose the correct negative.", ""], answers: ["I haven't been wasting water.", "I hasn't been wasting water.", "I haven't being waste water.", "I don't have been wasting water."], correct: 0, explTitle: "haven't been + -ing", explBody: "Add n't to have.", jp: "私は水をむだにしていません。" },
      { stem: ["Which sentence is NOT present perfect progressive?", ""], answers: ["I took swimming lessons last year.", "I've been taking swimming lessons.", "She has been saving water.", "They have been filtering it."], correct: 0, explTitle: "That one is simple past", explBody: "It has no have/has been + -ing.", jp: "最初の文は単純過去です。" },
      { stem: ["Complete: “The Hubbard Glacier ___ been flowing for centuries.”", ""], answers: ["has", "have", "is", "was"], correct: 0, explTitle: "Singular subject", explBody: "One glacier → has been.", jp: "1つの氷河なので has been です。" },
      { stem: ["Which one is wrong?", ""], answers: ["I've been taking lessons since three months.", "I've been taking lessons for three months.", "I've been taking lessons since March.", "I haven't been taking lessons since March."], correct: 0, explTitle: "since never takes a length", explBody: "Use for three months, or since March.", jp: "since に「長さ」は使えません。" },
      { stem: ["What does “been” tell you?", ""], answers: ["The action is still going on.", "The action finished long ago.", "The action will start soon.", "The action never happened."], correct: 0, explTitle: "Still in progress", explBody: "The perfect progressive reaches right up to now.", jp: "今も続いていることを表します。" },
      { stem: ["Choose the correct word order.", ""], answers: ["We have been taking quicker showers since March.", "We have taking been quicker showers since March.", "We been have taking quicker showers since March.", "We have been took quicker showers since March."], correct: 0, explTitle: "have + been + verb-ing", explBody: "Keep that order.", jp: "have + been + -ing の順です。" },
      { stem: ["Complete: “How long ___ they been leaking?”", ""], answers: ["have", "has", "did", "are"], correct: 0, explTitle: "Plural subject in a question", explBody: "They takes have.", jp: "they には have を使います。" }
    ]
  },

  g2: {
    key: "ever_words",
    tr: "4.7",
    component: "grammar-2",
    title: "Whatever, whenever, wherever, whoever",
    jpTitle: "whatever・whenever・wherever・whoever",
    short: "-ever words",
    role: "clause",
    rule: "Add -ever to what, when, where and who to mean “it does not matter which thing, time, place or person”.",
    jpRule: "what・when・where・who に -ever をつけると「どれでも・いつでも・どこでも・だれでも」という意味になります。",
    pattern: "whatever / whenever / wherever / whoever + subject + verb",
    jpPattern: "whatever / whenever / wherever / whoever + 主語 + 動詞",
    intro: [
      { t: "Do whatever you can to save water.", jp: "水を節約するためにできることは何でもしましょう。" },
      { t: "Save fresh water whenever you can and wherever you go.", jp: "できるときはいつでも、行く先どこでも淡水を節約しましょう。" },
      { t: "Whoever threw paint down the drain is in trouble!", jp: "排水口にペンキを流した人はだれであれ困ったことになります！" }
    ],
    rows: [
      { form: "whatever", pattern: "whatever = any thing that", example: "Do whatever you can to save water.", jp: "水を節約するためにできることは何でもしましょう。" },
      { form: "whenever", pattern: "whenever = at any time that", example: "Save fresh water whenever you can.", jp: "できるときはいつでも淡水を節約しましょう。" },
      { form: "wherever", pattern: "wherever = at any place that", example: "Save water wherever you go.", jp: "行く先どこでも水を節約しましょう。" },
      { form: "whoever", pattern: "whoever = any person who", example: "Whoever threw paint down the drain is in trouble!", jp: "排水口にペンキを流した人はだれであれ困ったことになります！" },
      { form: "As a subject", pattern: "whoever + verb + is / was …", example: "Whoever uses the dishwasher should fill it first.", jp: "食器洗い機を使う人はだれであれ、まずいっぱいにすべきです。" }
    ],
    noteRule: "These words join two ideas into one sentence and mean “no matter which / when / where / who”.",
    noteException: "Whoever can be the subject of the sentence, so the verb after it is singular: Whoever wants water needs to save it.",
    noteExceptionDetail: "Do not add a second question word: say Do whatever you can, not Do whatever what you can.",
    table: {
      title: "The -ever words",
      columns: ["Word", "Means", "Example"],
      rows: [
        { cells: ["whatever", "any thing that", "Do whatever you can to save water."], roles: ["clause", null, null] },
        { cells: ["whenever", "at any time that", "Save fresh water whenever you can."], roles: ["clause", null, null] },
        { cells: ["wherever", "at any place that", "Save fresh water wherever you go."], roles: ["clause", null, null] },
        { cells: ["whoever", "any person who", "Whoever threw paint down the drain is in trouble!"], roles: ["clause", null, null] }
      ],
      notes: [
        "The -ever word comes at the front of its own clause.",
        "Whoever + a singular verb: Whoever wants a shower has to be quick."
      ]
    },
    samples: [
      { t: "Do whatever you can to save water.", jp: "水を節約するためにできることは何でもしましょう。", h: "whatever you can" },
      { t: "Save fresh water whenever you can and wherever you go.", jp: "できるときはいつでも、行く先どこでも淡水を節約しましょう。", h: "whenever you can and wherever you go" },
      { t: "Whoever threw paint down the drain is in trouble!", jp: "排水口にペンキを流した人はだれであれ困ったことになります！", h: "Whoever threw paint down the drain" },
      { t: "Whenever we take a bath, we use 265 liters of water.", jp: "お風呂に入るたびに265リットルの水を使います。", h: "Whenever we take a bath" },
      { t: "Turn off the faucet whenever you brush your teeth.", jp: "歯をみがくときはいつでも蛇口を閉めましょう。", h: "whenever you brush your teeth" },
      { t: "Whoever uses the dishwasher should fill it first.", jp: "食器洗い機を使う人はだれであれ、まずいっぱいにすべきです。", h: "Whoever uses the dishwasher" },
      { t: "Take a quick shower wherever you are staying.", jp: "どこに泊まっていても短いシャワーにしましょう。", h: "wherever you are staying" },
      { t: "Tell someone whenever water is leaking in your home.", jp: "家で水がもれているときはいつでもだれかに伝えましょう。", h: "whenever water is leaking" },
      { t: "Drink whatever water is safe and clean.", jp: "安全できれいな水なら何でも飲みましょう。", h: "whatever water is safe and clean" },
      { t: "Whoever wastes water is making the drought worse.", jp: "水をむだにする人はだれであれ干ばつを悪化させています。", h: "Whoever wastes water" }
    ],
    levelup: {
      rules: [
        { title: "whatever = any thing that", jpTitle: "whatever は「何でも」",
          sub: "Use whatever when the exact thing does not matter.", jpSub: "どれかがはっきりしなくてよいときに whatever を使います。",
          transforms: [["Do / you can / to save water", "Do whatever you can to save water."], ["Drink / water is safe", "Drink whatever water is safe."]],
          examples: [{ t: "Do whatever you can to save water.", jp: "できることは何でもしましょう。", h: "whatever you can" },
                     { t: "Use whatever container you have.", jp: "どんな容器でもあるものを使いましょう。", h: "whatever container you have" }] },
        { title: "whenever and wherever join time and place", jpTitle: "whenever と wherever は時と場所をつなぐ",
          sub: "Whenever means at any time that; wherever means at any place that.", jpSub: "whenever は「いつでも」、wherever は「どこでも」です。",
          transforms: [["Save water / you can", "Save water whenever you can."], ["Save water / you go", "Save water wherever you go."]],
          examples: [{ t: "Whenever we take a bath, we use 265 liters.", jp: "お風呂に入るたびに265リットル使います。", h: "Whenever we take a bath" },
                     { t: "Turn the faucet off wherever you wash up.", jp: "どこで洗うときも蛇口を閉めましょう。", h: "wherever you wash up" }] },
        { title: "whoever can be the subject", jpTitle: "whoever は主語になれる",
          sub: "Whoever + verb can start the sentence, and the main verb after it is singular.", jpSub: "whoever + 動詞 が文の主語になれます。あとの動詞は単数形です。",
          transforms: [["threw paint down the drain / be in trouble", "Whoever threw paint down the drain is in trouble!"], ["wastes water / make the drought worse", "Whoever wastes water is making the drought worse."]],
          examples: [{ t: "Whoever uses the dishwasher should fill it first.", jp: "食器洗い機を使う人はまずいっぱいにすべきです。", h: "Whoever uses the dishwasher" },
                     { t: "Whoever finds the leak should tell an adult.", jp: "もれを見つけた人は大人に伝えるべきです。", h: "Whoever finds the leak" }] }
      ],
      mixed: [
        { t: "Leo watches whatever match is on.", jp: "レオはやっている試合なら何でも見ます。", h: "whatever match is on" },
        { t: "Whenever the faucet leaks, we lose 230 liters a day.", jp: "蛇口がもれるたびに、1日230リットル失います。", h: "Whenever the faucet leaks" },
        { t: "Take your bottle wherever you train.", jp: "練習する場所どこへでもボトルを持って行きましょう。", h: "wherever you train" },
        { t: "Whoever leaves the water running is wasting it.", jp: "水を出しっぱなしにする人はだれであれむだにしています。", h: "Whoever leaves the water running" },
        { t: "Fill the machine whenever you use it.", jp: "使うときはいつでも機械をいっぱいにしましょう。", h: "whenever you use it" },
        { t: "Drink whatever you like, but do not waste it.", jp: "好きなものを飲んでいいですが、むだにしないでください。", h: "whatever you like" }
      ]
    },
    quiz: [
      { stem: ["Do ", " you can to save water."], answers: ["whatever", "whenever", "wherever", "whoever"], correct: 0, explTitle: "whatever = any thing", explBody: "The sentence is about things you can do.", jp: "できることは何でもしましょう。" },
      { stem: ["Save fresh water ", " you can."], answers: ["whenever", "whatever", "whoever", "however"], correct: 0, explTitle: "whenever = any time", explBody: "It is about time, so use whenever.", jp: "できるときはいつでも節約しましょう。" },
      { stem: ["Save fresh water ", " you go."], answers: ["wherever", "whenever", "whatever", "whoever"], correct: 0, explTitle: "wherever = any place", explBody: "It is about place, so use wherever.", jp: "行く先どこでも節約しましょう。" },
      { stem: ["", "Whoever threw paint down the drain ___ in trouble!”"], answers: ["is", "are", "were", "be"], correct: 0, explTitle: "Whoever takes a singular verb", explBody: "Whoever behaves like one person.", jp: "whoever のあとの動詞は単数形です。" },
      { stem: ["", " we take a bath, we use 265 liters of water."], answers: ["Whenever", "Whatever", "Wherever", "Whoever"], correct: 0, explTitle: "Time again", explBody: "Every time we take a bath → Whenever.", jp: "お風呂に入るたびに、という意味です。" },
      { stem: ["Which sentence is wrong?", ""], answers: ["Do whatever what you can.", "Do whatever you can.", "Save water whenever you can.", "Take it wherever you go."], correct: 0, explTitle: "Don't double the question word", explBody: "Whatever already includes what.", jp: "whatever に what を重ねてはいけません。" },
      { stem: ["", " uses the dishwasher should fill it first."], answers: ["Whoever", "Whatever", "Whenever", "Wherever"], correct: 0, explTitle: "whoever = any person who", explBody: "It refers to a person.", jp: "だれであれ使う人、という意味です。" },
      { stem: ["“Wherever” means ___.", ""], answers: ["at any place that", "at any time that", "any person who", "any thing that"], correct: 0, explTitle: "Place", explBody: "Wherever is about place.", jp: "wherever は場所を表します。" },
      { stem: ["Tell someone ", " water is leaking in your home."], answers: ["whenever", "whatever", "whoever", "wherever"], correct: 0, explTitle: "Any time it happens", explBody: "It is about the time it happens.", jp: "もれているときはいつでも伝えましょう。" },
      { stem: ["Which word can start a sentence as its subject?", ""], answers: ["Whoever", "Whenever", "Wherever", "Whatever time"], correct: 0, explTitle: "whoever as subject", explBody: "Whoever + verb can be the whole subject.", jp: "whoever は主語になれます。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["Do whatever you can to save water.", "Do whatever can you to save water.", "Do what ever you can to save water badly.", "Do whenever you can to save water."], correct: 0, explTitle: "whatever + subject + verb", explBody: "Keep normal word order after whatever.", jp: "whatever + 主語 + 動詞の順です。" },
      { stem: ["Complete: “___ finds the leak should tell an adult.”", ""], answers: ["Whoever", "Whatever", "Whenever", "However"], correct: 0, explTitle: "A person", explBody: "The subject is a person.", jp: "人を表すので whoever です。" },
      { stem: ["Which one is about time?", ""], answers: ["whenever", "wherever", "whatever", "whoever"], correct: 0, explTitle: "when → time", explBody: "Whenever is the time word.", jp: "whenever が時を表します。" },
      { stem: ["Fix it: “Save water wherever you can and whenever you go.”", ""], answers: ["Save water whenever you can and wherever you go.", "Save water whatever you can and whoever you go.", "Save water however you can and whenever you go there.", "Save water wherever you can and wherever you go."], correct: 0, explTitle: "Time first, place second", explBody: "You can does not name a place; you go does.", jp: "「できるとき」は時、「行く先」は場所です。" },
      { stem: ["Which verb form follows Whoever?", ""], answers: ["a singular verb", "a plural verb", "no verb", "an -ing verb only"], correct: 0, explTitle: "Singular", explBody: "Whoever wants, whoever finds, whoever uses.", jp: "whoever のあとは単数形の動詞です。" },
      { stem: ["Complete: “___ the faucet leaks, we lose 230 liters a day.”", ""], answers: ["Whenever", "Whoever", "Whatever", "Wherever"], correct: 0, explTitle: "Each time it happens", explBody: "Whenever means every time.", jp: "もれるたびに、という意味です。" },
      { stem: ["Which sentence uses wherever correctly?", ""], answers: ["Take your bottle wherever you train.", "Take your bottle wherever you can it.", "Take your bottle wherever time you train.", "Take your bottle whoever you train."], correct: 0, explTitle: "wherever + subject + verb", explBody: "Follow it with a normal clause.", jp: "wherever + 主語 + 動詞の形です。" },
      { stem: ["“Whatever” is closest in meaning to ___.", ""], answers: ["any thing that", "any place that", "any person who", "any time that"], correct: 0, explTitle: "Things", explBody: "Whatever refers to things.", jp: "whatever は「もの」を表します。" },
      { stem: ["Choose the sentence with the best word.", ""], answers: ["Whoever leaves the water running is wasting it.", "Whatever leaves the water running is wasting it.", "Whenever leaves the water running is wasting it.", "Wherever leaves the water running is wasting it."], correct: 0, explTitle: "A person leaves it running", explBody: "Only whoever fits a person as subject.", jp: "主語が人なので whoever です。" },
      { stem: ["What do all four -ever words have in common?", ""], answers: ["They mean “it doesn't matter which”.", "They are all about time.", "They are all questions.", "They all take a plural verb."], correct: 0, explTitle: "No matter which", explBody: "Each one says the exact one does not matter.", jp: "どれも「どれでもかまわない」という意味です。" }
    ]
  },

  reading: {
    tr: "4.8",
    title: "A World of Water",
    jpTitle: "水の世界",
    intro: "Nearly 75% of the earth is covered by water. There is water above ground called surface water, such as lakes, swamps, and rivers, and water that's under the ground called groundwater. Water even exists in the sky! That is called water vapor.",
    paras: [
      { t: "Although we have a lot of water, we can't drink most of it. Ninety-seven and a half percent of the earth's water is salt water, which humans can't drink. The rest is fresh water, which we can drink.",
        q: "What percentage of the earth's water is salt water?", opts: ["97.5%", "75%", "5%"], correct: 0, jp: "97.5パーセントです。" },
      { t: "However, we can't use most of our drinking water because 70% is frozen—like the Hubbard Glacier. Also, we can only reach 30% of our groundwater, and most of that is polluted. In fact, we can only drink about 1% of the world's fresh water.",
        q: "How much of the world's fresh water can we actually drink?", opts: ["About 1%", "About 30%", "About 70%"], correct: 0, jp: "約1パーセントだけです。" },
      { t: "We don't drink most of our fresh water. Only 5% goes to the faucets in our homes. About 95% is used to produce food, clothes, and energy. We don't see that water, but it is a big part of our “water footprint,” or the total amount of water we use.",
        q: "What is a water footprint?", opts: ["The total amount of water we use", "The size of a puddle", "A kind of glacier"], correct: 0, jp: "私たちが使う水の総量のことです。" },
      { t: "For example, we don't see the water that was used to make a T-shirt. We only see the T-shirt. But 2,700 liters of water were used to produce it! Earth has always had the same amount of water. However, there are more people on the planet now, and we all need water. If we want water in the future, we must not waste it or pollute it now!",
        q: "How much water is used to make one T-shirt?", opts: ["2,700 liters", "270 liters", "27 liters"], correct: 0, jp: "2,700リットルです。" }
    ],
    strategy: {
      title: "Reading strategy — reading percentages",
      body: "This passage is built out of percentages: 75%, 97.5%, 70%, 30%, 5%, 95%, 1%. Every time you meet one, ask “a percentage of what?” — the whole changes from sentence to sentence.",
      jp: "この文章はパーセントでできています。数字を見るたびに「何に対する割合か」を確かめましょう。基準となる全体は文ごとに変わります。"
    },
    order: {
      title: "Follow the water from the whole earth to your glass",
      items: [
        "Nearly 75% of the earth is covered by water.",
        "97.5% of that water is salt water we can't drink.",
        "Of the fresh water left, 70% is frozen.",
        "We can reach only 30% of groundwater, and most is polluted.",
        "In the end we can drink about 1% of the world's fresh water.",
        "Only 5% of that reaches the faucets in our homes."
      ]
    },
    quiz: [
      { q: "How much of the earth is covered by water?", opts: ["Nearly 75%", "Nearly 25%", "Nearly 100%"], correct: 0, jp: "約75パーセントです。" },
      { q: "What is water in the sky called?", opts: ["Water vapor", "Groundwater", "Surface water"], correct: 0, jp: "水蒸気と呼ばれます。" },
      { q: "Why can't we use most of our fresh water?", opts: ["Most of it is frozen or polluted", "It is too expensive", "It tastes bad"], correct: 0, jp: "多くが凍っているか汚染されているからです。" },
      { q: "What is 95% of our fresh water used for?", opts: ["Producing food, clothes and energy", "Filling swimming pools", "Washing cars"], correct: 0, jp: "食べ物・衣類・エネルギーを作るために使われます。" },
      { q: "Has the amount of water on Earth changed?", opts: ["No — Earth has always had the same amount", "Yes, it doubled", "Yes, it halved"], correct: 0, jp: "いいえ、地球の水の量はずっと同じです。" },
      { q: "Why is water a bigger problem now?", opts: ["There are more people on the planet", "There is less rain everywhere", "The sea is smaller"], correct: 0, jp: "地球の人口が増えたからです。" },
      { q: "Lakes, swamps and rivers are called ___.", opts: ["surface water", "groundwater", "water vapor"], correct: 0, jp: "地表水と呼ばれます。" },
      { q: "What must we not do if we want water in the future?", opts: ["Waste it or pollute it", "Drink it", "Filter it"], correct: 0, jp: "むだにしたり汚染したりしてはいけません。" }
    ]
  },

  writing: {
    genre: "A persuasive water-saving poster",
    jpGenre: "水を守るための説得ポスター",
    modelTitle: "Be a Water Hero",
    model: [
      "Did you know that a five-minute shower uses 75 liters of water?",
      "I have been taking quicker showers since March, and my family has been saving water too.",
      "Turn off the faucet whenever you brush your teeth. It uses 11 liters every minute.",
      "Do whatever you can, wherever you are. Be a water hero!"
    ],
    modelJp: "5分間のシャワーで75リットルの水を使うことを知っていましたか。私は3月から短いシャワーにしています。",
    steps: [
      { t: "Open with a surprising number.", jp: "おどろく数字で書き出す。" },
      { t: "Say what you have been doing, using have been + -ing.", jp: "have been + -ing を使って、自分が続けていることを書く。" },
      { t: "Give one clear instruction with whenever or wherever.", jp: "whenever か wherever を使って、はっきりした指示を1つ書く。" },
      { t: "End with a short slogan.", jp: "短いスローガンで締めくくる。" }
    ],
    expressions: [
      { t: "Did you know that ___ uses ___ liters?", jp: "〜が〜リットル使うことを知っていましたか。" },
      { t: "I have been ___ since ____.", jp: "私は〜から〜し続けています。" },
      { t: "Turn off the faucet whenever you ___.", jp: "〜するときはいつでも蛇口を閉めましょう。" },
      { t: "Do whatever you can, wherever you are.", jp: "どこにいても、できることは何でもしましょう。" }
    ],
    checklist: [
      "I used at least one real number from the unit.",
      "I used have been / has been + -ing once.",
      "I used whenever, wherever or whatever once.",
      "My poster ends with a short slogan somebody would remember."
    ],
    quiz: [
      { q: "Which opening grabs attention best?", opts: ["Did you know a five-minute shower uses 75 liters?", "This is my poster.", "Water is a liquid."], correct: 0, jp: "おどろく数字で始めます。" },
      { q: "Choose the correct present perfect progressive.", opts: ["I have been saving water since March.", "I have saving water since March.", "I has been saving water since March."], correct: 0, jp: "have been + -ing が正しい形です。" },
      { q: "Which word means “at any time that”?", opts: ["whenever", "wherever", "whatever"], correct: 0, jp: "whenever です。" },
      { q: "A persuasive poster should ___.", opts: ["tell the reader what to do", "list your homework", "describe your bedroom"], correct: 0, jp: "読む人に行動を伝えます。" },
      { q: "Which fact is from this unit?", opts: ["A bath uses 265 liters of water.", "A bath uses 2 liters of water.", "A bath uses no water."], correct: 0, jp: "お風呂は265リットル使います。" },
      { q: "“for” goes with ___.", opts: ["a length of time", "a starting point", "a person"], correct: 0, jp: "for は期間の長さと使います。" },
      { q: "Which is the best slogan?", opts: ["Be a water hero!", "Water exists.", "I finished my poster."], correct: 0, jp: "短く覚えやすいスローガンにします。" },
      { q: "Which sentence uses whoever correctly?", opts: ["Whoever leaves the tap on is wasting water.", "Whoever leave the tap on are wasting water.", "Whoever the tap on leaves is wasting water."], correct: 0, jp: "whoever のあとは単数形の動詞です。" }
    ]
  }
};
