/*

autor: Marcos Felipe da Silva Jardim

Objetivo: Reune as principais tags e as exibe pelas chamadas das funcoes
------------------------------------------------------------------------------------
Revisao de codigo:

rev1.0 27-08-2018

************************* ------ CLASSES ------ ******************************************
*/
var testeRelease = '';
// Classe pai para as propriedade classe, id e conteudo
var ClasseId = function(conteudo, classe, id){
	this.conteudo = conteudo ? conteudo : '';
	this.classe = classe ? classe : '';
	this.id = id ? id : '';
	this.attr = new Array();
}

ClasseId.prototype.setClasse = function(classe){ if(classe){this.classe  = classe;} };
ClasseId.prototype.setId = function(id){if(id){this.id = id;} };
ClasseId.prototype.getClasse = function(){ return this.classe;};
ClasseId.prototype.getId = function(){ return this.id;};
ClasseId.prototype.addAtributo = function(atributo){ if(atributo){ this.attr.push(atributo);} };
ClasseId.prototype.getConteudo = function(){ return this.conteudo;};
ClasseId.prototype.setConteudo = function(conteudo){ if(conteudo){this.conteudo = conteudo;} };
ClasseId.prototype.getAtributo = function(){
	let at = '';
	this.attr.forEach(function(e){ at += " "+ e; });
	return at;
}

// Classe que cria uma instancia de Paragrafo
var Para = function(conteudo, classe, id){ClasseId.call(this, conteudo, classe, id);}

Para.prototype = new ClasseId();
Para.prototype.constructor = Para;
Para.prototype.setPara = function(conteudo){ this.conteudo = conteudo; }
Para.prototype.getPara = function(){
	let atributos = this.getAtributo();
	return '<p class="'+this.classe+'" id="'+this.id+'" '+atributos+ ' >'+this.conteudo+'</p>'; 
};

// Classe que cria uma instancia do titulo
var Titulo = function(conteudo, tamanho, classe, id){ClasseId.call(this, conteudo, classe, id);this.tamanho = tamanho > 0 ? tamanho : 1;}

Titulo.prototype = new ClasseId();
Titulo.prototype.constructor = Titulo;
Titulo.prototype.setTitulo = function(titulo){ this.conteudo = titulo; }
Titulo.prototype.getTitulo = function(){
	var atributos = '';	
	for(var i = 0;i < this.attr.length;i++){ 
		atributos += ' ' +this.attr[i]; 
	} 
	return '<h'+this.tamanho+' class="'+this.classe+'" id="'+this.id+'" '+atributos+ ' >'+this.conteudo+'</h'+this.tamanho+'>'; 
};

// Classe que cria uma instancia de uma Div comum
var Div = function(conteudo, classe, id){ClasseId.call(this, conteudo, classe, id);}; 

Div.prototype = new ClasseId();
Div.prototype.constructor = Div;
Div.prototype.getDiv = function(){
	var atributos = ''; 
	for(var i = 0;i < this.attr.length;i++){ 
		atributos += ' ' +this.attr[i]; 
	} 
	return '<div class="'+this.classe+'" id="'+this.id+'" '+atributos+ ' >'+this.conteudo+'</div>'; 
};

// Classe que cria uma instancia de Img
var Img = function(conteudo, classe, id){ ClasseId.call(this, conteudo, classe, id);}; 
Img.prototype = new ClasseId(); 
Img.prototype.constructor = Img; 
Img.prototype.getImg = function(){ 
	var atributos = ''; 
	for(var i = 0;i< this.attr.length;i++){
		atributos += ' ' +this.attr[i];
	} 
	return '<img src="'+this.conteudo+'" class="'+this.classe+'" id="'+this.id+'" '+atributos+' />';
};

// Classe que instancia uma tabela
var Tabela = function(cabecalho, corpo, classe, id, classeCabecalho){
	this._rodape = [];  // Rodape
	this._cabecalho; // Atributo do cabecalho
	this._classeCabecalho = classeCabecalho; // Define uma classe para o cabecalho
	this._corpo = Array.isArray(corpo)  && Array.isArray(corpo[0]) ? corpo : [[]];  // Define um corpo
	this._estiloTd = ''; // Recebe estilos do TD
	ClasseId.call(this, '', classe, id); // Define os atributos classe e id
	this._idDataTables = ''; // id do datatables
	this._opcoes = {"bPaginate": false, "ordering" : true,"colReorder" : true, "scrollY": 250, "scrollCollapse": true,
  "scrollX": true, "info" : false, "responsive": true,"autoWidth": false,
  "search" : {"regex": true }, retrieve: true, "language": { "search": "Procurar na tabela",
	"emptyTable" : "Nao ha dados", "zeroRecords": "Sem registros com valor informado","decimal":",","thousands":"."}};
	this.setCabecalho(cabecalho);// Define o cabecalho
}

Tabela.prototype = new ClasseId();
Tabela.prototype.constructor = Tabela; 

