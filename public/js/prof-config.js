document.addEventListener('DOMContentLoaded', function () {
    const classSelector = document.querySelector('.class-selector');
    classSelector.addEventListener('change', function (event) {
      const selectedClass = event.target.value;
      fetchStudents(selectedClass);
    });
  
    // Buscar os alunos da classe selecionada inicialmente
    fetchStudents(classSelector.value);
  });

  // Assim que a pagina for carregada Exibir TOAST avisando o uso do + 

window.addEventListener('DOMContentLoaded', (event) => { 
  userName.textContent = userData.name;
  userPicture.src = userData.picture;
  
   Toastify({
    text: 'Use o botão + para inserir alunos quando tiver certeza que está faltando algum aluno.',
    duration: 4000,
    gravity: 'bottom',
    close: true,
    backgroundColor: '#ffae00'
   }).showToast();
  });

  // Exibir as opçoes via URL

 window.onload = function() {
  // Pega a URL e os parâmetros dela
  var urlParams = new URLSearchParams(window.location.search);
  var year = urlParams.get('year');
  
  // Baseado no ano, mostra somente as opções relevantes
  document.getElementById('content-' + year).style.display = 'block';
}
  
// Exiir SALA A por padrao cramos um switch 
window.addEventListener('load', function() {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let year = params.get('year');
    let room = '';
    switch(year) {
      case '6':
      room = '6anoA'
      break;
            // Outro ano
      case '7':
      room = '7anoA'
      break;
            // Outro ano
      case '8':
      room = '8anoA'
      break;
            // Outro ano 
      case '9':
      room = '9anoA'
      break; 
    }
    fetchStudents(room); // Exibe por padrão a "SALA A" ao carregar a página
  });

// Opçoes de trocar SALA e exibir por via URL

function updateURL(year) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('year', year);
  const newURL = window.location.pathname + '?' + urlParams.toString();
  window.history.pushState({}, '', newURL);
  window.location.reload();
}

// Obtendo a série da URL
const urlParams = new URLSearchParams(window.location.search);
const currentYear = urlParams.get('year');

// Marcando a opção correta
const selectElement = document.querySelector('select');
if (currentYear) {
  selectElement.value = currentYear;
}

   // Funçao para pegar data ATUAL 
   var dataElement = document.getElementById("data");

   // Atualizar Data
   updateDate();
   
   // Function to update the date
   function updateDate() {
   var currentDate = new Date();
   var day = formatNumber(currentDate.getDate());
   var month = formatNumber(currentDate.getMonth() + 1);
   var year = currentDate.getFullYear();
   var date = day + "/" + month + "/" + year;
   // Atualizar para conteudo em texto 
   dataElement.textContent = date;
   }
   
   // Funçao para formatar os numeros em / 
   function formatNumber(number) {
   return number < 10 ? "0" + number : number;
   }



 // Configurando Botao EDITAR SALA para abrir a planilha do google 
const sheets = document.getElementById("sheets");
sheets.addEventListener("click", openSheets);

function openSheets(){
window.location.href = "https://docs.google.com/spreadsheets/d/1IaYIo6PwRK6i0Aola0Akxrd8VMlur1_OIWYGctTz4O4/edit#gid=1795826749";
  }
// Final EDITAR SALA

// FUNÇAO TIRAR PRINT e BAIXAR IMAGEM

const downloadRoom = document.getElementById("downloadRoom");
const loadingElement = document.getElementById("loading");

downloadRoom.addEventListener("click", () => {
  // Exibir o elemento de carregamento
  loadingElement.style.display = "block";

  // Chamar a função para tirar a print com um pequeno delay (simulação de delay)
  setTimeout(() => {
  takeScreenshot();
  }, 1000);
});

  const closeAlert = document.getElementById("closeAlert");
  closeAlert.addEventListener("click", function () {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
});

function takeScreenshot() {
  var screenshotArea = document.querySelector('.screenshotArea');
  var blackboard = document.querySelector('.blackboard');
  var backroom = document.querySelector('.backroom');
  var data = document.querySelector('.data');
  data.classList.remove('hidden');

  blackboard.classList.add('capture-border');
  backroom.classList.add('capture-border');
  
  // Obter todos os elementos com a classe .student
  var studentElements = document.querySelectorAll('.student');

  // Armazenar as informações dos elementos .student-image removidos
  var removedStudentImages = [];

  // Iterar sobre cada elemento
  studentElements.forEach(function(element) {
    // Remover o elemento .student-image e armazenar as informações
    var studentImage = element.querySelector('.student-image');
    if (studentImage) {
      var imageInfo = {
        studentElement: element,
        studentImage: studentImage
      };
      removedStudentImages.push(imageInfo);
      studentImage.remove();
    }

    // Centralizar o texto no elemento .student
    element.style.display = 'flex';
    element.style.flexDirection = 'column';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
  });
  
  html2canvas(screenshotArea).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const screenshot = document.getElementById("screenshot");
    const customAlert = document.getElementById("customAlert");
    const downloadLinkImage = document.getElementById("downloadLinkImage");
    downloadLinkImage.addEventListener("click", handleDownloadClick);

    screenshot.src = imgData;

    customAlert.style.display = "block";

    downloadLinkImage.href = imgData;
    loadingElement.style.display = "none";

    blackboard.classList.remove('capture-border');
    backroom.classList.remove('capture-border');

    

    // Restaurar os elementos .student-image
    removedStudentImages.forEach(function(imageInfo) {
      var studentElement = imageInfo.studentElement;
      var studentImage = imageInfo.studentImage;
      studentElement.insertBefore(studentImage, studentElement.firstChild);
    });

    // Restaurar as propriedades de estilo originais dos elementos .student
    studentElements.forEach(function(element) {
      element.style.display = '';
      element.style.flexDirection = '';
      element.style.alignItems = '';
      element.style.justifyContent = '';
    });

    data.classList.add('hidden');
  });
}



// Final Screenshot

// FUNÇAO BAIXAR IMAGEM


const downloadLinkImage = document.getElementById("downloadLinkImage");
downloadLinkImage.addEventListener("click", handleDownloadClick);

function handleDownloadClick() {
  setTimeout(() => {

    const sendModal = document.getElementById("sendModal");
    sendModal.style.display = "block";

    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", () => {
      sendModal.style.display = "none";
    });

    const customAlert = document.getElementById("customAlert");
    customAlert.style.display = "none";


    const sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", () => {
      // Lógica para enviar o arquivo aqui
    });
  }, 2000);
}
// FINAL FUNÇAO BAIXAR IMAGEM

//Adicionando Funçao swapElements}
function swapElements() {
  var desk = document.querySelector('.desk');
  var door = document.querySelector('.door');
  
  // Armazena o conteúdo da Mesa Prof
  var deskContent = desk.innerHTML;
  
  // Troca o conteúdo entre a Mesa Prof e a Porta
  desk.innerHTML = door.innerHTML;
  door.innerHTML = deskContent;
}
// Final swapElements

