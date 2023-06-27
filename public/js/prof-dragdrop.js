  // Seleciona a DIV STUDENTS 
const studentsArea = document.querySelector(".students-area"); // Pega a Area que sera exibido os estudantes 
  // allStudents = TOTAL DE ALUNOS da planilha 
  // filter = metodo de array para testar algo especifico como A selectedCLASS
  // Neste caso a funçao do filter e fazer um test para a selectedclass e assim criar uma nova ARRAY para os alunos que estao na mesma classe 
  // O teste do filter esta dentro do ()
  // Students e o parametro da funçao e sera CADA OBJETO DA ARRAY  
  // student.class === selectedClass.lenght 
  // Esta linha acima significa   estamos acessando a propiedade CLASS do student e comparando com a SelectedClass 
  // === operador de igualdade ou seja conseguimos definir coisas se foram iguais ou nao 

  // Em resumo a funçao inteira testa a propiedade class do studend = student.class e IGUAL === a selectedClass 
  // Se for Verdade esse student passa no teste do FILTER e assim cria um novo ARRAY para a classe SELECIONADA 
  //  .lenght outro metodo de ARRAY , ele ira contar o total DA ARRAY FILTER = total de alunos com a mesma selected CLASS que passamos 
  // Resumindo const NumAlunos vai criar um novo array contendo apenas os estudantes cuja class seja igual a selectedClass 
  // por exemplo 7 alunos temos com a class 8anoA === SelectedClass 
  const numAlunos = allStudents.filter(student => student.class === selectedClass).length;
  // como temos 7 alunos com a classe 8anoA iremos usar o math.ceil para arrendondar , so que como ja esta arredondado
  // iremo pegar 7 / 5 que e igual = 1.4 math.ceil arredonda para 2 
  // = 2 COLUNAs PARA ACOMODAR  7 ALUNOS 
  const numColunas = Math.ceil(numAlunos / 5);
  // Atualiza o CSS para definir o número de colunas dinamicamente
  studentsArea.style.gridTemplateColumns = `repeat(${numColunas}, 1fr)`;
  // studentsArea = AREA DOS ESTUDANTES TOTAL 
  // style.gridtemplatecolumns singifica = Alteramos usando javascript o CSS = no NOSSO css por padrao esta 5 , mas sera alterado 
  // REPEAT nos permite repetir colunas ou linhas
  // $numColunas = numero de vezes que desejo repetir a COLUNA 
  // fr = unidade CSS = fraçao do espaço disponivel 
  // entoa 1fr = cada coluna tera o mesmo tamanho independente de ser 7 colunas ou 25 
  // pois esta setado como 1fr
  // Resumindo estamos utiliando este codigo para cada aluno apareça em sua propia coluna na studentsArea
  // e esta defininindo o numero de numColunas  para acomodar o tanto de alunos da classe selecionada 
  // e cada coluna so ira ter o mesmo tamanho por causa da fraçao dsponivel = 1
  
  
  
  function displayStudents(students) {
    studentsArea.innerHTML = "";
    selectedStudents = []; 
  
    // Aqui estamos falando que a totalspots e = o numero total de alunos da planilha   (students.lengh divido por 5  VEZES* 5 ) const totalSpots = 35
    // Math.ceil arredonda pois 31/5 = 6.2 math.ceil arredonda para 7, 7 vezes 5 = 35 
    const totalSpots = Math.ceil(students.length / 5) * 5;
  
    // Aqui estamos falando que a const emptyspots e igual Totalspots = 35 MENOS students.lengh = 31  que e IGUAL A 4 
    // Assim EMPTySPOTS = 4 
    const emptySpots = totalSpots - students.length; // Calcule o número de carteiras vazias
  
    for (let i = 0; i < totalSpots; i++) {
      const studentElement = document.createElement("div");
      studentElement.classList.add("student");
  
      if (i < students.length) {
        const studentImage = document.createElement("img");
        studentImage.src = students[i].imageUrl;
        studentImage.alt = students[i].name;
        studentImage.classList.add("student-image");
        studentElement.appendChild(studentImage);
  
        const studentName = document.createElement("span");
        studentName.textContent = students[i].name;
        studentName.classList.add("student-name");
        studentElement.appendChild(studentName);
        studentElement.setAttribute("id", `student-${i}`); // Adiciona um ID único a cada aluno
  
        // Adiciona o evento de clique para marcar/desmarcar o aluno
        studentElement.addEventListener("click", function () {
          if (selectedStudents.length >= 5 && !studentElement.classList.contains("selected")) {
            return; // Limita a seleção a apenas 5 alunos
          }
  
          studentElement.classList.toggle("selected");
          toggleStudentSelection(students[i], studentElement);
        });
        
      } else {
        studentElement.classList.add("empty-spot"); // Adicione esta linha para adicionar uma classe CSS aos espaços vazios
        studentElement.textContent = "VAZIO"; // Adicione esta linha para adicionar o texto "VAZIO" aos espaços vazios
      }
  
      studentsArea.appendChild(studentElement);
    }
  
    const studentCountElement = document.getElementById("student-count");
    studentCountElement.textContent = `Alunos: ${students.length}, Carteiras vazias: ${emptySpots}`;
  }
  
  function toggleStudentSelection(student, element) {
    const index = selectedStudents.findIndex(selected => selected.name === student.name);
    if (index > -1) {
      selectedStudents.splice(index, 1);
    } else {
      selectedStudents.push(student);
    }
    
    console.log(selectedStudents);
  }
    
    function handleDragStart(event) {
   
    }
    
    function handleDragOver(event) {
      
    }
  
   
    
    
    
    function handleDrop(event) {
     
    
    }
  
    function handleDragEnd(event) {
      
    } 