// Metodo para definir o cabecalho
Tabela.prototype.setCabecalho = function(cabe){
	if(!Array.isArray(cabe)){
		throw new SyntaxError(`FAVOR ENVIAR SOMENTE ARRAYS PARA O CABECALHO.VALOR ENVIADO ${JSON.stringify(cabe)}`);
	} else if(!Array.isArray(this._corpo[0]) || (this._corpo[0].length !== 0 && this._corpo[0].length !== cabe.length)){
		throw new SyntaxError(`NÃO PODE SER ENVIADO UM CABECALHO DE TAMANHO DIFERENTE DO CORPO ATUAL ${JSON.stringify(cabe)}`);
	}
	this._cabecalho = cabe;
	return true;
}
// Define o corpo da tabela, o mesmo deve estar alinhado com o tamanho do cabecalho<>
Tabela.prototype.setCorpo = function(corpo){
	// Verificando se o corpo é um array e seu conteudo é um array também
	if(Array.isArray(corpo) && Array.isArray(corpo[0])){
		corpo.forEach((e,i) =>{
			if(e.length !== this._cabecalho.length){
				throw new SyntaxError(`FALHA, UM DOS REGISTROS TEM O TAMANHO DIFERENTE DO CABECALHO:
				 REGISTRO ${i} VALOR DO ARRAY:${JSON.stringify(e)}`);
			}
		});
			this._corpo = corpo;
			return true;
	} else {
		console.log("O corpo enviado não é um array ou não contém um array alinhado.");
	}
}
// Obtem uma tabela de forma simples <>
Tabela.prototype.getTabela = function(){
	let tabe = `<div class="tabe table-responsive small"><table class="${this.classe}" id="${this.id}">`; 
	let corpo = '<tbody>'; 
	let cabe = `<thead><tr class="${this._classeCabecalho}">`; 
	//let cabecalho = this._cabecalho; 
	// Fazer um loop sobre o corpo para criar os tr
	this._corpo.forEach(e=>{
		let tr = '<tr>';
		e.forEach(eInterno=>{ tr += `<td style="${this._estiloTd}">${eInterno}</td>`; });
		tr += '</tr>';
		corpo += tr;
	});

	corpo += '</tbody>'; 
	this._cabecalho.forEach(e=>{ cabe += `<th>${e}</th>`; });
	cabe += '</tr></thead>';
	// Criando rodape se existir
	if(this._rodape.length === this._cabecalho.length){
		corpo +='<tfoot><tr>';
		this._rodape.forEach(e1=>{ corpo += `<td>${e1}</td>`; });
		corpo += '</tr></tfoot>';
	}
	// Montando as strings das tabela e retornando
	tabe += cabe + corpo + '</table></div>'; 
	return tabe; 
};
// Metodo para obter o dataTables
Tabela.prototype.getIdDataTable = function(){
	return this._idDataTables;
}
// Metodo que cria uma tabela dinamica recebendo a coluna chave e as colunas de valores monetarios
Tabela.prototype.getTabelaDinamica = function(colunaChave, arrayValoresMonetarios, campoMovidoAbaixo){
	// Verifica se a coluna chave existe no corpo
	if(this._corpo[0][colunaChave] === null){
		return 'A coluna informada não existe';
	}
	// Tá coluna ok, agora verifica se o arrayValoresMonetarios se é um array
	if(!(Array.isArray(arrayValoresMonetarios))){
		return 'O arrayValoresMonetarios não é um array, então não é possivel determinar quais serao as colunas monetarias';
	}
	// Criando a lista arrChave
	let arrChave = {};
	// Fazendo um loop para criar as chaves únicas
	this._corpo.forEach((e1,i1)=>{
		// Recupera o valor da coluna a ser filtrada
		let valor = this.corpo[x][colunaChave];
		// Se ele nao contiver a chave, vamos cria-la
		if(typeof arrChave[valor] == "undefined"){
			arrChave[valor] = [];
			// Realizar a copia deste array
			let arrTemp = JSON.stringify(e1);
			arrTemp = JSON.parse(arrTemp);
			arrTemp[campoMovidoAbaixo] = "- -";
			// Apendando este array copiado
			arrChave[valor].push(arrTemp); // Chaves preenchidas
			// Agora fazer um loop sobre o arrayMonetario, para zerar os campos que foram informados
			arrayValoresMonetarios.forEach((e2, i2) => {
				let indiceM = arrayValoresMonetarios[i2];
				//Atribuindo o valor
				arrChave[valor][0][indiceM] = 0.00;
			});
		}
	});
	
	// Agora este é o segundo loop para gerar o total ao arrChave
	this._corpo.forEach((e1,i1) =>{
		let valor = this._corpo[i1][colunaChave];
		// Agora fazer um loop sobre o arrayMonetario, para zerar os campos que foram informados
		arrayValoresMonetarios.forEach((e2, i2) =>{
			let indiceM = arrayValoresMonetarios[i2];
			arrChave[valor][0][indiceM] += e1[indiceM];
		});
	});

	// Pronto, agora temos o array com os totais, vamos apendar este objeto
	// para que ele receba os subregistros de this._corpo
	this._corpo.forEach((e1,i1)=>{
		// Recupera o valor da coluna a ser filtrada
		let valor = e1[colunaChave];
		// Criando o arrayTemp que armazena dados do array corpo
		let arrTemp = JSON.stringify(e1);
		arrTemp = JSON.parse(arrTemp);
		// Substituir o campo da coluna chave pelo valor do campoMovidoAbaixo
		arrTemp[colunaChave] = arrTemp[campoMovidoAbaixo];
		arrTemp[campoMovidoAbaixo] = "- -";
		// Apendando este array copiado
		arrChave[valor].push(arrTemp);
	});

	
	// BOM, TUDO ESTA SOMADO E INCLUSO NO ARRCHAVE, VAMOS AGORA DEFINIR OS VALORES MONETARIOS
	for(let z in arrChave){
		// Fazer um loop sobre os array para alterar os valores para monetarios
		arrChave[z].forEach((e1, i1)=>{
			arrayValoresMonetarios.forEach((e2,i2)=>{
				let indiceM = e2;
				// Atribuindo o valor
				arrChave[z][i1][indiceM] = converter(parseFloat(arrChave[z][i1][indiceM]).toFixed(2));
			});
		});
	}
	
	let tabe = `<table class="${this.classe}" id="${this.id}">`; 
	let corpoTabela = '<tbody>';
	let cabe = `<thead><tr class="${this.classeCabecalho}">`; 
	let cabecalho = this._cabecalho; 
	// Fazendo um loop no rodape(caso exista para dar valores monetarios para os campos marcados)
	if(this._rodape.length === this._cabecalho.length){
		arrayValoresMonetarios.forEach((e2,i2)=>{
			let vl = converter(parseFLoat(this._rodape[i2]).toFixed(2));
			this._rodape[i2] = vl;
		});
	}
	
	// OK, sta tudo certo, agora vamos criar o corpo desta tabela
	for(let reg in arrChave){
		let ID = arrChave[reg][0][colunaChave].replace(/ /g,'_');
		// Vamos fazer um loop sobre cada registro afim de preencher os trs
		for(let x = 0;x < arrChave[reg].length;x++){
			// Se x for igual a zero, este é o registro mestre, precisa ser clicavel e ter um id com o nome do campocoluna informado
			let TR = '';
			if(x == 0){
				TR = `<tr id="${ID}" style="color:red;font-weight:bold;cursor:pointer">`;
			} else {
				TR = `<tr class="${ID}" style="display:none">`;
			}
			
			// Vamos fazer um loop sobre cada campo do registro e incluir o td de cada um
			for(let y = 0;y < arrChave[reg][x].length;y++){
				TR += `<td>${arrChave[reg][x][y]}</td>`;
			}
			TR += '</tr>';
			corpoTabela += TR;
		}
	}
	corpoTabela += '<tbody>';
	for(let i = 0;i < cabecalho.length;i++){ 
		cabe += `<th>${cabecalho[i]}</th>`; 
	} 
	cabe += '</tr></thead>';
	// Verificando se tem rodape, se tiver cria-lo, senão deixe sem ele
	if(this.rodape.length == cabecalho.length){
		corpoTabela += `<tfoot><tr class="${this.classeCabecalho}">`;
		for(let x = 0;x < this.rodape.length;x++){
			corpoTabela += `<th>${this.rodape[x]}</th>`;
		}
		corpoTabela += '</tr></tfoot>';
	}
	
	tabe += cabe + corpoTabela + '</table>';
	return tabe; 
}
// Metodo da tabela dinamica que liga o evento de click para exibir os registros ocultos
Tabela.prototype.clickTabelaDinamica = function(){
	$('tbody tr').each(function(){
		if(typeof $(this).attr('id') === "undefined"){

		} else {

			// Ligando o evento click a cada ID de TR
			let ID = $(this).attr('id');

			$('#'+ID+' td').bind('click', function(){
				$('.'+ID).slideToggle();
				$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
			});
		}
	});
}
// Metodo que vai adicionar um rodape a tabela se o mesmo for do mesmo tamanho que o cabecalho <>
Tabela.prototype.setRodape = function(arrayRodape){
	if(!Array.isArray(arrayRodape)){
		new SyntaxError(`O QUE FOI ENVIADO NAO E UM ARRAY.VALOR ENVIADO: ${arrayRodape}`);
		return false;
	}
	if(arrayRodape.length !== this._cabecalho.length){
		new SyntaxError(`O RODAPE ENVIADO E DIFERENTE DO TAMANHO DO CABECALHO DA TABELA. VALOR ENVIADO ${arrayRodape}`);
		return false;
	}
	this._rodape = JSON.parse(JSON.stringify(arrayRodape));
	return true;
}
// Define a classe do cabecalho da tabela (thead) <>
Tabela.prototype.setClasseCabecalho = function(classe){
	if(typeof classe === "string"){ this._classeCabecalho = classe; return true; } 
	console.log(`ENVIOU UM ESTILO QUE NAO E UMA STRING ${classe}`);
	return false;
};
// Metodo para definir um estilo para os tds
Tabela.prototype.setEstiloTd = function(estiloTd){
	if(typeof estiloTd === "string"){ 
		this._estiloTd = estiloTd; return true; 
	} else if(typeof estiloTd === "object"){
		let estilo = "";
		for(let k in estiloTd){
			estilo += `${k}:${estiloTd[k]}`;
		}
		this._estiloTd = estilo;
		return true;
	} else {
		console.log(`ENVIOU UM ESTILO QUE NAO E UMA STRING ${estiloTd}`);
		throw new SyntaxError("FAVOR ENVIAR UMA STRING OU UM OBJETO COM ESTILOS");
	}
}

// Metodo interno usado para validar um indice
Tabela.prototype._validaIndice = function(index, msg){
	let valido = true;
	this._corpo.forEach(e1=>{
		if(typeof e1[index] === "undefined"){
			valido = false;
			return valido;
		}
	});
	if(!valido){
		throw new SyntaxError(`INDICE SOLICITADO NAO EXISTE: ${msg} -> ${index}`);
	}
	return valido;
};

// Metodo que exclui uma determinada coluna Ele recebe o index da coluna e a exclui gerando um novo corpo e cabecalho. <>
Tabela.prototype.removeColuna = function(index){
	// Verifica se a coluna existe
	this._validaIndice(index, 'IMPOSSSIVEL REMOVER ');		
	// O indice existe, vamos recriar o corpo
	this._corpo.forEach(e1=>{ e1.splice(index,1); });
	// Agora removendo o indice do cabecalho
	this._cabecalho.splice(index,1);
	// Tudo correto, retorne true.
	return true;
};
// Metodo usado para converter os monetarios da tabela <>
Tabela.prototype.converterMonetario = function(index){
	let valido = true;
	// Verifica se a coluna existe
	this._validaIndice(index, "NAO FOI POSSIVEL CONVERTER");
	// O indice existe, vamos fazer um loop para converter o corpo em monetario
	this._corpo.forEach((e1, i1) => {
		// Se o valor nao for um number, vamos dizer que nao foi possivel converter
		if(typeof e1[index] === "number"){
			this._corpo[i1][index] = converter(parseFloat(e1[index]).toFixed(2));
		} else if(e1[index].search('R\\$') != -1){// Ja foi convertido
			console.log('NAO PRECISA CONVERTER, JA E UM NUMERO');
		} else {
			console.log('NÃO FOI POSSIVEL CONVERTER POIS A COLUNA INFORMADA NAO E UM NUMERO');
			valido = false;
		}
	});
	// Tudo correto, retorne true.
	return valido;
}
// Metodo usado para converter valores para Percentuais de 1 casa <>
Tabela.prototype.converterPercentual = function(index){
	let valido = true;
	// Verifica se a coluna existe
	this._validaIndice(index);
	// O indice existe, vamos fazer um loop para converter o corpo em percentual
	this._corpo.forEach((e1, i1) =>{
		// Se o valor nao for um number, vamos dizer que nao foi possivel converter
		if(typeof e1[index] === "number"){
			this._corpo[i1][index] = Math.round(parseFloat(e1[index] * 100).toFixed(1), 1) + ' %';
		} else if(e1[index].search('\\%') != -1){// Ja foi convertido
			console.log('NAO PRECISA CONVERTER, JA E UM PERCENTUAL');
		} else {
			console.log('NÃO FOI POSSIVEL CONVERTER POIS A COLUNA INFORMADA NAO E UM NUMERO');
			valido = false;
		}
	});
	// Tudo correto, retorne true.
	return valido;
}
// Metodo usado para retornar cabecalho e corpo de dados filtrados. Recebe uma string para filtro e retorna [[cabecalho][corpo],[corpo]] <>
Tabela.prototype.filtro = function(palavra){
	// Cria um novo array para criar o novo corpo com os dados filtrados.
	let filtrados = new Array();
	this._corpo.forEach(e1=>{
			e1.forEach((e2, i2)=>{
				if(e2.toString().search(palavra) != -1){
					filtrados.push(e1);
				}
			});
	});
	// Retorna um array com o cabecalho e o corpo com os dados filtrados.
	if(filtrados.length === 0){ return []; } 
	else { return [this._cabecalho, filtrados]; }
};
// Metodo usado para realizar um copia da coluna solicitada e retorna-la
Tabela.prototype.getColuna = function(indice) {
	if(typeof indice !== "number"){
		throw new SyntaxError('FAVOR INFORMAR UM INDICE INICIANDO DO ZERO.');
		console.log('FAVOR INFORMAR UM INDICE INICIANDO DO ZERO.');
		return false;
	}
	let arrTemp = [];
	this._corpo.forEach(e1=>{
		arrTemp.push(e1[indice]);
	});
	return arrTemp;
};

