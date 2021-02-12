document.addEventListener('DOMContentLoaded', function () {
  const btnOpenModal = document.querySelector('#btnOpenModal');
  const modalBlock = document.querySelector('#modalBlock');
  const modalClose = document.querySelector('#closeModal');
  const questionTitle = document.querySelector('#question');
  const formAnswers = document.querySelector('#formAnswers');
  const nextButton = document.querySelector('#next');
  const prevButton = document.querySelector('#prev');
  const sendButton = document.querySelector('#send');

  var firebaseConfig = {
    apiKey: "AIzaSyC37LOZzeIV80C3uoFBoJqCSC4jS3fBID8",
    authDomain: "pr12-15.firebaseapp.com",
    databaseURL: "https://pr12-15-default-rtdb.firebaseio.com",
    projectId: "pr12-15",
    storageBucket: "pr12-15.appspot.com",
    messagingSenderId: "668497794801",
    appId: "1:668497794801:web:a7ef24a95a003417733b50",
    measurementId: "G-SKE96L4EWZ"
  };
  firebase.initializeApp(firebaseConfig);

  const getData = () => {
    formAnswers.textContent = 'LOAD';
    nextButton.classList.add('d-none');
    prevButton.classList.add('d-none');
    sendButton.classList.add('d-none');
    firebase.database().ref().child('questions').once('value')
      .then(snap => playTest(snap.val()))
  }

  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.add("d-block");
    getData();
  });

  closeModal.addEventListener("click", () => {
    modalBlock.classList.remove("d-block");
  });
  const playTest = (questions) => {

    const finalAnswers = [];
    let numberQuestion = 0;
    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {
        const answerItem = document.createElement('div');

        answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

        answerItem.innerHTML = `<div class="answers-item d-flex flex-column">
          <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
          <label for="${answer.title}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${answer.url}" alt="burger">
            <span>${answer.title}</span>
          </label>
        </div>`;
        formAnswers.appendChild(answerItem);
      })
    }
    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = '';

      if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
        questionTitle.textContent = `${questions[indexQuestion].question}`;
        renderAnswers(indexQuestion);
        sendButton.classList.add('d-none');
        nextButton.classList.remove('d-none');
        prevButton.classList.remove('d-none');
      }

      if (numberQuestion === 0) {
        prevButton.classList.add('d-none');
      }

      if (numberQuestion === questions.length) {
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        sendButton.classList.remove('d-none');
        formAnswers.innerHTML = `
        <div class="form-group">
        <label for="numberPhone">Enter your phone</label>
        <input type="phone" class="form-control" id="numberPhone">
        </div>
        `;
      }
      if (numberQuestion === questions.length + 1) {
        formAnswers.textContent = `Спасибо за пройденный тест!`;
        setTimeout(() => {
          modalBlock.classList.remove('d-block');
        }, 2000);
      }
    };
    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const obj = {};
      const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === "numberPhone");
      console.log(inputs);
      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }
        if (numberQuestion === questions.length) {
          obj['Номер телефона'] = input.value;
        }
      })
      finalAnswers.push(obj)
    }

    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    }
    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    }
    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      firebase
        .database()
        .ref()
        .child('contacts')
        .push(finalAnswers)
    }
  };
});