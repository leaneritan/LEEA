/* Our World Level 6 · Unit 9 — Amazing Adventures at Sea
   Source: Student's Book audio script TR 9.1-9.8. */
export default {
  unit: 9,
  title: "Amazing Adventures at Sea",
  jpTitle: "海の驚くべき冒険",
  themeEmoji: "🚢",
  slug: "amazing-adventures-at-sea",

  opener: {
    tr: "9.1",
    intro:
      "If you dive down to the ocean floor today, you will find more than a million shipwrecks lying there. Many ships sank in bad weather, like the Santa Margarita, which was hit by a hurricane in 1622. What caused other shipwrecks?",
    goals: [
      { en: "Talk about shipwrecks and what caused them.", jp: "沈没船と、その原因について話す。" },
      { en: "Use as soon as to link two past events.", jp: "as soon as を使って過去の2つのできごとをつなぐ。" },
      { en: "Use opposite adjectives with the prefixes in-, un- and il-.", jp: "in-・un-・il- の接頭辞で反対の意味の形容詞を作る。" },
      { en: "Use It's + adjective + infinitive to give advice.", jp: "It's + 形容詞 + to不定詞 で助言をする。" },
      { en: "Read about the deepest dive on Earth and retell it.", jp: "地球で最も深い潜水について読み、それを伝える。" }
    ],
    photoCards: [
      { emoji: "⚓", title: "1622 — the Santa Margarita", text: "Many ships sank in bad weather, like the Santa Margarita, which was hit by a hurricane in 1622.", jp: "多くの船が悪天候で沈みました。サンタ・マルガリータ号は1622年にハリケーンに襲われました。" },
      { emoji: "💥", title: "1804 — a naval battle", text: "Many centuries ago ships carried cargo to sell to other countries. Ships also carried weapons because they were often attacked. In 1804, the Spanish ship Nuestra Señora de las Mercedes was attacked and exploded. It sank with over half a million silver coins onboard.", jp: "何世紀も前、船は他国に売る積み荷を運びました。よく襲われたので武器も積んでいました。1804年、スペイン船ヌエストラ・セニョーラ・デ・ラス・メルセデス号は襲われて爆発し、50万枚以上の銀貨とともに沈みました。" },
      { emoji: "🏴‍☠️", title: "1717 — Blackbeard", text: "In 1717, a famous pirate called Blackbeard captured the French ship La Concorde. By 1718, Blackbeard was captain of four stolen ships and had captured over 300 sailors! According to legend, he buried many treasures, but they have never been found.", jp: "1717年、黒ひげという有名な海賊がフランス船ラ・コンコルド号を捕らえました。1718年までに黒ひげは奪った4隻の船の船長となり、300人以上の船員を捕らえていました！伝説によれば多くの宝を埋めましたが、まだ見つかっていません。" },
      { emoji: "🧊", title: "1912 — the Titanic", text: "The most famous modern shipwreck is the Titanic, which hit an iceberg and sank in 1912. There weren't enough lifeboats on board and over 1,500 people drowned.", jp: "最も有名な現代の沈没船はタイタニック号で、1912年に氷山に衝突して沈みました。救命ボートが足りず、1,500人以上がおぼれました。" }
    ],
    lookAndCheck: [
      { q: "How many shipwrecks lie on the ocean floor?", opts: ["More than a million", "About a hundred", "Exactly a thousand"], correct: 0, jp: "100万隻以上です。" },
      { q: "What hit the Santa Margarita in 1622?", opts: ["A hurricane", "An iceberg", "A pirate ship"], correct: 0, jp: "ハリケーンです。" },
      { q: "Why did ships carry weapons?", opts: ["Because they were often attacked", "To sell them", "For decoration"], correct: 0, jp: "よく襲われたからです。" },
      { q: "What sank the Titanic?", opts: ["An iceberg", "A hurricane", "A naval battle"], correct: 0, jp: "氷山です。" }
    ],
    sort: {
      title: "Person, thing or event?",
      zones: [
        { id: "person", label: "🧑 People at sea" },
        { id: "thing", label: "⚓ Things on a ship" },
        { id: "event", label: "🌊 Events" }
      ],
      tiles: [
        { text: "a pirate", zone: "person" },
        { text: "a captain", zone: "person" },
        { text: "a sailor", zone: "person" },
        { text: "cargo", zone: "thing" },
        { text: "a weapon", zone: "thing" },
        { text: "a lifeboat", zone: "thing" },
        { text: "a shipwreck", zone: "event" },
        { text: "a naval battle", zone: "event" },
        { text: "hitting an iceberg", zone: "event" }
      ]
    },
    quiz: [
      { q: "In what year did the Santa Margarita sink?", opts: ["1622", "1717", "1912"], correct: 0, jp: "1622年です。" },
      { q: "How many silver coins were on the Spanish ship?", opts: ["Over half a million", "Over five hundred", "Exactly a thousand"], correct: 0, jp: "50万枚以上です。" },
      { q: "Which ship did Blackbeard capture in 1717?", opts: ["La Concorde", "The Titanic", "The Santa Margarita"], correct: 0, jp: "ラ・コンコルド号です。" },
      { q: "How many sailors had Blackbeard captured by 1718?", opts: ["Over 300", "Over 30", "Exactly 4"], correct: 0, jp: "300人以上です。" },
      { q: "What happened to Blackbeard's buried treasures?", opts: ["They have never been found", "They are in a museum", "They were sold"], correct: 0, jp: "まだ見つかっていません。" },
      { q: "How many people drowned on the Titanic?", opts: ["Over 1,500", "Over 150", "Exactly 15"], correct: 0, jp: "1,500人以上です。" },
      { q: "Why did so many people drown on the Titanic?", opts: ["There weren't enough lifeboats", "It was too cold", "The captain left"], correct: 0, jp: "救命ボートが足りなかったからです。" },
      { q: "What did ships carry to sell to other countries?", opts: ["Cargo", "Icebergs", "Lifeboats"], correct: 0, jp: "積み荷です。" }
    ]
  },

  v1: {
    tr: "9.2",
    words: [
      { w: "dive", norm: "dive", emoji: "🤿", ipa: "daɪv", syl: "dive", pos: "verb", mean: "to go down into water head first, or deep under water.", jw: "潜る", jr: "もぐる", jm: "頭から水に入る、または水の中深くへ行くこと。",
        tr: "James Cameron has dived many times.",
        ex: [["James Cameron has dived many times.", "ジェームズ・キャメロンは何度も潜っています。"],
             ["If you dive down to the ocean floor, you will find shipwrecks.", "海底まで潜れば、沈没船が見つかります。"],
             ["I'm going to dive down again and again.", "私は何度も何度も潜るつもりです。"]] },
      { w: "a shipwreck", norm: "shipwreck", emoji: "🚢", ipa: "ˈʃɪprek", syl: "ship-wreck", pos: "noun", mean: "a ship that has been destroyed or sunk at sea.", jw: "沈没船", jr: "ちんぼつせん", jm: "海で壊れたり沈んだりした船。",
        tr: "There are more than a million shipwrecks.",
        ex: [["There are more than a million shipwrecks.", "沈没船は100万隻以上あります。"],
             ["The most famous modern shipwreck is the Titanic.", "最も有名な現代の沈没船はタイタニック号です。"],
             ["Local legend says there's a shipwreck near.", "地元の伝説によれば近くに沈没船があります。"]] },
      { w: "sink", norm: "sink", emoji: "🌊", ipa: "sɪŋk", syl: "sink", pos: "verb", mean: "to go down under the surface of water.", jw: "沈む", jr: "しずむ", jm: "水面の下に沈んでいくこと。",
        tr: "Many ships sank when the weather was bad.",
        ex: [["Many ships sink in bad weather.", "多くの船は悪天候で沈みます。"],
             ["Life jackets float and we sink.", "救命胴衣は浮きますが、私たちは沈みます。"],
             ["A ship can sink in minutes.", "船は数分で沈むことがあります。"]] },
      { w: "cargo", norm: "cargo", emoji: "📦", ipa: "ˈkɑːrɡoʊ", syl: "car-go", pos: "noun", mean: "the goods carried by a ship or plane.", jw: "積み荷", jr: "つみに", jm: "船や飛行機が運ぶ荷物。",
        tr: "Some ships carried a lot of cargo.",
        ex: [["Some ships carried a lot of cargo.", "多くの積み荷を運んだ船もありました。"],
             ["Ships carried cargo to sell to other countries.", "船は他国に売る積み荷を運びました。"],
             ["It's illegal to put too much cargo on a ship.", "船に積み荷を積みすぎるのは違法です。"]] },
      { w: "a weapon", norm: "weapon", emoji: "⚔️", ipa: "ˈwepən", syl: "weap-on", pos: "noun", mean: "something used for fighting or attacking.", jw: "武器", jr: "ぶき", jm: "戦ったり攻撃したりするために使うもの。",
        tr: "Weapons are often found in shipwrecks.",
        ex: [["Weapons are often found in shipwrecks.", "武器は沈没船でよく見つかります。"],
             ["Ships also carried weapons because they were often attacked.", "よく襲われたので、船は武器も積んでいました。"],
             ["Was the ship carrying cargo, like weapons and silver?", "その船は武器や銀のような積み荷を運んでいましたか。"]] },
      { w: "silver", norm: "silver", emoji: "🥈", ipa: "ˈsɪlvər", syl: "sil-ver", pos: "noun", mean: "a valuable shiny grey metal.", jw: "銀", jr: "ぎん", jm: "価値のある光る灰色の金属。",
        tr: "Cargo ships carried gold and silver.",
        ex: [["Cargo ships carried gold and silver.", "貨物船は金と銀を運びました。"],
             ["It sank with over half a million silver coins onboard.", "50万枚以上の銀貨とともに沈みました。"],
             ["Blackbeard, where's your silver now?", "黒ひげよ、おまえの銀は今どこにある？"]] },
      { w: "a pirate", norm: "pirate", emoji: "🏴‍☠️", ipa: "ˈpaɪrət", syl: "pi-rate", pos: "noun", mean: "someone who attacks and robs ships at sea.", jw: "海賊", jr: "かいぞく", jm: "海で船を襲って奪う人。",
        tr: "Blackbeard was a very famous pirate.",
        ex: [["Blackbeard was a very famous pirate.", "黒ひげはとても有名な海賊でした。"],
             ["Pirates were a big problem.", "海賊は大きな問題でした。"],
             ["It's illegal to be a pirate.", "海賊になるのは違法です。"]] },
      { w: "capture", norm: "capture", emoji: "🪝", ipa: "ˈkæptʃər", syl: "cap-ture", pos: "verb", mean: "to catch and take control of someone or something.", jw: "捕らえる", jr: "とらえる", jm: "つかまえて支配下に置くこと。",
        tr: "The pirate captured three ships.",
        ex: [["The pirate captured three ships.", "その海賊は3隻の船を捕らえました。"],
             ["Blackbeard captured the French ship La Concorde.", "黒ひげはフランス船ラ・コンコルド号を捕らえました。"],
             ["By 1718 he had captured over 300 sailors.", "1718年までに彼は300人以上の船員を捕らえていました。"]] },
      { w: "a captain", norm: "captain", emoji: "🧑‍✈️", ipa: "ˈkæptɪn", syl: "cap-tain", pos: "noun", mean: "the person in charge of a ship.", jw: "船長", jr: "せんちょう", jm: "船を指揮する人。",
        tr: "The ship's captain worked very hard.",
        ex: [["The ship's captain worked very hard.", "その船の船長はとても熱心に働きました。"],
             ["As soon as I am captain, I'll find your treasure.", "船長になったらすぐ、おまえの宝を見つけよう。"],
             ["The captain allowed over 4,000 passengers on board.", "船長は4,000人以上の乗客を乗せることを許しました。"]] },
      { w: "a sailor", norm: "sailor", emoji: "⚓", ipa: "ˈseɪlər", syl: "sail-or", pos: "noun", mean: "someone who works on a ship.", jw: "船員", jr: "せんいん", jm: "船で働く人。",
        tr: "Many sailors didn't know how to swim.",
        ex: [["Many sailors didn't know how to swim.", "泳ぎ方を知らない船員が多くいました。"],
             ["I'm the bravest sailor for miles and miles around.", "私はこのあたりでいちばん勇敢な船員だ。"],
             ["Lots of sailors died in the fire.", "多くの船員が火事で亡くなりました。"]] },
      { w: "a legend", norm: "legend", emoji: "📖", ipa: "ˈledʒənd", syl: "leg-end", pos: "noun", mean: "an old story that people tell but cannot prove.", jw: "伝説", jr: "でんせつ", jm: "人々が語り継ぐが証明できない古い話。",
        tr: "There are many legends about pirates.",
        ex: [["There are many legends about pirates.", "海賊についての伝説はたくさんあります。"],
             ["According to legend, he buried many treasures.", "伝説によれば、彼は多くの宝を埋めました。"],
             ["Local legend says there's a shipwreck near.", "地元の伝説によれば近くに沈没船があります。"]] },
      { w: "an iceberg", norm: "iceberg", emoji: "🧊", ipa: "ˈaɪsbɜːrɡ", syl: "ice-berg", pos: "noun", mean: "a very large piece of ice floating in the sea.", jw: "氷山", jr: "ひょうざん", jm: "海に浮かぶとても大きな氷の塊。",
        tr: "The Titanic hit a big iceberg.",
        ex: [["The Titanic hit a big iceberg.", "タイタニック号は大きな氷山に衝突しました。"],
             ["Water poured in as soon as it hit the iceberg.", "氷山に衝突したとたん、水が流れ込みました。"],
             ["I'm not afraid of icebergs.", "私は氷山を恐れません。"]] },
      { w: "a lifeboat", norm: "lifeboat", emoji: "🛶", ipa: "ˈlaɪfboʊt", syl: "life-boat", pos: "noun", mean: "a small boat used to save people from a sinking ship.", jw: "救命ボート", jr: "きゅうめいぼーと", jm: "沈む船から人を助けるための小さな船。",
        tr: "There weren't enough lifeboats on the ship.",
        ex: [["There weren't enough lifeboats on the ship.", "船には救命ボートが足りませんでした。"],
             ["There wasn't even enough time to use the lifeboats.", "救命ボートを使う時間さえありませんでした。"],
             ["Every passenger should have a place in a lifeboat.", "乗客はみな救命ボートに席があるべきです。"]] },
      { w: "drown", norm: "drown", emoji: "🌊", ipa: "draʊn", syl: "drown", pos: "verb", mean: "to die under water because you cannot breathe.", jw: "おぼれ死ぬ", jr: "おぼれじぬ", jm: "水の中で息ができずに亡くなること。",
        tr: "People who couldn't swim usually drowned.",
        ex: [["People who couldn't swim usually drowned.", "泳げない人はたいていおぼれ死にました。"],
             ["Over 1,500 people drowned.", "1,500人以上がおぼれ死にました。"],
             ["I'm not afraid to drown.", "私はおぼれることを恐れません。"]] },
      { w: "a passenger", norm: "passenger", emoji: "🧳", ipa: "ˈpæsɪndʒər", syl: "pas-sen-ger", pos: "noun", mean: "someone travelling on a ship, plane or bus.", jw: "乗客", jr: "じょうきゃく", jm: "船・飛行機・バスで移動する人。",
        tr: "Many of the passengers on the Titanic were rich.",
        ex: [["Many of the passengers on the Titanic were rich.", "タイタニック号の乗客の多くは裕福でした。"],
             ["The ship was built for 1,500 passengers.", "その船は1,500人の乗客のために造られました。"],
             ["The captain didn't have a passenger list.", "船長は乗客名簿を持っていませんでした。"]] },
      { w: "a crew", norm: "crew", emoji: "👥", ipa: "kruː", syl: "crew", pos: "noun", mean: "all the people who work on a ship or plane.", jw: "乗組員", jr: "のりくみいん", jm: "船や飛行機で働く人たち全員。",
        tr: "A ship's crew earned very little money.",
        ex: [["A ship's crew earned very little money.", "船の乗組員はほとんどお金を稼げませんでした。"],
             ["Most of the Doña Paz crew died.", "ドニャ・パス号の乗組員のほとんどが亡くなりました。"],
             ["As soon as I am captain, with cargo and crew, I'll set sail.", "積み荷と乗組員をそろえて船長になったらすぐ出航しよう。"]] }
    ]
  },

  v2: {
    tr: "9.5",
    words: [
      { w: "correct", norm: "correct", emoji: "✅", ipa: "kəˈrekt", syl: "cor-rect", pos: "adjective", mean: "right, with no mistakes.", jw: "正しい", jr: "ただしい", jm: "まちがいがないこと。",
        tr: "I got all the answers correct.",
        ex: [["I got all the answers correct.", "私は答えを全部正しく書けました。"],
             ["I'll show you the correct way to wear it.", "正しい着け方をお見せします。"],
             ["We thought they died from an illness and we were correct.", "彼らは病気で亡くなったと考え、それは正しかったのです。"]] },
      { w: "incorrect", norm: "incorrect", emoji: "❌", ipa: "ˌɪnkəˈrekt", syl: "in-cor-rect", pos: "adjective", mean: "not right — the opposite of correct.", jw: "まちがった", jr: "まちがった", jm: "正しくないこと。correct の反対。",
        tr: "Blackbeard wasn't from France. That's incorrect!",
        ex: [["Blackbeard wasn't from France. That's incorrect!", "黒ひげはフランス出身ではありません。それはまちがいです！"],
             ["An incorrect answer still teaches you something.", "まちがった答えからも何かを学べます。"],
             ["The date on the map was incorrect.", "地図の日付はまちがっていました。"]] },
      { w: "safe", norm: "safe", emoji: "🦺", ipa: "seɪf", syl: "safe", pos: "adjective", mean: "not in danger.", jw: "安全な", jr: "あんぜんな", jm: "危険がないこと。",
        tr: "Put on this life jacket. You'll be safe with it.",
        ex: [["Put on this life jacket. You'll be safe with it.", "この救命胴衣を着けてください。それがあれば安全です。"],
             ["Why do we wear our life jackets? Because they keep us safe.", "なぜ救命胴衣を着けるのでしょう。安全を守ってくれるからです。"],
             ["It isn't safe to take artifacts from this shipwreck.", "この沈没船から遺物を取るのは安全ではありません。"]] },
      { w: "unsafe", norm: "unsafe", emoji: "⚠️", ipa: "ʌnˈseɪf", syl: "un-safe", pos: "adjective", mean: "dangerous — the opposite of safe.", jw: "危険な", jr: "きけんな", jm: "安全でないこと。safe の反対。",
        tr: "This is very unsafe! He's not wearing a life jacket.",
        ex: [["This is very unsafe! He's not wearing a life jacket.", "これはとても危険です！彼は救命胴衣を着けていません。"],
             ["It's very unsafe out there because there are jellyfish.", "クラゲがいるので、そこはとても危険です。"],
             ["It's unsafe to be a pirate.", "海賊になるのは危険です。"]] },
      { w: "legal", norm: "legal", emoji: "⚖️", ipa: "ˈliːɡəl", syl: "le-gal", pos: "adjective", mean: "allowed by the law.", jw: "合法の", jr: "ごうほうの", jm: "法律で許されていること。",
        tr: "Is it legal to drive a car when you are 18?",
        ex: [["Is it legal to drive a car when you are 18?", "18歳で車を運転するのは合法ですか。"],
             ["The Doña Paz had too many passengers, which wasn't legal.", "ドニャ・パス号は乗客が多すぎて、それは合法ではありませんでした。"],
             ["It isn't legal to take artifacts from this shipwreck.", "この沈没船から遺物を取るのは合法ではありません。"]] },
      { w: "illegal", norm: "illegal", emoji: "🚫", ipa: "ɪˈliːɡəl", syl: "il-le-gal", pos: "adjective", mean: "against the law — the opposite of legal.", jw: "違法の", jr: "いほうの", jm: "法律に反すること。legal の反対。",
        tr: "It's illegal to put too much cargo on a ship.",
        ex: [["It's illegal to put too much cargo on a ship.", "船に積み荷を積みすぎるのは違法です。"],
             ["It's illegal to throw your trash into the ocean.", "ごみを海に投げ捨てるのは違法です。"],
             ["The captain didn't have a licence to sail. That was illegal.", "その船長は航海の免許を持っていませんでした。それは違法でした。"]] },
      { w: "possible", norm: "possible", emoji: "🙆", ipa: "ˈpɑːsəbəl", syl: "pos-si-ble", pos: "adjective", mean: "able to happen or be done.", jw: "可能な", jr: "かのうな", jm: "起こりうる、またはできること。",
        tr: "It's possible to swim today. Let's go out.",
        ex: [["It's possible to swim today. Let's go out.", "今日は泳ぐことができます。出かけましょう。"],
             ["If the boat hits a big wave, it's possible that you will fall in.", "大きな波に当たれば、水に落ちることもありえます。"],
             ["It's possible to reach the falls by canoe.", "カヌーでその滝に行くことは可能です。"]] },
      { w: "impossible", norm: "impossible", emoji: "🙅", ipa: "ɪmˈpɑːsəbəl", syl: "im-pos-si-ble", pos: "adjective", mean: "not able to happen — the opposite of possible.", jw: "不可能な", jr: "ふかのうな", jm: "起こりえないこと。possible の反対。",
        tr: "I can't do this. It's impossible!",
        ex: [["I can't do this. It's impossible!", "これはできません。不可能です！"],
             ["It's impossible for you. Call me and I'll jump in.", "あなたには不可能です。私を呼んでください。飛び込みます。"],
             ["It's impossible to know how many passengers drowned.", "何人の乗客がおぼれたのかを知ることは不可能です。"]] }
    ]
  },

  academic: ["sequence", "cause_and_effect", "main_idea", "summarize", "evaluate"],

  content: [
    { w: "a submersible", norm: "submersible", emoji: "🛥️", ipa: "səbˈmɜːrsəbəl", syl: "sub-mer-si-ble", pos: "noun", mean: "a small craft that can travel deep under water.", jw: "潜水艇", jr: "せんすいてい", jm: "水中深くを進める小さな船。",
      ex: [["Cameron traveled in a submersible called the DEEPSEA CHALLENGER.", "キャメロンはディープシー・チャレンジャーという潜水艇で移動しました。"],
           ["The submersible was 7.3 meters long.", "その潜水艇は全長7.3メートルでした。"],
           ["A submersible must survive enormous pressure.", "潜水艇は巨大な水圧に耐えなければなりません。"]] },
    { w: "a trench", norm: "trench", emoji: "🕳️", ipa: "trentʃ", syl: "trench", pos: "noun", mean: "a very deep, long valley in the ocean floor.", jw: "海溝", jr: "かいこう", jm: "海底のとても深く長い谷。",
      ex: [["The Mariana Trench is the deepest place on Earth.", "マリアナ海溝は地球で最も深い場所です。"],
           ["He traveled to the deepest point of the Mariana Trench.", "彼はマリアナ海溝の最深部まで行きました。"],
           ["The pressure at the bottom of the trench is incredibly strong.", "海溝の底の水圧は信じられないほど強いです。"]] },
    { w: "pressure", norm: "pressure", emoji: "🌡️", ipa: "ˈpreʃər", syl: "pres-sure", pos: "noun", mean: "the force pushing on something.", jw: "圧力", jr: "あつりょく", jm: "何かを押す力。",
      ex: [["Because of its extreme depth, the pressure is incredibly strong.", "その極端な深さのため、圧力は信じられないほど強いです。"],
           ["Pressure increases the deeper you dive.", "深く潜るほど圧力は強くなります。"],
           ["No human could survive that pressure without a submersible.", "潜水艇なしでその圧力に耐えられる人はいません。"]] },
    { w: "isolated", norm: "isolated", emoji: "🏝️", ipa: "ˈaɪsəleɪtɪd", syl: "i-so-lat-ed", pos: "adjective", mean: "far away from everything else.", jw: "孤立した", jr: "こりつした", jm: "ほかのすべてから遠く離れていること。",
      ex: [["The Mariana Trench is perhaps the most isolated place on the planet.", "マリアナ海溝はおそらく地球で最も孤立した場所です。"],
           ["An isolated place is hard and expensive to reach.", "孤立した場所へ行くのは難しく費用もかかります。"],
           ["He was completely isolated at the bottom of the ocean.", "彼は海の底で完全に孤立していました。"]] },
    { w: "a tsunami", norm: "tsunami", emoji: "🌊", ipa: "tsuːˈnɑːmi", syl: "tsu-na-mi", pos: "noun", mean: "a very large ocean wave caused by an earthquake.", jw: "津波", jr: "つなみ", jm: "地震によって起きるとても大きな海の波。",
      ex: [["Scientists might learn more about the earthquakes that cause a tsunami.", "科学者は津波を起こす地震についてもっと学べるかもしれません。"],
           ["A tsunami can cross a whole ocean.", "津波は大洋を横断することがあります。"],
           ["Studying the rocks may help us predict a tsunami.", "岩を調べることは津波の予測に役立つかもしれません。"]] }
  ],

  song: {
    tr: "9.3",
    title: "Blackbeard",
    jpTitle: "黒ひげ",
    lyrics: [
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "Blackbeard, Blackbeard, where's your silver now?", jp: "黒ひげ、黒ひげ、おまえの銀は今どこに？" },
      { t: "You've buried many treasures", jp: "おまえは多くの宝を埋めた" },
      { t: "that never have been found.", jp: "まだ見つかっていない宝を。" },
      { t: "Blackbeard, Blackbeard, I am going down", jp: "黒ひげ、黒ひげ、私は潜っていく" },
      { t: "to the bottom of the sea", jp: "海の底まで" },
      { t: "where treasure might be found.", jp: "宝が見つかるかもしれない場所へ。" },
      { t: "I'm not afraid of icebergs. I'm not afraid to drown.", jp: "私は氷山を恐れない。おぼれることも恐れない。" },
      { t: "I'm the bravest sailor for miles and miles around!", jp: "私はこのあたりでいちばん勇敢な船員だ！" },
      { t: "As soon as I am captain, with cargo and crew,", jp: "積み荷と乗組員をそろえて船長になったらすぐ、" },
      { t: "I'll find your treasure deep in the ocean blue!", jp: "青い海の底でおまえの宝を見つけよう！" },
      { t: "Local legend says there's a shipwreck near.", jp: "地元の伝説によれば近くに沈没船がある。" },
      { t: "As soon as I am ready, I'm going there.", jp: "準備ができたらすぐ、そこへ行く。" },
      { t: "I love sunken treasure like flowers love rain.", jp: "花が雨を愛するように、私は沈んだ宝を愛する。" },
      { t: "I'm going to dive down again and again.", jp: "私は何度も何度も潜るつもりだ。" },
      { t: "Heave-ho! Here we go!", jp: "そーれ！行くぞ！" },
      { t: "Get the silver! Get the gold!", jp: "銀を取れ！金を取れ！" },
      { t: "Get the treasure down below!", jp: "下の宝を取れ！" }
    ],
    tapWords: ["silver", "treasures", "icebergs", "drown", "sailor", "captain", "cargo", "crew", "legend", "shipwreck", "dive"],
    quiz: [
      { q: "What is the singer looking for?", opts: ["Blackbeard's treasure", "A lifeboat", "An iceberg"], correct: 0, jp: "黒ひげの宝です。" },
      { q: "“As soon as I am captain” means the singer will act ___.", opts: ["immediately after becoming captain", "long before becoming captain", "never"], correct: 0, jp: "船長になったらすぐ、という意味です。" },
      { q: "What is the singer not afraid of?", opts: ["Icebergs and drowning", "The dark", "Pirates"], correct: 0, jp: "氷山とおぼれることです。" },
      { q: "What does the local legend say?", opts: ["There's a shipwreck near", "There's no treasure", "The sea is calm"], correct: 0, jp: "近くに沈没船があると言っています。" },
      { q: "How often will the singer dive?", opts: ["Again and again", "Once", "Never"], correct: 0, jp: "何度も何度もです。" },
      { q: "“You've buried many treasures that never have been found” is in the ___.", opts: ["present perfect", "simple past", "future"], correct: 0, jp: "現在完了形です。" }
    ]
  },

  g1: {
    key: "as_soon_as",
    tr: "9.4",
    component: "grammar-1",
    title: "Time clauses with as soon as",
    jpTitle: "as soon as を使う時の節",
    short: "as soon as",
    role: "clause",
    rule: "Use as soon as to say that the second thing happened immediately after the first. Both verbs are in the simple past when you talk about the past.",
    jpRule: "as soon as は「〜するとすぐに」という意味です。過去の話をするときは、両方の動詞を過去形にします。",
    pattern: "As soon as + past clause, + past clause",
    jpPattern: "As soon as + 過去の文, + 過去の文",
    intro: [
      { t: "As soon as the Santa Margarita sank, people began looking for the silver.", jp: "サンタ・マルガリータ号が沈むとすぐ、人々は銀を探し始めました。" },
      { t: "Water poured into the Titanic as soon as it hit the iceberg.", jp: "タイタニック号は氷山に衝突するとすぐ、水が流れ込みました。" },
      { t: "As soon as the two ships crashed, an enormous fire started.", jp: "2隻の船が衝突するとすぐ、巨大な火事が起こりました。" }
    ],
    rows: [
      { form: "Clause first", pattern: "As soon as + past clause, + past clause", example: "As soon as the Santa Margarita sank, people began looking for the silver.", jp: "サンタ・マルガリータ号が沈むとすぐ、人々は銀を探し始めました。" },
      { form: "Clause second", pattern: "past clause + as soon as + past clause", example: "Water poured into the Titanic as soon as it hit the iceberg.", jp: "タイタニック号は氷山に衝突するとすぐ、水が流れ込みました。" },
      { form: "Comma rule", pattern: "comma only when as soon as comes first", example: "As soon as the two ships crashed, an enormous fire started.", jp: "as soon as が先に来るときだけコンマを打ちます。" },
      { form: "About the future", pattern: "as soon as + present, + will", example: "As soon as I am captain, I'll find your treasure.", jp: "船長になったらすぐ、おまえの宝を見つけよう。" },
      { form: "Order of events", pattern: "the as soon as clause happens first", example: "As soon as it hit the iceberg, water poured in.", jp: "as soon as の節のできごとが先に起こります。" }
    ],
    noteRule: "As soon as always marks the earlier event, wherever it appears in the sentence.",
    noteException: "When you talk about the future, use the present tense after as soon as, not will.",
    noteExceptionDetail: "Put a comma after the as soon as clause only when it starts the sentence.",
    table: {
      title: "as soon as",
      columns: ["First event (as soon as)", "Second event"],
      rows: [
        { cells: ["As soon as the Santa Margarita sank,", "people began looking for the silver."], roles: ["clause", null] },
        { cells: ["as soon as it hit the iceberg", "Water poured into the Titanic"], roles: ["clause", null] },
        { cells: ["As soon as the two ships crashed,", "an enormous fire started."], roles: ["clause", null] },
        { cells: ["As soon as I am captain,", "I'll find your treasure."], roles: ["clause", null] }
      ],
      notes: [
        "The as soon as clause is always the earlier event.",
        "For the future, use the present tense after as soon as."
      ]
    },
    samples: [
      { t: "As soon as the Santa Margarita sank, people began looking for the silver.", jp: "サンタ・マルガリータ号が沈むとすぐ、人々は銀を探し始めました。", h: "As soon as the Santa Margarita sank" },
      { t: "Water poured into the Titanic as soon as it hit the iceberg.", jp: "タイタニック号は氷山に衝突するとすぐ、水が流れ込みました。", h: "as soon as it hit the iceberg" },
      { t: "As soon as the two ships crashed, an enormous fire started.", jp: "2隻の船が衝突するとすぐ、巨大な火事が起こりました。", h: "As soon as the two ships crashed" },
      { t: "As soon as I am captain, with cargo and crew, I'll find your treasure.", jp: "積み荷と乗組員をそろえて船長になったらすぐ、宝を見つけよう。", h: "As soon as I am captain" },
      { t: "As soon as I am ready, I'm going there.", jp: "準備ができたらすぐ、そこへ行きます。", h: "As soon as I am ready" },
      { t: "The Doña Paz sank as soon as the fire reached the fuel.", jp: "火が燃料に達するとすぐ、ドニャ・パス号は沈みました。", h: "as soon as the fire reached" },
      { t: "As soon as the divers found the wreck, they called the museum.", jp: "ダイバーが沈没船を見つけるとすぐ、博物館に連絡しました。", h: "As soon as the divers found the wreck" },
      { t: "As soon as the storm passed, the crew checked the lifeboats.", jp: "嵐が去るとすぐ、乗組員は救命ボートを点検しました。", h: "As soon as the storm passed" },
      { t: "Cameron started filming as soon as the submersible reached the bottom.", jp: "潜水艇が底に着くとすぐ、キャメロンは撮影を始めました。", h: "as soon as the submersible reached the bottom" },
      { t: "As soon as the whistle blew, Leo ran toward the goal.", jp: "ホイッスルが鳴るとすぐ、レオはゴールに向かって走りました。", h: "As soon as the whistle blew" }
    ],
    levelup: {
      rules: [
        { title: "The as soon as clause is the earlier event", jpTitle: "as soon as の節が先のできごと",
          sub: "Wherever it sits in the sentence, that event happened first.", jpSub: "文のどこにあっても、そのできごとが先に起こります。",
          transforms: [["the Santa Margarita sink / people begin looking for the silver", "As soon as the Santa Margarita sank, people began looking for the silver."], ["it hit the iceberg / water pour into the Titanic", "Water poured into the Titanic as soon as it hit the iceberg."]],
          examples: [{ t: "As soon as the divers found the wreck, they called the museum.", jp: "ダイバーが沈没船を見つけるとすぐ、博物館に連絡しました。", h: "As soon as the divers found the wreck" },
                     { t: "Cameron started filming as soon as the submersible reached the bottom.", jp: "潜水艇が底に着くとすぐ撮影を始めました。", h: "as soon as the submersible reached the bottom" }] },
        { title: "Comma only when it comes first", jpTitle: "先頭に来るときだけコンマ",
          sub: "As soon as … , main clause. But main clause as soon as … with no comma.", jpSub: "As soon as … , 主節。主節 as soon as … のときはコンマなしです。",
          transforms: [["the two ships crash / an enormous fire start", "As soon as the two ships crashed, an enormous fire started."], ["the storm pass / the crew check the lifeboats", "As soon as the storm passed, the crew checked the lifeboats."]],
          examples: [{ t: "As soon as the two ships crashed, an enormous fire started.", jp: "2隻の船が衝突するとすぐ、巨大な火事が起こりました。", h: "As soon as the two ships crashed" },
                     { t: "The Doña Paz sank as soon as the fire reached the fuel.", jp: "火が燃料に達するとすぐドニャ・パス号は沈みました。", h: "as soon as the fire reached" }] },
        { title: "For the future, use the present tense", jpTitle: "未来のことでも現在形",
          sub: "After as soon as, never use will — use the present, and put will in the main clause.", jpSub: "as soon as のあとに will は使いません。現在形にして、will は主節に置きます。",
          transforms: [["I am captain / I find your treasure", "As soon as I am captain, I'll find your treasure."], ["I am ready / I go there", "As soon as I am ready, I'm going there."]],
          examples: [{ t: "As soon as I am captain, with cargo and crew, I'll find your treasure.", jp: "船長になったらすぐ宝を見つけよう。", h: "As soon as I am captain" },
                     { t: "As soon as I am ready, I'm going there.", jp: "準備ができたらすぐそこへ行きます。", h: "As soon as I am ready" }] }
      ],
      mixed: [
        { t: "As soon as the referee blew the final whistle, the fans ran onto the pitch.", jp: "主審が試合終了のホイッスルを鳴らすとすぐ、ファンがピッチに走り込みました。", h: "As soon as the referee blew the final whistle" },
        { t: "The captain called for help as soon as the ship began to sink.", jp: "船が沈み始めるとすぐ、船長は助けを求めました。", h: "as soon as the ship began to sink" },
        { t: "As soon as the pirates saw the cargo, they attacked.", jp: "海賊は積み荷を見るとすぐ襲いかかりました。", h: "As soon as the pirates saw the cargo" },
        { t: "We will launch the lifeboats as soon as the captain gives the order.", jp: "船長が命令を出したらすぐ救命ボートを下ろします。", h: "as soon as the captain gives the order" },
        { t: "As soon as the DEEPSEA CHALLENGER started to ascend, the crew cheered.", jp: "ディープシー・チャレンジャーが浮上を始めるとすぐ、乗組員は歓声をあげました。", h: "As soon as the DEEPSEA CHALLENGER started to ascend" },
        { t: "As soon as the water reached the engine, the lights went out.", jp: "水がエンジンに達するとすぐ、明かりが消えました。", h: "As soon as the water reached the engine" }
      ]
    },
    quiz: [
      { stem: ["", " the Santa Margarita sank, people began looking for the silver."], answers: ["As soon as", "As soon", "Soon as", "So soon"], correct: 0, explTitle: "The full phrase", explBody: "It is always as soon as, all three words.", jp: "3語そろって as soon as です。" },
      { stem: ["Water poured into the Titanic as soon as it ", " the iceberg."], answers: ["hit", "hits", "will hit", "hitting"], correct: 0, explTitle: "Past clause", explBody: "The sentence is about the past, so use hit.", jp: "過去の話なので hit です。" },
      { stem: ["In “As soon as the two ships crashed, a fire started”, what happened first?", ""], answers: ["The ships crashed", "The fire started", "Both at once", "Neither"], correct: 0, explTitle: "The as soon as clause is first", explBody: "That event comes first in time.", jp: "as soon as の節が先です。" },
      { stem: ["As soon as I ", " captain, I'll find your treasure."], answers: ["am", "will be", "was", "will am"], correct: 0, explTitle: "Present for the future", explBody: "Never use will after as soon as.", jp: "as soon as のあとに will は使いません。" },
      { stem: ["When do you put a comma?", ""], answers: ["When as soon as comes first", "Always", "Never", "Only in questions"], correct: 0, explTitle: "Comma rule", explBody: "Only when the clause starts the sentence.", jp: "as soon as が先頭のときだけです。" },
      { stem: ["The Doña Paz sank ", " the fire reached the fuel."], answers: ["as soon as", "as soon", "soon as", "so soon as"], correct: 0, explTitle: "Full phrase", explBody: "All three words are needed.", jp: "3語そろえて使います。" },
      { stem: ["Which sentence needs no comma?", ""], answers: ["Water poured in as soon as it hit the iceberg.", "As soon as it hit the iceberg water poured in.", "As soon as it sank people looked for silver.", "As soon as I am ready I'm going there."], correct: 0, explTitle: "Main clause first", explBody: "No comma when as soon as comes second.", jp: "as soon as があとなら不要です。" },
      { stem: ["As soon as the pirates ", " the cargo, they attacked."], answers: ["saw", "see", "will see", "seeing"], correct: 0, explTitle: "Past clause", explBody: "Both verbs are simple past.", jp: "両方とも過去形です。" },
      { stem: ["“As soon as” means ___.", ""], answers: ["immediately after", "a long time after", "before", "at the same time as"], correct: 0, explTitle: "Immediately after", explBody: "The second thing follows straight away.", jp: "「〜するとすぐに」という意味です。" },
      { stem: ["We will launch the lifeboats as soon as the captain ", " the order."], answers: ["gives", "will give", "gave", "giving"], correct: 0, explTitle: "Present for the future", explBody: "Use the present tense after as soon as.", jp: "as soon as のあとは現在形です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["As soon as the ship sank, people looked for the silver.", "As soon as the ship will sink, people looked for the silver.", "As soon the ship sank, people looked for the silver.", "As soon as the ship sank people looked for the silver as soon."], correct: 0, explTitle: "Past + comma", explBody: "Both verbs past, comma after the first clause.", jp: "両方過去形で、コンマを打ちます。" },
      { stem: ["Which event happened first? “Water poured in as soon as it hit the iceberg.”", ""], answers: ["It hit the iceberg.", "Water poured in.", "Both at once.", "Neither happened."], correct: 0, explTitle: "The as soon as clause", explBody: "That event is always earlier.", jp: "as soon as の節が先です。" },
      { stem: ["Complete: “As soon as I ___ ready, I'm going there.”", ""], answers: ["am", "will be", "was", "been"], correct: 0, explTitle: "Present for the future", explBody: "The song uses the present.", jp: "歌でも現在形です。" },
      { stem: ["Fix it: “As soon as the storm passed the crew checked the lifeboats.”", ""], answers: ["As soon as the storm passed, the crew checked the lifeboats.", "As soon as, the storm passed the crew checked the lifeboats.", "As soon as the storm, passed the crew checked the lifeboats.", "The storm passed as soon as, the crew checked the lifeboats."], correct: 0, explTitle: "Comma placement", explBody: "The comma closes the as soon as clause.", jp: "as soon as の節のあとにコンマです。" },
      { stem: ["Which one is NOT a time clause?", ""], answers: ["because the fire started", "as soon as the fire started", "when the fire started", "after the fire started"], correct: 0, explTitle: "because gives a reason", explBody: "Because explains why, not when.", jp: "because は理由を表します。" },
      { stem: ["Complete: “Cameron started filming as soon as the submersible ___ the bottom.”", ""], answers: ["reached", "reaches", "will reach", "reaching"], correct: 0, explTitle: "Past clause", explBody: "The story is in the past.", jp: "過去の話なので reached です。" },
      { stem: ["Which sentence is about the future?", ""], answers: ["We will launch the lifeboats as soon as the captain gives the order.", "We launched the lifeboats as soon as the captain gave the order.", "As soon as the ship sank, we launched the lifeboats.", "The lifeboats were launched as soon as it sank."], correct: 0, explTitle: "will in the main clause", explBody: "Present after as soon as, will in the main clause.", jp: "主節に will、as soon as のあとは現在形です。" },
      { stem: ["How many words are in the phrase?", ""], answers: ["three", "two", "four", "one"], correct: 0, explTitle: "as + soon + as", explBody: "All three are needed.", jp: "3語です。" },
      { stem: ["Choose the correct word order.", ""], answers: ["As soon as the pirates saw the cargo, they attacked.", "As soon as saw the pirates the cargo, they attacked.", "The pirates as soon as saw the cargo, they attacked.", "Attacked they as soon as the pirates saw the cargo."], correct: 0, explTitle: "Normal clause order", explBody: "Keep subject + verb inside the clause.", jp: "節の中はふつうの語順です。" },
      { stem: ["Complete: “As soon as the water ___ the engine, the lights went out.”", ""], answers: ["reached", "reaches", "will reach", "reach"], correct: 0, explTitle: "Past clause", explBody: "Both verbs are past.", jp: "両方過去形です。" }
    ]
  },

  g2: {
    key: "its_adjective_infinitive",
    tr: "9.7",
    component: "grammar-2",
    title: "It's + adjective + infinitive",
    jpTitle: "It's + 形容詞 + to不定詞",
    short: "It's important to…",
    role: "clause",
    rule: "Use It's or It isn't + an adjective + to + the base verb to judge an action — to say it is important, useful, safe, legal or not.",
    jpRule: "It's / It isn't + 形容詞 + to + 動詞の原形 で、その行動が大切か、役に立つか、安全か、合法かを判断して言います。",
    pattern: "It's / It isn't + adjective + to + base verb",
    jpPattern: "It's / It isn't + 形容詞 + to + 動詞の原形",
    intro: [
      { t: "It's important to know how to swim.", jp: "泳ぎ方を知っていることは大切です。" },
      { t: "It isn't legal to take artifacts from this shipwreck.", jp: "この沈没船から遺物を取るのは合法ではありません。" },
      { t: "It's illegal to be a pirate.", jp: "海賊になるのは違法です。" }
    ],
    rows: [
      { form: "Positive", pattern: "It's + adjective + to + base verb", example: "It's important to know how to swim.", jp: "泳ぎ方を知っていることは大切です。" },
      { form: "Negative", pattern: "It isn't + adjective + to + base verb", example: "It isn't safe to take artifacts from this shipwreck.", jp: "この沈没船から遺物を取るのは安全ではありません。" },
      { form: "Opposite adjectives", pattern: "It's + un-/in-/im-/il- adjective + to + base verb", example: "It's unsafe to be a pirate.", jp: "海賊になるのは危険です。" },
      { form: "Useful adjectives", pattern: "important / useful / necessary / helpful / right", example: "It's necessary to know how to swim.", jp: "泳ぎ方を知っていることは必要です。" },
      { form: "The it is empty", pattern: "it points forward to the to-phrase", example: "It's helpful to know how to swim.", jp: "この it はあとの to不定詞を指しています。" }
    ],
    noteRule: "The it at the front does not mean anything on its own — it points forward to the to-phrase.",
    noteException: "You can say the same thing with the opposite adjective: It isn't legal = It's illegal.",
    noteExceptionDetail: "The verb after to is always the base form: to know, to take, to be.",
    table: {
      title: "It's + adjective + to + base verb",
      columns: ["It's / It isn't", "Adjective", "to + base verb"],
      rows: [
        { cells: ["It's", "important", "to know how to swim."], roles: [null, "clause", "clause"] },
        { cells: ["It's", "useful", "to know how to swim."], roles: [null, "clause", "clause"] },
        { cells: ["It isn't", "legal", "to take artifacts from this shipwreck."], roles: [null, "clause", "clause"] },
        { cells: ["It's", "illegal", "to be a pirate."], roles: [null, "clause", "clause"] }
      ],
      notes: [
        "It isn't legal and It's illegal mean the same thing.",
        "The base form always follows to."
      ]
    },
    samples: [
      { t: "It's important to know how to swim.", jp: "泳ぎ方を知っていることは大切です。", h: "It's important to know" },
      { t: "It's useful to know how to swim.", jp: "泳ぎ方を知っていることは役に立ちます。", h: "It's useful to know" },
      { t: "It's necessary to know how to swim.", jp: "泳ぎ方を知っていることは必要です。", h: "It's necessary to know" },
      { t: "It's helpful to know how to swim.", jp: "泳ぎ方を知っていることは助けになります。", h: "It's helpful to know" },
      { t: "It isn't legal to take artifacts from this shipwreck.", jp: "この沈没船から遺物を取るのは合法ではありません。", h: "It isn't legal to take" },
      { t: "It isn't safe to take artifacts from this shipwreck.", jp: "この沈没船から遺物を取るのは安全ではありません。", h: "It isn't safe to take" },
      { t: "It isn't right to take artifacts from this shipwreck.", jp: "この沈没船から遺物を取るのは正しくありません。", h: "It isn't right to take" },
      { t: "It's illegal to be a pirate.", jp: "海賊になるのは違法です。", h: "It's illegal to be" },
      { t: "It's unsafe to be a pirate.", jp: "海賊になるのは危険です。", h: "It's unsafe to be" },
      { t: "It's impossible to know how many passengers drowned.", jp: "何人の乗客がおぼれたのかを知ることは不可能です。", h: "It's impossible to know" }
    ],
    levelup: {
      rules: [
        { title: "It points forward to the to-phrase", jpTitle: "it はあとの to不定詞を指す",
          sub: "The it at the front has no meaning of its own — the real subject is to know how to swim.", jpSub: "文頭の it 自体に意味はありません。本当の主語は to know how to swim です。",
          transforms: [["know how to swim / important", "It's important to know how to swim."], ["know how to swim / useful", "It's useful to know how to swim."]],
          examples: [{ t: "It's important to know how to swim.", jp: "泳ぎ方を知っていることは大切です。", h: "It's important to know" },
                     { t: "It's helpful to know how to swim.", jp: "泳ぎ方を知っていることは助けになります。", h: "It's helpful to know" }] },
        { title: "Two ways to say the same thing", jpTitle: "同じ意味を2通りで言う",
          sub: "It isn't legal = It's illegal. It isn't safe = It's unsafe.", jpSub: "It isn't legal と It's illegal は同じ意味です。",
          transforms: [["take artifacts / not legal", "It isn't legal to take artifacts."], ["be a pirate / illegal", "It's illegal to be a pirate."]],
          examples: [{ t: "It isn't legal to take artifacts from this shipwreck.", jp: "遺物を取るのは合法ではありません。", h: "It isn't legal to take" },
                     { t: "It's illegal to be a pirate.", jp: "海賊になるのは違法です。", h: "It's illegal to be" }] },
        { title: "Always the base form after to", jpTitle: "to のあとは必ず原形",
          sub: "to know, to take, to be — never to knowing or to knew.", jpSub: "to know・to take・to be の形で、to knowing や to knew とは言いません。",
          transforms: [["know how many drowned / impossible", "It's impossible to know how many drowned."], ["throw trash into the ocean / illegal", "It's illegal to throw trash into the ocean."]],
          examples: [{ t: "It's impossible to know how many passengers drowned.", jp: "何人の乗客がおぼれたか知ることは不可能です。", h: "It's impossible to know" },
                     { t: "It's illegal to throw your trash into the ocean.", jp: "ごみを海に投げ捨てるのは違法です。", h: "It's illegal to throw" }] }
      ],
      mixed: [
        { t: "It's important to wear a life jacket on the boat.", jp: "ボートでは救命胴衣を着けることが大切です。", h: "It's important to wear" },
        { t: "It isn't safe to sit on the edge of the boat.", jp: "ボートのふちに座るのは安全ではありません。", h: "It isn't safe to sit" },
        { t: "It's impossible for you to save your friend alone.", jp: "一人で友達を助けるのはあなたには不可能です。", h: "It's impossible for you to save" },
        { t: "It's useful to check the weather before you sail.", jp: "出航する前に天気を確かめるのは役に立ちます。", h: "It's useful to check" },
        { t: "It's incorrect to say that Blackbeard was French.", jp: "黒ひげがフランス人だったと言うのはまちがいです。", h: "It's incorrect to say" },
        { t: "It's necessary to count every passenger before sailing.", jp: "出航前にすべての乗客を数えることが必要です。", h: "It's necessary to count" }
      ]
    },
    quiz: [
      { stem: ["It's important ", " how to swim."], answers: ["to know", "knowing", "know", "known"], correct: 0, explTitle: "to + base verb", explBody: "The infinitive follows the adjective.", jp: "形容詞のあとは to + 原形です。" },
      { stem: ["It isn't legal ", " artifacts from this shipwreck."], answers: ["to take", "taking", "take", "taken"], correct: 0, explTitle: "to + base verb", explBody: "Always the base form after to.", jp: "to のあとは原形です。" },
      { stem: ["“It isn't legal” means the same as ___.", ""], answers: ["It's illegal", "It's legal", "It's possible", "It's safe"], correct: 0, explTitle: "Opposite prefix", explBody: "il- makes legal into its opposite.", jp: "il- で反対の意味になります。" },
      { stem: ["It's ", " to be a pirate. (dangerous)"], answers: ["unsafe", "safe", "possible", "correct"], correct: 0, explTitle: "un- makes the opposite", explBody: "Unsafe is the opposite of safe.", jp: "unsafe は safe の反対です。" },
      { stem: ["What does the “it” at the front do?", ""], answers: ["It points forward to the to-phrase.", "It names a ship.", "It is the object.", "It means nothing at all."], correct: 0, explTitle: "Forward-pointing it", explBody: "The real subject is the to-phrase.", jp: "本当の主語はあとの to不定詞です。" },
      { stem: ["It's impossible ", " how many passengers drowned."], answers: ["to know", "knowing", "known", "know"], correct: 0, explTitle: "to + base verb", explBody: "Use the infinitive.", jp: "to + 原形です。" },
      { stem: ["Which prefix makes “possible” its opposite?", ""], answers: ["im-", "un-", "il-", "in-"], correct: 0, explTitle: "impossible", explBody: "Possible takes im-.", jp: "possible には im- がつきます。" },
      { stem: ["Which prefix makes “correct” its opposite?", ""], answers: ["in-", "un-", "im-", "il-"], correct: 0, explTitle: "incorrect", explBody: "Correct takes in-.", jp: "correct には in- がつきます。" },
      { stem: ["It's useful ", " the weather before you sail."], answers: ["to check", "checking", "check", "checked"], correct: 0, explTitle: "to + base verb", explBody: "The infinitive again.", jp: "to + 原形です。" },
      { stem: ["Which sentence uses this pattern?", ""], answers: ["It's necessary to count every passenger.", "Counting every passenger is it necessary.", "It's necessary counting every passenger.", "Necessary it's to count every passenger."], correct: 0, explTitle: "It's + adjective + to + base verb", explBody: "Only the first one has the right shape.", jp: "最初の文だけが正しい形です。" }
    ],
    master: [
      { stem: ["Choose the correct sentence.", ""], answers: ["It's important to know how to swim.", "It's important knowing how to swim.", "It's important know how to swim.", "Important it's to know how to swim."], correct: 0, explTitle: "It's + adjective + to + base verb", explBody: "Keep that shape.", jp: "It's + 形容詞 + to + 原形です。" },
      { stem: ["Rewrite: “It isn't safe to be a pirate.”", ""], answers: ["It's unsafe to be a pirate.", "It's safe to be a pirate.", "It's insafe to be a pirate.", "It's imsafe to be a pirate."], correct: 0, explTitle: "safe → unsafe", explBody: "The un- prefix makes the opposite.", jp: "safe の反対は unsafe です。" },
      { stem: ["Which prefix goes with “legal”?", ""], answers: ["il-", "un-", "im-", "in-"], correct: 0, explTitle: "illegal", explBody: "Legal takes il-.", jp: "legal には il- がつきます。" },
      { stem: ["Complete: “It's ___ to know how many passengers drowned.” (not possible)", ""], answers: ["impossible", "unpossible", "inpossible", "ilpossible"], correct: 0, explTitle: "im- before p", explBody: "Possible takes im-.", jp: "possible には im- です。" },
      { stem: ["Fix it: “It's important knowing how to swim.”", ""], answers: ["It's important to know how to swim.", "It's important know how to swim.", "It's important to knowing how to swim.", "It important is to know how to swim."], correct: 0, explTitle: "Use the infinitive", explBody: "to + know.", jp: "to + 原形にします。" },
      { stem: ["Which adjective does NOT fit the pattern?", ""], answers: ["swim", "important", "useful", "necessary"], correct: 0, explTitle: "swim is a verb", explBody: "You need an adjective after It's.", jp: "It's のあとは形容詞です。" },
      { stem: ["Complete: “It's ___ to say that Blackbeard was French.” (wrong)", ""], answers: ["incorrect", "uncorrect", "imcorrect", "ilcorrect"], correct: 0, explTitle: "in- before c", explBody: "Correct takes in-.", jp: "correct には in- です。" },
      { stem: ["Which sentence gives advice?", ""], answers: ["It's important to wear a life jacket.", "The life jacket is orange.", "He wore a life jacket.", "Life jackets float."], correct: 0, explTitle: "The pattern judges an action", explBody: "It says whether an action is worth doing.", jp: "行動の是非を判断する形です。" },
      { stem: ["Choose the correct word order.", ""], answers: ["It isn't right to take artifacts from this shipwreck.", "It right isn't to take artifacts from this shipwreck.", "Right it isn't to take artifacts.", "To take artifacts it isn't right from this shipwreck."], correct: 0, explTitle: "It isn't + adjective + to + base verb", explBody: "Keep that order.", jp: "It isn't + 形容詞 + to + 原形です。" },
      { stem: ["What follows “to” in this pattern?", ""], answers: ["the base form of the verb", "the past form", "the -ing form", "a noun only"], correct: 0, explTitle: "Base form", explBody: "to know, to take, to be.", jp: "to のあとは原形です。" }
    ]
  },

  reading: {
    tr: "9.8",
    title: "Journey to the Bottom of the Earth",
    jpTitle: "地球の底への旅",
    intro: "James Cameron, the famous explorer and movie director, traveled to the deepest point of the Mariana Trench—the Challenger Deep—on March 26, 2012.",
    paras: [
      { t: "At about 11,000 meters below sea level, this is the deepest point on Earth. Since childhood, Cameron has wanted to dive and explore the ocean. Now he has reached the deepest point in the ocean. Alone.",
        q: "How deep is the Challenger Deep?", opts: ["About 11,000 meters below sea level", "About 1,100 meters", "About 110 meters"], correct: 0, jp: "海面下約11,000メートルです。" },
      { t: "The Mariana Trench is perhaps the most isolated place on the planet. Because of its extreme depth, the pressure at the bottom of the Mariana Trench is incredibly strong. The temperature is just a few degrees above freezing, and the place is always in darkness. Although two explorers went there in 1960, Cameron was the first to film this strange, dark place.",
        q: "What was Cameron the first to do?", opts: ["Film the bottom of the trench", "Reach the trench", "Swim in the trench"], correct: 0, jp: "海溝の底を撮影した最初の人です。" },
      { t: "For this incredible expedition, Cameron traveled in a submersible called the DEEPSEA CHALLENGER. It was 7.3 meters long and 1.09 meters wide—so small that Cameron could hardly move. Yet the sub was powerful enough to reach the bottom of the ocean in just two hours and thirty-six minutes and ascend in seventy minutes!",
        q: "How long did the descent take?", opts: ["Two hours and thirty-six minutes", "Seventy minutes", "Three hours"], correct: 0, jp: "2時間36分です。" },
      { t: "In the DEEPSEA CHALLENGER, Cameron spent three hours filming the bottom of the ocean while its mechanical arms picked up rocks and animals. We know less about the deepest points on our planet than we do about the surface of Mars. But the samples Cameron collected will give scientists a lot of information. When they analyze the rocks, they might discover more about the earthquakes that cause tsunamis.",
        q: "What might the rocks tell scientists about?", opts: ["The earthquakes that cause tsunamis", "The weather on Mars", "The Titanic"], correct: 0, jp: "津波を起こす地震についてです。" }
    ],
    strategy: {
      title: "Reading strategy — although signals a contrast",
      body: "Although two explorers went there in 1960, Cameron was the first to film it. Although warns you that the second half of the sentence will go against the first. Slow down whenever you meet it.",
      jp: "although は「前半と後半が逆になる」合図です。although が出てきたら、少しゆっくり読みましょう。"
    },
    order: {
      title: "Put Cameron's dive in order",
      items: [
        "Since childhood, Cameron has wanted to explore the ocean.",
        "On March 26, 2012 he travelled in the DEEPSEA CHALLENGER.",
        "The sub reached the bottom in two hours and thirty-six minutes.",
        "He spent three hours filming the bottom of the ocean.",
        "The mechanical arms picked up rocks and animals.",
        "The sub ascended in seventy minutes."
      ]
    },
    quiz: [
      { q: "On what date did Cameron make the dive?", opts: ["March 26, 2012", "March 26, 1960", "May 26, 2012"], correct: 0, jp: "2012年3月26日です。" },
      { q: "Who went with Cameron?", opts: ["Nobody — he went alone", "Two explorers", "A film crew"], correct: 0, jp: "だれも同行せず、一人で行きました。" },
      { q: "What is the temperature at the bottom?", opts: ["A few degrees above freezing", "Below freezing", "Very warm"], correct: 0, jp: "氷点より数度高いだけです。" },
      { q: "How long was the DEEPSEA CHALLENGER?", opts: ["7.3 meters", "1.09 meters", "11 meters"], correct: 0, jp: "7.3メートルです。" },
      { q: "How long did the sub take to ascend?", opts: ["Seventy minutes", "Two hours", "Three hours"], correct: 0, jp: "70分です。" },
      { q: "What did the mechanical arms do?", opts: ["Picked up rocks and animals", "Filmed the trench", "Steered the sub"], correct: 0, jp: "岩や生き物を拾い上げました。" },
      { q: "We know less about the deep ocean than about ___.", opts: ["the surface of Mars", "the moon's core", "the Sahara"], correct: 0, jp: "火星の表面より知られていません。" },
      { q: "What might studying the organisms teach us?", opts: ["More about how life began", "How to build a sub", "Where the Titanic sank"], correct: 0, jp: "生命がどう始まったかについてです。" }
    ]
  },

  writing: {
    genre: "A safety notice for a boat trip",
    jpGenre: "ボート旅行の安全案内",
    modelTitle: "Five Rules on Board",
    model: [
      "Welcome on board! It's important to know these five rules before we sail.",
      "First, you must wear your life jacket. It's unsafe to move around the deck without one.",
      "Second, don't sit on the edge. As soon as the boat hits a big wave, it's possible that you will fall in.",
      "Finally, it's illegal to throw your trash into the ocean, so please use the trash cans on board."
    ],
    modelJp: "ようこそ！出航前に5つの決まりを知っておくことが大切です。まず、救命胴衣を着けなければなりません。着けずに甲板を歩き回るのは危険です。",
    steps: [
      { t: "Open with why the rules matter, using It's important to…", jp: "It's important to … を使って、なぜ決まりが大切かを書き出す。" },
      { t: "Give each rule in order with First, Second, Third and Finally.", jp: "First・Second・Third・Finally を使って決まりを順に書く。" },
      { t: "Use as soon as once to describe what happens if a rule is broken.", jp: "as soon as を1回使って、決まりを破ったら何が起きるかを書く。" },
      { t: "Use one opposite adjective with un-, in-, im- or il-.", jp: "un-・in-・im-・il- のついた形容詞を1つ使う。" }
    ],
    expressions: [
      { t: "It's important to ___ before we ___.", jp: "〜する前に〜することが大切です。" },
      { t: "It's unsafe to ___ without ___.", jp: "〜なしで〜するのは危険です。" },
      { t: "As soon as ___, it's possible that ___.", jp: "〜するとすぐ、〜ということもありえます。" },
      { t: "It's illegal to ___, so please ___.", jp: "〜は違法なので、〜してください。" }
    ],
    checklist: [
      "I used It's + adjective + to + base verb at least twice.",
      "I used as soon as once.",
      "I used one opposite adjective with un-, in-, im- or il-.",
      "My rules are in a clear order with First, Second and Finally."
    ],
    quiz: [
      { q: "Choose the correct pattern.", opts: ["It's important to wear a life jacket.", "It's important wearing a life jacket.", "It's important wear a life jacket."], correct: 0, jp: "It's + 形容詞 + to + 原形です。" },
      { q: "Which prefix makes “legal” its opposite?", opts: ["il-", "un-", "im-"], correct: 0, jp: "il- です。" },
      { q: "Choose the correct as soon as sentence.", opts: ["As soon as the boat hits a wave, you may fall in.", "As soon as the boat will hit a wave, you may fall in.", "As soon the boat hits a wave, you may fall in."], correct: 0, jp: "as soon as のあとは現在形です。" },
      { q: "A safety notice should be ___.", opts: ["clear and ordered", "long and funny", "written as a poem"], correct: 0, jp: "はっきりと順序立てて書きます。" },
      { q: "Which word signals the last rule?", opts: ["Finally", "First", "Also"], correct: 0, jp: "Finally です。" },
      { q: "“It isn't safe” means the same as ___.", opts: ["It's unsafe", "It's safe", "It's possible"], correct: 0, jp: "It's unsafe と同じ意味です。" },
      { q: "Why do we wear life jackets, according to the unit?", opts: ["They float and we don't", "They look good", "They are warm"], correct: 0, jp: "救命胴衣は浮きますが、私たちは浮かないからです。" },
      { q: "What follows “to” in It's + adjective + to?", opts: ["the base form of the verb", "the -ing form", "the past form"], correct: 0, jp: "動詞の原形です。" }
    ]
  }
};