// Metodo usado para realizar copia de colunas solicitadas e retorna-las
Tabela.prototype.getColunas = function(arrIndice){
	if(!Array.isArray(arrIndice)){
		console.log('FAVOR INFORNAR UM ARRAY DE INDICES.');
		return false;
	}
	let arrTemp = [];
	this._corpo.forEach((e1,i1)=>{
		arrTemp[i1] = [];
		e1.forEach((e2, i2)=>{
			if(arrIndice.indexOf(i2) != -1){
				arrTemp[i1].push(e2);
			}
		});
	});
	return arrTemp;
};
// Metodo que recebe o apoio da biblioteca Datatable e coloca a tabela de forma representativa na tela <>
Tabela.prototype.desenhaDataTable = function(){
	// Destruindo a tabela se ela existir
	try{
		$('#'+this.id).DataTable().destroy();
		this._idDataTables = $('#'+this.id).DataTable(this._opcoes);
		return true;
	}catch(e){
		alert('VOCE PRECISA IMPORTAR A API DO DATATABLES PARA USAR ESTE RECURSO');
		return false;
	}
};
// Metodo usado para definir as opcoes do DataTable, quando deseja enviar opcoes personalizadas
Tabela.prototype.setOpcoes = function(opcoes){
	if(typeof opcoes === "object"){
		this.opcoes = opcoes;
		return true;
	} 
	console.log(`OS DADOS ENVIADOS NAO SAO UM OBJETO ${opcoes}`);
	return false;
}
// Metodo que calcula o rodape passando por todo o corpo
Tabela.prototype.calculaRodape = function(camposNaoCalculaveis, valorCamposNaoCalculaveis, camposMonetarios){
	let arrTempRodape = [];
	// Fazer um loop para criar o rodape e inicializa-lo em zero
	this._cabecalho.forEach(e=>{ arrTempRodape.push(0); });
	
	// Faz um loop sobre o corpo e então calcula o rodape
	if(!Array.isArray(this._corpo[0]) || !Array.isArray(this._cabecalho)){
        console.log('Ainda nao foi definido um corpo e/ou cabecalho');
        return false;
    }
	// Pronto, temos o corpo e o cabecalho, agora vamos ver se o camposNaoCalculaveis é um array
	if(!Array.isArray(camposNaoCalculaveis) || !Array.isArray(camposMonetarios) || (camposNaoCalculaveis.length !== valorCamposNaoCalculaveis.length)){
		console.log('Os parametros enviados não são um array, ou tamanhos incompativeis entre o parametro 1 e 2');
		return false;
	}
	// Preparando o rodape dos valores que nao devem ser calculados
	camposNaoCalculaveis.forEach(e=>{ arrTempRodape[e] = valorCamposNaoCalculaveis[e]; });
	// Faz um loop, desconverte os monetarios e soma os rodapes corretamente
	this._corpo.forEach((e,i) => {
		e.forEach((e2, i2)=>{
			// Se nao faz parte dos camposNaoCalculaveis entao devemos analisar
			if(!camposNaoCalculaveis.includes(i2)){
				let valor = e2; // desconverter os monetarios se tiver algum
				if(camposMonetarios.includes(i2)){
					if(typeof e2 === "number"){ valor = parseFloat(e2).toFixed(2); } 
					else { valor = desconverter(e2); }
				}
				arrTempRodape[i2] += valor; // Soma o valor, sendo o que foi convertido a monetario ou nao
				
			}
		});
	});
	// Converte os valores do rodape para ficarem corretos
	camposMonetarios.forEach(e=>{
		arrTempRodape[e] = converter( parseFloat(arrTempRodape[e]).toFixed(2) );
	});
	// Tudo certo, agora defina o rodape com este valor
	this.setRodape(arrTempRodape);
	return true;
}
// Metodo que coloca um botao para baixar a tabela
Tabela.prototype.baixarEmExcel = function(nomeArmazenamentoLocal, localParaBaixar){
	// Valida par aver se os parametros foram preenchidos
	if(typeof localParaBaixar === "undefined"){ alert('INFORME DE ONDE RECUPERAR O EXCEL'); return false;}
	// Salva o ID do botao
	let idBotao = '#'+this.id+'_botao';
	let idTabela = '#'+this.id;
	// Verifica se a tabela nao existir, nem prosseguir
	if($(idTabela).length < 1){ alert('ESTA TABELA NAO EXISTE '+idTabela); return false; }

  	// Verificar se o botao existe e se da para colocar ele no local correto
  	if($(idBotao).length < 1 && $(idTabela+'_wrapper').length){ 
  		// Nao existe, vamos criar o Elemento
  		$(idTabela+'_wrapper').prepend(new Botao('<span class="glyphicon glyphicon-download-alt"></span> BAIXAR', 'btn btn-xs btn-danger', idBotao.replace('#', '')).getBotao());
  	}
  	// Se a tabela nao tiver dados, vamos retornar false
  	if($(idTabela+' tbody tr').length < 1){ alert('ESTA TABELA NÃO TEM DADOS '+idTabela); return false;}
  	// Desativando o evento de click, se o botao o tiver
  	$(idBotao).unbind('click');
  	// Se clicar em baixar o customizado, vamos baixa-lo
  	$(idBotao).bind('click', function(e){
    	e.preventDefault();
    	// Vendo se tem o armazenamento local
    	if(typeof(Storage) === "undefined"){ 
      		alert('NÃO será possivel salvar as colunas desejadas para baixar.');
      		// Agora criar o objeto que vai comportar o cabecalho e o corpo da tabela
        		let objTabelaBaixar = {'cabe':[], 'corpo':[]};
        	$(idTabela+' thead tr').children().each(function(i,v){
            	objTabelaBaixar.cabe.push($(this).text());
        	});
        	$(idTabela+' tbody').children().each(function(i,v){
            	let tempQ = [];
            	$(this).children().each(function(ia,va){
                	tempQ.push($(this).text());
            	});
            	objTabelaBaixar.corpo.push(tempQ);
        	});

        	// Agora despachando o objeto para o servidor, que vai captura-lo e retornar a planilha em excel
        	$.ajax({method:'POST', url:localParaBaixar, 
        		data:{'objeto':JSON.stringify(objTabelaBaixar)}
        	}).done(function(data){
            	window.location.href = data;
        	}).fail(function(){
          		alert('ERRO AO BAIXAR EM EXCEL. SE PERSISTIR ENTRAR EM CONTATO COM O ADMINISTRADOR DO SITE.');
        	});
        	return false;
    	}
	    // Verificamos se temos dados no armazenamento interno
	    let asColunasSelecionadas = [];
	    if(localStorage.getItem(nomeArmazenamentoLocal)){
	      asColunasSelecionadas = JSON.parse(localStorage.getItem('colunas_selecionadas'));
	    }
	    // Recupera todas as colunas e permite o usuario a escolher quais ele quer
	    let tempA = '';let entrada = '<input class="checa_colunas" type="checkbox" value="indice" /> VALOR<br/>';
	    $(idTabela+' thead tr').children().each(function(ind, val){
	        if(asColunasSelecionadas.indexOf(Number(ind).toString()) != -1){
	          tempA += `<input class="checa_colunas" checked type="checkbox" value="${ind}" />${$(this).text()}<br/>`;
	        } else {
	          tempA += entrada.replace('VALOR', $(this).text()).replace('indice', ind);
	        }
	    });
	    tempA += `<p class="text-center">${new Botao('BAIXAR', 'btn btn-xs btn-danger', 'baixar_selecionados').getBotao()}</p>`;
	    // Agora cria o modal permitindo que o usuario escolhas as colunas que ele deseja fazer o download
	    let modTitulo = new Titulo('ESCOLHA AS COLUNAS A BAIXAR', 4, 'text-center text-danger').getTitulo();
	    let modRodape = '<button class="btn btn-xs btn-default" data-dismiss="modal">FECHAR</button>';
	    let mod = new Modal(modTitulo, tempA, modRodape, '', 'modalExcel');
	    mod.setTipoModal(true);
	    $('#modalExcel').remove();
	    $('body').append(mod.getModal());
	    mod.executaModal();

	    // Clica no botao para baixar_selecionados e então é permitido gerar um excel disto
	    $('#baixar_selecionados').bind('click', function(e){
	        let $_CHECADOS = $('.checa_colunas');
	        let escolhidas = [];
	        $($_CHECADOS).each(function(ind,val){
	            if($(this).prop('checked')){ escolhidas.push($(this).val()); }
	        });

	        localStorage.setItem(nomeArmazenamentoLocal, JSON.stringify(escolhidas));
	        // Agora criar o objeto que vai comportar o cabecalho e o corpo da tabela
	        let objTabelaBaixar = {'cabe':[], 'corpo':[]};
	        // Obtendo o cabecalho
	        $(idTabela+' thead tr').children().each(function(ind, val){
	            if(escolhidas.indexOf(Number(ind).toString()) != -1){
	              objTabelaBaixar.cabe.push($(this).text());
	            }
	        });
	        // Agora obtendo o corpo
	        $(idTabela+' tbody').children().each(function(i, v){
	          // Passando pelos filhos do registro
	          let tempInternoTab = [];
	          $(this).children().each(function(ix, vx){
	              if(escolhidas.indexOf(Number(ix).toString()) != -1){
	                tempInternoTab.push($(this).text());
	              }
	          });
	          objTabelaBaixar.corpo.push(tempInternoTab);
	        });

	        $('[data-dismiss="modal"]').trigger('click');

	        // Agora despachando o objeto para o servidor, que vai captura-lo e retornar a planilha em excel
	        $.ajax({method:'POST', url:localParaBaixar, data:{'objeto':JSON.stringify(objTabelaBaixar)}
	        }).done(function(data){
	            window.location.href = data;
	        }).fail(function(){
	          alert('ERRO AO BAIXAR EM EXCEL. SE PERSISTIR ENTRAR EM CONTATO COM O ADMINISTRADOR DO SITE.');
	        });
	    });
    });
}

