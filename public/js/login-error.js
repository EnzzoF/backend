// Carrega a pagina e exibe o ERROR
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'access_denied') {
        Swal.fire({
          allowOutsideClick: false,
            icon: 'error',
            title: 'Somente professores',
            text: 'Contate equipe de TE',
            html: 'Contate equipe de TE. <br> <a href="mailto:tecnologia@notredamecampinas.net.br" style="color: yellow;">tecnologia@notredamecampinas.net.br</a>',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "/";
            }
        });
    }
}