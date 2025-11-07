const correctSound = new Audio("correct.aiff");
const wrongSound = new Audio("wrong.mp3");

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function generateArithmeticQuestion() {
  const type = rand(0, 7);
  let a, b, result, content, options;

  switch (type) {
    case 0:
      a = rand(1, 50); b = rand(1, 50);
      result = a + b;
      content = `Tính ${a} + ${b} = ?`;
      break;
    case 1:
      a = rand(20, 100); b = rand(1, 20);
      result = a - b;
      content = `Tính ${a} - ${b} = ?`;
      break;
    case 2:
      a = rand(1, 20); b = rand(1, 10);
      result = a * b;
      content = `Tính ${a} × ${b} = ?`;
      break;
    case 3:
      b = rand(1, 10); a = b * rand(1, 10);
      result = a / b;
      content = `Tính ${a} ÷ ${b} = ?`;
      break;
    case 4:
      a = rand(2, 10); b = rand(2, 10);
      result = lcm(a, b);
      content = `Tìm BCNN của ${a} và ${b}`;
      break;
    case 5:
      a = rand(10, 50); b = rand(10, 50);
      result = gcd(a, b);
      content = `Tìm ƯCLN của ${a} và ${b}`;
      break;
    case 6:
      a = rand(10, 50); b = rand(10, 50);
      result = gcd(a, b) === 1 ? "Có" : "Không";
      content = `${a} và ${b} có phải là hai số nguyên tố cùng nhau?`;
      options = ["Có", "Không", "Không xác định", "Không biết"];
      return { content, options, correct: result };
    case 7:
      a = rand(2, 10); b = rand(2, 10);
      result = (a + b) % a === 0 ? "Có" : "Không";
      content = `Tổng ${a} + ${b} có chia hết cho ${a}?`;
      options = ["Có", "Không", "Không chắc", "Không biết"];
      return { content, options, correct: result };
  }

  options = [result, result + 1, result - 1, result + 2].sort(() => Math.random() - 0.5);
  return { content, options, correct: result };
}

function generateGeometryQuestion() {
  const type = rand(0, 1);
  let content, result, options;

  if (type === 0) {
    const side = rand(1, 20);
    result = 4 * side;
    content = `Chu vi hình vuông cạnh ${side} cm là?`;
  } else {
    const length = rand(5, 20);
    const width = rand(5, 15);
    result = 2 * (length + width);
    content = `Chu vi hình chữ nhật dài ${length} cm, rộng ${width} cm là?`;
  }

  options = [result, result + 2, result - 2, result + 4].sort(() => Math.random() - 0.5);
  return { content, options, correct: result };
}

function generateEssayQuestion() {
  const a = rand(2, 20);
  const b = rand(2, 20);
  const result = a * b;
  return {
    prompt: `Tính ${a} × ${b} = ?`,
    correct: result.toString()
  };
}

let questions = [];
let essayQuestions = [];
let current = 0;
let score = 0;
let startTime;

function startGame() {
  const name = document.getElementById("playerName").value.trim();
  if (!name) return alert("Bạn chưa nhập tên!");

  questions = [];
  essayQuestions = [];
  for (let i = 0; i < 10; i++) questions.push(generateArithmeticQuestion());
  for (let i = 0; i < 10; i++) questions.push(generateGeometryQuestion());
  for (let i = 0; i < 5; i++) essayQuestions.push(generateEssayQuestion());

  current = 0;
  score = 0;
  startTime = Date.now();
  document.getElementById("info").style.display = "none";
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = `<p><strong>Câu ${current + 1}:</strong> ${q.content}</p>`;
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.onclick = () => {
      if (opt == q.correct) {
        score += 10;
        correctSound.play();
      } else {
        wrongSound.play();
      }
      current++;
      current < questions.length ? showQuestion() : showEssay();
    };
    gameDiv.appendChild(btn);
  });
}

function showEssay(index = 0, essayScore = 0) {
  if (index >= essayQuestions.length) {
    const totalScore = score + essayScore;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("game").innerHTML = "";
    document.getElementById("result").innerHTML = `
      🎉 Tổng điểm: <strong>${totalScore}</strong><br>
      ⏱ Thời gian: <strong>${timeTaken} giây</strong>
    `;
    return;
  }

  const q = essayQuestions[index];
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = `
    <p><strong>Tự luận ${index + 1}:</strong> ${q.prompt}</p>
    <input type="text" id="essayAnswer" placeholder="Nhập đáp án..." />
    <br><br>
    <button onclick="submitEssay(${index}, ${essayScore})">Gửi</button>
  `;
}

function submitEssay(index, essayScore) {
  const input = document.getElementById("essayAnswer").value.trim();
  if (input === essayQuestions[index].correct) {
    essayScore += 20;
    correctSound.play();
  } else {
    wrongSound.play();
  }
  showEssay(index + 1, essayScore);
}