// Classe que instancia um link
var Link = function(link, conteudo, classe, id){ this.link = link; ClasseId.call(this, conteudo, classe, id);}

Link.prototype = new ClasseId(); 
Link.prototype.constructor = Link; 
Link.prototype.getLink = function(){
	var atributos = '';
	for(var i = 0;i< this.attr.length;i++){ 
		atributos += ' ' +this.attr[i];
	} 
	return '<a href="'+this.link+'" class="'+this.classe+'" id="'+this.id+'" '+atributos+' >'+this.conteudo+'</a>';
};

// Classe utilizada para criar listas ordenadas ou não ordenadas
var Lista = function(itens, ordenada, classe, id){ this.itens = itens instanceof Array ? itens : []; this.ordenada = ordenada ? 'ol' : 'ul'; ClasseId.call(this, '', classe, id); }

Lista.prototype = new ClasseId();
Lista.prototype.constructor = Lista;
Lista.prototype.getLista = function(){
	var lista = ''; 
	var atributos = '';
	for(var i = 0;i< this.attr.length;i++){ 
		atributos += ' ' +this.attr[i];
	} 
	var itens = this.itens; 
	for(var i = 0;i < itens.length;i++){ 
		lista += '<li>'+itens[i]+'</li>'; 
	} 
	return '<'+this.ordenada+' class="'+ this.classe + '" id="'+this.id+'" '+atributos+' >'+lista+'</'+this.ordenada+'>';
};

// Classe utilizada para criar botoes
var Botao = function(conteudo, classe, id){ ClasseId.call(this, conteudo, classe, id);}

Botao.prototype = new ClasseId(); 
Botao.prototype.constructor = Botao;
Botao.prototype.getBotao = function(){
	var atributos = ''; 
	for(var i = 0;i< this.attr.length;i++){ 
		atributos += ' ' +this.attr[i];
	} 
	return '<button class="'+this.classe+'" id="'+this.id+'" '+atributos+' >'+this.conteudo+'</button>'; 
}

// CLASSE QUE CRIA FORM.SELECTS
var Selecao = function(nome, classe, id){
	this.itens = [];
	this.nome = nome;
	this.autoSelecionado;
	ClasseId.call(this, "",classe, id);
};

Selecao.prototype = new ClasseId();

// Metodo utilizado para incluir um item no array
Selecao.prototype.addItem = function(arrayItem){
	if(arrayItem instanceof Array && arrayItem.length == 2){
		this.itens.push(arrayItem);
	} else {
		console.log("É necessario enviar um array com dois itens, um sendo o valor e outro o rotulo");
	}
};

// Metodo utilizado para incluir um array com arrays de itens
Selecao.prototype.addItens = function(arrayItens){
	if(arrayItens instanceof Array && arrayItens[0] instanceof Array){
		for(var x = 0;x < arrayItens.length;x++){
				this.itens.push(arrayItens[x]);
		}
	} else {
		console.log("É necessario enviar arrays aninhados, sendo que cada um deles deve ter o tamanho de 2. EX: [['hora','HORAS'],['dia','DIAS']]");
	}
}

// Metodo utilizado para retornar um  select usando os dados repassados
Selecao.prototype.getSelecao = function(){
	var select = "<select name='"+this.nome+"' id='"+this.id+"' class='"+this.classe+"' "+this.getAtributo()+">";
	for(var x = 0;x < this.itens.length;x++){
		if(this.itens[x][0] == this.autoSelecionado || this.itens[x][1] == this.autoSelecionado){
			select += "<option selected value='"+this.itens[x][0]+"'>"+this.itens[x][1]+"</option>";
		} else {
			select += "<option value='"+this.itens[x][0]+"'>"+this.itens[x][1]+"</option>";
		}
	}
	select += "</select>";
	return select;
};
// Metodo que define o valor que vai ser selecionado por padrao
Selecao.prototype.setSelecionado = function(valorSelecionado){
	this.autoSelecionado = valorSelecionado;
}
// Classe usada para criar um DivRow no sistema de grids do bootstrap
var DivRow = function(classe, id){this.tamanho = 0; this.corpo = new Array(); ClasseId.call(this, "", classe, id); };

DivRow.prototype = new ClasseId();
DivRow.prototype.constructor = DivRow;
DivRow.prototype.addDiv = function(conteudo, tamanho, classe, id){ 
	// Verificando se o tamanho atual somado com o tamanho enviado é menor ou igual a 12
	var tamanhoAtual = this.tamanho + tamanho;
	if(tamanhoAtual <= 12){
		this.tamanho += tamanho;
		// Para classe o ids nao configurados, insira uma string vazia
		var classe = typeof classe == "undefined" ? "" : classe;
		var id =  typeof  id == "undefined" ? "" : id;
		this.corpo.push([conteudo, tamanho, classe, id]);
	} else {
		console.log('Tamanho enviado excede o limite de 12 grids.');
		return false;
	}
}
DivRow.prototype.getDivRow = function(){
	// Realizar um loop e criar o corpo da divRow, retorna-lo
	var di = '<div class="row">';
	for(var x = 0;x < this.corpo.length;x++){
		di += '<div class="col-sm-'+this.corpo[x][1]+' '+this.corpo[x][2]+'" id="'+this.corpo[x][3]+'">'+this.corpo[x][0]+'</div>';
	}
	di += '</div>';
	return di;
}

// Classe utilizada para criar abas
var DivTabs = function(){
	this.lista = [];
	this.conteudo = [];
	
}

// Metodo utilizado para acrescentar um tab, Nome, idDaDiv e div
DivTabs.prototype.addDivTabs = function(nome, idDaDiv, conteudo){
	if(typeof nome == "string" && nome.search('@') == -1 && idDaDiv.search('@') == -1 && typeof idDaDiv == "string" && typeof conteudo == "string"){
		this.lista.push(nome+'@'+idDaDiv); // Concatenando o nome com o idDaDiv
		this.conteudo.push(conteudo);
	} else {
		console.log("Alguma das informacoes nao foram repassadas corretamente, um simbolo de '@'' esta no nome ou no idDadiv e todos os parametros devem ser strings");
	}
}
// Metodo que retorna um tab com as informacoes repassadas
DivTabs.prototype.getDivTabs = function(){
	if(this.lista.length < 1){
		console.log("Não é possivel criar um divTab sem as informacoes");
		return false;
	}
	var ulTab = "<ul class='nav nav-tabs'>";
	var divs = "<div class='tab-content'>";
	for(var x = 0;x < this.lista.length;x++){ // Fazer um loop e preencher o ulTab
		var divisao = this.lista[x].split('@'); // Divide o nome do link com o id que vai identificar a div
		if(x == 0){ // Se x e igual a 0 entao esta e a primeira aba, entao ela deve estar ativa
			// O item da lista e a div do content devem ser criadas
			ulTab += "<li class='active'><a data-toggle='tab' href='#"+divisao[1]+"'>"+divisao[0]+"</a></li>";
			divs += "<div id='"+divisao[1]+"' class='tab-pane fade in active'>"+this.conteudo[x]+"</div>";
		} else {
			// O item da lista e a div do content devem ser criadas
			ulTab += "<li><a data-toggle='tab' href='#"+divisao[1]+"'>"+divisao[0]+"</a></li>";
			divs += "<div id='"+divisao[1]+"' class='tab-pane fade '>"+this.conteudo[x]+"</div>";
		}
	}
	ulTab += "</ul>";divs += "</div>";
	return ulTab + divs;
}

