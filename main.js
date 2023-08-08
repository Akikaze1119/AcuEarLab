new Vue({
    el: "#app",
    data: {
      startFlg: false, //開始判定
      endFlg: false, //終了判定
      word1: "", //1つ目の単語
      word2: "", //2つ目の単語
      answer:"", //正解
      userAnswer:"", //ユーザーの回答
      //問題リスト
      wordPairs: [
        ['right', 'light'],
        ['row', 'low'],
        ['far', 'fall'],
        ['mirror', 'mile'],
        ['bar', 'ball'],
        ['collar', 'carol'],
        ['revel', 'level'],
        ['room', 'loom'],
        ['call', 'curl'],
        ['arrow', 'allow'],
        ['brew', 'blue'],
        ['branch', 'blanch'],
        ['brand', 'bland'],
        ['break', 'bleak'],
        ['bred', 'bled'],
        ['breed', 'bleed'],
        ['brink', 'blink'],
        ['brown', 'blown'],
        ['brow', 'blow'],
        ['brush', 'blush'],
        ['burly', 'bully'],
        ['crash', 'clash'],
        ['curry', 'curly'],
        ['erect', 'elect'],
        ['fork', 'folk'],
        ['frame', 'flame'],
        ['fred', 'fled'],
        ['free', 'flee'],
        ['fresh', 'flesh'],
        ['fries', 'flies'],
        ['fright', 'flight'],
        ['frown', 'flown'],
        ['fry', 'fly'],
        ['fryer', 'flyer'],
        ['gentry', 'gently'],
        ['grade', 'glade'],
        ['grass', 'glass'],
        ['gross', 'gloss'],
        ['grove', 'glove'],
        ['jerry', 'jelly'],
        ['order', 'older'],
        ['poor', 'pool'],
        ['pray', 'play'],
        ['purse', 'pulse'],
        ['race', 'lace'],
        ['rain', 'lain'],
        ['rate', 'late'],
        ['raw', 'law'],
        ['ray', 'lay'],
        ['read', 'lead'],
        ['reader', 'leader'],
        ['reap', 'leap'],
        ['red', 'led'],
        ['rice', 'lice'],
        ['road', 'load'],
        ['rock', 'lock'],
        ['rocket', 'locket'],
        ['rose', 'lose'],
        ['royal', 'loyal'],
        ['scare', 'scale'],
        ['sore', 'sole'],
      ],
      questionIndex: 0, // 現在の問題のインデックス
      questions: [],  // 生成された問題の配列
      questionList: [], //問題一覧
      questionId: 1, //問題ID
      currentQuestionsCounts: 0, //現在の問題数のカウント
      questionCounts: 0, //問題数のカウント
      correctAnswers:0, //正解数のカウント
      showResult: false, //正誤判定
      resultMessage: '', //回答結果のメッセージ
      isCorrect: false, //回答結果の正誤判定
      answerButtonShow: true, //正誤判定
      nextButtonShow: false, //正誤判定
      selectedOption: '', //選択状況判定
    },
    computed: {
      styleobject: function() {
        width = 20 * this.currentQuestionsCounts + "%"
        if (this.currentQuestionsCounts == 5) {
          color = "#30C3DD"
        }
        else {
          color = "orange"
        }
        return {
          'width': width,
          'background-color': color
        }
      }
    },
    methods: {
      //スタートボタン
      gameStart: function() {
        this.startFlg = true;
      },
      //読み上げボタン
      readAloud: function () {
        // ブラウザにWeb Speech API Speech Synthesis機能があるか判定
        if ('speechSynthesis' in window) {
      
          // 発言を設定
          const uttr = new SpeechSynthesisUtterance()
      
          // テキストを設定
          uttr.text = this.answer
      
          // 言語を設定
          uttr.lang = 'en-US'
      
          // 英語に対応しているvoiceを設定
          const voices = speechSynthesis.getVoices()
          for (let i = 0; i < voices.length; i++) {
            if (voices[i].lang === 'en-US') {
              uttr.voice = voices[i]
            }
          }
      
          // 発言を再生
          window.speechSynthesis.speak(uttr)
        }
      },
      //結果一覧読み上げボタン
      readAloudAnswer: function (id) {
        const speakanswer = this.questionList.find(item => item.id === id)?.answer;
        // ブラウザにWeb Speech API Speech Synthesis機能があるか判定
        if ('speechSynthesis' in window) {
      
          // 発言を設定
          const uttr = new SpeechSynthesisUtterance(speakanswer)
      
          // 言語を設定
          uttr.lang = 'en-US'
      
          // 英語に対応しているvoiceを設定
          const voices = speechSynthesis.getVoices()
          for (let i = 0; i < voices.length; i++) {
            if (voices[i].lang === 'en-US') {
              uttr.voice = voices[i]
            }
          }
      
          // 発言を再生
          window.speechSynthesis.speak(uttr)
        }
      },
      //シャッフル関数  
      shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      },
      //5問分生成
      generateQuestions: function() {
        // wordPairs 配列をシャッフルする
        const shuffledPairs = this.shuffle([...this.wordPairs]);
        // 最初の5つの要素を取得して、questions 配列に追加する
        this.questions = shuffledPairs.slice(0, 5);
      },
      // 問題をセットアップするメソッド
      setupQuestion: function() {
        // 現在の問題を取得する
        const wordPair = this.questions[this.questionIndex];
        // 1つ目の単語を取得
        this.word1 = wordPair[Math.floor(Math.random() * 2)];
        // 正解の単語を取得
        this.answer = wordPair[Math.floor(Math.random() * 2)];
        // 2つ目の単語を選択する
        this.word2 = wordPair.find(word => word !== this.word1);
        /* // 正解の発音を取得
        const correctPronunciation = this.pronunciationList[this.questionIndex]; */
        // 問題がセットアップされたので、結果メッセージを初期化しておく
        this.resultMessage = '';
        //questionListに問題を追加する
        const questionItem = {
          id: this.questionId,
          question1: this.word1,
          question2: this.word2,
          answer: this.answer,
          isCorrect: false
        };
        this.questionList.push(questionItem);
        this.questionId++;
      },
      //選択ボタンAを回答とする
      optionA: function(){
        this.userAnswer = this.word1
        this.selectedOption = 'optionA'; //回答ボタンをアクティブにするフラグ
        if(this.userAnswer === ""){
          //ユーザー回答が空の場合、メッセージを表示
          this.resultMessage = '選択してください';
        }else {
          if (this.answer === this.userAnswer) {
            this.resultMessage = 'Correct!';
            this.isCorrect = true; // 正解の場合はisCorrectをtrueに設定
            this.correctAnswers++;
          }else {
            this.resultMessage = 'Incorrect. Try again.';
            this.isCorrect = false; // 不正解の場合はisCorrectをfalseに設定
          }
          //回答したら+1カウントアップ（現在の問題数を示す）
          this.currentQuestionsCounts++
          //回答ボタンを非表示に
          this.answerButtonShow = false;
          //Nextボタンを表示
          this.nextButtonShow = true;
          //回答結果を反映する
          const questionItem = this.questionList[this.questionIndex];
          questionItem.isCorrect = this.answer === this.userAnswer;
        }
      },
      //選択ボタンBを回答とする
      optionB: function(){
        this.userAnswer = this.word2
        this.selectedOption = 'optionB'; //回答ボタンをアクティブにするフラグ
        if(this.userAnswer === ""){
        //ユーザー回答が空の場合、メッセージを表示
        this.resultMessage = '選択してください';
        }else {
          if (this.answer === this.userAnswer) {
            this.resultMessage = 'Correct!';
            this.isCorrect = true; // 正解の場合はisCorrectをtrueに設定
            this.correctAnswers++;
          }else {
            this.resultMessage = 'Incorrect. Try again.';
            this.isCorrect = false; // 不正解の場合はisCorrectをfalseに設定
          }
          //回答したら+1カウントアップ（現在の問題数を示す）
          this.currentQuestionsCounts++
          //回答ボタンを非表示に
          this.answerButtonShow = false;
          //Nextボタンを表示
          this.nextButtonShow = true;
          //回答結果を反映する
          const questionItem = this.questionList[this.questionIndex];
          questionItem.isCorrect = this.answer === this.userAnswer;
        }
      },
      nextButton: function() {
        //ユーザー回答と選択状況を空に
        this.userAnswer="";
        this.selectedOption = '';
        // 次の問題に移る
        this.questionIndex++;
        if (this.questionIndex < this.questions.length) {
          // 次の問題がある場合は、setupQuestion() メソッドを呼び出して新しい問題をセットアップする
          this.setupQuestion();
        } else {
          // 次の問題がない場合は、クイズを終了する
          this.endFlg = true;
        }
        this.answerButtonShow = true;
        this.nextButtonShow = false;
      },
    },
    //描画された瞬間の処理
    mounted: function() {
      this.generateQuestions(); //問題を初回の時に、出題数分のクイズを作成
      this.setupQuestion(); //1問目を作成
      //現在の問題は配列"questions"から吐き出される
      this.current_questions = this.questions[0]
      this.questionCounts = Object.keys(this.questions).length;
    }
  })
