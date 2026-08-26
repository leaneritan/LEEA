/* Our World Level 6 · Unit 6 — Smart Choices
   Source: Student's Book audio script TR 6.1-6.8. */
export default {
  unit: 6,
  title: "Smart Choices",
  jpTitle: "かしこい選択",
  themeEmoji: "🛒",
  slug: "smart-choices",

  opener: {
    tr: "6.1",
    intro:
      "Have you ever bought a product that broke the next day? Probably not! One reason is that it's bad for the manufacturer if their product breaks. Also, unhappy customers tell others if a product isn't good quality!",
    goals: [
      { en: "Talk about how products are tested before they are sold.", jp: "商品が売られる前にどう検査されるかを話す。" },
      { en: "Report an instruction someone gave you.", jp: "だれかに言われた指示を伝える。" },
      { en: "Describe the features of a phone or a gadget.", jp: "スマホや機器の特徴を説明する。" },
      { en: "Report a question someone asked you.", jp: "だれかにされた質問を伝える。" },
      { en: "Read about advertising and spot the techniques.", jp: "広告について読み、その手法を見抜く。" }
    ],
    photoCards: [
      { emoji: "🚗", title: "The crash test", text: "Cars must pass safety tests. To test a car, manufacturers put dummies, which look like humans, inside the car. Then they make the car crash. Crash tests show manufacturers what happens on impact.", jp: "車は安全性の検査に合格しなければなりません。製造業者は人間に似たダミー人形を車に乗せ、衝突させます。衝突試験は衝撃で何が起こるかを示します。" },
      { emoji: "🧸", title: "The torque test", text: "The “torque test” twists toys until they break. The “drop test” drops toys on the floor!", jp: "「トルク試験」はおもちゃが壊れるまでねじります。「落下試験」はおもちゃを床に落とします！" },
      { emoji: "💦", title: "The water test", text: "Waterproof toys are dipped in water. Machines tear balloons. If something doesn't work, manufacturers fix the problem.", jp: "防水のおもちゃは水に浸されます。機械が風船を引き裂きます。うまくいかなければ、製造業者は問題を直します。" },
      { emoji: "🙋", title: "Why bother?", text: "It can cost a lot of money to replace a broken product, and unhappy customers tell others if a product isn't good quality.", jp: "壊れた商品を交換するには多くの費用がかかります。また、品質が悪ければ不満な客がほかの人に伝えます。" }
    ],
    lookAndCheck: [
      { q: "What do manufacturers put inside a car for a crash test?", opts: ["Dummies", "Real people", "Balloons"], correct: 0, jp: "ダミー人形です。" },
      { q: "What does the torque test do to toys?", opts: ["Twists them until they break", "Drops them", "Dips them in water"], correct: 0, jp: "壊れるまでねじります。" },
      { q: "What happens to waterproof toys?", opts: ["They are dipped in water", "They are torn", "They are frozen"], correct: 0, jp: "水に浸されます。" },
      { q: "Why is a broken product bad for a manufacturer?", opts: ["It costs a lot to replace and customers complain", "It is illegal", "It is too heavy"], correct: 0, jp: "交換に費用がかかり、客が不満を言うからです。" }
    ],
    sort: {
      title: "Test, person or thing?",
      zones: [
        { id: "test", label: "🧪 Tests" },
        { id: "person", label: "🧑 People" },
        { id: "thing", label: "📦 Things" }
      ],
      tiles: [
        { text: "a crash test", zone: "test" },
        { text: "the torque test", zone: "test" },
        { text: "the drop test", zone: "test" },
        { text: "a customer", zone: "person" },
        { text: "a manufacturer", zone: "person" },
        { text: "a tester", zone: "person" },
        { text: "a product", zone: "thing" },
        { text: "a dummy", zone: "thing" },
        { text: "a balloon", zone: "thing" }
      ]
    },
    quiz: [
      { q: "Most manufacturers test their products ___.", opts: ["before selling them", "after a year", "never"], correct: 0, jp: "売る前に検査します。" },
      { q: "A dummy looks like a ___.", opts: ["human", "car", "balloon"], correct: 0, jp: "人間に似ています。" },
      { q: "Crash tests show what happens on ___.", opts: ["impact", "holiday", "delivery"], correct: 0, jp: "衝撃のときに何が起こるかを示します。" },
      { q: "What does the drop test do?", opts: ["Drops toys on the floor", "Drops prices", "Drops customers"], correct: 0, jp: "おもちゃを床に落とします。" },
      { q: "What do machines do to balloons?", opts: ["Tear them", "Paint them", "Sell them"], correct: 0, jp: "引き裂きます。" },
      { q: "If something doesn't work, manufacturers ___.", opts: ["fix the problem", "hide it", "sell it anyway"], correct: 0, jp: "問題を直します。" },
      { q: "Unhappy customers ___.", opts: ["tell others about bad quality", "always buy again", "test the product"], correct: 0, jp: "品質が悪いとほかの人に伝えます。" },
      { q: "Cars must pass ___ tests.", opts: ["safety", "spelling", "swimming"], correct: 0, jp: "安全性の検査です。" }
    ]
  },

  v1: {
    tr: "6.2",
    words: [
      { w: "a product", norm: "product", emoji: "📦", ipa: "ˈprɑːdʌkt", syl: "prod-uct", pos: "noun", mean: "something that is made to be sold.", jw: "商品", jr: "しょうひん", jm: "売るために作られたもの。",
        tr: "The mall is full of new products!",
        ex: [["The mall is full of new products!", "ショッピングモールは新商品でいっぱいです！"],
             ["Most manufacturers test their products carefully.", "たいていの製造業者は商品をていねいに検査します。"],
             ["Have you ever bought a product that broke the next day?", "翌日に壊れた商品を買ったことがありますか。"]] },
      { w: "break", norm: "break", emoji: "💔", ipa: "breɪk", syl: "break", pos: "verb", mean: "to come apart into pieces or stop working.", jw: "壊れる", jr: "こわれる", jm: "ばらばらになる、または動かなくなること。",
        tr: "I bought a pen and it broke the next day!",
        ex: [["I bought a pen and it broke the next day!", "ペンを買ったら翌日に壊れました！"],
             ["It's bad for the manufacturer if their product breaks.", "商品が壊れるのは製造業者にとって困ることです。"],
             ["The torque test twists toys until they break.", "トルク試験はおもちゃが壊れるまでねじります。"]] },
      { w: "a manufacturer", norm: "manufacturer", emoji: "🏭", ipa: "ˌmænjuˈfæktʃərər", syl: "man-u-fac-tur-er", pos: "noun", mean: "a company that makes products.", jw: "製造業者", jr: "せいぞうぎょうしゃ", jm: "商品を作る会社。",
        tr: "A manufacturer makes products for us.",
        ex: [["A manufacturer makes products for us.", "製造業者は私たちのために商品を作ります。"],
             ["Crash tests show manufacturers what happens on impact.", "衝突試験は衝撃で何が起こるかを製造業者に示します。"],
             ["Buy from a different manufacturer next time.", "次は別の製造業者から買いましょう。"]] },
      { w: "cost", norm: "cost", emoji: "💵", ipa: "kɔːst", syl: "cost", pos: "verb", mean: "to have a particular price.", jw: "費用がかかる", jr: "ひようがかかる", jm: "ある値段であること。",
        tr: "How much does it cost?",
        ex: [["How much does it cost?", "それはいくらしますか。"],
             ["It can cost a lot of money to replace a broken product.", "壊れた商品を交換するには多くの費用がかかります。"],
             ["I told them that it cost me money.", "私はそれにお金がかかったと伝えました。"]] },
      { w: "a customer", norm: "customer", emoji: "🛍️", ipa: "ˈkʌstəmər", syl: "cus-tom-er", pos: "noun", mean: "a person who buys something from a shop or company.", jw: "客", jr: "きゃく", jm: "店や会社から物を買う人。",
        tr: "A customer bought many things.",
        ex: [["A customer bought many things.", "ある客がたくさんの物を買いました。"],
             ["Unhappy customers tell others if a product isn't good quality.", "品質が悪ければ、不満な客はほかの人に伝えます。"],
             ["You're the customer, and they should listen.", "あなたは客なのだから、彼らは聞くべきです。"]] },
      { w: "quality", norm: "quality", emoji: "⭐", ipa: "ˈkwɑːləti", syl: "qual-i-ty", pos: "noun", mean: "how good or bad something is.", jw: "品質", jr: "ひんしつ", jm: "物のよしあし。",
        tr: "I like to buy good quality products, even if they are expensive.",
        ex: [["I like to buy good quality products, even if they are expensive.", "高くても品質のよい商品を買うのが好きです。"],
             ["Quality is important. Products should be safe.", "品質は大切です。商品は安全であるべきです。"],
             ["I guess I should buy better quality next time.", "次はもっと品質のよいものを買うべきでしょう。"]] },
      { w: "test", norm: "test", emoji: "🧪", ipa: "test", syl: "test", pos: "verb", mean: "to try something out to see if it works well.", jw: "検査する", jr: "けんさする", jm: "うまく働くか試してみること。",
        tr: "Manufacturers should test products before they sell them.",
        ex: [["Manufacturers should test products before they sell them.", "製造業者は売る前に商品を検査すべきです。"],
             ["Toys are tested, too.", "おもちゃも検査されます。"],
             ["A factory that makes things should test everything.", "物を作る工場はすべてを検査すべきです。"]] },
      { w: "safety", norm: "safety", emoji: "🦺", ipa: "ˈseɪfti", syl: "safe-ty", pos: "noun", mean: "being free from danger.", jw: "安全", jr: "あんぜん", jm: "危険がないこと。",
        tr: "Cars must be checked for safety. It's very important.",
        ex: [["Cars must be checked for safety. It's very important.", "車は安全のために点検されなければなりません。とても大切です。"],
             ["Many of the things we buy are tested for safety.", "私たちが買う物の多くは安全のために検査されます。"],
             ["Cars must pass safety tests.", "車は安全性の検査に合格しなければなりません。"]] },
      { w: "a dummy", norm: "dummy", emoji: "🧍", ipa: "ˈdʌmi", syl: "dum-my", pos: "noun", mean: "a model of a person used for testing.", jw: "ダミー人形", jr: "だみーにんぎょう", jm: "検査に使う人の形をした模型。",
        tr: "Car testers use dummies instead of real people.",
        ex: [["Car testers use a dummy instead of a real person.", "車の検査員は本物の人の代わりにダミー人形を使います。"],
             ["Manufacturers put a dummy, which looks like a human, inside the car.", "製造業者は人間に似たダミー人形を車の中に置きます。"],
             ["A dummy sits inside a car. The car speeds up!", "ダミー人形が車の中に座っています。車は加速します！"]] },
      { w: "a crash test", norm: "crash test", emoji: "💥", ipa: "ˈkræʃ test", syl: "crash test", pos: "noun", mean: "a test where a car is crashed on purpose.", jw: "衝突試験", jr: "しょうとつしけん", jm: "わざと車をぶつけて行う検査。",
        tr: "It would be interesting to watch a crash test.",
        ex: [["It would be interesting to watch a crash test.", "衝突試験を見るのはおもしろいでしょう。"],
             ["Crash tests show manufacturers what happens on impact.", "衝突試験は衝撃で何が起こるかを製造業者に示します。"],
             ["A crash test uses dummies, never real people.", "衝突試験には本物の人ではなくダミー人形を使います。"]] },
      { w: "impact", norm: "impact", emoji: "🎯", ipa: "ˈɪmpækt", syl: "im-pact", pos: "noun", mean: "the moment one thing hits another.", jw: "衝撃", jr: "しょうげき", jm: "物が別の物にぶつかる瞬間。",
        tr: "He dropped the glass and it broke on impact.",
        ex: [["He dropped the glass and it broke on impact.", "彼はグラスを落とし、衝撃で割れました。"],
             ["Crash tests show what happens on impact.", "衝突試験は衝撃で何が起こるかを示します。"],
             ["The helmet protects your head on impact.", "ヘルメットは衝撃から頭を守ります。"]] },
      { w: "drop", norm: "drop", emoji: "⬇️", ipa: "drɑːp", syl: "drop", pos: "verb", mean: "to let something fall.", jw: "落とす", jr: "おとす", jm: "物を落ちるままにすること。",
        tr: "I dropped mom's laptop and now it doesn't work.",
        ex: [["I dropped mom's laptop and now it doesn't work.", "母のノートパソコンを落として、今は動きません。"],
             ["The “drop test” drops toys on the floor!", "「落下試験」はおもちゃを床に落とします！"],
             ["My son dropped it in the bath and it got wet.", "息子がお風呂に落として、ぬれてしまいました。"]] },
      { w: "waterproof", norm: "waterproof", emoji: "💧", ipa: "ˈwɔːtərpruːf", syl: "wa-ter-proof", pos: "adjective", mean: "not letting water in.", jw: "防水の", jr: "ぼうすいの", jm: "水を通さないこと。",
        tr: "There is water in my shoes. I thought they were waterproof.",
        ex: [["There is water in my shoes. I thought they were waterproof.", "靴に水が入っています。防水だと思っていました。"],
             ["Waterproof toys are dipped in water.", "防水のおもちゃは水に浸されます。"],
             ["Did you ask the store if it was waterproof?", "防水かどうか店に聞きましたか。"]] },
      { w: "dip", norm: "dip", emoji: "🫗", ipa: "dɪp", syl: "dip", pos: "verb", mean: "to put something into a liquid for a moment.", jw: "浸す", jr: "ひたす", jm: "少しの間、液体に入れること。",
        tr: "If you dip this toy in hot water, it changes color!",
        ex: [["If you dip this toy in hot water, it changes color!", "このおもちゃをお湯に浸すと色が変わります！"],
             ["Let's dip the clock. It's just a test.", "その時計を浸してみよう。ただの検査だよ。"],
             ["Waterproof products are dipped before they are sold.", "防水の商品は売られる前に浸されます。"]] },
      { w: "tear", norm: "tear", emoji: "📄", ipa: "ter", syl: "tear", pos: "verb", mean: "to pull something apart so it rips.", jw: "引き裂く", jr: "ひきさく", jm: "引っぱって裂くこと。",
        tr: "Oh, no. I just tore my best T-shirt.",
        ex: [["Machines tear balloons to test them.", "機械は風船を引き裂いて検査します。"],
             ["Be careful — thin paper can tear easily.", "気をつけて。薄い紙は簡単に裂けます。"],
             ["Good products survive lots of wear and tear.", "よい商品はたくさんの傷みに耐えます。"]] },
      { w: "fix", norm: "fix", emoji: "🔧", ipa: "fɪks", syl: "fix", pos: "verb", mean: "to repair something that is broken.", jw: "直す", jr: "なおす", jm: "壊れたものを修理すること。",
        tr: "It's broken. Can you fix it, please?",
        ex: [["It's broken. Can you fix it, please?", "壊れています。直してもらえますか。"],
             ["If something doesn't work, manufacturers fix the problem.", "うまくいかなければ、製造業者は問題を直します。"],
             ["Did you ask them if they could fix it?", "直せるかどうか彼らに聞きましたか。"]] }
    ]
  },

  v2: {
    tr: "6.5",
    words: [
      { w: "reception", norm: "reception", emoji: "📶", ipa: "rɪˈsepʃən", syl: "re-cep-tion", pos: "noun", mean: "how well a phone picks up a signal.", jw: "電波", jr: "でんぱ", jm: "電話が信号をどれだけ受け取れるか。",
        tr: "My cell phone has very bad reception at home.",
        ex: [["My cell phone has very bad reception at home.", "私の携帯は家では電波がとても悪いです。"],
             ["How do they test the reception?", "電波はどうやって検査するのですか。"],
             ["They make calls from many places to check the reception.", "電波を確かめるために、いろいろな場所から電話をかけます。"]] },
      { w: "Wi-Fi", norm: "Wi-Fi", emoji: "📡", ipa: "ˈwaɪ faɪ", syl: "Wi-Fi", pos: "noun", mean: "a way of connecting to the internet without wires.", jw: "Wi-Fi", jr: "わいふぁい", jm: "線を使わずにインターネットにつなぐ仕組み。",
        tr: "My phone doesn't have Wi-Fi.",
        ex: [["My phone doesn't have Wi-Fi.", "私の電話には Wi-Fi がありません。"],
             ["There doesn't seem to be any Wi-Fi here.", "ここには Wi-Fi がないようです。"],
             ["It doesn't have any apps or Wi-Fi.", "アプリも Wi-Fi もありません。"]] },
      { w: "an app", norm: "app", emoji: "📱", ipa: "æp", syl: "app", pos: "noun", mean: "a program you run on a phone or tablet.", jw: "アプリ", jr: "あぷり", jm: "スマホやタブレットで動かすプログラム。",
        tr: "What apps does your new phone have?",
        ex: [["What apps does your new phone have?", "新しい電話にはどんなアプリがありますか。"],
             ["How do they test apps, like games?", "ゲームのようなアプリはどうやって検査するのですか。"],
             ["They play them many times to test each app.", "アプリを検査するために何度も遊びます。"]] },
      { w: "a text message", norm: "text message", emoji: "💬", ipa: "ˈtekst ˌmesɪdʒ", syl: "text mes-sage", pos: "noun", mean: "a short written message sent from a phone.", jw: "メッセージ", jr: "めっせーじ", jm: "電話から送る短い文章。",
        tr: "My grandparents don't know how to send text messages.",
        ex: [["My grandparents don't know how to send text messages.", "祖父母はメッセージの送り方を知りません。"],
             ["It's only for calls and text messages.", "通話とメッセージだけのためのものです。"],
             ["She sent one text message and waited.", "彼女はメッセージを1通送って待ちました。"]] },
      { w: "a key", norm: "key", emoji: "⌨️", ipa: "kiː", syl: "key", pos: "noun", mean: "one of the buttons you press on a keyboard or phone.", jw: "キー", jr: "きー", jm: "キーボードや電話で押すボタン。",
        tr: "I pressed the key on my laptop and it fell off!",
        ex: [["I pressed the key on my laptop and it fell off!", "ノートパソコンのキーを押したら外れました！"],
             ["How do manufacturers test the keys?", "製造業者はキーをどうやって検査しますか。"],
             ["They press each key thousands of times for five days.", "彼らは5日間で各キーを何千回も押します。"]] },
      { w: "wear and tear", norm: "wear and tear", emoji: "🧵", ipa: "ˌwer ənd ˈter", syl: "wear and tear", pos: "noun", mean: "the damage that normal daily use causes over time.", jw: "傷み", jr: "いたみ", jm: "ふだん使ううちに少しずつ傷むこと。",
        tr: "Good products must survive lots of wear and tear.",
        ex: [["Good products must survive lots of wear and tear.", "よい商品はたくさんの傷みに耐えなければなりません。"],
             ["I wanted something that will survive lots of wear and tear.", "たくさんの傷みに耐えるものがほしかったのです。"],
             ["Wear and tear is normal, but breaking in a day is not.", "傷みはふつうですが、1日で壊れるのはふつうではありません。"]] }
    ]
  },

  academic: ["evaluate", "opinion", "fact", "persuade", "reason"],

  content: [
    { w: "an advertisement", norm: "advertisement", emoji: "📺", ipa: "ˌædvərˈtaɪzmənt", syl: "ad-ver-tise-ment", pos: "noun", mean: "a message that tries to make you buy something.", jw: "広告", jr: "こうこく", jm: "何かを買わせようとするメッセージ。",
      ex: [["Every day we see an advertisement on TV or online.", "毎日テレビやネットで広告を見ます。"],
           ["An advertisement can hide its message.", "広告はメッセージを隠すことがあります。"],
           ["Can you understand the messages an advertisement sends you?", "広告が送ってくるメッセージを理解できますか。"]] },
    { w: "a technique", norm: "technique", emoji: "🧠", ipa: "tekˈniːk", syl: "tech-nique", pos: "noun", mean: "a particular way of doing something.", jw: "手法", jr: "しゅほう", jm: "何かをするときの特定のやり方。",
      ex: [["Let's look at some typical advertising techniques.", "よくある広告の手法をいくつか見てみましょう。"],
           ["Repetition is one technique advertisers use.", "くり返しは広告主が使う手法の一つです。"],
           ["Knowing the technique helps you decide.", "手法を知っていると判断しやすくなります。"]] },
    { w: "a brand", norm: "brand", emoji: "🏷️", ipa: "brænd", syl: "brand", pos: "noun", mean: "the name a company puts on its products.", jw: "ブランド", jr: "ぶらんど", jm: "会社が商品につける名前。",
      ex: [["A famous athlete says he wears a certain brand of sneakers.", "有名な選手が特定のブランドのスニーカーをはくと言います。"],
           ["A brand you can trust is worth paying for.", "信頼できるブランドにはお金を払う価値があります。"],
           ["The brand name is not the same as the quality.", "ブランド名と品質は同じではありません。"]] },
    { w: "a review", norm: "review", emoji: "📝", ipa: "rɪˈvjuː", syl: "re-view", pos: "noun", mean: "what someone writes about how good a product is.", jw: "レビュー", jr: "れびゅー", jm: "商品がどれくらいよいかを書いたもの。",
      ex: [["Try these tips: read product reviews and compare products.", "こつを試しましょう：商品のレビューを読み、比べることです。"],
           ["A review from a real customer is useful.", "実際の客のレビューは役に立ちます。"],
           ["Read more than one review before you buy.", "買う前に複数のレビューを読みましょう。"]] },
    { w: "an opportunity", norm: "opportunity", emoji: "⏳", ipa: "ˌɑːpərˈtuːnəti", syl: "op-por-tu-ni-ty", pos: "noun", mean: "a chance to do something good.", jw: "機会", jr: "きかい", jm: "よいことができるチャンス。",
      ex: [["Buy now before you miss a great opportunity!", "すばらしい機会を逃す前に今すぐ買いましょう！"],
           ["Time pressure makes an opportunity look smaller than it is.", "時間の圧力は機会を実際より小さく見せます。"],
           ["Waiting 24 hours costs you no opportunity at all.", "24時間待っても機会は少しも失われません。"]] }
  ],

  song: {
    tr: "6.3",
    title: "Safe Buys",
    jpTitle: "安全な買い物",
    lyrics: [
      { t: "CHORUS", jp: "コーラス", chorus: true },
      { t: "Many of the things we buy", jp: "私たちが買う物の多くは" },
      { t: "are tested for safety.", jp: "安全のために検査されている。" },
      { t: "That's good! Products should be safe.", jp: "それはいいこと！商品は安全であるべきだ。" },
      { t: "They should be safe for you and me.", jp: "きみと私のために安全であるべきだ。" },
      { t: "When you're a customer,", jp: "客であるとき、" },
      { t: "the products you buy shouldn't break.", jp: "買う商品は壊れてはいけない。" },
      { t: "A manufacturer", jp: "製造業者は" },
      { t: "should try not to make mistakes.", jp: "まちがいをしないようにすべきだ。" },
      { t: "Is this clock waterproof?", jp: "この時計は防水？" },
      { t: "It goes tick tock. Let's dip the clock.", jp: "チクタク鳴っている。時計を浸してみよう。" },
      { t: "It's just a test to make sure everything is safe.", jp: "すべてが安全か確かめるためのただの検査。" },
      { t: "Quality is important. Products should be safe.", jp: "品質は大切。商品は安全であるべきだ。" },
      { t: "A factory that makes things", jp: "物を作る工場は" },
      { t: "should test everything, just in case.", jp: "念のためすべてを検査すべきだ。" },
      { t: "A dummy sits inside a car.", jp: "ダミー人形が車の中に座っている。" },
      { t: "The car speeds up! BAM! It's a crash!", jp: "車が加速する！ドン！衝突だ！" },
      { t: "It's just a test to make sure everything is safe.", jp: "すべてが安全か確かめるためのただの検査。" },
      { t: "Safe for you and me!", jp: "きみと私のために安全に！" }
    ],
    tapWords: ["tested", "safety", "Products", "customer", "break", "manufacturer", "waterproof", "dip", "Quality", "dummy", "crash"],
    quiz: [
      { q: "What are many of the things we buy tested for?", opts: ["Safety", "Speed", "Colour"], correct: 0, jp: "安全のためです。" },
      { q: "What shouldn't the products you buy do?", opts: ["Break", "Work", "Cost money"], correct: 0, jp: "壊れてはいけません。" },
      { q: "What do they do to the clock in the song?", opts: ["Dip it", "Drop it", "Tear it"], correct: 0, jp: "浸します。" },
      { q: "Who sits inside the car?", opts: ["A dummy", "A customer", "A manufacturer"], correct: 0, jp: "ダミー人形です。" },
      { q: "What should a factory do?", opts: ["Test everything, just in case", "Sell everything quickly", "Break everything"], correct: 0, jp: "念のためすべてを検査すべきです。" },
      { q: "According to the song, what is important?", opts: ["Quality", "Colour", "Speed"], correct: 0, jp: "品質です。" }
    ]
  },

  g1: {
    key: "reported_speech_imperatives",
    tr: "6.4",
    component: "grammar-1",
    title: "Reported speech: Imperatives",
    jpTitle: "話法：命令文",
    short: "told me to…",
    role: "clause",
    rule: "To report an instruction, use told + person + to + base verb. For a negative instruction, use told + person + not to + base verb.",
    jpRule: "指示を伝えるときは told + 人 + to + 動詞の原形 を使います。否定の指示は told + 人 + not to + 動詞の原形 です。",
    pattern: "subject + told + person + (not) to + base verb",
    jpPattern: "主語 + told + 人 + (not) to + 動詞の原形",
    intro: [
      { t: "Mom told me to put my pen in my backpack.", jp: "母は私にペンをリュックに入れるように言いました。" },
      { t: "My brother told me not to break his toys.", jp: "兄は私に彼のおもちゃを壊さないように言いました。" },
      { t: "They told me to buy another one!", jp: "彼らは私にもう一つ買うように言いました！" }
    ],
    rows: [
      { form: "Positive instruction", pattern: "told + person + to + base verb", example: "Mom told me to put my pen in my backpack.", jp: "母は私にペンをリュックに入れるように言いました。" },
      { form: "Negative instruction", pattern: "told + person + not to + base verb", example: "My brother told me not to break his toys.", jp: "兄は私に彼のおもちゃを壊さないように言いました。" },
      { form: "Ask rather than order", pattern: "asked + person + to + base verb", example: "I'll ask my son not to take it for a swim.", jp: "息子にそれを泳ぎに持って行かないよう頼みます。" },
      { form: "Pronouns change", pattern: "“my toys” → “his toys”", example: "My brother told me not to break his toys.", jp: "「私のおもちゃ」は「彼のおもちゃ」に変わります。" },
      { form: "No that", pattern: "never use that with an imperative", example: "They told me to buy another one.", jp: "命令文の伝達では that は使いません。" }
    ],
    noteRule: "Told always needs a person straight after it: told me, told her, told the customer.",
    noteExceptionDetail: "Said cannot be used this way — you cannot say “She said me to go”. Use told, or said to me that…",
    noteException: "Not comes before to, never after it: told me not to break, not told me to not break.",
    table: {
      title: "Instruction → reported instruction",
      columns: ["Someone said", "You report it"],
      rows: [
        { cells: ["“Put your pen in your backpack.”", "Mom told me to put my pen in my backpack."], roles: [null, "clause"] },
        { cells: ["“Don't break my toys.”", "My brother told me not to break his toys."], roles: [null, "clause"] },
        { cells: ["“Buy another one.”", "They told me to buy another one."], roles: [null, "clause"] },
        { cells: ["“Don't take it for a swim.”", "I asked my son not to take it for a swim."], roles: [null, "clause"] }
      ],
      notes: [
        "Told is always followed by a person.",
        "Not goes in front of to."
      ]
    },
    samples: [
      { t: "Mom told me to put my pen in my backpack.", jp: "母は私にペンをリュックに入れるように言いました。", h: "told me to put" },
      { t: "My brother told me not to break his toys.", jp: "兄は私に彼のおもちゃを壊さないように言いました。", h: "told me not to break" },
      { t: "They told me to buy another one!", jp: "彼らは私にもう一つ買うように言いました！", h: "told me to buy" },
      { t: "I'll ask my son not to take it for a swim next time.", jp: "次は息子にそれを泳ぎに持って行かないよう頼みます。", h: "ask my son not to take" },
      { t: "The clerk told me to keep the receipt.", jp: "店員は私にレシートを取っておくように言いました。", h: "told me to keep" },
      { t: "Dad told me to read the reviews first.", jp: "父は私にまずレビューを読むように言いました。", h: "told me to read" },
      { t: "The teacher told us to compare two products.", jp: "先生は私たちに2つの商品を比べるように言いました。", h: "told us to compare" },
      { t: "She told him not to buy it on the first day.", jp: "彼女は彼に初日には買わないように言いました。", h: "told him not to buy" },
      { t: "The manager told the customer to come back tomorrow.", jp: "店長はその客に明日また来るように言いました。", h: "told the customer to come back" },
      { t: "They told us not to drop the phone in water.", jp: "彼らは私たちに電話を水に落とさないように言いました。", h: "told us not to drop" }
    ],
    levelup: {
      rules: [
        { title: "told + person + to + base verb", jpTitle: "told + 人 + to + 動詞の原形",
          sub: "The person has to come straight after told.", jpSub: "told のすぐあとに人が来ます。",
          transforms: [["“Put your pen in your backpack.”", "Mom told me to put my pen in my backpack."], ["“Buy another one.”", "They told me to buy another one."]],
          examples: [{ t: "Dad told me to read the reviews first.", jp: "父はまずレビューを読むように言いました。", h: "told me to read" },
                     { t: "The clerk told me to keep the receipt.", jp: "店員はレシートを取っておくように言いました。", h: "told me to keep" }] },
        { title: "Negative: not goes before to", jpTitle: "否定は not を to の前に",
          sub: "Say told me not to break, never told me to not break.", jpSub: "told me not to break の順です。",
          transforms: [["“Don't break my toys.”", "My brother told me not to break his toys."], ["“Don't buy it today.”", "She told him not to buy it today."]],
          examples: [{ t: "She told him not to buy it on the first day.", jp: "彼女は初日には買わないように言いました。", h: "told him not to buy" },
                     { t: "They told us not to drop the phone in water.", jp: "電話を水に落とさないように言われました。", h: "told us not to drop" }] },
        { title: "Change the pronouns too", jpTitle: "代名詞も変える",
          sub: "“my toys” becomes “his toys”, “your pen” becomes “my pen”.", jpSub: "「私のおもちゃ」は「彼のおもちゃ」、「あなたのペン」は「私のペン」になります。",
          transforms: [["“Don't break my toys.”", "He told me not to break his toys."], ["“Put your pen away.”", "She told me to put my pen away."]],
          examples: [{ t: "My brother told me not to break his toys.", jp: "兄は彼のおもちゃを壊さないように言いました。", h: "told me not to break" },
                     { t: "Mom told me to put my pen in my backpack.", jp: "母はペンをリュックに入れるように言いました。", h: "told me to put" }] }
      ],
      mixed: [
        { t: "The coach told Leo to shoot with his left foot.", jp: "コーチはレオに左足でシュートするよう言いました。", h: "told Leo to shoot" },
        { t: "The shop told my mother to send the phone back.", jp: "店は母に電話を送り返すように言いました。", h: "told my mother to send" },
        { t: "Dad told me not to believe every advertisement.", jp: "父はすべての広告を信じないように言いました。", h: "told me not to believe" },
        { t: "They told the testers to press each key thousands of times.", jp: "彼らは検査員に各キーを何千回も押すように言いました。", h: "told the testers to press" },
        { t: "She told us not to waste money on bad quality.", jp: "彼女は品質の悪いものにお金をむだにしないよう言いました。", h: "told us not to waste" },
        { t: "The teacher told me to wait 24 hours before buying.", jp: "先生は買う前に24時間待つように言いました。", h: "told me to wait" }
      ]
    },
    quiz: [
      { stem: ["“Put your pen in your backpack.” → Mom told me ", " my pen in my backpack."], answers: ["to put", "put", "putting", "that put"], correct: 0, explTitle: "told + person + to + base verb", explBody: "Use to + the base form.", jp: "told + 人 + to + 原形です。" },
      { stem: ["“Don't break my toys.” → My brother told me ", " his toys."], answers: ["not to break", "to not break", "don't break", "not break"], correct: 0, explTitle: "not before to", explBody: "The negative is not to + base verb.", jp: "not は to の前です。" },
      { stem: ["Which verb can be followed by a person + to?", ""], answers: ["told", "said", "spoke", "talked"], correct: 0, explTitle: "told takes an object", explBody: "You tell someone to do something.", jp: "told のあとには人が来ます。" },
      { stem: ["“Buy another one.” → They told me ", " another one."], answers: ["to buy", "buy", "buying", "bought"], correct: 0, explTitle: "to + base verb", explBody: "Always the base form after to.", jp: "to のあとは原形です。" },
      { stem: ["“Don't take it for a swim.” → I asked my son ", " it for a swim."], answers: ["not to take", "to not take", "don't take", "not taking"], correct: 0, explTitle: "asked + person + not to", explBody: "Asked works the same way as told.", jp: "asked も told と同じ形です。" },
      { stem: ["In “My brother told me not to break his toys”, “his” was originally ___.", ""], answers: ["my", "your", "their", "her"], correct: 0, explTitle: "Pronouns shift", explBody: "He said “my toys”, so it becomes “his toys”.", jp: "「私のおもちゃ」が「彼のおもちゃ」になります。" },
      { stem: ["Which sentence is wrong?", ""], answers: ["She said me to go.", "She told me to go.", "She asked me to go.", "She said that I should go."], correct: 0, explTitle: "said cannot take a person directly", explBody: "Use told me, or said to me.", jp: "said のあとに人を直接置けません。" },
      { stem: ["The clerk told me ", " the receipt."], answers: ["to keep", "keep", "keeping", "kept"], correct: 0, explTitle: "to + base verb", explBody: "Keep is the base form.", jp: "to + 原形です。" },
      { stem: ["Do you use “that” after told with an instruction?", ""], answers: ["No", "Yes, always", "Only in questions", "Only with not"], correct: 0, explTitle: "No that", explBody: "That belongs with reported statements, not instructions.", jp: "命令文の伝達に that は使いません。" },
      { stem: ["They told us ", " the phone in water."], answers: ["not to drop", "to not drop", "don't drop", "not dropping"], correct: 0, explTitle: "not to + base verb", explBody: "Not goes before to.", jp: "not to + 原形です。" }
    ],
    master: [
      { stem: ["Report it: “Read the reviews first.”", ""], answers: ["Dad told me to read the reviews first.", "Dad told me read the reviews first.", "Dad said me to read the reviews first.", "Dad told me that read the reviews first."], correct: 0, explTitle: "told + me + to + base verb", explBody: "Keep that shape.", jp: "told + 人 + to + 原形です。" },
      { stem: ["Report it: “Don't buy it today.”", ""], answers: ["She told him not to buy it today.", "She told him to not buy it today.", "She told him don't buy it today.", "She said him not to buy it today."], correct: 0, explTitle: "not before to", explBody: "The negative goes in front of to.", jp: "not は to の前に置きます。" },
      { stem: ["Which one needs a person after it?", ""], answers: ["told", "said", "explained", "replied"], correct: 0, explTitle: "told + person", explBody: "Told always takes an object.", jp: "told には必ず人が続きます。" },
      { stem: ["Fix it: “Mom told to me put my pen away.”", ""], answers: ["Mom told me to put my pen away.", "Mom told to me putting my pen away.", "Mom told me put to my pen away.", "Mom said me to put my pen away."], correct: 0, explTitle: "Person comes first", explBody: "told + me + to + put.", jp: "told + 人 + to + 原形の順です。" },
      { stem: ["Complete: “The coach told Leo ___ with his left foot.”", ""], answers: ["to shoot", "shoot", "shooting", "shot"], correct: 0, explTitle: "to + base verb", explBody: "Shoot is the base form.", jp: "to + 原形です。" },
      { stem: ["Which sentence reports a negative instruction?", ""], answers: ["They told us not to drop the phone.", "They told us to drop the phone.", "They said the phone was dropped.", "They asked if we dropped the phone."], correct: 0, explTitle: "not to = negative instruction", explBody: "Not to marks the negative.", jp: "not to が否定の指示を表します。" },
      { stem: ["What must change in “Don't break my toys” when your brother's words are reported?", ""], answers: ["my → his", "break → broke", "don't → didn't", "toys → toy"], correct: 0, explTitle: "Possessive shifts", explBody: "Only the pronoun changes; the verb stays a base form after not to.", jp: "変わるのは代名詞だけです。" },
      { stem: ["Complete: “The shop told my mother ___ the phone back.”", ""], answers: ["to send", "send", "sending", "sent"], correct: 0, explTitle: "to + base verb", explBody: "Send is the base form.", jp: "to + 原形です。" },
      { stem: ["Which sentence uses asked correctly?", ""], answers: ["I asked my son not to take it for a swim.", "I asked to my son not take it for a swim.", "I asked my son don't take it for a swim.", "I asked that my son not to take it."], correct: 0, explTitle: "asked + person + (not) to", explBody: "Same shape as told.", jp: "asked も told と同じ形です。" },
      { stem: ["Which is the base form?", ""], answers: ["break", "broke", "broken", "breaking"], correct: 0, explTitle: "Base form", explBody: "After to, use the base form break.", jp: "to のあとは原形 break です。" }
    ]
  },

  g2: {
    key: "reported_speech_questions",
    tr: "6.7",
    component: "grammar-2",
    title: "Reported speech: Questions",
    jpTitle: "話法：疑問文",
    short: "asked me what / if…",
    role: "clause",
    rule: "To report a wh- question, use asked + person + the question word + normal word order. To report a yes/no question, use asked + person + if.",
    jpRule: "疑問詞のある質問は asked + 人 + 疑問詞 + ふつうの語順 で伝えます。yes / no の質問は asked + 人 + if を使います。",
    pattern: "subject + asked + person + what / if + subject + past verb",
    jpPattern: "主語 + asked + 人 + what / if + 主語 + 過去形の動詞",
    intro: [
      { t: "Lisa asked me what she needed to do next.", jp: "リサは私に、次に何をすればよいかたずねました。" },
      { t: "Ken asked me if I could help him.", jp: "ケンは私に、手伝ってもらえるかたずねました。" },
      { t: "Did you ask the store if it was waterproof?", jp: "防水かどうか店にたずねましたか。" }
    ],
    rows: [
      { form: "Wh- question", pattern: "asked + person + what / where / how + subject + verb", example: "Lisa asked me what she needed to do next.", jp: "リサは次に何をすればよいかたずねました。" },
      { form: "Yes/no question", pattern: "asked + person + if + subject + verb", example: "Ken asked me if I could help him.", jp: "ケンは手伝ってもらえるかたずねました。" },
      { form: "No question mark", pattern: "the reported question ends with a full stop", example: "Ken asked me if I could help him.", jp: "伝えられた質問はピリオドで終わります。" },
      { form: "Normal word order", pattern: "no do / does / did in the reported clause", example: "She asked me what I wanted.", jp: "伝えるときは do / does / did を使いません。" },
      { form: "Backshift", pattern: "can → could, is → was, do → did", example: "Did you ask the store if it was waterproof?", jp: "can は could、is は was になります。" }
    ],
    noteRule: "A reported question is not a question any more — it takes normal word order and no question mark.",
    noteException: "Use if (or whether) when the original question could be answered yes or no.",
    noteExceptionDetail: "Drop the auxiliary: “What do I need?” becomes what she needed, not what did she need.",
    table: {
      title: "Question → reported question",
      columns: ["Someone asked", "You report it"],
      rows: [
        { cells: ["“What do I need to do next?”", "Lisa asked me what she needed to do next."], roles: [null, "clause"] },
        { cells: ["“Can you help me?”", "Ken asked me if I could help him."], roles: [null, "clause"] },
        { cells: ["“Is it waterproof?”", "I asked the store if it was waterproof."], roles: [null, "clause"] },
        { cells: ["“Can you fix it?”", "I asked them if they could fix it."], roles: [null, "clause"] }
      ],
      notes: [
        "No question mark and no inversion.",
        "If marks a yes/no question."
      ]
    },
    samples: [
      { t: "Lisa asked me what she needed to do next.", jp: "リサは私に、次に何をすればよいかたずねました。", h: "asked me what she needed" },
      { t: "Ken asked me if I could help him.", jp: "ケンは私に、手伝ってもらえるかたずねました。", h: "asked me if I could help" },
      { t: "Did you ask the store if it was waterproof?", jp: "防水かどうか店にたずねましたか。", h: "ask the store if it was" },
      { t: "Did you ask them if they could fix it?", jp: "直せるかどうか彼らにたずねましたか。", h: "ask them if they could fix" },
      { t: "She asked me what apps the phone had.", jp: "彼女は私に、その電話にどんなアプリがあるかたずねました。", h: "asked me what apps the phone had" },
      { t: "He asked me if there was any Wi-Fi.", jp: "彼は私に Wi-Fi があるかたずねました。", h: "asked me if there was" },
      { t: "The clerk asked me how much I wanted to spend.", jp: "店員は私にいくら使いたいかたずねました。", h: "asked me how much I wanted" },
      { t: "Dad asked me if I had read the reviews.", jp: "父は私にレビューを読んだかたずねました。", h: "asked me if I had read" },
      { t: "They asked us how they tested the keys.", jp: "彼らは私たちに、キーをどう検査したかたずねました。", h: "asked us how they tested" },
      { t: "Regina asked Olga what kind of phone she had bought.", jp: "レジーナはオルガに、どんな電話を買ったのかたずねました。", h: "asked Olga what kind of phone she had bought" }
    ],
    levelup: {
      rules: [
        { title: "Use if for a yes/no question", jpTitle: "yes / no の質問には if",
          sub: "If the answer would be yes or no, join the clause with if.", jpSub: "答えが yes か no なら if でつなぎます。",
          transforms: [["“Can you help me?”", "Ken asked me if I could help him."], ["“Is it waterproof?”", "I asked the store if it was waterproof."]],
          examples: [{ t: "He asked me if there was any Wi-Fi.", jp: "彼は Wi-Fi があるかたずねました。", h: "asked me if there was" },
                     { t: "Dad asked me if I had read the reviews.", jp: "父はレビューを読んだかたずねました。", h: "asked me if I had read" }] },
        { title: "Keep the question word for a wh- question", jpTitle: "疑問詞のある質問は疑問詞を残す",
          sub: "What, where, how and why stay, but the word order becomes normal.", jpSub: "what・where・how・why は残しますが、語順はふつうに戻します。",
          transforms: [["“What do I need to do next?”", "Lisa asked me what she needed to do next."], ["“How much do you want to spend?”", "The clerk asked me how much I wanted to spend."]],
          examples: [{ t: "She asked me what apps the phone had.", jp: "彼女はその電話にどんなアプリがあるかたずねました。", h: "asked me what apps the phone had" },
                     { t: "They asked us how they tested the keys.", jp: "彼らはキーをどう検査したかたずねました。", h: "asked us how they tested" }] },
        { title: "Drop do, does and did", jpTitle: "do / does / did は落とす",
          sub: "The auxiliary disappears and the main verb takes the past form instead.", jpSub: "助動詞は消えて、動詞が過去形になります。",
          transforms: [["“What do you want?”", "She asked me what I wanted."], ["“Where did you buy it?”", "He asked me where I had bought it."]],
          examples: [{ t: "She asked me what I wanted.", jp: "彼女は私が何をほしいのかたずねました。", h: "asked me what I wanted" },
                     { t: "He asked me where I had bought it.", jp: "彼はどこでそれを買ったのかたずねました。", h: "asked me where I had bought it" }] }
      ],
      mixed: [
        { t: "Leo asked his dad if they could watch the Bundesliga game.", jp: "レオは父に、ブンデスリーガの試合を見られるかたずねました。", h: "asked his dad if they could watch" },
        { t: "The teacher asked us what an advertisement was really selling.", jp: "先生は私たちに、その広告が本当は何を売っているのかたずねました。", h: "asked us what an advertisement was" },
        { t: "Mom asked me if the phone was waterproof.", jp: "母は私に、その電話が防水かたずねました。", h: "asked me if the phone was" },
        { t: "The manufacturer asked the testers how many times they pressed each key.", jp: "製造業者は検査員に、各キーを何回押したかたずねました。", h: "asked the testers how many times they pressed" },
        { t: "He asked me whether I had compared the two products.", jp: "彼は私に、2つの商品を比べたかたずねました。", h: "asked me whether I had compared" },
        { t: "She asked us why we wanted to wait 24 hours.", jp: "彼女は私たちに、なぜ24時間待ちたいのかたずねました。", h: "asked us why we wanted" }
      ]
    },
    quiz: [
      { stem: ["“What do I need to do next?” → Lisa asked me what she ", " to do next."], answers: ["needed", "needs", "did need", "need"], correct: 0, explTitle: "Drop did, shift the verb", explBody: "The auxiliary goes and need becomes needed.", jp: "助動詞は消え、動詞が過去形になります。" },
      { stem: ["“Can you help me?” → Ken asked me ", " I could help him."], answers: ["if", "that", "what", "do"], correct: 0, explTitle: "if for yes/no", explBody: "A yes/no question is joined with if.", jp: "yes / no の質問は if でつなぎます。" },
      { stem: ["A reported question ends with ___.", ""], answers: ["a full stop", "a question mark", "an exclamation mark", "a comma"], correct: 0, explTitle: "Not a question any more", explBody: "It is a statement about a question.", jp: "疑問符ではなくピリオドで終わります。" },
      { stem: ["“Is it waterproof?” → I asked the store if it ", " waterproof."], answers: ["was", "is", "were", "be"], correct: 0, explTitle: "is → was", explBody: "The verb shifts one step back.", jp: "is は was になります。" },
      { stem: ["Which word order is right?", ""], answers: ["She asked me what I wanted.", "She asked me what did I want.", "She asked me what wanted I.", "She asked me what do I want."], correct: 0, explTitle: "Normal word order", explBody: "No inversion in a reported question.", jp: "語順はふつうに戻します。" },
      { stem: ["“Can you fix it?” → I asked them if they ", " fix it."], answers: ["could", "can", "will", "did"], correct: 0, explTitle: "can → could", explBody: "Modals shift back too.", jp: "can は could になります。" },
      { stem: ["Which word can replace “if” in a reported yes/no question?", ""], answers: ["whether", "that", "what", "how"], correct: 0, explTitle: "whether", explBody: "Whether means the same as if here.", jp: "whether も同じ意味で使えます。" },
      { stem: ["“Where did you buy it?” → He asked me where I ", " it."], answers: ["had bought", "did buy", "buy", "buys"], correct: 0, explTitle: "Drop did", explBody: "The auxiliary goes and buy shifts back.", jp: "did は落として動詞をずらします。" },
      { stem: ["Which verb introduces a reported question?", ""], answers: ["asked", "told", "said", "spoke"], correct: 0, explTitle: "asked", explBody: "Use asked for questions and told for instructions.", jp: "質問には asked を使います。" },
      { stem: ["Which sentence is a reported question?", ""], answers: ["He asked me if there was any Wi-Fi.", "Is there any Wi-Fi?", "He told me to find the Wi-Fi.", "There is no Wi-Fi here."], correct: 0, explTitle: "asked + if", explBody: "It reports a yes/no question.", jp: "asked + if の形です。" }
    ],
    master: [
      { stem: ["Report it: “Can you help me?”", ""], answers: ["Ken asked me if I could help him.", "Ken asked me if I can help him.", "Ken asked me can I help him.", "Ken told me if I could help him."], correct: 0, explTitle: "asked + if + backshift", explBody: "Can becomes could.", jp: "can は could になります。" },
      { stem: ["Report it: “What do I need to do next?”", ""], answers: ["Lisa asked me what she needed to do next.", "Lisa asked me what did she need to do next.", "Lisa asked me what she needs to do next.", "Lisa told me what she needed to do next."], correct: 0, explTitle: "Drop did, shift need", explBody: "No auxiliary, and need → needed.", jp: "助動詞を落として needed にします。" },
      { stem: ["Which is wrong in a reported question?", ""], answers: ["a question mark", "the word if", "normal word order", "a past verb"], correct: 0, explTitle: "No question mark", explBody: "The sentence is a statement.", jp: "疑問符は使いません。" },
      { stem: ["Fix it: “She asked me what did I want.”", ""], answers: ["She asked me what I wanted.", "She asked me what I want.", "She asked me did I want what.", "She asked me what wanted I."], correct: 0, explTitle: "Drop did", explBody: "Use normal word order with a past verb.", jp: "did を落としてふつうの語順にします。" },
      { stem: ["Complete: “Mom asked me ___ the phone was waterproof.”", ""], answers: ["if", "what", "that", "which"], correct: 0, explTitle: "Yes/no question", explBody: "The answer would be yes or no.", jp: "yes / no の質問なので if です。" },
      { stem: ["Which verb pairs with an instruction, not a question?", ""], answers: ["told", "asked", "wondered", "enquired"], correct: 0, explTitle: "told = instruction", explBody: "Use told for imperatives.", jp: "命令文の伝達には told を使います。" },
      { stem: ["Report it: “Why do you want to wait?”", ""], answers: ["She asked us why we wanted to wait.", "She asked us why did we want to wait.", "She asked us why we want to wait.", "She told us why we wanted to wait."], correct: 0, explTitle: "Keep why, drop do", explBody: "The question word stays; the auxiliary goes.", jp: "疑問詞は残し、助動詞は落とします。" },
      { stem: ["Complete: “He asked me ___ I had compared the two products.”", ""], answers: ["whether", "that", "what", "how much"], correct: 0, explTitle: "whether = if", explBody: "Both work for a yes/no question.", jp: "whether は if と同じ働きです。" },
      { stem: ["Which sentence keeps the original question mark correctly?", ""], answers: ["“Can you help me?” Ken asked.", "Ken asked me if I could help him?", "Ken asked me can you help me?", "Ken asked if could I help him?"], correct: 0, explTitle: "Only direct speech keeps it", explBody: "The question mark belongs inside the quotation.", jp: "疑問符は直接話法の中だけです。" },
      { stem: ["Complete: “The clerk asked me how much I ___ to spend.”", ""], answers: ["wanted", "want", "did want", "wants"], correct: 0, explTitle: "Backshift", explBody: "Want becomes wanted.", jp: "want は wanted になります。" }
    ]
  },

  reading: {
    tr: "6.8",
    title: "Be an Ad Detective!",
    jpTitle: "広告の探偵になろう！",
    intro: "Every day we see ads—on TV, in magazines, on websites, in the street, and on our computer screens. We hear them, too. But often we don't notice them.",
    paras: [
      { t: "A famous film producer once showed over one hundred products in his movie, but most people didn't notice them! Are you an ad detective? Can you understand the messages advertisers send you? To be an ad detective, it is useful to know how ads work.",
        q: "What did most people fail to notice in the film?", opts: ["Over one hundred products", "The actors", "The music"], correct: 0, jp: "100点以上の商品に気づきませんでした。" },
      { t: "1. Group pressure: An ad shows lots of young people, each with their own cell phone. Message: Everyone has a cell phone. You need one, too! 2. Association: Everyone looks happy and healthy in the ad. Message: If you buy the product, you will be happy and cool like these people.",
        q: "What is the message of “group pressure”?", opts: ["Everyone has one, so you need one too", "This product is cheap", "Buy it before the shop closes"], correct: 0, jp: "みんな持っているから、あなたも必要だ、というメッセージです。" },
      { t: "3. Testimonials: A famous athlete says he wears a certain brand of sneakers. Message: You'll be good at sports, too, if you buy these sneakers. 4. Repetition: These ads mention the product many times and say wonderful things about it. Message: You need to remember the product.",
        q: "Which technique uses a famous athlete?", opts: ["Testimonials", "Repetition", "Time pressure"], correct: 0, jp: "推薦（テスティモニアル）です。" },
      { t: "5. Time pressure: These ads use expressions like “Buy now! Half price this week.” Message: You should buy the product quickly before you miss a great opportunity. Ads are interesting, but you can make better decisions when you know these techniques! Try these tips: read product reviews, compare products, test products in the store, and, if you are not sure, wait 24 hours before buying.",
        q: "What should you do if you are not sure?", opts: ["Wait 24 hours before buying", "Buy it immediately", "Ask the advertiser"], correct: 0, jp: "24時間待ってから買いましょう。" }
    ],
    strategy: {
      title: "Reading strategy — numbered techniques",
      body: "This passage is a numbered list: 1 group pressure, 2 association, 3 testimonials, 4 repetition, 5 time pressure. Each one has a name and a Message. Read the name, then the Message — that pair is the whole idea.",
      jp: "この文章は番号つきのリストです。それぞれに「名前」と「メッセージ」があります。名前とメッセージをセットで読むと要点がつかめます。"
    },
    order: {
      title: "Put the five advertising techniques in the order the article gives them",
      items: [
        "Group pressure — everyone has one, so you need one too.",
        "Association — buy it and you will be happy and cool.",
        "Testimonials — a famous athlete says he uses it.",
        "Repetition — the product is mentioned again and again.",
        "Time pressure — buy now before you miss out.",
        "The tips: read reviews, compare, test in the store, wait 24 hours."
      ]
    },
    quiz: [
      { q: "Where do we see ads?", opts: ["On TV, in magazines, on websites and in the street", "Only on TV", "Only in shops"], correct: 0, jp: "テレビ・雑誌・ウェブサイト・街中などです。" },
      { q: "How many products did the film producer show?", opts: ["Over one hundred", "Over ten", "Exactly five"], correct: 0, jp: "100点以上です。" },
      { q: "Which technique repeats the product many times?", opts: ["Repetition", "Association", "Group pressure"], correct: 0, jp: "くり返し（repetition）です。" },
      { q: "“Half price this week” is an example of ___.", opts: ["time pressure", "testimonials", "association"], correct: 0, jp: "時間の圧力です。" },
      { q: "What does “association” make you believe?", opts: ["You will be happy and cool like the people in the ad", "The product is cheap", "The product is safe"], correct: 0, jp: "広告の人たちのように幸せでかっこよくなれる、と思わせます。" },
      { q: "Which tip is in the article?", opts: ["Read product reviews", "Buy the most expensive one", "Ignore the price"], correct: 0, jp: "商品のレビューを読むことです。" },
      { q: "Why is it useful to know how ads work?", opts: ["So you can make better decisions", "So you can make ads", "So you can watch more TV"], correct: 0, jp: "よりよい判断ができるようになるからです。" },
      { q: "What might you decide after waiting 24 hours?", opts: ["That you don't really need the product", "That the ad was true", "That the shop is closed"], correct: 0, jp: "本当はその商品が必要ないと気づくかもしれません。" }
    ]
  },

  writing: {
    genre: "A product review",
    jpGenre: "商品レビュー",
    modelTitle: "My New Football Boots",
    model: [
      "I bought these boots last month, and they cost about 8,000 yen.",
      "The quality is good. They survived a lot of wear and tear, and they are waterproof.",
      "The shop assistant told me to try them on with football socks, and that was good advice.",
      "I asked the shop if they could replace them if they broke, and they said yes. I would buy them again."
    ],
    modelJp: "先月このシューズを買いました。値段は約8,000円です。品質はよく、たくさんの傷みに耐え、防水です。",
    steps: [
      { t: "Say what you bought, when, and what it cost.", jp: "何をいつ買い、いくらだったかを書く。" },
      { t: "Judge the quality with real evidence, not just an opinion.", jp: "意見だけでなく根拠を挙げて品質を判断する。" },
      { t: "Report advice you were given, using told me to.", jp: "told me to を使って、受けた助言を伝える。" },
      { t: "Report a question you asked, using asked if.", jp: "asked if を使って、自分がした質問を伝える。" }
    ],
    expressions: [
      { t: "I bought ___ last ___, and it cost ___.", jp: "先〜に〜を買い、値段は〜でした。" },
      { t: "The quality is ___ because ___.", jp: "〜なので品質は〜です。" },
      { t: "The assistant told me to ___.", jp: "店員は私に〜するように言いました。" },
      { t: "I asked the shop if they could ___.", jp: "店に〜できるかたずねました。" }
    ],
    checklist: [
      "I gave the price and when I bought it.",
      "I gave real evidence for my opinion about the quality.",
      "I used told me to once.",
      "I used asked if once."
    ],
    quiz: [
      { q: "Which sentence gives evidence, not just an opinion?", opts: ["They survived a lot of wear and tear.", "They are great.", "I love them."], correct: 0, jp: "根拠のある文です。" },
      { q: "Choose the correct reported instruction.", opts: ["He told me to try them on.", "He told me try them on.", "He said me to try them on."], correct: 0, jp: "told + 人 + to + 原形です。" },
      { q: "Choose the correct reported question.", opts: ["I asked if they could replace them.", "I asked could they replace them.", "I asked if could they replace them."], correct: 0, jp: "asked + if + ふつうの語順です。" },
      { q: "A review should include ___.", opts: ["the price and the quality", "your favourite colour only", "a recipe"], correct: 0, jp: "値段と品質を書きます。" },
      { q: "“Wear and tear” means ___.", opts: ["damage from normal daily use", "a torn shirt", "a crash test"], correct: 0, jp: "ふだん使ううちの傷みのことです。" },
      { q: "Which advertising technique should a review avoid?", opts: ["Time pressure", "Honest evidence", "A clear price"], correct: 0, jp: "時間の圧力は避けます。" },
      { q: "Which ending is most useful to a reader?", opts: ["I would buy them again.", "The end.", "Goodbye."], correct: 0, jp: "また買うかどうかを書きます。" },
      { q: "Reported instructions use ___.", opts: ["told + person + to + base verb", "said + to + base verb", "asked + that"], correct: 0, jp: "told + 人 + to + 原形です。" }
    ]
  }
};