// Classe que configura a criaçao de um objeto modal
var Modal = function(cabeModal, corpoModal, rodapeModal, classe, id){ 
	this.cabeModal = cabeModal;
	this.corpoModal = corpoModal;
	this.rodapeModal = rodapeModal;
	this.tipoModal = true;
	ClasseId.call(this, "", classe, id);
};

Modal.prototype = new ClasseId();
Modal.prototype.constructor = Modal;
// Metodos configuradores das partes do modal
Modal.prototype.setCabeModal = function(cabeModal){ this.cabeModal = typeof cabeModal == "undefined" ? "" : cabeModal;};
Modal.prototype.setCorpoModal = function(corpoModal){ this.corpoModal = typeof corpoModal == "undefined" ? "" : corpoModal;};
Modal.prototype.setRodapeModal = function(rodapeModal){ this.rodapeModal = typeof rodapeModal == "undefined" ? "" : rodapeModal;};
// Metodos configurador do comportamento do modal
Modal.prototype.setTipoModal = function(tipoModal){this.tipoModal = typeof tipoModal == "undefined" ? false : tipoModal;};

Modal.prototype.getModal = function(){
	var conteudoDoModal = '<div '+this.getAtributo()+' class="modal fade '+this.classe+'" id="'+this.id+'" role="dialog"><div class="modal-dialog"><div class="modal-content">';
	conteudoDoModal += '<div class="modal-header">'+this.cabeModal+'</div>';
	conteudoDoModal += '<div class="modal-body">'+this.corpoModal+'</div>';
	conteudoDoModal += '<div class="modal-footer">'+this.rodapeModal+'</div>';
    conteudoDoModal += '</div></div></div>';
    return conteudoDoModal;
};
Modal.prototype.executaModal = function(){
	// Este metodo é dependente de jquery, apos executado o modal é exibido
	$('#'+this.id).modal({backdrop:this.tipoModal});
}

//Classe vendedor que cria o registro dos vendedores
var Vendedor = function(nome, imagem, id){
	this.nome = nome; this.imagem = imagem;
	this.tempoAtendimento = "";
	this.tempoFinalizaAtendimento = "";
	this.dataAtendimento = "";
	this.isImagem = true;
	ClasseId.call(this, "", "",id);
};

Vendedor.prototype = new ClasseId();
Vendedor.prototype.constructor = Vendedor;
// Metodos do vendedor
Vendedor.prototype.alteraImagem = function(){};

Vendedor.prototype.setNome = function(nome){ 
	this.nome = nome;
};
Vendedor.prototype.getVendedor = function(){
	var vend = ""; // Representa como um vendedor é exibido
	// Verificando a forma como o vendedor deve ser exibido, se é imagem ou nome
	if(this.isImagem){
		vend += '<p id="'+this.id+'">';
		vend += '<img class="img img-circle" style="width:48px;height:48px;" title="'+this.nome+'" src="'+this.imagem+'" alt="'+this.nome+'" />'+this.nome.split(' ')[0];
	} else{
		vend += '<p id="'+this.id+'" imagem="'+this.imagem+'" title="'+this.nome+'"><span class="glyphicon glyphicon-user"> </span> '+this.nome;
	}
	vend += ' <time style="font-weight:bold" class="text-danger">'+this.tempoAtendimento+'</time></p>';
	return vend;

};
Vendedor.prototype.iniciaAtendimento = function(){
	// Inicia o atendimento, definindo o tempo de atendimento
	var hora = new Date();
	this.tempoAtendimento = (hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'')+hora.getMinutes();
	$('#'+this.id).find('time').html(this.tempoAtendimento);
	// Registrando a data do atendimento
	this.dataAtendimento = hora.getUTCFullYear() +'-'+(hora.getUTCMonth()+1)+'-'+hora.getUTCDate();

};

Vendedor.prototype.finalizaAtendimento = function(){
	// Registra tempo de finalizacao do atendimento
	var hora = new Date();
	this.tempoFinalizaAtendimento = (hora.getHours()<10?'0':'')+hora.getHours()+':'+(hora.getMinutes()<10?'0':'')+hora.getMinutes();
};

Vendedor.prototype.trocaExibicao = function(){
	// Se a imagem e verdadeira, exiba nomes e troque isImagem para false
	if(this.isImagem){
		this.isImagem = false;

		$('#'+this.id).html(this.getVendedor());
	} else { // Imagem nao e verdadeira, troque isImagem para true e reexiba os vendedores
		this.isImagem = true;
		$('#'+this.id).html(this.getVendedor());
	}

};

// CLASSE QUE GERA OBJETO PARA CRIAR GRAFICOS
var Grafico = function(dados, opcoes, classe, id){
	this.setDados(dados); // Validando o cadastro de dados
	this.dadosModificados = []; // Os dados modificados
	this.opcoes = opcoes;
	this.cores = []; // Define o array de cores
	this.total = 0; // Define a variavel total somando todos os atendimentos
	this.refGraf = ''; // Define uma referencia para o grafico quando ligar envento de clicks
	ClasseId.call(this, "", classe, id);
}

Grafico.prototype = new ClasseId();

Grafico.prototype.constructor = Grafico;
// Metodo para validacao de dados, recebe um array bidimencional e valida-o
Grafico.prototype.setDados = function(dados){
	if(dados instanceof Array && dados[0] instanceof Array && dados[0].length > 1){
		if(this.dadosModificados instanceof Array && this.dadosModificados.length >= 1){
			this.dadosModificados = dados;
		} else {
			this.dados = dados;
		}
	} else {
		console.log("Dados mal formatados.");
	}
}
// Metodo capaz de gerar percentual de todos os dados do grafico
Grafico.prototype.getPercentual = function(linha){
	var arr = [];
	if(this.dadosModificados.length > 1){
		arr = JSON.stringify(this.dadosModificados);
	} else{
		arr = JSON.stringify(this.dados);
	}
	var arrayLocal = JSON.parse(arr); // Tive que converter em um JSON para remover a referencia e poder alterar o array
	arr = null;
	// Vamos inciar fazendo um loop e pegando o valor total de cada coluna que for Integer
	// e/ou Float E somando elas
	var total = ['TOTAL'];
	for(var x = 1;x < arrayLocal.length;x++){
		if(linha){ // Linha é verdadeiro, então vamos calcular o percentual de cada array dentro do array
			var total = 0;
			// Fazendo loop interno para pegar o valor de cada campo
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){ // Se este campo e um numero
					total += arrayLocal[x][y]; // Somando o valor total
				}
				
			}
			// Agora calculando o percentual, substituindo os valores das colunas
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){
					arrayLocal[x][y] = parseFloat(parseFloat((arrayLocal[x][y] / total) * 100).toFixed(1));
				} else if(!isNaN(parseFloat(arrayLocal[x][y].split(' ')[0]))){
					arrayLocal[x][y] = arrayLocal[x][y-1]+' %';
				}
			}	
		} else {
			// Fazendo loop interno para pegar o valor de cada campo
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){ // Se este campo e um numero
					if(total[y]){ // Verificando se a referencia ja existe
						total[y] += arrayLocal[x][y]; // Somando o valor total
					} else {
						total[y] = arrayLocal[x][y];
					}
				}
			}
		}
		

	}
	/* Agora faremos um loop para gerar a percentagem dividindo d asoma
		
	*/
	if(!linha){
		for(var x = 1;x < arrayLocal.length;x++){
			for(var y = 1;y < arrayLocal[x].length;y++){
				if(!isNaN(arrayLocal[x][y])){ // Se este campo e um numero
					var valor = parseFloat(parseFloat((arrayLocal[x][y] / total[y]) * 100).toFixed(2)) ; // Calcular percentual
					arrayLocal[x][y] = valor;
				}
			}
		}
	}
	// Retorna o arrayLocal com percentual
	return arrayLocal;

}
// Metodo que adiciona mais uma coluna aos dados Sempre adicionado a partir da segunda coluna
Grafico.prototype.addColuna = function(coluna){
	
	arrayLocal = [];
	if(this.dadosModificados > 1){ // Verifica se vamos usar o array modificado ou nao para gerar os novos dados
		arrayLocal = this.dadosModificados;
	} else {
		arrayLocal = this.dados;
	}
	// Verificar se a coluna tem a mesma extensao da coluna original
	if(arrayLocal.length == coluna.length){
		// Vamos fazer um loop e incluir a coluna na terceira parte
		for(var x = 0;x < arrayLocal.length;x++){
			arrayLocal[x].splice(2,0, coluna[x]);
		}
		this.dadosModificados = arrayLocal;
	} else {
		console.log("O tamanho da coluna esta incorreto.");
		return false;
	}
}
// Metodo que gera o novo array de dados retornando-o (Metodo somente usado dentro do metodo setCores)
Grafico.prototype.getCores = function(usarModificado){
	var arrayLocal = [];
	if(usarModificado){ // Verifica se vamos usar o array modificado ou nao para gerar os novos dados
		arrayLocal = this.dadosModificados;
	} else {
		arrayLocal = this.dados;
	}
	var qtdCores = this.cores.length; // Conta a quantidade de cores
	var x = 0; // Variavel que vai contar as cores
	var novo = []; // Array auxiliar para inclusao dos dados
	// Verificar se ja  temos cores definidas
	for(var i = 2;i < arrayLocal[0].length;i++){ 
		if(arrayLocal[0][i].role == "style"){ // Verificando se o campo pesquisado tem
			// o atributo role com valor style.
			// Fazer um loop no array e excluir o campo de referencia
			for(var e = 0;e < arrayLocal.length;e++){
				arrayLocal[e].splice(i, 1); // Removendo a coluna do array
			}
		}
	}
	novo.push(arrayLocal[0]);
	novo[0].push({role:'style'});
	// Iniciando o loop para preencher a cor
	for(var y = 1;y < arrayLocal.length;y++){
		if(x == qtdCores){
			x = 0;
		}
		novo.push(arrayLocal[y]);
		novo[y].push(this.cores[x]);
		x++;
	}
  return novo;
}
// metodo que define a cor ou as cores do grafico
Grafico.prototype.setCores = function(cores){
	// Verifica se as cores enviadas sao um array
	if(cores instanceof Array && cores.length >= 1){
		this.cores = cores;
		if(this.dadosModificados.length > 1){
			var novo = this.getCores(true); // Informo que desejo usar o array modificado
		} else{
			var novo = this.getCores(); // Retorna o array original modificado
		}
		// Definindo os novos dadosModificados
		this.dadosModificados = novo;
	}
}

