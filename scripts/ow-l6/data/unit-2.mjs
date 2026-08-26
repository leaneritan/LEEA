/* Our World Level 6 · Unit 2 — History's a Mystery
   Source: Student's Book audio script TR 2.1-2.9. */
export default {
  unit: 2,
  title: "History's a Mystery",
  jpTitle: "歴史はミステリー",
  themeEmoji: "🏺",
  slug: "historys-a-mystery",

  opener: {
    tr: "2.1",
    intro:
      "Archaeologists have made some incredibly important discoveries—in the desert, in the mountains, and under the ground. Discoveries tell us a lot about the past.",
    goals: [
      { en: "Talk about famous archaeological discoveries.", jp: "有名な考古学の発見について話す。" },
      { en: "Use the passive voice in the simple past to say what was done.", jp: "受け身の過去形を使って「何がされたか」を言う。" },
      { en: "Name the tools scientists use to study the past.", jp: "科学者が過去を調べるために使う道具の名前を言う。" },
      { en: "Use by + agent to say who did something.", jp: "by + 動作主 を使って「だれがしたか」を言う。" },
      { en: "Read about King Tut and retell the mystery.", jp: "ツタンカーメンについて読み、その謎を伝える。" }
    ],
    photoCards: [
      { emoji: "🗿", title: "210 BCE — the terra-cotta army", text: "Over 700,000 men built an enormous tomb for Chinese ruler Qin Shihuang. Archaeologists excavated the tomb and found over 6,000 statues of soldiers and horses. Each statue is different!", jp: "70万人以上が中国の統治者・秦の始皇帝のために巨大な墓を造りました。考古学者は6,000体以上の兵士と馬の像を発見しました。" },
      { emoji: "🧟", title: "450 CE — the mummy of Peru", text: "This female mummy was found in a tomb in Peru. She was beautifully preserved, with tattoos of snakes and spiders on her body.", jp: "この女性のミイラはペルーの墓で見つかりました。ヘビやクモの入れ墨があり、美しく保存されていました。" },
      { emoji: "💰", title: "650 CE — the treasure in a field", text: "In 2009 this treasure was found in a field in England. Later, archaeologists discovered over 3,500 objects there.", jp: "2009年、この宝物がイングランドの野原で見つかりました。のちに3,500点以上の物が発見されました。" },
      { emoji: "🔬", title: "Today — the science", text: "Scientists have analyzed what they found. They know when the gold was buried, but they don't know who buried it or why.", jp: "科学者たちは見つけたものを分析しました。金がいつ埋められたかは分かりますが、だれがなぜ埋めたかは分かりません。" }
    ],
    lookAndCheck: [
      { q: "Who built the tomb for Qin Shihuang?", opts: ["Over 700,000 men", "Six thousand soldiers", "Three archaeologists"], correct: 0, jp: "70万人以上の人が造りました。" },
      { q: "What was found on the Peruvian mummy's body?", opts: ["Tattoos of snakes and spiders", "Gold coins", "A CT scan"], correct: 0, jp: "ヘビとクモの入れ墨が見つかりました。" },
      { q: "Where was the English treasure found?", opts: ["In a field", "In a river", "In a mountain cave"], correct: 0, jp: "野原で見つかりました。" },
      { q: "What do scientists still NOT know about the gold?", opts: ["Who buried it and why", "When it was buried", "What it is made of"], correct: 0, jp: "だれがなぜ埋めたかはまだ分かりません。" }
    ],
    sort: {
      title: "Person, place or thing?",
      zones: [
        { id: "person", label: "🧑 People" },
        { id: "place", label: "📍 Places" },
        { id: "thing", label: "🏺 Things" }
      ],
      tiles: [
        { text: "a ruler", zone: "person" },
        { text: "a thief", zone: "person" },
        { text: "an archaeologist", zone: "person" },
        { text: "a tomb", zone: "place" },
        { text: "a site", zone: "place" },
        { text: "a field", zone: "place" },
        { text: "a statue", zone: "thing" },
        { text: "a treasure", zone: "thing" },
        { text: "gold", zone: "thing" }
      ]
    },
    quiz: [
      { q: "Archaeologists make discoveries in the desert, the mountains and ___.", opts: ["under the ground", "in space", "on the moon"], correct: 0, jp: "地面の下でも発見します。" },
      { q: "How many statues were found in Qin Shihuang's tomb?", opts: ["Over 6,000", "Over 600", "Exactly 100"], correct: 0, jp: "6,000体以上見つかりました。" },
      { q: "The Peruvian mummy was ___.", opts: ["beautifully preserved", "completely destroyed", "made of gold"], correct: 0, jp: "美しく保存されていました。" },
      { q: "In what year was the English treasure found?", opts: ["2009", "1974", "1922"], correct: 0, jp: "2009年です。" },
      { q: "How many objects did archaeologists find in the field?", opts: ["Over 3,500", "Over 35", "Exactly 3"], correct: 0, jp: "3,500点以上です。" },
      { q: "What does an archaeologist do?", opts: ["Studies the past by digging", "Builds new tombs", "Sells gold"], correct: 0, jp: "考古学者は発掘して過去を調べます。" },
      { q: "Each terra-cotta statue is ___.", opts: ["different", "the same", "made of gold"], correct: 0, jp: "それぞれ違います。" },
      { q: "Discoveries tell us a lot about ___.", opts: ["the past", "the future", "the weather"], correct: 0, jp: "発見は過去について多くを教えてくれます。" }
    ]
  },

  v1: {
    tr: "2.2",
    words: [
      { w: "a tomb", norm: "tomb", emoji: "⚰️", ipa: "tuːm", syl: "tomb", pos: "noun", mean: "a room or building where a dead person is buried.", jw: "墓", jr: "はか", jm: "亡くなった人が埋葬される部屋や建物。",
        tr: "Scientists found the statues in the tomb.",
        ex: [["Scientists found the statues in the tomb.", "科学者たちは墓の中で像を見つけました。"],
             ["Over 700,000 men built an enormous tomb.", "70万人以上が巨大な墓を造りました。"],
             ["King Tut's tomb was full of gold objects.", "ツタンカーメンの墓は金の物でいっぱいでした。"]] },
      { w: "a ruler", norm: "ruler", emoji: "👑", ipa: "ˈruːlər", syl: "rul-er", pos: "noun", mean: "a person like a king or queen who leads a country.", jw: "統治者", jr: "とうちしゃ", jm: "王や女王のように国を治める人。",
        tr: "I saw the statue of a Chinese ruler.",
        ex: [["I saw the statue of a Chinese ruler.", "私は中国の統治者の像を見ました。"],
             ["The ruler was buried with 6,000 statues.", "その統治者は6,000体の像とともに埋葬されました。"],
             ["Tut became a ruler at the age of nine.", "ツタンカーメンは9歳で統治者になりました。"]] },
      { w: "a statue", norm: "statue", emoji: "🗿", ipa: "ˈstætʃuː", syl: "stat-ue", pos: "noun", mean: "a figure of a person or animal made from stone or metal.", jw: "像", jr: "ぞう", jm: "石や金属で作った人や動物の形。",
        tr: "I really liked the statues at the museum.",
        ex: [["I really liked the statues at the museum.", "私は博物館の像がとても気に入りました。"],
             ["Each terra-cotta statue is different.", "テラコッタの像はそれぞれ違います。"],
             ["The statue was carved from one block of stone.", "その像は一つの石の塊から彫られました。"]] },
      { w: "die", norm: "die", emoji: "🕯️", ipa: "daɪ", syl: "die", pos: "verb", mean: "to stop living.", jw: "死ぬ", jr: "しぬ", jm: "生きるのをやめること。",
        tr: "When the ruler died, they buried him with the statues.",
        ex: [["When the ruler died, they buried him with the statues.", "統治者が亡くなったとき、人々は像とともに彼を埋葬しました。"],
             ["We know that Tut died in 1323 BCE.", "ツタンカーメンは紀元前1323年に亡くなったと分かっています。"],
             ["No one knows exactly how the Iceman died.", "アイスマンがどう亡くなったのか、だれも正確には知りません。"]] },
      { w: "bury", norm: "bury", emoji: "🪦", ipa: "ˈberi", syl: "bur-y", pos: "verb", mean: "to put something under the ground and cover it.", jw: "埋める", jr: "うめる", jm: "何かを地面の下に入れて覆うこと。",
        tr: "The mummy was buried in a big tomb.",
        ex: [["The mummy was buried in a big tomb.", "そのミイラは大きな墓に埋葬されました。"],
             ["They know when the gold was buried.", "その金がいつ埋められたかは分かっています。"],
             ["Some rich people were buried with chocolate.", "裕福な人の中にはチョコレートとともに埋葬された人もいます。"]] },
      { w: "excavate", norm: "excavate", emoji: "⛏️", ipa: "ˈekskəveɪt", syl: "ex-ca-vate", pos: "verb", mean: "to dig carefully in the ground to find old objects.", jw: "発掘する", jr: "はっくつする", jm: "古い物を見つけるために地面を注意深く掘ること。",
        tr: "Archaeologists excavated the tomb.",
        ex: [["Archaeologists excavated the tomb.", "考古学者たちがその墓を発掘しました。"],
             ["The Sphinx wasn't excavated until 1925.", "スフィンクスは1925年まで発掘されませんでした。"],
             ["Teams will excavate the ruins more carefully in the future.", "チームは将来もっと注意深くその遺跡を発掘するでしょう。"]] },
      { w: "a mummy", norm: "mummy", emoji: "🧟", ipa: "ˈmʌmi", syl: "mum-my", pos: "noun", mean: "a dead body that has been kept for thousands of years.", jw: "ミイラ", jr: "みいら", jm: "何千年も保存された遺体。",
        tr: "I saw a mummy at the museum.",
        ex: [["I saw a mummy at the museum.", "私は博物館でミイラを見ました。"],
             ["In 1991 a mummy was discovered by hikers.", "1991年、ハイカーによってミイラが発見されました。"],
             ["The mummy had tattoos of snakes and spiders.", "そのミイラにはヘビとクモの入れ墨がありました。"]] },
      { w: "preserve", norm: "preserve", emoji: "🧊", ipa: "prɪˈzɜːrv", syl: "pre-serve", pos: "verb", mean: "to keep something in good condition for a very long time.", jw: "保存する", jr: "ほぞんする", jm: "とても長い間、良い状態のまま保つこと。",
        tr: "The mummy was well preserved.",
        ex: [["The mummy was well preserved.", "そのミイラはよく保存されていました。"],
             ["He was preserved in ice for 5,000 years.", "彼は5,000年間氷の中で保存されていました。"],
             ["Tut's DNA was perfectly preserved.", "ツタンカーメンのDNAは完璧に保存されていました。"]] },
      { w: "a tattoo", norm: "tattoo", emoji: "🖋️", ipa: "tæˈtuː", syl: "tat-too", pos: "noun", mean: "a picture drawn permanently on someone's skin.", jw: "入れ墨", jr: "いれずみ", jm: "皮膚に永久に描かれた絵。",
        tr: "The mummy has tattoos.",
        ex: [["The mummy has tattoos.", "そのミイラには入れ墨があります。"],
             ["She had tattoos of snakes and spiders on her body.", "彼女の体にはヘビとクモの入れ墨がありました。"],
             ["A tattoo can tell us about an ancient culture.", "入れ墨は古代の文化について教えてくれることがあります。"]] },
      { w: "a cause", norm: "cause", emoji: "❓", ipa: "kɔːz", syl: "cause", pos: "noun", mean: "the reason why something happens.", jw: "原因", jr: "げんいん", jm: "何かが起こる理由。",
        tr: "No one knows the cause of his death.",
        ex: [["No one knows the cause of his death.", "彼の死の原因はだれも知りません。"],
             ["We wanted to know the cause of their death.", "私たちは彼らの死の原因を知りたかったのです。"],
             ["The cause of the fire is still a mystery.", "火事の原因はまだ謎です。"]] },
      { w: "a treasure", norm: "treasure", emoji: "💰", ipa: "ˈtreʒər", syl: "treas-ure", pos: "noun", mean: "gold, money or objects that are worth a lot.", jw: "宝物", jr: "たからもの", jm: "とても価値のある金・お金・品物。",
        tr: "They found a treasure in the tomb.",
        ex: [["They found a treasure in the tomb.", "彼らは墓の中で宝物を見つけました。"],
             ["Carter found over 3,000 treasures.", "カーターは3,000以上の宝物を見つけました。"],
             ["Anglo Saxon treasure was discovered in the mist.", "アングロサクソンの宝物が霧の中で発見されました。"]] },
      { w: "discover", norm: "discover", emoji: "🔍", ipa: "dɪˈskʌvər", syl: "dis-cov-er", pos: "verb", mean: "to find something for the first time.", jw: "発見する", jr: "はっけんする", jm: "何かを初めて見つけること。",
        tr: "The treasure was discovered by accident.",
        ex: [["The treasure was discovered by accident.", "その宝物は偶然発見されました。"],
             ["Archaeologists discovered over 3,500 objects there.", "考古学者はそこで3,500点以上の物を発見しました。"],
             ["When were the statues discovered?", "その像はいつ発見されましたか。"]] },
      { w: "an object", norm: "object", emoji: "🏺", ipa: "ˈɑːbdʒɪkt", syl: "ob-ject", pos: "noun", mean: "a thing you can see and touch.", jw: "物", jr: "もの", jm: "見たり触ったりできるもの。",
        tr: "There were many objects in the tomb.",
        ex: [["There were many objects in the tomb.", "墓の中には多くの物がありました。"],
             ["Objects that were hidden can be found by scientists.", "隠された物は科学者によって見つけられることがあります。"],
             ["Tut was buried with all the objects he would need.", "ツタンカーメンは必要な物すべてとともに埋葬されました。"]] },
      { w: "analyze", norm: "analyze", emoji: "🔬", ipa: "ˈænəlaɪz", syl: "an-a-lyze", pos: "verb", mean: "to study something carefully to find out what it is made of.", jw: "分析する", jr: "ぶんせきする", jm: "何でできているかを調べるために注意深く研究すること。",
        tr: "Scientists are analyzing the mummy.",
        ex: [["Scientists analyze the objects they find in a tomb.", "科学者は墓で見つけた物を分析します。"],
             ["The Iceman's body was analyzed by scientists.", "アイスマンの体は科学者によって分析されました。"],
             ["In 1968 his mummy was analyzed by scientists.", "1968年、彼のミイラは科学者によって分析されました。"]] },
      { w: "gold", norm: "gold", emoji: "🥇", ipa: "ɡoʊld", syl: "gold", pos: "noun", mean: "a valuable yellow metal.", jw: "金", jr: "きん", jm: "価値の高い黄色の金属。",
        tr: "They found many gold coins.",
        ex: [["They found many gold coins.", "彼らは多くの金貨を見つけました。"],
             ["Carter found hundreds of gold objects.", "カーターは何百もの金の物を見つけました。"],
             ["They know when the gold was buried.", "その金がいつ埋められたかは分かっています。"]] },
      { w: "a thief", norm: "thief", emoji: "🥷", ipa: "θiːf", syl: "thief", pos: "noun", mean: "a person who steals things.", jw: "泥棒", jr: "どろぼう", jm: "物を盗む人。",
        tr: "Thieves stole the treasure.",
        ex: [["A thief took the gold from the tomb.", "泥棒が墓から金を持ち去りました。"],
             ["Did a thief hide the treasure in the field?", "泥棒がその宝物を野原に隠したのでしょうか。"],
             ["Was the pottery broken by a thief?", "その陶器は泥棒に壊されたのでしょうか。"]] }
    ]
  },

  v2: {
    tr: "2.5",
    words: [
      { w: "a CT scan", norm: "CT scan", emoji: "🩻", ipa: "ˌsiː ˈtiː skæn", syl: "C-T scan", pos: "noun", mean: "a machine picture that shows the inside of a body.", jw: "CTスキャン", jr: "しーてぃーすきゃん", jm: "体の中を写す機械の画像。",
        tr: "The scientist did a CT scan.",
        ex: [["The scientist did a CT scan.", "科学者はCTスキャンをしました。"],
             ["A CT scan of Tut's mummy was taken in 2006.", "2006年にツタンカーメンのミイラのCTスキャンが撮られました。"],
             ["The Iceman was checked with a new CT scan machine.", "アイスマンは新しいCTスキャン装置で調べられました。"]] },
      { w: "an artifact", norm: "artifact", emoji: "🏺", ipa: "ˈɑːrtɪfækt", syl: "ar-ti-fact", pos: "noun", mean: "an old object made by people long ago.", jw: "遺物", jr: "いぶつ", jm: "昔の人が作った古い物。",
        tr: "They discovered an ancient artifact.",
        ex: [["They discovered an ancient artifact.", "彼らは古代の遺物を発見しました。"],
             ["Carter found an artifact with the king's name on it.", "カーターは王の名前が入った遺物を見つけました。"],
             ["The artifacts were moved to a museum.", "その遺物は博物館に移されました。"]] },
      { w: "a DNA test", norm: "DNA test", emoji: "🧬", ipa: "ˌdiː en ˈeɪ test", syl: "D-N-A test", pos: "noun", mean: "a science test that reads the code inside a body.", jw: "DNA検査", jr: "でぃーえぬえーけんさ", jm: "体の中の遺伝情報を読む検査。",
        tr: "To learn about the mummy, they did a DNA test.",
        ex: [["To learn about the mummy, they did a DNA test.", "ミイラについて知るために、彼らはDNA検査をしました。"],
             ["A DNA test showed that he had malaria.", "DNA検査で彼がマラリアだったと分かりました。"],
             ["A DNA test can tell us who someone's family was.", "DNA検査はその人の家族がだれだったかを教えてくれます。"]] },
      { w: "a site", norm: "site", emoji: "📍", ipa: "saɪt", syl: "site", pos: "noun", mean: "the place where something is found or built.", jw: "遺跡", jr: "いせき", jm: "何かが見つかったり建てられたりする場所。",
        tr: "They found artifacts at the site.",
        ex: [["They found artifacts at the site.", "彼らはその遺跡で遺物を見つけました。"],
             ["New technology can help find a new site.", "新しい技術は新しい遺跡を見つけるのに役立ちます。"],
             ["Carter searched near the site for years.", "カーターは何年もその遺跡の近くを探しました。"]] },
      { w: "a sample", norm: "sample", emoji: "🧪", ipa: "ˈsæmpəl", syl: "sam-ple", pos: "noun", mean: "a small piece taken so it can be studied.", jw: "見本", jr: "みほん", jm: "調べるために取った小さな一部。",
        tr: "They are analyzing a sample.",
        ex: [["They are analyzing a sample.", "彼らは見本を分析しています。"],
             ["The sample was taken from inside the tomb.", "その見本は墓の中から取られました。"],
             ["Scientists study each sample in a lab.", "科学者は実験室でそれぞれの見本を調べます。"]] }
    ]
  },

  academic: ["analyze", "evidence", "cause_and_effect", "sequence", "summarize"],

  content: [
    { w: "an archaeologist", norm: "archaeologist", emoji: "🧑‍🔬", ipa: "ˌɑːrkiˈɑːlədʒɪst", syl: "ar-chae-ol-o-gist", pos: "noun", mean: "a scientist who studies the past by digging things up.", jw: "考古学者", jr: "こうこがくしゃ", jm: "発掘して過去を研究する科学者。",
      ex: [["Archaeologists have made some incredibly important discoveries.", "考古学者はとても重要な発見をしてきました。"],
           ["Howard Carter was an English archaeologist.", "ハワード・カーターはイギリスの考古学者でした。"],
           ["The archaeologist took photos and left the artifacts.", "その考古学者は写真を撮り、遺物はそのままにしました。"]] },
    { w: "ancient", norm: "ancient", emoji: "🏛️", ipa: "ˈeɪnʃənt", syl: "an-cient", pos: "adjective", mean: "from a time very long ago.", jw: "古代の", jr: "こだいの", jm: "とても昔の時代のもの。",
      ex: [["Egypt is full of ancient discoveries.", "エジプトは古代の発見でいっぱいです。"],
           ["They discovered an ancient artifact.", "彼らは古代の遺物を発見しました。"],
           ["Ancient rulers were buried with their treasures.", "古代の統治者は宝物とともに埋葬されました。"]] },
    { w: "the pottery", norm: "pottery", emoji: "🍶", ipa: "ˈpɑːtəri", syl: "pot-ter-y", pos: "noun", mean: "pots and bowls made from clay.", jw: "陶器", jr: "とうき", jm: "粘土で作った器や皿。",
      ex: [["Was the pottery broken by thieves?", "その陶器は泥棒に壊されたのですか。"],
           ["Pottery and paper were found in the mist.", "陶器と紙が霧の中で見つかりました。"],
           ["The pottery tells us how people ate.", "陶器は人々がどのように食べていたかを教えてくれます。"]] },
    { w: "a hiker", norm: "hiker", emoji: "🥾", ipa: "ˈhaɪkər", syl: "hik-er", pos: "noun", mean: "a person who walks a long way in the mountains or countryside.", jw: "ハイカー", jr: "はいかー", jm: "山や野を長く歩く人。",
      ex: [["The hiker found the mummy.", "そのハイカーがミイラを見つけました。"],
           ["The mummy was found by hikers in the mountains.", "そのミイラは山でハイカーによって見つけられました。"],
           ["A hiker can discover history by accident.", "ハイカーが偶然に歴史を発見することがあります。"]] },
    { w: "a skull", norm: "skull", emoji: "💀", ipa: "skʌl", syl: "skull", pos: "noun", mean: "the bones of the head.", jw: "頭蓋骨", jr: "ずがいこつ", jm: "頭の骨。",
      ex: [["Scientists found broken bones in Tut's skull.", "科学者はツタンカーメンの頭蓋骨に折れた骨を見つけました。"],
           ["The skull was studied with a CT scan.", "その頭蓋骨はCTスキャンで調べられました。"],
           ["A skull can show how old someone was.", "頭蓋骨はその人が何歳だったかを示すことがあります。"]] }
  ],

  song: {
    tr: "2.3",
    title: "So Much to Learn",
    jpTitle: "学ぶことがたくさん",
    lyrics: [
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "History's a mystery,", jp: "歴史はミステリー、" },
      { t: "and that's why I like history!", jp: "だから歴史が好きなんだ！" },
      { t: "Buried statues and mummies, too!", jp: "埋められた像もミイラも！" },
      { t: "So much to learn. So much to do!", jp: "学ぶことがたくさん。やることもたくさん！" },
      { t: "Excavated kings", jp: "発掘された王たちは" },
      { t: "were found by archaeologists.", jp: "考古学者によって見つけられた。" },
      { t: "Anglo Saxon treasure was discovered in the mist.", jp: "アングロサクソンの宝物が霧の中で発見された。" },
      { t: "The Terra-cotta Army", jp: "テラコッタの兵馬俑は" },
      { t: "was found deep underground.", jp: "地下深くで見つかった。" },
      { t: "Just think what you might find", jp: "何が見つかるか考えてみて" },
      { t: "if you look around.", jp: "まわりを見てみれば。" },
      { t: "Objects that were hidden", jp: "隠されていた物は" },
      { t: "can be found by scientists.", jp: "科学者によって見つけられる。" },
      { t: "Pottery and paper, gold and money, in the mist.", jp: "陶器も紙も、金もお金も、霧の中に。" },
      { t: "If we learn from history,", jp: "歴史から学べば、" },
      { t: "wisdom from the past", jp: "過去からの知恵が" },
      { t: "can help us answer questions", jp: "知りたい問いに" },
      { t: "we really want to ask.", jp: "答える助けになる。" }
    ],
    tapWords: ["statues", "mummies", "Excavated", "archaeologists", "treasure", "discovered", "Objects", "Pottery", "gold", "found"],
    quiz: [
      { q: "Why does the singer like history?", opts: ["Because history's a mystery", "Because it is easy", "Because there is no homework"], correct: 0, jp: "歴史はミステリーだからです。" },
      { q: "Who found the excavated kings?", opts: ["Archaeologists", "Thieves", "Hikers"], correct: 0, jp: "考古学者です。" },
      { q: "Where was the Terra-cotta Army found?", opts: ["Deep underground", "In the sea", "On a mountain"], correct: 0, jp: "地下深くです。" },
      { q: "“Objects that were hidden can be found by scientists” is in the ___.", opts: ["passive voice", "future tense", "imperative"], correct: 0, jp: "受け身の文です。" },
      { q: "What can wisdom from the past help us do?", opts: ["Answer questions we want to ask", "Build a new tomb", "Sell treasure"], correct: 0, jp: "知りたい問いに答える助けになります。" },
      { q: "Where was the Anglo Saxon treasure discovered?", opts: ["In the mist", "In a museum", "In a river"], correct: 0, jp: "霧の中です。" }
    ]
  },

  g1: {
    key: "passive_simple_past",
    tr: "2.4",
    component: "grammar-1",
    title: "Passive voice: Simple past",
    jpTitle: "受け身の過去形",
    short: "was / were + past participle",
    role: "verb",
    rule: "Use was or were + the past participle when you want to talk about what happened to something, and who did it is unknown or not important.",
    jpRule: "何がされたかを話し、だれがしたかが分からない、または重要でないときは was / were + 過去分詞 を使います。",
    pattern: "subject + was / were + past participle",
    jpPattern: "主語 + was / were + 過去分詞",
    intro: [
      { t: "The Sphinx was built around 2500 BCE.", jp: "スフィンクスは紀元前2500年ごろに建てられました。" },
      { t: "It wasn't excavated until 1925.", jp: "それは1925年まで発掘されませんでした。" },
      { t: "When were the statues discovered?", jp: "その像はいつ発見されましたか。" }
    ],
    rows: [
      { form: "Singular", pattern: "subject + was + past participle", example: "The Sphinx was built around 2500 BCE.", jp: "スフィンクスは紀元前2500年ごろに建てられました。" },
      { form: "Plural", pattern: "subject + were + past participle", example: "The statues were found in 1974.", jp: "その像は1974年に見つかりました。" },
      { form: "Negative", pattern: "subject + wasn't / weren't + past participle", example: "The treasures weren't stolen.", jp: "その宝物は盗まれませんでした。" },
      { form: "Question", pattern: "Was / Were + subject + past participle?", example: "When were the statues discovered?", jp: "その像はいつ発見されましたか。" },
      { form: "Where the agent goes", pattern: "…+ by + person (only if it matters)", example: "The treasure was discovered in a field.", jp: "その宝物は野原で発見されました。" }
    ],
    noteRule: "The passive puts the important thing first. The Sphinx matters here, not the builders.",
    noteException: "Use was with I/he/she/it and a singular noun; use were with you/we/they and a plural noun.",
    noteExceptionDetail: "Many past participles are irregular: build → built, find → found, steal → stolen, break → broken, take → taken.",
    table: {
      title: "was / were + past participle",
      columns: ["Subject", "was / were", "Past participle", "Rest"],
      rows: [
        { cells: ["The Sphinx", "was", "built", "around 2500 BCE."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["The statues", "were", "found", "in 1974."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["It", "wasn't", "excavated", "until 1925."], roles: ["subject", "verb", "verb", "clause"] },
        { cells: ["The treasures", "weren't", "stolen", "."], roles: ["subject", "verb", "verb", null] }
      ],
      notes: [
        "The object of the active sentence becomes the subject of the passive one.",
        "Make questions by putting was or were before the subject."
      ],
      qa: [
        { question: "When were the statues discovered?", answer: "They were found in 1974." },
        { question: "Was the treasure stolen?", answer: "No, it wasn't." }
      ]
    },
    samples: [
      { t: "The Sphinx was built around 2500 BCE.", jp: "スフィンクスは紀元前2500年ごろに建てられました。", h: "was built" },
      { t: "It wasn't excavated until 1925.", jp: "それは1925年まで発掘されませんでした。", h: "wasn't excavated" },
      { t: "When were the statues discovered?", jp: "その像はいつ発見されましたか。", h: "were the statues discovered" },
      { t: "The statues were found in 1974.", jp: "その像は1974年に見つかりました。", h: "were found" },
      { t: "The treasure was discovered in a field.", jp: "その宝物は野原で発見されました。", h: "was discovered" },
      { t: "The treasures weren't stolen.", jp: "その宝物は盗まれませんでした。", h: "weren't stolen" },
      { t: "The mummy was buried in a big tomb.", jp: "そのミイラは大きな墓に埋葬されました。", h: "was buried" },
      { t: "Over 3,500 objects were discovered there.", jp: "そこで3,500点以上の物が発見されました。", h: "were discovered" },
      { t: "Tut's DNA was perfectly preserved.", jp: "ツタンカーメンのDNAは完璧に保存されていました。", h: "was perfectly preserved" },
      { t: "The artifacts were moved to a museum.", jp: "その遺物は博物館に移されました。", h: "were moved" }
    ],
    levelup: {
      rules: [
        { title: "Match was / were to the subject", jpTitle: "was / were を主語に合わせる",
          sub: "One thing takes was. More than one thing takes were.", jpSub: "1つなら was、2つ以上なら were を使います。",
          transforms: [["The Sphinx / build / 2500 BCE", "The Sphinx was built around 2500 BCE."], ["The statues / find / 1974", "The statues were found in 1974."]],
          examples: [{ t: "The tomb was opened in 1922.", jp: "その墓は1922年に開けられました。", h: "was opened" },
                     { t: "The bones were studied in a lab.", jp: "その骨は実験室で調べられました。", h: "were studied" }] },
        { title: "Use the past participle, not the past tense", jpTitle: "過去形ではなく過去分詞を使う",
          sub: "After was or were you need the third form: find → found, steal → stolen, break → broken.", jpSub: "was / were のあとは3番目の形（過去分詞）です。",
          transforms: [["The gold / steal", "The gold was stolen."], ["The pottery / break", "The pottery was broken."]],
          examples: [{ t: "The gold was stolen from the tomb.", jp: "金は墓から盗まれました。", h: "was stolen" },
                     { t: "The pottery was broken long ago.", jp: "その陶器はずっと昔に壊されました。", h: "was broken" }] },
        { title: "Make questions by moving was / were", jpTitle: "was / were を前に出して疑問文を作る",
          sub: "Put was or were before the subject, and keep the past participle after it.", jpSub: "was / were を主語の前に出し、過去分詞はそのあとに置きます。",
          transforms: [["the statues / discover / when", "When were the statues discovered?"], ["the treasure / steal", "Was the treasure stolen?"]],
          examples: [{ t: "Was the mummy preserved in ice?", jp: "そのミイラは氷の中で保存されていましたか。", h: "Was the mummy preserved" },
                     { t: "Were the objects analyzed by scientists?", jp: "その物は科学者に分析されましたか。", h: "Were the objects analyzed" }] }
      ],
      mixed: [
        { t: "The Iceman was found in the mountains.", jp: "アイスマンは山で見つかりました。", h: "was found" },
        { t: "Six thousand statues were buried with the ruler.", jp: "6,000体の像が統治者とともに埋葬されました。", h: "were buried" },
        { t: "The tomb wasn't opened for 3,000 years.", jp: "その墓は3,000年間開けられませんでした。", h: "wasn't opened" },
        { t: "Where was the gold hidden?", jp: "金はどこに隠されていましたか。", h: "was the gold hidden" },
        { t: "The samples were taken to a laboratory.", jp: "見本は実験室に運ばれました。", h: "were taken" },
        { t: "A CT scan was used in 2006.", jp: "2006年にCTスキャンが使われました。", h: "was used" }
      ]
    },
    quiz: [
      { stem: ["The Sphinx ", " built around 2500 BCE."], answers: ["was", "were", "is", "did"], correct: 0, explTitle: "Singular takes was", explBody: "“The Sphinx” is one thing, so use was.", jp: "スフィンクスは紀元前2500年ごろに建てられました。" },
      { stem: ["The statues ", " found in 1974."], answers: ["were", "was", "are", "did"], correct: 0, explTitle: "Plural takes were", explBody: "“The statues” is plural, so use were.", jp: "その像は1974年に見つかりました。" },
      { stem: ["It wasn't ", " until 1925."], answers: ["excavated", "excavate", "excavating", "excavates"], correct: 0, explTitle: "Past participle after was", explBody: "After was / wasn't use the past participle.", jp: "それは1925年まで発掘されませんでした。" },
      { stem: ["When ", " the statues discovered?"], answers: ["were", "was", "did", "are"], correct: 0, explTitle: "were before a plural subject", explBody: "Questions put were before the plural subject.", jp: "その像はいつ発見されましたか。" },
      { stem: ["The treasures ", " stolen."], answers: ["weren't", "wasn't", "didn't", "aren't"], correct: 0, explTitle: "Plural negative", explBody: "Plural subjects take weren't in the past passive.", jp: "その宝物は盗まれませんでした。" },
      { stem: ["The gold was ", " in a field."], answers: ["buried", "bury", "burying", "buries"], correct: 0, explTitle: "Past participle of bury", explBody: "bury → buried.", jp: "金は野原に埋められました。" },
      { stem: ["The pottery was ", " long ago."], answers: ["broken", "broke", "break", "breaking"], correct: 0, explTitle: "Irregular participle", explBody: "break → broke → broken.", jp: "その陶器はずっと昔に壊されました。" },
      { stem: ["Over 3,500 objects ", " discovered there."], answers: ["were", "was", "is", "has"], correct: 0, explTitle: "Plural subject", explBody: "“Objects” is plural, so use were.", jp: "そこで3,500点以上の物が発見されました。" },
      { stem: ["Tut's DNA ", " perfectly preserved."], answers: ["was", "were", "are", "have"], correct: 0, explTitle: "Singular subject", explBody: "“DNA” is treated as singular here.", jp: "ツタンカーメンのDNAは完璧に保存されていました。" },
      { stem: ["“The tomb was opened in 1922.” Who opened it?", ""], answers: ["The sentence doesn't say", "The tomb", "1922", "The Sphinx"], correct: 0, explTitle: "The passive can hide the agent", explBody: "A passive sentence does not have to say who did it.", jp: "受け身の文はだれがしたかを言わなくてもかまいません。" }
    ],
    master: [
      { stem: ["Choose the correct passive sentence.", ""], answers: ["The statues were found in 1974.", "The statues was found in 1974.", "The statues were find in 1974.", "The statues are found in 1974."], correct: 0, explTitle: "were + past participle", explBody: "Plural subject + were + found.", jp: "その像は1974年に見つかりました。" },
      { stem: ["Make it passive: “Thieves stole the gold.”", ""], answers: ["The gold was stolen.", "The gold were stolen.", "The gold was steal.", "The gold stole."], correct: 0, explTitle: "Object becomes subject", explBody: "The gold moves to the front and takes was + stolen.", jp: "金は盗まれました。" },
      { stem: ["Choose the correct question.", ""], answers: ["When was the tomb opened?", "When the tomb was opened?", "When did the tomb opened?", "When was opened the tomb?"], correct: 0, explTitle: "was before the subject", explBody: "In questions, was comes before the subject.", jp: "その墓はいつ開けられましたか。" },
      { stem: ["Choose the correct negative.", ""], answers: ["The treasures weren't stolen.", "The treasures didn't stolen.", "The treasures weren't steal.", "The treasures not were stolen."], correct: 0, explTitle: "weren't + past participle", explBody: "Add n't to were, then the past participle.", jp: "その宝物は盗まれませんでした。" },
      { stem: ["Which past participle is correct? “The pottery was ___.”", ""], answers: ["broken", "broke", "breaked", "breaking"], correct: 0, explTitle: "break → broken", explBody: "Broken is the past participle.", jp: "break の過去分詞は broken です。" },
      { stem: ["Which one is NOT passive?", ""], answers: ["Archaeologists excavated the tomb.", "The tomb was excavated.", "The statues were found.", "The gold was buried."], correct: 0, explTitle: "That one is active", explBody: "It has a subject doing the action, with no was / were + participle.", jp: "最初の文は能動態です。" },
      { stem: ["Complete: “The mummy ", " preserved in ice.”"], answers: ["was", "were", "is being", "has"], correct: 0, explTitle: "Singular past passive", explBody: "One mummy → was preserved.", jp: "そのミイラは氷の中で保存されていました。" },
      { stem: ["Why use the passive here? “The Sphinx was built around 2500 BCE.”", ""], answers: ["We do not know exactly who built it.", "Because the Sphinx is small.", "Because 2500 BCE is a year.", "Because it is a question."], correct: 0, explTitle: "Unknown agent", explBody: "The passive is useful when the doer is unknown.", jp: "だれが建てたか正確には分からないからです。" },
      { stem: ["Choose the sentence with the correct word order.", ""], answers: ["The artifacts were moved to a museum.", "The artifacts to a museum were moved.", "Were the artifacts moved to a museum.", "The artifacts moved were to a museum."], correct: 0, explTitle: "subject + were + participle", explBody: "Keep the order subject + were + past participle.", jp: "主語 + were + 過去分詞の順です。" },
      { stem: ["Which sentence is correct?", ""], answers: ["Over 6,000 statues were discovered.", "Over 6,000 statues was discovered.", "Over 6,000 statues were discover.", "Over 6,000 statues is discovered."], correct: 0, explTitle: "Plural + were + participle", explBody: "6,000 statues is plural, so were discovered.", jp: "6,000体以上の像が発見されました。" }
    ]
  },

  g2: {
    key: "passive_by_agent",
    tr: "2.7",
    component: "grammar-2",
    title: "Passive voice: Simple past with by + agent",
    jpTitle: "受け身の過去形と by + 動作主",
    short: "by + agent",
    role: "clause",
    rule: "Add by + the person or thing that did the action when it matters who did it.",
    jpRule: "だれがしたかが大切なときは、by + 動作主 を加えます。",
    pattern: "subject + was / were + past participle + by + agent",
    jpPattern: "主語 + was / were + 過去分詞 + by + 動作主",
    intro: [
      { t: "The mummy was found by the hiker.", jp: "そのミイラはハイカーによって見つけられました。" },
      { t: "The bottles weren't found by the divers.", jp: "そのびんはダイバーには見つけられませんでした。" },
      { t: "Was the pottery broken by thieves?", jp: "その陶器は泥棒に壊されたのですか。" }
    ],
    rows: [
      { form: "Affirmative", pattern: "subject + was/were + participle + by + agent", example: "The mummy was found by the hiker.", jp: "そのミイラはハイカーによって見つけられました。" },
      { form: "Negative", pattern: "subject + wasn't/weren't + participle + by + agent", example: "The bottles weren't found by the divers.", jp: "そのびんはダイバーには見つけられませんでした。" },
      { form: "Question", pattern: "Was/Were + subject + participle + by + agent?", example: "Was the pottery broken by thieves?", jp: "その陶器は泥棒に壊されたのですか。" },
      { form: "From active", pattern: "The hiker found the mummy. → The mummy was found by the hiker.", example: "The hiker found the mummy.", jp: "ハイカーがミイラを見つけました。" },
      { form: "When to drop by", pattern: "leave out by + agent when nobody knows or nobody cares", example: "The treasure was discovered in a field.", jp: "その宝物は野原で発見されました。" }
    ],
    noteRule: "The agent is the person or thing doing the action. It comes after by, at the end of the sentence.",
    noteException: "Only add by + agent when the reader needs to know who did it.",
    noteExceptionDetail: "The object of the active sentence becomes the subject of the passive sentence, and the active subject moves after by.",
    table: {
      title: "Active → passive with by",
      columns: ["Active", "Passive"],
      rows: [
        { cells: ["The hiker found the mummy.", "The mummy was found by the hiker."], roles: [null, "clause"] },
        { cells: ["The divers didn't find the bottles.", "The bottles weren't found by the divers."], roles: [null, "clause"] },
        { cells: ["Did thieves break the pottery?", "Was the pottery broken by thieves?"], roles: [null, "clause"] },
        { cells: ["Scientists analyzed the body.", "The body was analyzed by scientists."], roles: [null, "clause"] }
      ],
      notes: [
        "The active object always becomes the passive subject.",
        "Use by only for the doer — use in, at or on for places."
      ]
    },
    samples: [
      { t: "The mummy was found by the hiker.", jp: "そのミイラはハイカーによって見つけられました。", h: "by the hiker" },
      { t: "The bottles weren't found by the divers.", jp: "そのびんはダイバーには見つけられませんでした。", h: "by the divers" },
      { t: "Was the pottery broken by thieves?", jp: "その陶器は泥棒に壊されたのですか。", h: "by thieves" },
      { t: "The Iceman's body was analyzed by scientists.", jp: "アイスマンの体は科学者によって分析されました。", h: "by scientists" },
      { t: "In 2001, the Iceman was studied by Paul Gostner.", jp: "2001年、アイスマンはパウル・ゴストナーによって研究されました。", h: "by Paul Gostner" },
      { t: "In 2005, the Iceman was checked by doctors.", jp: "2005年、アイスマンは医師たちによって調べられました。", h: "by doctors" },
      { t: "Excavated kings were found by archaeologists.", jp: "発掘された王たちは考古学者によって見つけられました。", h: "by archaeologists" },
      { t: "Objects that were hidden can be found by scientists.", jp: "隠されていた物は科学者によって見つけられます。", h: "by scientists" },
      { t: "Many of their things were stolen by thieves.", jp: "彼らの物の多くは泥棒に盗まれました。", h: "by thieves" },
      { t: "The artifacts were moved by Dr. Zahi Hawass.", jp: "その遺物はザヒ・ハワス博士によって移されました。", h: "by Dr. Zahi Hawass" }
    ],
    levelup: {
      rules: [
        { title: "Turn an active sentence around", jpTitle: "能動態をひっくり返す",
          sub: "The object goes first, then was/were + participle, then by + the old subject.", jpSub: "目的語を先頭に、次に was/were + 過去分詞、最後に by + もとの主語です。",
          transforms: [["The hiker found the mummy.", "The mummy was found by the hiker."], ["Scientists analyzed the body.", "The body was analyzed by scientists."]],
          examples: [{ t: "The tomb was opened by Howard Carter.", jp: "その墓はハワード・カーターによって開けられました。", h: "by Howard Carter" },
                     { t: "The city was found by a filmmaker.", jp: "その都市は映画製作者によって見つけられました。", h: "by a filmmaker" }] },
        { title: "Keep negatives and questions the same shape", jpTitle: "否定文・疑問文でも形は同じ",
          sub: "Add n't to was/were, or move was/were before the subject. by + agent still goes last.", jpSub: "was/were に n't をつけるか、主語の前に出します。by + 動作主 は最後のままです。",
          transforms: [["The divers didn't find the bottles.", "The bottles weren't found by the divers."], ["Did thieves break the pottery?", "Was the pottery broken by thieves?"]],
          examples: [{ t: "The gold wasn't taken by the archaeologists.", jp: "金は考古学者には持ち去られませんでした。", h: "by the archaeologists" },
                     { t: "Were the samples collected by the team?", jp: "その見本はチームによって集められたのですか。", h: "by the team" }] },
        { title: "Drop by when it adds nothing", jpTitle: "意味を足さない by は省く",
          sub: "If the doer is unknown or obvious, leave the by phrase out completely.", jpSub: "だれがしたか分からない、または明らかなときは by を省きます。",
          transforms: [["Someone discovered the treasure in a field.", "The treasure was discovered in a field."], ["People buried the gold long ago.", "The gold was buried long ago."]],
          examples: [{ t: "The treasure was discovered in a field.", jp: "その宝物は野原で発見されました。", h: "was discovered" },
                     { t: "The gold was buried long ago.", jp: "金はずっと昔に埋められました。", h: "was buried" }] }
      ],
      mixed: [
        { t: "The Sphinx wasn't built by the Romans.", jp: "スフィンクスはローマ人によって建てられたのではありません。", h: "by the Romans" },
        { t: "Who was the Iceman killed by?", jp: "アイスマンはだれに殺されたのでしょうか。", h: "killed by" },
        { t: "The ruins were photographed by the archaeologists.", jp: "その遺跡は考古学者によって撮影されました。", h: "by the archaeologists" },
        { t: "The statues were made by thousands of workers.", jp: "その像は何千人もの働き手によって作られました。", h: "by thousands of workers" },
        { t: "The DNA test was done by a laboratory in Egypt.", jp: "そのDNA検査はエジプトの研究所によって行われました。", h: "by a laboratory in Egypt" },
        { t: "The mummy was described by people around the world as the “Iceman”.", jp: "そのミイラは世界中の人々に「アイスマン」と呼ばれました。", h: "by people around the world" }
      ]
    },
    quiz: [
      { stem: ["The mummy was found ", " the hiker."], answers: ["by", "from", "with", "of"], correct: 0, explTitle: "by marks the agent", explBody: "Use by before the person who did the action.", jp: "そのミイラはハイカーによって見つけられました。" },
      { stem: ["The bottles ", " found by the divers."], answers: ["weren't", "wasn't", "didn't", "aren't"], correct: 0, explTitle: "Plural negative", explBody: "“The bottles” is plural, so weren't.", jp: "そのびんはダイバーには見つけられませんでした。" },
      { stem: ["", "“Was the pottery broken by thieves?” The agent is ___."], answers: ["thieves", "the pottery", "broken", "was"], correct: 0, explTitle: "The agent follows by", explBody: "Whatever comes after by is the agent.", jp: "by のあとが動作主です。" },
      { stem: ["Make it passive: “Scientists analyzed the body.” → The body ", " by scientists."], answers: ["was analyzed", "were analyzed", "analyzed", "did analyze"], correct: 0, explTitle: "Singular subject", explBody: "“The body” is singular, so was analyzed.", jp: "その体は科学者によって分析されました。" },
      { stem: ["Excavated kings were found ", " archaeologists."], answers: ["by", "in", "on", "to"], correct: 0, explTitle: "by + agent", explBody: "Use by, not in, for the doer.", jp: "発掘された王たちは考古学者によって見つけられました。" },
      { stem: ["Which sentence needs NO by phrase?", ""], answers: ["The treasure was discovered in a field.", "The mummy was found by the hiker.", "The tomb was opened by Carter.", "The body was analyzed by scientists."], correct: 0, explTitle: "Unknown agent", explBody: "Nobody knows who discovered it, so by adds nothing.", jp: "だれが発見したか分からないので by は不要です。" },
      { stem: ["The artifacts were moved ", " Dr. Zahi Hawass."], answers: ["by", "for", "at", "about"], correct: 0, explTitle: "by + a named person", explBody: "Named agents also follow by.", jp: "その遺物はザヒ・ハワス博士によって移されました。" },
      { stem: ["Choose the correct question form.", ""], answers: ["Were the samples collected by the team?", "Was the samples collected by the team?", "Did the samples collected by the team?", "The samples were collected by the team?"], correct: 0, explTitle: "Were before a plural subject", explBody: "Plural subject + Were at the front.", jp: "その見本はチームによって集められたのですか。" },
      { stem: ["Many of their things ", " stolen by thieves."], answers: ["were", "was", "are", "did"], correct: 0, explTitle: "Plural subject", explBody: "“Many of their things” is plural.", jp: "彼らの物の多くは泥棒に盗まれました。" },
      { stem: ["In the passive, the old active subject goes ___.", ""], answers: ["after by", "at the front", "before was", "nowhere"], correct: 0, explTitle: "Agent position", explBody: "The active subject becomes the agent after by.", jp: "もとの主語は by のあとに移ります。" }
    ],
    master: [
      { stem: ["Choose the correct passive with by.", ""], answers: ["The mummy was found by the hiker.", "The mummy found by the hiker.", "The mummy was find by the hiker.", "The hiker was found by the mummy."], correct: 0, explTitle: "was + participle + by + agent", explBody: "Keep that order.", jp: "そのミイラはハイカーによって見つけられました。" },
      { stem: ["Make it passive: “Thieves broke the pottery.”", ""], answers: ["The pottery was broken by thieves.", "The pottery were broken by thieves.", "The pottery was break by thieves.", "Thieves was broken by the pottery."], correct: 0, explTitle: "Object first", explBody: "The pottery becomes the subject.", jp: "その陶器は泥棒に壊されました。" },
      { stem: ["Which sentence is active?", ""], answers: ["Howard Carter found the tomb.", "The tomb was found by Carter.", "The tomb was opened in 1922.", "The gold was buried long ago."], correct: 0, explTitle: "Active has a doer as subject", explBody: "Carter is the subject and does the action.", jp: "最初の文が能動態です。" },
      { stem: ["Complete: “Who was the Iceman killed ", "?”"], answers: ["by", "with", "from", "for"], correct: 0, explTitle: "by at the end of a question", explBody: "The by can end a wh- question about the agent.", jp: "アイスマンはだれに殺されたのですか。" },
      { stem: ["Which is the best reason to add by + agent?", ""], answers: ["The reader needs to know who did it.", "It makes the sentence longer.", "Every passive sentence needs one.", "It sounds more formal."], correct: 0, explTitle: "Only when it matters", explBody: "Add the agent when it carries information.", jp: "だれがしたかが大切なときだけ加えます。" },
      { stem: ["Choose the correct negative.", ""], answers: ["The gold wasn't taken by the archaeologists.", "The gold not was taken by the archaeologists.", "The gold wasn't take by the archaeologists.", "The gold didn't taken by the archaeologists."], correct: 0, explTitle: "wasn't + past participle", explBody: "wasn't + taken.", jp: "金は考古学者には持ち去られませんでした。" },
      { stem: ["“The statues were made by thousands of workers.” The subject is ___.", ""], answers: ["the statues", "thousands of workers", "made", "were"], correct: 0, explTitle: "Passive subject", explBody: "In a passive sentence the thing acted on is the subject.", jp: "受け身の主語は「像」です。" },
      { stem: ["Fix it: “The city found was by a filmmaker.”", ""], answers: ["The city was found by a filmmaker.", "The city by a filmmaker was found.", "Was the city found a filmmaker by.", "Found the city was by a filmmaker."], correct: 0, explTitle: "Word order", explBody: "subject + was + found + by + agent.", jp: "主語 + was + 過去分詞 + by + 動作主 の順です。" },
      { stem: ["Which participle completes it? “The tomb was ___ by Carter.”", ""], answers: ["opened", "open", "opening", "opens"], correct: 0, explTitle: "Past participle needed", explBody: "After was, use opened.", jp: "was のあとは過去分詞 opened です。" },
      { stem: ["Which sentence keeps the agent even though it is obvious?", ""], answers: ["The bread was baked by a baker.", "The tomb was opened in 1922.", "The gold was buried long ago.", "The treasure was discovered in a field."], correct: 0, explTitle: "An agent that adds nothing", explBody: "“By a baker” is obvious — usually you would leave it out.", jp: "当たり前の動作主は省くのがふつうです。" }
    ]
  },

  reading: {
    tr: "2.9",
    title: "The Amazing Discovery of King Tut",
    jpTitle: "ツタンカーメンの驚くべき発見",
    intro: "Egypt is full of really exciting and ancient discoveries, but the most famous is the tomb of King Tutankhamun (King Tut).",
    paras: [
      { t: "Howard Carter and another English archaeologist spent years looking for the tomb. Carter found it, in 1922, after someone discovered an artifact with the king's name on it near the site. Inside the tomb, Carter found hundreds of gold objects, over 3,000 treasures, and—most importantly—King Tut's mummy.",
        q: "What helped Carter find the tomb?", opts: ["An artifact with the king's name on it", "A CT scan", "A DNA test"], correct: 0, jp: "王の名前が入った遺物が手がかりになりました。" },
      { t: "Although King Tut was buried more than 3,000 years ago, his DNA was perfectly preserved. Later, Dr. Zahi Hawass, a famous Egyptian archaeologist, moved the artifacts and the mummy to a museum.",
        q: "Who moved the artifacts to a museum?", opts: ["Dr. Zahi Hawass", "Howard Carter", "Paul Gostner"], correct: 0, jp: "ザヒ・ハワス博士です。" },
      { t: "Who was King Tut? He was an Egyptian boy who became a ruler in 1333 BCE—at the age of nine. We know from the date of some artifacts that he ruled until he died in 1323 BCE. Tut was buried with all the objects he would need in his next life.",
        q: "How old was Tut when he became a ruler?", opts: ["Nine", "Nineteen", "Thirty"], correct: 0, jp: "9歳でした。" },
      { t: "Why did he die so young? The cause of his death is not known. In 1968 his mummy was analyzed by scientists, who found broken bones in Tut's skull. A CT scan of Tut's mummy in 2006 showed that he broke his leg before he died. A DNA test showed that he had malaria. Nobody knows exactly how he died. History's a mystery!",
        q: "What did the DNA test show?", opts: ["That he had malaria", "That he was a thief", "That he was 40 years old"], correct: 0, jp: "彼がマラリアだったと分かりました。" }
    ],
    strategy: {
      title: "Reading strategy — dates as signposts",
      body: "This passage jumps between 1333 BCE, 1922, 1968 and 2006. Circle every date as you read and put them on a timeline — the story is much easier to hold once the dates are in order.",
      jp: "この文章は紀元前1333年、1922年、1968年、2006年と行き来します。読みながら年号に丸をつけ、時系列に並べると分かりやすくなります。"
    },
    order: {
      title: "Put King Tut's story in order",
      items: [
        "Tut became a ruler in 1333 BCE at the age of nine.",
        "He died in 1323 BCE and was buried with his objects.",
        "Carter found the tomb in 1922.",
        "Scientists analyzed the mummy in 1968.",
        "A CT scan was taken in 2006.",
        "A DNA test showed that Tut had malaria."
      ]
    },
    quiz: [
      { q: "In what year did Carter find the tomb?", opts: ["1922", "1968", "2006"], correct: 0, jp: "1922年です。" },
      { q: "How many treasures were in the tomb?", opts: ["Over 3,000", "Over 300", "Exactly 30"], correct: 0, jp: "3,000以上です。" },
      { q: "Tut became a ruler in ___.", opts: ["1333 BCE", "1323 BCE", "2500 BCE"], correct: 0, jp: "紀元前1333年です。" },
      { q: "What did the 2006 CT scan show?", opts: ["He broke his leg before he died", "He was killed by a thief", "He was 60 years old"], correct: 0, jp: "亡くなる前に脚を折っていたと分かりました。" },
      { q: "Why was Tut buried with objects?", opts: ["He would need them in his next life", "They were too heavy to move", "They belonged to Carter"], correct: 0, jp: "来世で必要になると考えられたからです。" },
      { q: "“His DNA was perfectly preserved” is in the ___.", opts: ["passive voice", "active voice", "future tense"], correct: 0, jp: "受け身の文です。" },
      { q: "Who was Dr. Zahi Hawass?", opts: ["A famous Egyptian archaeologist", "An English king", "A doctor from Peru"], correct: 0, jp: "有名なエジプトの考古学者です。" },
      { q: "What is still unknown about King Tut?", opts: ["Exactly how he died", "Where he was buried", "When he became a ruler"], correct: 0, jp: "どのように亡くなったかは今も分かりません。" }
    ]
  },

  writing: {
    genre: "A discovery report",
    jpGenre: "発見のレポート",
    modelTitle: "The Terra-cotta Army",
    model: [
      "The terra-cotta statues were made in 210 BCE for the Chinese ruler Qin Shihuang.",
      "They were buried in an enormous tomb and were not found for over 2,000 years.",
      "In 1974 the statues were discovered by farmers who were digging a well.",
      "Over 6,000 soldiers and horses were excavated by archaeologists, and each statue is different."
    ],
    modelJp: "テラコッタの像は紀元前210年に中国の統治者・秦の始皇帝のために作られました。1974年、井戸を掘っていた農民によって発見されました。",
    steps: [
      { t: "Name the discovery and say when it was made.", jp: "発見の名前と、いつのことかを書く。" },
      { t: "Say what was found, using the passive voice.", jp: "受け身を使って、何が見つかったかを書く。" },
      { t: "Say who found it, using by + agent.", jp: "by + 動作主 を使って、だれが見つけたかを書く。" },
      { t: "End with the mystery that is still unsolved.", jp: "まだ解けていない謎で締めくくる。" }
    ],
    expressions: [
      { t: "___ was built / found / made in ____.", jp: "〜は〜年に建てられた／見つかった／作られた。" },
      { t: "It wasn't ___ until ____.", jp: "それは〜年まで〜されなかった。" },
      { t: "___ was discovered by ___.", jp: "〜は〜によって発見された。" },
      { t: "Nobody knows who ___ or why.", jp: "だれが〜したのか、なぜなのかはだれも知らない。" }
    ],
    checklist: [
      "I used the passive voice in the simple past at least three times.",
      "I used by + agent once, where it really matters who did it.",
      "I gave at least two dates.",
      "I checked was for singular subjects and were for plural ones."
    ],
    quiz: [
      { q: "Which sentence is passive?", opts: ["The statues were found in 1974.", "Farmers found the statues.", "Find the statues!"], correct: 0, jp: "最初の文が受け身です。" },
      { q: "Choose the correct participle: “The tomb was ___ in 1922.”", opts: ["opened", "open", "opening"], correct: 0, jp: "was のあとは過去分詞です。" },
      { q: "When should you add by + agent?", opts: ["When it matters who did it", "Always", "Never"], correct: 0, jp: "だれがしたかが大切なときだけです。" },
      { q: "Which is the best opening line for a discovery report?", opts: ["The terra-cotta statues were made in 210 BCE.", "I like history.", "Turn to page five."], correct: 0, jp: "何がいつ作られたかから始めます。" },
      { q: "Plural subjects take ___.", opts: ["were", "was", "is"], correct: 0, jp: "複数主語には were を使います。" },
      { q: "Which ending fits a “History's a mystery” report?", opts: ["Nobody knows who buried it or why.", "The end.", "Please buy my book."], correct: 0, jp: "未解決の謎で終えます。" },
      { q: "“It wasn't excavated until 1925” means it was excavated ___.", opts: ["in 1925", "before 1925", "never"], correct: 0, jp: "1925年に発掘されたという意味です。" },
      { q: "A discovery report should include ___.", opts: ["dates and what was found", "your favourite food", "a shopping list"], correct: 0, jp: "年号と何が見つかったかを書きます。" }
    ]
  }
};
