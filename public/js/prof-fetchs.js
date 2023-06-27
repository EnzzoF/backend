// fetchStudents , Função para buscar alunos de uma determinada classe
function fetchStudents(selectedClass) {
    const sheetName = selectedClass.replace(/ /g, ''); // Remove espaços em branco da classe selecionada
    fetch(`http://localhost:5500/students/${sheetName}`) // Adiciona o nome da aba na URL da chamada
        .then((response) => response.json())
        .then((students) => {
        displayStudents(students);
      })
      .catch((error) => {
        console.error('Erro ao buscar alunos, provável tabela não existente', error);
        Swal.fire({
                  icon: 'warning',
                  title: 'Erro ao buscar Sala <br> Contate Equipe TE',
                  text: 'Contate equipe de TE',
                  html: ' <a href="mailto:tecnologia@notredamecampinas.net.br" style="color: #ffae00;">tecnologia@notredamecampinas.net.br</a>',
                  confirmButtonColor: '#044c5c',
                })
});
} 
// Final fetchStudents 


// Enviar respostas dos alunos para  planilha 

function enviarResposta() {
  const selectedOptions = selectedStudents.slice(0, 5).map(student => student.name);
  
  const data = {
    userNameWithId: userNameWithId,
    selectedOptions: selectedOptions,
  };
  
  fetch('http://localhost:5500/send-response', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      console.log('Resposta enviada com sucesso');
    } else {
      console.error('Erro ao enviar resposta');
    }
  })
  .catch(error => {
    console.error('Erro ao enviar resposta', error);
  });
}



// Adicionando eventos de cliques para enviar e fechar 
document.getElementById('insertAlunos').addEventListener('click', function() {
// Mostra o formulário quando o botão é clicado
document.getElementById('student-form').style.display = 'block';
});
// Adiciona um evento de clique ao botão para fechar o formulário
document.getElementById('close-form').addEventListener('click', function(event) {
// Oculta o formulário quando o botão X é clicado
document.getElementById('student-form').style.display = 'none';
event.preventDefault();
});
// Adicione uma funçao a o SUBMIT para enviar
document.getElementById('student-form').addEventListener('submit', function(event) {
event.preventDefault(); // Impede o envio padrão do formulário

const studentName = document.getElementById('student-name').value;
const studentRa = document.getElementById('student-ra').value;
const className = document.getElementById('class-name').value;

    // Verifica se os campos estão vazios antes de enviar
if (studentName == "" || studentRa == "") {
  Swal.fire({
    icon: 'warning',
    title: 'Preencha todos os campos',
    confirmButtonColor: '#044c5c',
  });
      return;  // Interrompe a execução da função se os campos estão vazios
    }
    // Verifica o RA para ter 8 numeros 
if (!/^\d{8}$/.test(studentRa)) {
  Swal.fire({
    icon: 'warning',
    title: 'Apenas 8 digitos o RA',
    confirmButtonColor: '#044c5c',
  });
      return;
    }
    // Mensagem de Confirmaçao
    const confirmMessage =
  'Por favor, confirme os detalhes:\n\n' +
  'Nome do Aluno: <u>' + studentName + '</u>\n' +
  'RA do Aluno: <u>' + studentRa + '</u>\n\n' +
  'Estão corretos?';

    Swal.fire({
      title: confirmMessage,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      confirmButtonColor: '#044c5c',
    }).then((result) => {

// Se o OK for clicado ira chamar o FECTH
if (result.isConfirmed) {
        // Fetch para o ENDPOINT para inserir alunos a planilha
        fetch('http://localhost:5500/students', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: studentName,
            ra: 'N: ' + studentRa,
            className: className 
          }),
        })
        
          .then(response => {
            if (response.ok) {
              return response.text();
            } else {
              throw new Error('Erro ao inserir aluno');
            }
          })

         // Tratamento 200 = OK
          .then(data => {
            Swal.fire({
              title: 'Sucesso',
              html: 'Aluno inserido com sucesso',
              icon: 'success',
              confirmButtonColor: '#044c5c',
            });
          })

          // Tratamento de erro
          .catch((error) => {
            console.error('Erro:', error);
            Swal.fire({
              title: 'Error',
              html: 'Erro ao inserir aluno',
              icon: 'error',
              confirmButtonColor: '#044c5c',
            });
          });

  } // End IF
  });
  });

 // Fetch e Funçao para ENVIAR EMAIL 

const sendButton = document.getElementById('sendButton');
const cancelButton = document.getElementById('cancelButton');
sendButton.addEventListener('click', sendEmail);
  
function sendEmail() {
// Obter os valores dos campos de input
const email = document.getElementById('nameInput').value;
const assunto = document.getElementById('subjectInput').value;
const arquivo = document.getElementById('fileInput').files[0];

  // Verifica se todos os campos foram preenchidos
  if (!email || !assunto || !arquivo) {
    Swal.fire({
      title: 'Por favor',
      html: '<p style="color: #ffae00;">Preencha Todos os campos !</p>',
      icon: 'error',
      confirmButtonColor: '#044c5c'
    });
    return; // NAO PERMITE ENVIAR
  }

  // Verifica se o email tem um formato válido usando expressao reg REGEX
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!regex.test(email)) {
    Swal.fire({
      title: 'Erro',
      html: '<p style="color: #ffae00;">Por favor, insira um email válido</p>',
      icon: 'error',
      confirmButtonColor: '#044c5c',
    });
    return; // NAO PERMITE ENVIAR 
  }

  // Criar um objeto FormData para enviar os dados do formulário
  const formData = new FormData();
  formData.append('email', email);
  formData.append('assunto', assunto);
  formData.append('arquivo', arquivo);
  
  // Mostra o indicador de carregamento
Swal.fire({
  title: 'Enviando Email...',
  allowOutsideClick: false, 
  showConfirmButton: false,
  didOpen: () => {
  Swal.showloading();
  } 
 });

  fetch('http://localhost:5500/send-email', {
    method: 'POST',
    body: formData, 
  })

  .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na resposta do servidor");
      }
      return response.json();
    })
    // Mensagem de SUCESSO
    .then((data) => {
    // Fecha o indicador de carregamento
      Swal.close();
      Swal.fire({
        title: 'Sucesso',
        html: '<p style="color: #ffae00;">' + data.message + '</p>',
        icon: 'success',
        confirmButtonColor: '#044c5c',
      }).then((result) => {
        document.getElementById('sendModal').style.display = 'none';
      }
      );
    })
    // Caso Houver algum ERRO 
    .catch((error) => {
      // Fecha o indicador de carregamento
      Swal.close();
      Swal.fire({
        title: 'Erro',
        html: '<p style="color: #ffae00;">Erro ao enviar email: ' + error + '</p>',
        icon: 'error',
        confirmButtonColor: '#044c5c',
      });
      console.error('Erro ao enviar email:', error);
    });
}
    // Adiciona Evento de click 
  cancelButton.addEventListener('click', () => {
    // Fechar o modal e limpar os campos de input
    document.getElementById('sendModal').style.display = 'none';
    document.getElementById('nameInput').value = '';
    document.getElementById('subjectInput').value = '';
    document.getElementById('fileInput').value = '';
  });
  // FINAL FETCH ENVIAR EMAIL

  