// Metodo para ajustar a variavel total
Grafico.prototype.setTotal = function(coluna, linhaNaoRegistrada){

	if(!isNaN(coluna)){// Se a coluna usada para a soma foi definida, vamos somar
		var tot = 0; // Total a ser somado
		if(this.dadosModificados.length > 1){
			var arrayLocal = this.dadosModificados;
		} else {
			var arrayLocal = this.dados
		}

		// Verificando se a opçao de linha nao registrada foi informada
		if(linhaNaoRegistrada == "ultima"){ // Se for ultima, entao registrar a ultima linha como nao participante da soma
			linhaNaoRegistrada = arrayLocal.length - 1; 
		} else if(isNaN(linhaNaoRegistrada)){
			linhaNaoRegistrada = undefined;
		}
		// Fazer o loop, somar a coluna e colocar no atributo this.total
		for(var x = 1;x < arrayLocal.length;x++){
			if(x == linhaNaoRegistrada){
				continue;
			} else {
				tot += arrayLocal[x][coluna];
			}
		}
		// Atualizando o valor do total
		this.total = tot;
	} else {
		console.log("É necessario informar pelo menos uma coluna");
	}
};
// Metodo para definir as opcoes do grafico
Grafico.prototype.setOpcoes = function(opcoes){
	this.opcoes = opcoes;
}

// Metodo que prepara os dados para a criacao do grafico
Grafico.prototype.getDados = function(percent, linha){
	// Verificando os dados são um array bidimensional e se as opcoes sao um objeto
	if(this.dados instanceof Array && this.dados[0] instanceof Array && this.opcoes instanceof Object){
		if(percent){
			var dado = google.visualization.arrayToDataTable(this.getPercentual(linha));
		} else if(this.dadosModificados.length > 1){
			var dado = google.visualization.arrayToDataTable(this.dadosModificados);
		} else {
			var dado = google.visualization.arrayToDataTable(this.dados);
		}
	}
	return dado;
}
// Metodo que cria um grafico de pizza
Grafico.prototype.getPizza = function(){
		var dado = this.getDados(); // Recebendo o array de dados para montar o grafico
		var chart = new google.visualization.PieChart(document.getElementById(this.id));
		chart.draw(dado, this.opcoes);
		this.refGraf = chart; //Recuperando referencia do grafico
	
}
// Metodo que cria grafico de coluna
Grafico.prototype.getColuna = function(percent, linha){
	var dado = this.getDados(percent, linha);
	var chart = new google.visualization.ColumnChart(document.getElementById(this.id));
	chart.draw(dado, this.opcoes);
	this.refGraf = chart; //Recuperando referencia do grafico
}
//Metodo que cria grafico de barra
Grafico.prototype.getBarra = function(percent, linha){
	var dado = this.getDados(percent, linha);
	var chart = new google.visualization.BarChart(document.getElementById(this.id));
	chart.draw(dado, this.opcoes);
	this.refGraf = chart; //Recuperando referencia do grafico
}
// Metodo para criar grafico de linha
Grafico.prototype.getLinha = function(percent, linha){
	var dado = this.getDados(percent, linha);
	var chart = new google.visualization.LineChart(document.getElementById(this.id));
	chart.draw(dado, this.opcoes);
	this.refGraf = chart; //Recuperando referencia do grafico
}
// Retorna a referencia do grafico
Grafico.prototype.getRefGraf = function(){
	return this.refGraf;
};
// Metodo que define anotacoes {role:annotarion}
Grafico.prototype.setAnotacoes = function(){
	var arrTempNovo, listaCampos = [];
	// Verificando quais dados vou utilizar
	if(this.dadosModificados.length > 0){
		arrTempNovo = this.dadosModificados;
	} else { arrTempNovo = this.dados;
		console.log(JSON.stringify(this.dados));
	}
	listaCampos.push(arrTempNovo[0]);

  	arrTempNovo.forEach(function(value, index){
  		if(index > 0){
    		listaCampos.push([]);// Cria novo array no temp2
	    	var marcador = 1; // Inicializa o marcador de linha
	    	value.forEach(function(val, ind){
	    		//console.log('PASSA AQUI');
	      		if(ind < 1){ 
	      			listaCampos[index][ind] = val;
	      		}else{ // utilizando o marcador atual, passa o valor desconvertido

	      			if(typeof val == "string" && val.search('R') != -1){
	      				console.log(val);
	      				listaCampos[index][marcador] = parseFloat(desconverter(val));
	      			}else{
	      				listaCampos[index][marcador] = val;
	      			}
	        		// Colocando o valor no campo do role:annotation
	        		listaCampos[index][marcador+1] = val;
	        		marcador += 2; // Sempre aumenta o contador em 2 para criar o proximo campo
	        	}
	        	
	    	});
	    }
  	});
  	
  	// Agora o ajuste o cabecalho para ter role:annotation
  	var tempC = [];var cont = 1;
  	// A logica aqui e a mesma, a diferenca e que o contador e array temp estao fora
  	listaCampos[0].forEach(function(value, ind){ 
    	if(ind < 1){ tempC.push(value);
  		} else { 
  			tempC[cont] = value;  // Colocando o valor usando contador atual
  			tempC[cont+1] = {'role':'annotation'}; // colocando o role:annotation
    		cont += 2; // Atualizando o contador
    	}
  	});
  
  	listaCampos[0] = tempC;
  	console.log(listaCampos);
  	this.dados = listaCampos;
  		// Verificando quais dados vou utilizar
	if(this.dadosModificados.length > 0){this.dadosModificados = listaCampos;}
	 else { this.dados = listaCampos;}

}

/*
	CLASSE UTILIZADA PARA VALIDAR DADOS DE UM FORMULARIO
*/

var Formulario = function(){
	this.dados = {};
};

// Metodo para validar uma data, retorna true se a data foi validada
Formulario.prototype.validaData = function(idOuClasse){
	
	// Se a classe ou id não for encontrado, retorne erro
	if(typeof $(idOuClasse).val() == "undefined"){
		console.log('Não foi possível encontrar este campo. '+idOuClasse);
		return false;
	}
	// Agora vamos verificar se o valor pode ser convertido em uma data
	var data = $(idOuClasse).val();
	// Regex para validar a data
	var re = /^[2][0][0-9][0-9]-([0][0-9]|[1][0-2])-([0-2][0-9]|[3][0-1])$/g;
	// Se a data seguir o padrao, exiba correto, senao exiba um alert informando que a data esta incorreta
	if(data.search(re) == -1){
		alert("A data informada esta no formato incorreto.");
		return false;
	}
	// Data esta correta, vamos retornar o objeto Date da data informada
	var d = new Date(data);
	return d;
};

