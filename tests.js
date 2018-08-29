
// Testando a criacao de uma tabela
let cabe, corpo, tabe;
cabe = ['NOME','SOBRENOME','EMAIL', 'SALARIO'];
corpo = [['MARCOS','FELIPE','plimo263@gmail.com', 250.20], 
['SILVA','JARDIM', 'mfelipe@dinizbh.com.br', 480.58]];

console.log('TESTANDO O INICIO DA TABELA');
tabe = new Tabela(cabe, corpo, '', 'minhaTabela', 'small');
console.log('EXIBINDO A ESTRUTURA DA TABELA COM getTabela()');
console.log(tabe.getTabela());
console.log("ENVIANDO UM CORPO USANDO setCorpo([['FELIPE', 'JARDIM','plimo262@gmail.com', 258.20]])");
console.log(tabe.setCorpo([['FELIPE', 'JARDIM','plimo262@gmail.com', 18258.20]]));
console.log("ENVIANDO UM RODAPE USANDO setRodape(['NOME','SOBRENOME','EMAIL', 'SALARIO'])");
console.log(tabe.setRodape(['NOME','SOBRENOME','EMAIL', 'SALARIO']));
console.log('DEFININDO UM ESTILO PARA OS TD usando setEstiloTd("style="margin:0px;padding:0px")');
console.log(tabe.setEstiloTd('style="margin:0px;padding:0px'));
console.log('TESTANDO O METODO DE REMOCAO DE COLUNA removeColuna(0)');
console.log(tabe.removeColuna(0));
console.log('CONVERTER O MONETARIO USANDO converterMonetario(2)');
console.log(tabe.converterMonetario(2));
console.log('MODIFICANDO O CABECALHO COM setCabecalho(["APELIDO", "EMAIL", "SALARIO"])');
console.log(tabe.setCabecalho(["APELIDO", "EMAIL", "SALARIO"]));
console.log('INCLUINDO UMA COLUNA NUMERICA E CONVERTENDO O PERCENTUAL usando converterPercentual(3)');
tabe.setCabecalho(["APELIDO", "EMAIL", "SALARIO"]);
cabe = ["APELIDO", "EMAIL", "SALARIO", 'PORCENTO']
tabe = new Tabela(cabe, [['FELIPE', 'plimo262@gmail.com', 18258.20, 0.40]], '', 'minhaTabela');
console.log(tabe.converterPercentual(3));
console.log('TESTANDO O FILTRO DA TABELA ONDE SE RECUPERAR UM ARRAY USANDO filtro("palavra")');
console.log(tabe.filtro('FELIPE'));
console.log('BUSCANDO UMA COLUNA PELO INDICE COM getColuna(1) // RETORNA UM ARRAY');
console.log(tabe.getColuna(1));
console.log('TESTANDO O METODO PARA BUSCAR MULTIPLAS COLUNAS USANDO getColunas([0,1]) // RETORNA UM ARRAY ANINHADO');
console.log(tabe.getColunas([0,1]));
console.log('TESTANDO O METODO SETOPCOES PARA definir opcoes ao datatables setOpcoes({})')
console.log(tabe.setOpcoes({bInfo:false}));
console.log('TESTANDO O RODAPE COM calculaRodape([0,1],["--","TOTAIS"],[2])');
console.log(tabe.calculaRodape([0,1],["--","TOTAIS"],[2]));