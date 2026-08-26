/* Academic words Level 6 introduces that no earlier level has authored yet.
   Everything else in a unit's `academic` list is cloned from the existing
   global card by build-content.mjs. */
export default {
  evidence: {
    w: "evidence", emoji: "🔍📄", emojiDesc: "magnifying glass over a document",
    ipa: "ˈevɪdəns", syl: "ev-i-dence", pos: "noun",
    mean: "facts or objects that show something is true.",
    jr: "証拠（しょうこ）", jm: "何かが本当だと示す事実やもの。",
    jnote: "evidence は、自分の考えを支える「証拠」を示すときに使う学習語です。",
    when: [
      ["test", "Use evidence when a test question asks you to prove your answer from the text."],
      ["school", "Use evidence when you explain why your answer is right in class."],
      ["real-world", "Use evidence when you want someone to believe a claim you are making."]
    ].map(([c, t]) => [c, t, { test: "テストで、本文から答えの根拠を示すよう求められたとき。", school: "授業で、なぜその答えなのかを説明するとき。", "real-world": "日常で、自分の主張を信じてもらいたいとき。" }[c]]),
    how: "Use evidence with a verb like find, give, show or support: The archaeologists found evidence of a tomb.",
    jhow: "「find / give / show / support + evidence」の形で使います。",
    colloc: ["find evidence", "give evidence", "strong evidence", "scientific evidence", "evidence shows"],
    ex: [
      ["test", "Give evidence from the passage to support your answer.", "本文から証拠を挙げて答えを支えなさい。"],
      ["school", "The DNA test was strong evidence about the mummy.", "DNA検査はミイラについての強い証拠でした。"],
      ["real-world", "Scientists look for evidence before they agree.", "科学者は納得する前に証拠を探します。"]
    ],
    nonEx: [["guessing without any facts", "事実なしに当てずっぽうで言うこと。"], ["repeating an opinion louder", "意見をただ大きな声でくり返すこと。"]],
    prompt: ["Find one piece of evidence in the reading that shows the Iceman was old.", "アイスマンが古いと分かる証拠を本文から1つ探しましょう。"],
    quiz: {
      prompt: "Which sentence uses 'evidence' correctly?",
      options: ["The archaeologists found evidence of a tomb.", "I evidence my homework every night.", "That is a very evidence idea."],
      correct: 0,
      explanation: "Evidence is a noun — you find, give or show evidence.",
      jp: "evidence は名詞で、find / give / show と一緒に使います。"
    }
  },

  percentage: {
    w: "percentage", emoji: "📊%", emojiDesc: "bar chart with a percent sign",
    ipa: "pərˈsentɪdʒ", syl: "per-cen-tage", pos: "noun",
    mean: "an amount out of one hundred, written with the % sign.",
    jr: "割合（わりあい）", jm: "100 のうちいくつかを表す量。%（パーセント）で書きます。",
    jnote: "percentage は、グラフや統計で「どのくらいの割合か」を説明するときの学習語です。",
    when: [
      ["test", "Use percentage when a test question asks how much of a whole something is."],
      ["school", "Use percentage when you read or make a graph in class."],
      ["real-world", "Use percentage when you compare amounts, like water use or battery life."]
    ].map(([c, t]) => [c, t, { test: "テストで、全体のどれくらいかを問われたとき。", school: "授業でグラフを読んだり作ったりするとき。", "real-world": "水の使用量や電池の残量など、量を比べるとき。" }[c]]),
    how: "Use a percentage with of + a noun: 75% of the earth is covered by water.",
    jhow: "「percentage of + 名詞」の形で使います。",
    colloc: ["a high percentage", "a small percentage", "the percentage of", "percentage points", "show the percentage"],
    ex: [
      ["test", "What percentage of the earth's water is salt water?", "地球の水のうち何パーセントが塩水ですか。"],
      ["school", "Our graph shows the percentage of fresh water on the planet.", "私たちのグラフは地球上の淡水の割合を示しています。"],
      ["real-world", "A small percentage of the water we use is for drinking.", "私たちが使う水のうち、飲み水はごくわずかな割合です。"]
    ],
    nonEx: [["counting a total number with no whole to compare it to", "比べる全体がないまま合計だけを数えること。"], ["giving an exact weight in grams", "グラムで正確な重さを言うこと。"]],
    prompt: ["Say what percentage of the earth is covered by water.", "地球の何パーセントが水におおわれているか言いましょう。"],
    quiz: {
      prompt: "Which sentence uses 'percentage' correctly?",
      options: ["A high percentage of fresh water is frozen.", "I percentage my homework.", "The lake is very percentage."],
      correct: 0,
      explanation: "Percentage is a noun and normally pairs with of.",
      jp: "percentage は名詞で、ふつう of と一緒に使います。"
    }
  },

  classify: {
    w: "classify", emoji: "🗂️", emojiDesc: "card index dividers",
    ipa: "ˈklæsɪfaɪ", syl: "clas-si-fy", pos: "verb",
    mean: "to put things into groups because they share a feature.",
    jr: "分類する（ぶんるいする）", jm: "同じ特徴をもつものどうしをグループに分けること。",
    jnote: "classify は、共通点を見つけてグループ分けするときの学習語です。",
    when: [
      ["test", "Use classify when a test asks you to sort items into groups."],
      ["school", "Use classify when you organise creatures, words or data in class."],
      ["real-world", "Use classify when you tidy or organise things by type."]
    ].map(([c, t]) => [c, t, { test: "テストで、項目をグループに分けるよう求められたとき。", school: "授業で生き物・語・データを整理するとき。", "real-world": "身のまわりのものを種類ごとに片づけるとき。" }[c]]),
    how: "Use classify + object + as / into: Scientists classify a seahorse as a fish.",
    jhow: "「classify + 目的語 + as / into」の形で使います。",
    colloc: ["classify into groups", "classify as", "how to classify", "classify by size", "scientists classify"],
    ex: [
      ["test", "Classify each creature as an insect or a bird.", "それぞれの生き物を昆虫か鳥かに分類しなさい。"],
      ["school", "We classify the organisms by habitat.", "私たちは生き物を生息地で分類します。"],
      ["real-world", "Libraries classify books so you can find them.", "図書館は本を探しやすいように分類します。"]
    ],
    nonEx: [["listing things in no order at all", "順序も分け方もなく並べるだけのこと。"], ["describing one thing in detail", "1つのものを詳しく説明するだけのこと。"]],
    prompt: ["Classify three tiny creatures from the reading by habitat.", "本文の小さな生き物3つを生息地で分類しましょう。"],
    quiz: {
      prompt: "Which sentence uses 'classify' correctly?",
      options: ["Scientists classify a seahorse as a fish.", "I classify very happy today.", "The classify is on the table."],
      correct: 0,
      explanation: "Classify is a verb — you classify something as, or into, a group.",
      jp: "classify は動詞で、as や into と一緒に使います。"
    }
  },

  observe: {
    w: "observe", emoji: "👁️🔬", emojiDesc: "eye beside a microscope",
    ipa: "əbˈzɜːrv", syl: "ob-serve", pos: "verb",
    mean: "to watch something carefully to learn about it.",
    jr: "観察する（かんさつする）", jm: "何かをよく見て、そこから学ぶこと。",
    jnote: "observe は、理科の実験や自然観察で「注意深く見る」ときの学習語です。",
    when: [
      ["test", "Use observe when a test asks what you noticed in a picture or experiment."],
      ["school", "Use observe when you record what happens in a science lesson."],
      ["real-world", "Use observe when you watch animals, weather or people carefully."]
    ].map(([c, t]) => [c, t, { test: "テストで、写真や実験から気づいたことを問われたとき。", school: "理科の授業で起きたことを記録するとき。", "real-world": "動物・天気・人をじっくり観察するとき。" }[c]]),
    how: "Use observe + object, or observe that + a clause: He observed that the mites move at night.",
    jhow: "「observe + 目的語」または「observe that + 文」の形で使います。",
    colloc: ["observe carefully", "observe an experiment", "observe wildlife", "observe changes", "observe that"],
    ex: [
      ["test", "Observe the photo and write two things you notice.", "写真を観察して、気づいたことを2つ書きなさい。"],
      ["school", "Liittschwager observed everything that crawled into the cube.", "リッチュワガーは立方体に入ってきたものすべてを観察しました。"],
      ["real-world", "Mireya Mayor observes wildlife in the rain forest.", "ミレヤ・メイヨーは熱帯雨林で野生動物を観察します。"]
    ],
    nonEx: [["glancing at something for a second", "ちらっと一瞬見るだけのこと。"], ["imagining what might be there", "そこに何があるか想像するだけのこと。"]],
    prompt: ["Observe one small creature near your home and describe it.", "家の近くの小さな生き物を1つ観察して説明しましょう。"],
    quiz: {
      prompt: "Which sentence uses 'observe' correctly?",
      options: ["Scientists observe the creatures through a microscope.", "I observe very tired today.", "That is a big observe."],
      correct: 0,
      explanation: "Observe is a verb — you observe something or observe that something happens.",
      jp: "observe は動詞で、目的語や that 節をとります。"
    }
  },

  persuade: {
    w: "persuade", emoji: "🗣️👍", emojiDesc: "speaking head with a thumbs up",
    ipa: "pərˈsweɪd", syl: "per-suade", pos: "verb",
    mean: "to make someone believe something or agree to do it.",
    jr: "説得する（せっとくする）", jm: "相手に信じてもらったり、やってもらうように話すこと。",
    jnote: "persuade は、広告や意見文の目的を説明するときによく使う学習語です。",
    when: [
      ["test", "Use persuade when a test asks what an advertisement is trying to do."],
      ["school", "Use persuade when you write or analyse an opinion text."],
      ["real-world", "Use persuade when you explain why an ad wants you to buy something."]
    ].map(([c, t]) => [c, t, { test: "テストで、広告のねらいを問われたとき。", school: "意見文を書いたり分析したりするとき。", "real-world": "広告がなぜ買わせようとするのか説明するとき。" }[c]]),
    how: "Use persuade + someone + to + verb: The ad persuades people to buy the sneakers.",
    jhow: "「persuade + 人 + to + 動詞」の形で使います。",
    colloc: ["persuade someone to", "try to persuade", "persuade a customer", "persuasive language", "hard to persuade"],
    ex: [
      ["test", "How does the advertiser persuade you to buy the product?", "広告主はどのようにあなたを説得して買わせようとしていますか。"],
      ["school", "Repetition is one way ads persuade customers.", "くり返しは広告が客を説得する方法の一つです。"],
      ["real-world", "A famous athlete can persuade fans to trust a brand.", "有名な選手はファンにブランドを信頼させることができます。"]
    ],
    nonEx: [["forcing someone with no reason at all", "理由もなく無理やりさせること。"], ["describing a product without any message", "何のメッセージもなく商品を説明するだけのこと。"]],
    prompt: ["Say one technique an ad uses to persuade you.", "広告があなたを説得するために使う手法を1つ言いましょう。"],
    quiz: {
      prompt: "Which sentence uses 'persuade' correctly?",
      options: ["The ad tries to persuade you to buy the sneakers.", "I persuade very hungry now.", "That was a good persuade."],
      correct: 0,
      explanation: "Persuade is a verb, usually followed by someone + to + verb.",
      jp: "persuade は動詞で、「人 + to + 動詞」を続けます。"
    }
  },

  features: {
    w: "features", norm: "features", emoji: "🧩", emojiDesc: "puzzle piece",
    ipa: "ˈfiːtʃərz", syl: "fea-tures", pos: "noun",
    mean: "the important parts or qualities that something has.",
    jr: "特徴（とくちょう）", jm: "そのものがもっている大事な部分や性質。",
    jnote: "features は、機械や生き物の「どんな部分・性質があるか」を説明する学習語です。",
    when: [
      ["test", "Use features when a test asks you to list what a thing has."],
      ["school", "Use features when you compare two products, robots or creatures."],
      ["real-world", "Use features when you choose a phone, a bike or an app."]
    ].map(([c, t]) => [c, t, { test: "テストで、そのものが持つものを挙げるよう求められたとき。", school: "2つの製品・ロボット・生き物を比べるとき。", "real-world": "スマホや自転車、アプリを選ぶとき。" }[c]]),
    how: "Use have / has + features, or the features of + a noun: This robot has human features.",
    jhow: "「have / has + features」や「the features of + 名詞」の形で使います。",
    colloc: ["human features", "safety features", "the features of", "special features", "compare features"],
    ex: [
      ["test", "List three features of the robot in the reading.", "本文のロボットの特徴を3つ挙げなさい。"],
      ["school", "ASIMO is an android robot with human features.", "ASIMO は人間のような特徴をもつアンドロイドロボットです。"],
      ["real-world", "Which features does your new phone have?", "あなたの新しいスマホにはどんな機能がありますか。"]
    ],
    nonEx: [["saying only whether you like it", "好きかどうかだけを言うこと。"], ["giving the price and nothing else", "値段だけを言うこと。"]],
    prompt: ["Name two features you would give your own robot.", "自分のロボットにつけたい特徴を2つ挙げましょう。"],
    quiz: {
      prompt: "Which sentence uses 'features' correctly?",
      options: ["This robot has human features.", "I features my homework quickly.", "The robot is very features."],
      correct: 0,
      explanation: "Features is a noun — something has features.",
      jp: "features は名詞で、have / has と一緒に使います。"
    }
  }
};