// Método que compara dois objetos data para verificar se De é menor ou igual a ate
Formulario.prototype.deMenorQueAte = function(data1, data2){
	
	// Recebemos dados do tipo string (supostamente classe ou id e os atribuem a data1 e data2)

	if(typeof data1 == "string" && typeof data2 == "string"){
		var data1 = this.validaData(data1);var data2 = this.validaData(data2);
	} else if(typeof data1 == "undefined" || typeof data2 == "undefined" || typeof data1 == false || typeof data2 == false){
		console.log("Os objetos enviados não são datas.");
		return false;
	}

	// Verificando se a data1 é menor/igual a data2
	if(data1.getTime() > data2.getTime()){
  	alert('A data DE nao deve ser maior que a data ATE.');
  	return false;
  	} else {
		var de2 = data1.getUTCFullYear() +'-'+(data1.getUTCMonth()+1 > 9 ? data1.getUTCMonth()+1 : '0'+(data1.getUTCMonth()+1))+'-'+(data1.getUTCDate() > 9 ? data1.getUTCDate() : '0'+data1.getUTCDate());
		var ate2 = data2.getUTCFullYear() +'-'+(data2.getUTCMonth()+1 > 9 ? data2.getUTCMonth()+1 : '0'+(data2.getUTCMonth()+1))+'-'+(data2.getUTCDate()> 9 ? data2.getUTCDate() : '0'+data2.getUTCDate());
		this.dados.de = de2;this.dados.ate = ate2;
  		return true;
  	}
};
// Método para validar um campo verificando se o mesmo não está em branco
Formulario.prototype.validaCampo = function(idOuClasse){
	// Se a classe ou id não for encontrado, retorne erro
	if(typeof $(idOuClasse).val() == "undefined"){
		console.log('Não foi possível encontrar este campo. '+idOuClasse);
		return false;
	}
	// Existe, então vamos recuperar o seu valor
	var valor = $(idOuClasse).val();

	// Verificando se o valor esta em branco ou e indefinido
	if(valor == "" || typeof valor == "undefined"){
		console.log("Valor do campo não foi definido.");
		alert('Um campo não foi preenchido.');
		return false;
	}
	// Recuperando o IdOuClasse para usa-lo como chave do dicionario this.dados
	this.dados[idOuClasse.slice(1)] = valor.toString();
	return true;
};
// Metodo para validar arquivos, recebe dois parametros, o id do campo file e um array com os tipos aceitos
Formulario.prototype.validaArquivo = function(ID, arrayDeTipos){
	if(!arrayDeTipos instanceof Array){
		console.log("Os tipos enviados não estão na forma de array.");
		return false;
	}
	// Os tipos estão na forma de array, agora vamos procurar o ID do arquivo
	if(!(document.getElementById(ID)) || !(document.getElementById(ID).files)){
		console.log("O id escolhido não existe ou este ID informado não é de um input file: "+ID);
		return false;
	}
	// O id esta correto, agora vamos fazer um loop para ver se os arquivos enviados estão de acordo com os tipos aceitos
	var arq = document.getElementById(ID).files;
	// Verificando se existe pelo menos um arquivo, caso nao exista retorne a mensagem informando que nao temos arquivos
	if(arq.length < 1){
		alert('Por favor envie pelo menos um arquivo.');
		return false;
	}
	for(var x = 0;x < arq.length;x++){
		// Retirar a extensao do arquivo
		var nome = arq[x].name.split('.');
		// Fazer loop sobre as extensoes
		console.log(nome[1]);
			if(arrayDeTipos.indexOf(nome[1]) == -1){
				// Falhou, tipo nao aceito
				alert('Tipo incorreto, somente é aceito tipos: '+ arrayDeTipos.join(','));
				return false;
				break;
			}
	}
	// Se chegou aqui, o arquivo foi validado, então retorne true.
	return true;
};
// METODO PARA ATUALIZAR AS INFORMACOES E OPCIONALMENTE EXECUTAR UMA FUNCAO;
Formulario.prototype.atualizarDados = function(fn){
	// Agora quando clicar no botao de atualizacao o cookie é novamente salvo, os dados são atualizados e a pagina se mantem intacta
	$('#pesquisar').click(function(e){
		e.preventDefault();
		
		var form = new Formulario();
		if(form.deMenorQueAte('#data1', '#data2') && form.validaCampo('#grupos') && form.validaCampo('#lojas')){
			$.ajax({ url: '/set_salvar_cookies', method: 'POST', data : form.dados }).done(function(da){
				// TUDO DEU CERTO, GRAVANDO AS DATAS NO USUARIO ATUAL
				usuario.dados.de = form.dados.de;usuario.dados.ate = form.dados.ate;
				// GRAVANDO OS GRUPOS SELECIONADOS E AS LOJAS
				usuario.dados.grupo_selecionado = form.dados.grupos; usuario.dados.loja_selecionada = form.dados.lojas;
				// Atualiza os dados novamente
				fn();
		}).fail(function(err){
			console.log('ERRO.');
		});
	} 
});
}

// FUNCAO USADA PARA CONVERTER VALORES MONETARIOS
function converter(valor){
    valor = valor.replace('.',',');// Substituindo ponto por virgula
    var valorReverso = valor.split("").reverse(); // Reverte a string
    var recebeConvertido = '';
    var x = 0;// Contado a cada 3 vai incluir ponto
    for(var i =0;i< valorReverso.length;i++){
        // Se o x for inferior a 4 entao vamos incrementar x e colocar o caractere
        if(x < 4){
            x += 1
            recebeConvertido += valorReverso[i];
        } else if(x % 3 == 0){ // X nao tem resto na divisao por tres, entao incluiremos o ponto e incrementamos x
            recebeConvertido += '.' + valorReverso[i];
            x += 1
        // X já e maior que 4 e nao e divisivel por 3, entao vamos incrementar x e adicionar o caractere a d
        } else {
            recebeConvertido += valorReverso[i];
            x += 1
        }
    }
    //# Reverte novamente a string para o formato de ordem original
    var valor2 = 'R$ '+recebeConvertido.split("").reverse().join("");
    return valor2;

};

// ESTA CLASSE DESENHA FUNCIONALIDADES PARA O USUARIO
var Usuario = function(){
	this.dados = {};
	this.obterCookie();
}

// Metodo usado para obter os cookies do usuario
Usuario.prototype.obterCookie = function(){
	var todosCookies = decodeURIComponent(document.cookie).split(';');
	for(var x = 0;x < todosCookies.length;x++){
		var dados = todosCookies[x].split('=');
		this.dados[dados[0].trim()] = dados[1].replace(/\\054/g, ',');
		
	}
}

// Metodo usado para obter o nome dos grupos de forma resumida e separados por virgula
Usuario.prototype.getGrupoResumido = function(){
	var grupoResumido = [];
	var todos = this.dados.grupo_selecionado.split(',');
	for(var x = 0;x < todos.length;x++){
		var nome = todos[x].split('|')[1].split(' ')[1];
		grupoResumido.push(nome);
	}
	return grupoResumido.join();
}

// Metodo usado para formatar a saida dos grupos, alterando virgula por exclamacao
Usuario.prototype.getGrupoParaUrl = function(){
	return this.getGrupoResumido().replace(/,/g, '!');
}

// Metodo usado para formatar a saida de lojas, alterando a virgula por & comercial
Usuario.prototype.getLojaParaUrl = function(){
	return lj = this.dados.loja_selecionada.replace(',', '!').replace(/"/g,'');
}

// Classe usada para criar e manipular uma barra de progresso
var BarraDeProgresso = function(){
      this.contador = 0;
      this.barra = '<div class="campo_barra"><p class="text-center">\
      Aguarde, estamos atualizando os dados</p><div class="progress">\
      <div class="progress-bar progress-bar-striped active" role="progressbar" \
      aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:1%">0%</div></div></div>';
      this.alvo = '';
      this.tempoIntervalo = 0;
};
// Método que apenda a barra de progressso eliminando o conteudo do alvo
BarraDeProgresso.prototype.incluirBarra = function(idOuClasse){
  if(typeof idOuClasse === "string"){
    // OK, agora vamos coloca-lo no alvo
    this.alvo = idOuClasse;
    // Limpando o campo para apendar a barra
    if($(idOuClasse).length < 1){console.log('Não encontrado o elemento ');return false;}
    $(idOuClasse).empty();$(idOuClasse).html(this.barra);
  } else{
    console.log('O idOuClasse enviado não é uma string.');
    return false;
  }
};
// Método que inicia a barra de progresso. Se desejar pode passar um tempo inicial
BarraDeProgresso.prototype.ativarBarra = function(contador, intervalo){
  // Vendo se tempo foi definido e atribuindo ele ao contador
  if(typeof contador !== "number"){this.contador = 0;} else{
    this.contador = contador;}
    var obj = this;
    // Funcao criada para executar o cronometro e alterar os valores
    function crono(){ obj.cronometro(); };
    // Recupera o numero retornado por setInteval. Vamos usa-lo para interromper o tempo
    this.tempoIntervalo = setInterval(crono, intervalo);
};
// Metodo para stopar a barra de vez
BarraDeProgresso.prototype.pararBarra = function(){
  this.contador = 100;

}

// Metodo que ativa o contador de fato e vai monitorando(Metodo interno da classe)
BarraDeProgresso.prototype.cronometro = function(){
  // Se o tempo for menor que 100 vamos modificando os valores da barra
  if(this.contador < 101){
    $('.progress-bar').attr('aria-valuenow', this.contador);
    $('.progress-bar').attr('style', "width:"+this.contador+"%");
    $('.progress-bar').text(this.contador+"% Completo");
    this.contador++;
  } else {
    clearInterval(this.tempoIntervalo);
  }
}

// Esta funcao desconverte o valor monetario para um float.toFixed2
function desconverter(valor){
	if(typeof valor !== "string"){ console.log('FAVOR ENVIAR STRING.'); return false;}
	// Removendo o cifrao, ponto e a virgula e retornando um float
	valor = parseFloat(valor.replace('R$', '').replace(/\./g, '').replace(',','.')).toFixed(2);
	return valor;
}

// Objeto que controla as acoes da pagina
var Controlador = function(){
    this.grupos;
    this.lojas;
    this.de;
    this.ate;
    this.barra = new BarraDeProgresso();
    this.opcoesDataTable = {
           "bPaginate": false,"ordering" : true,
          //"order" : [1],
          "fixedColumns":{ leftColumns: 3 },
          "colReorder" : true, "scrollY": "400px",
          "scrollCollapse": true, "scrollX": true,
          "info" : false, "responsive": true,
          "autoWidth": true,     
          "search" : { "regex": true },
          "language": {"search": "Procurar na tabela",
    "emptyTable" : "Nao ha dados",
    "zeroRecords": "Sem registros com valor informado","decimal":",","thousands":"."}
    };
};
// Metodo que controla o botao de pesquisa
Controlador.prototype.pesquisar = function(paginaALvo){
    if(typeof paginaALvo !== "string"){
        console.log('FAVOR DEFINIR A PAGINA ALVO');
        return false;
    }
    var ref = this;
    $('#pesquisar').bind('click', function(){
                
        var grupo, filial, dataDe, dataAte;
        grupo = $('#grupos').val();
        filial = $('#lojas').val();
        dataDe = $('#data1').val();dataAte = $('#data2').val();
        // Enviando dados para validacao
        if(!ref.validarCampos(grupo, filial, dataDe, dataAte)){
            return false;
        }
        // Ativando a barra de progresso
        ref.barra.incluirBarra('#corpo_pagina2');
        ref.barra.ativarBarra(0, 2000);
        // Campos validados, agora vamos submeter os dados para o servidor
        $.ajax({method:'POST', url:paginaALvo, data:{
            'grupos':ref.grupos, 'lojas':ref.lojas, 'de':ref.de, 'ate':ref.ate}
        }).done(function(data){
            // Deu tudo certo, enviar os dados para o metodo de criacao de tabela o criar
            ref.criarTabela(data); 
        }).fail(function(){
            alert('ERRO AO ENVIAR OS DADOS, CASO PERSISTA ENTRAR EM CONTATO COM O ADMINISTRADOR DO SITE.');
        });
    });
};

// Metodo que valida os campos do relatorio
Controlador.prototype.validarCampos = function(grupos, lojas, de, ate){
    var ref = this;
    var dDe = new Date(de); var dAte = new Date(ate);

    if(!(grupos instanceof Array) || (grupos.length < 1) || !(lojas instanceof Array) || 
        (lojas.length < 1)){alert('GRUPO(S) E/OU LOJA(S) NÃƒO SELECIONADOS. VERIFICAR.');
        return false;
    // Verificar as datas de e ate
    } else if(dDe > dAte){alert('A DATA DE NÃO PODE SER MAIOR QUE A DATA ATÉ.');
        return false;}
    // Tudo ok, retorne verdadeiro
    ref.grupos = grupos.join(',');ref.lojas = lojas.join(',');
    ref.de = de; ref.ate = ate;
    return true;
};

// Este metodo lida com o download de arquivos em excel dando a opçao de escolher as colunas
Controlador.prototype.baixarEmExcel = function(idTabela, idBotao, nomeArmazenamentoLocal, localParaBaixar){
  // Verificar se o botao existe
  if($(idBotao).length < 1){ alert('ESTE BOTÃO NÃO EXISTE. '+idBotao); return false; }
  if($(idTabela).length < 1){ alert('ESTA TABELA NAO EXISTE '+idTabela); return false; }
  if($(idTabela+' tbody tr').length < 1){ alert('ESTA TABELA NÃO TEM DADOS '+idTabela); return false;}
  
  // Se clicar em baixar o customizado, vamos baixa-lo
  $(idBotao).bind('click', function(e){
    e.preventDefault();
    // Vendo se tem o armazenamento local
    if(typeof(Storage) === "undefined"){ 
      alert('NÃO será possivel escolher as colunas desejadas para baixar.');
      // Agora criar o objeto que vai comportar o cabecalho e o corpo da tabela
        var objTabelaBaixar = {'cabe':[], 'corpo':[]};
        $(idTabela+' thead tr').children().each(function(i,v){
            objTabelaBaixar.cabe.push($(this).text());
        });
        $(idTabela+' tbody').children().each(function(i,v){
            var tempQ = [];
            $(this).children().each(function(ia,va){
                tempQ.push($(this).text());
            });
            objTabelaBaixar.corpo.push(tempQ);
        });

        // Agora despachando o objeto para o servidor, que vai captura-lo e retornar a planilha em excel
        $.ajax({method:'POST', url:localParaBaixar, data:{'objeto':JSON.stringify(objTabelaBaixar)}
        }).done(function(data){
            window.location.href = data;
        }).fail(function(){
          alert('ERRO AO BAIXAR EM EXCEL. SE PERSISTIR ENTRAR EM CONTATO COM O ADMINISTRADOR DO SITE.');
        });
        return false;
    }
    // Verificamos se temos dados no armazenamento interno
    var asColunasSelecionadas = [];
    if(localStorage.getItem(nomeArmazenamentoLocal)){
      asColunasSelecionadas = JSON.parse(localStorage.getItem('colunas_selecionadas'));
    }
    
    // Recupera todas as colunas e permite o usuario a escolher quais ele quer
    var tempA = '';var entrada = '<input class="checa_colunas" type="checkbox" value="indice" /> VALOR<br/>';
    $(idTabela+' thead tr').children().each(function(ind, val){
        if(asColunasSelecionadas.indexOf(Number(ind).toString()) != -1){
          tempA += '<input class="checa_colunas" checked type="checkbox" value="'+ind+'" />'+$(this).text()+'<br/>';
        } else {
          tempA += entrada.replace('VALOR', $(this).text()).replace('indice', ind);
        }
    });
    tempA += '<p class="text-center">'+new Botao('BAIXAR', 'btn btn-xs btn-danger', 'baixar_selecionados').getBotao()+'</p>';
    // Agora cria o modal permitindo que o usuario escolhas as colunas que ele deseja fazer o download
    var modTitulo = new Titulo('ESCOLHA AS COLUNAS A BAIXAR', 4, 'text-center text-danger').getTitulo();
    var modRodape = '<button class="btn btn-xs btn-default" data-dismiss="modal">FECHAR</button>';
    var mod = new Modal(modTitulo, tempA, modRodape, '', 'modalExcel');
    mod.setTipoModal(true);
    $('#modalExcel').remove();
    $('body').append(mod.getModal());
    mod.executaModal();

    // Clica no botao para baixar_selecionados e então é permitido gerar um excel disto
    $('#baixar_selecionados').bind('click', function(e){
        var $_CHECADOS = $('.checa_colunas');
        var escolhidas = [];
        $($_CHECADOS).each(function(ind,val){
            if($(this).prop('checked')){
              escolhidas.push($(this).val());
            }
        });

        localStorage.setItem(nomeArmazenamentoLocal, JSON.stringify(escolhidas));
        // Agora criar o objeto que vai comportar o cabecalho e o corpo da tabela
        var objTabelaBaixar = {'cabe':[], 'corpo':[]};
        // Obtendo o cabecalho
        $(idTabela+' thead tr').children().each(function(ind, val){
            if(escolhidas.indexOf(Number(ind).toString()) != -1){
              objTabelaBaixar.cabe.push($(this).text());
            }
        });
        // Agora obtendo o corpo
        $(idTabela+' tbody').children().each(function(i, v){
          // Passando pelos filhos do registro
          var tempInternoTab = [];
          $(this).children().each(function(ix, vx){
              if(escolhidas.indexOf(Number(ix).toString()) != -1){
                tempInternoTab.push($(this).text());
              }
          });
          objTabelaBaixar.corpo.push(tempInternoTab);
        });

        $('[data-dismiss="modal"]').trigger('click');

        // Agora despachando o objeto para o servidor, que vai captura-lo e retornar a planilha em excel
        $.ajax({method:'POST', url:localParaBaixar, data:{'objeto':JSON.stringify(objTabelaBaixar)}
        }).done(function(data){
            window.location.href = data;
        }).fail(function(){
          alert('ERRO AO BAIXAR EM EXCEL. SE PERSISTIR ENTRAR EM CONTATO COM O ADMINISTRADOR DO SITE.');
        });

    });
      
  });
}

/**
 *  ESTA CLASSE TRAZ FUNCIONALIDADES COMO CONVERSAO E DESCONVERSAO DE VALORES
*/
var Utilitario = {};
Utilitario.converter = function(valor){

};
Utilitario.desconverter = function(valor){

};
